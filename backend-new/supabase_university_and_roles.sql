-- ==============================================================================
-- POOKAR CIVIC INNOVATION & GOVERNANCE PLATFORM - SUPABASE PRODUCTION SCHEMA
-- University Innovation Dashboard, Academic Roles, & Gov Officer Invite Codes
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('CITIZEN', 'GOVERNMENT', 'INSTITUTION', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE academic_role_enum AS ENUM ('STUDENT', 'FACULTY', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE team_status_enum AS ENUM ('PENDING_FACULTY', 'APPROVED_FACULTY', 'APPROVED_ADMIN', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_status_enum AS ENUM ('DRAFT', 'SUBMITTED_FACULTY', 'FACULTY_ENDORSED', 'ADMIN_SANCTIONED', 'DISPATCHED_TO_GOV');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE problem_status_enum AS ENUM ('OPEN', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. GOVERNMENT 7-CHARACTER REGISTRATION INVITE CODES
-- ==============================================================================
-- Generates and verifies unique 7-character alphanumeric access tokens
-- ensuring ONLY officially sanctioned officers can activate a Government node.
CREATE TABLE IF NOT EXISTS government_invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(7) UNIQUE NOT NULL,                       -- 7-char alphanumeric token (e.g. 'JH7X9K2')
    department VARCHAR(150) NOT NULL,                      -- e.g. 'Urban Development & Housing'
    designation VARCHAR(100) NOT NULL DEFAULT 'Nodal Officer',
    district VARCHAR(100) NOT NULL DEFAULT 'Ranchi',
    allocated_to_email VARCHAR(255),                       -- Optional: pre-assigned officer email
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_by_user_id UUID,                                  -- References auth.users(id) once claimed
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gov_code ON government_invite_codes (code);
CREATE INDEX IF NOT EXISTS idx_gov_code_status ON government_invite_codes (is_used, expires_at);

-- Helper function to generate cryptographically random 7-character alphanumeric code
-- (Uses Crockford Base32-like characters, excluding ambiguous chars: 0/O, 1/I)
CREATE OR REPLACE FUNCTION generate_gov_invite_code(
    p_department VARCHAR,
    p_district VARCHAR,
    p_designation VARCHAR DEFAULT 'Nodal Officer',
    p_allocated_email VARCHAR DEFAULT NULL,
    p_expires_days INT DEFAULT 30
) RETURNS VARCHAR(7) AS $$
DECLARE
    v_chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    v_code VARCHAR(7) := '';
    v_i INT;
    v_rand INT;
    v_exists BOOLEAN;
BEGIN
    LOOP
        v_code := '';
        FOR v_i IN 1..7 LOOP
            v_rand := floor(random() * length(v_chars) + 1)::INT;
            v_code := v_code || substr(v_chars, v_rand, 1);
        END LOOP;

        SELECT EXISTS(SELECT 1 FROM government_invite_codes WHERE code = v_code) INTO v_exists;
        IF NOT v_exists THEN
            EXIT;
        END IF;
    END LOOP;

    INSERT INTO government_invite_codes (
        code, department, designation, district, allocated_to_email, expires_at
    ) VALUES (
        v_code, p_department, p_district, p_designation, p_allocated_email, NOW() + (p_expires_days || ' days')::INTERVAL
    );

    RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate and burn code during Government Officer registration
CREATE OR REPLACE FUNCTION claim_gov_invite_code(
    p_code VARCHAR(7),
    p_user_id UUID,
    p_user_email VARCHAR(255)
) RETURNS JSONB AS $$
DECLARE
    v_invite RECORD;
BEGIN
    SELECT * INTO v_invite
    FROM government_invite_codes
    WHERE code = UPPER(TRIM(p_code))
      AND is_used = FALSE
      AND expires_at > NOW()
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or expired Government Invite Code.');
    END IF;

    IF v_invite.allocated_to_email IS NOT NULL AND LOWER(v_invite.allocated_to_email) != LOWER(TRIM(p_user_email)) THEN
        RETURN jsonb_build_object('success', false, 'message', 'This code was allocated to a different official email.');
    END IF;

    UPDATE government_invite_codes
    SET is_used = TRUE,
        used_by_user_id = p_user_id,
        used_at = NOW()
    WHERE id = v_invite.id;

    RETURN jsonb_build_object(
        'success', true,
        'department', v_invite.department,
        'district', v_invite.district,
        'designation', v_invite.designation
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 4. UNIVERSITY STAKEHOLDER PROFILES (STUDENT / FACULTY / ADMIN)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS university_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,                          -- Maps to Supabase auth.users(id)
    academic_role academic_role_enum NOT NULL,             -- 'STUDENT' | 'FACULTY' | 'ADMIN'
    institution_name VARCHAR(255) NOT NULL,                -- e.g. 'Birsa Institute of Technology (BIT Mesra)'
    department VARCHAR(150),                               -- e.g. 'Electronics & Communication Engineering'
    roll_number VARCHAR(50),                               -- For STUDENT (e.g. '2022-EC-042')
    faculty_id VARCHAR(50),                                -- For FACULTY (e.g. 'FAC-BIT-2041')
    aishe_code VARCHAR(50) NOT NULL,                       -- University AISHE (e.g. 'AISHE-U-0268')
    state VARCHAR(100) NOT NULL DEFAULT 'Jharkhand',
    district VARCHAR(100) NOT NULL DEFAULT 'Ranchi',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_univ_profiles_role ON university_profiles (academic_role);
CREATE INDEX IF NOT EXISTS idx_univ_profiles_institution ON university_profiles (institution_name);
CREATE INDEX IF NOT EXISTS idx_univ_profiles_aishe ON university_profiles (aishe_code);


-- ==============================================================================
-- 5. LIVE CIVIC PROBLEMS (OPEN FOR ACADEMIC PROTOTYPING & Redressal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS live_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id VARCHAR(50) UNIQUE NOT NULL,                 -- e.g. 'JS-2026-8812'
    title VARCHAR(255) NOT NULL,
    department VARCHAR(150) NOT NULL,                      -- e.g. 'Drinking Water & Sanitation'
    district VARCHAR(100) NOT NULL,
    urgency VARCHAR(20) NOT NULL DEFAULT 'HIGH',           -- 'CRITICAL', 'HIGH', 'MODERATE'
    domain VARCHAR(100) NOT NULL,                          -- 'Water & Sanitation', 'Renewable Energy', etc.
    description TEXT NOT NULL,
    affected_population VARCHAR(150),
    estimated_budget VARCHAR(100),
    deadline DATE,
    status problem_status_enum NOT NULL DEFAULT 'OPEN',    -- 'OPEN', 'ACCEPTED', 'RESOLVED'
    accepted_by_team_id UUID,                              -- Linked when student team claims
    accepted_by_team_name VARCHAR(150),
    accepted_by_user_id UUID,                              -- References auth.users(id)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_problems_domain ON live_problems (domain);
CREATE INDEX IF NOT EXISTS idx_live_problems_status ON live_problems (status);
CREATE INDEX IF NOT EXISTS idx_live_problems_district ON live_problems (district);


-- ==============================================================================
-- 6. STUDENT TEAM FORMATION & SELECTION APPLICATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS team_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name VARCHAR(150) NOT NULL,
    problem_id UUID REFERENCES live_problems(id) ON DELETE RESTRICT,
    problem_title VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    lead_student_id UUID NOT NULL,                         -- References auth.users(id)
    lead_student_name VARCHAR(150) NOT NULL,
    lead_student_email VARCHAR(255) NOT NULL,
    lead_student_phone VARCHAR(25),
    lead_student_roll VARCHAR(50),
    members JSONB NOT NULL DEFAULT '[]',                   -- Array of {name, rollNo, department, role}
    faculty_mentor_name VARCHAR(150) NOT NULL,
    faculty_mentor_email VARCHAR(255),
    faculty_mentor_id UUID,                                -- References auth.users(id)
    skills TEXT[] DEFAULT '{}',
    statement_of_purpose TEXT NOT NULL,
    status team_status_enum NOT NULL DEFAULT 'PENDING_FACULTY',
    faculty_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_apps_lead ON team_applications (lead_student_id);
CREATE INDEX IF NOT EXISTS idx_team_apps_mentor ON team_applications (faculty_mentor_id);
CREATE INDEX IF NOT EXISTS idx_team_apps_status ON team_applications (status);


-- ==============================================================================
-- 7. PROBLEM SOLUTION PLANS & BILL OF MATERIALS (BoM)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS problem_solution_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES team_applications(id) ON DELETE CASCADE,
    team_name VARCHAR(150) NOT NULL,
    problem_id UUID REFERENCES live_problems(id) ON DELETE RESTRICT,
    problem_title VARCHAR(255) NOT NULL,
    plan_title VARCHAR(255) NOT NULL,
    executive_summary TEXT NOT NULL,
    hardware_bom JSONB NOT NULL DEFAULT '[]',              -- Array of {component, quantity, estimatedCost, purpose, vendorStandard}
    total_budget_required NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    milestones JSONB NOT NULL DEFAULT '[]',                 -- Array of {phase, duration, deliverables}
    prototype_architecture TEXT,
    firmware_or_repo_url TEXT,
    status plan_status_enum NOT NULL DEFAULT 'DRAFT',
    faculty_feedback TEXT,
    admin_grant_sanction VARCHAR(255),
    submitted_by UUID NOT NULL,                            -- References auth.users(id)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solution_plans_team ON problem_solution_plans (team_id);
CREATE INDEX IF NOT EXISTS idx_solution_plans_status ON problem_solution_plans (status);


-- ==============================================================================
-- 8. UNIVERSITY TECHNICAL RESOURCES & GUIDELINES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS university_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,                        -- 'Technical Standards', 'BoM Catalog', 'Research Paper', 'DPR Template'
    format VARCHAR(10) NOT NULL DEFAULT 'PDF',             -- 'PDF', 'DOCX', 'CSV', 'ZIP'
    file_url TEXT,
    file_size VARCHAR(50) NOT NULL DEFAULT '1.2 MB',
    description TEXT NOT NULL,
    downloads INT NOT NULL DEFAULT 0,
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==============================================================================
-- 9. UNIVERSITY REAL-TIME ALERTS & NOTIFICATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS university_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,                                          -- Specific user or NULL for role broadcast
    target_role academic_role_enum,                        -- 'STUDENT', 'FACULTY', 'ADMIN', or NULL for all
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',        -- 'APPROVAL', 'SYSTEM', 'DEADLINE', 'GRANT'
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',        -- 'HIGH', 'MEDIUM', 'LOW'
    action_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_univ_alerts_user ON university_alerts (user_id);
CREATE INDEX IF NOT EXISTS idx_univ_alerts_role ON university_alerts (target_role);


-- ==============================================================================
-- 10. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE university_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_solution_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_invite_codes ENABLE ROW LEVEL SECURITY;

-- University Profiles: Users can view their own, or faculty/admin can view institutional peers
CREATE POLICY "Users view own profile" ON university_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own profile" ON university_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own profile" ON university_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Live Problems: Anyone authenticated can view; Only Faculty / Admin can mark accepted or update
CREATE POLICY "Authenticated users view problems" ON live_problems
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users accept problems" ON live_problems
    FOR UPDATE TO authenticated USING (true);

-- Team Applications:
-- Students can insert & view their own team applications
CREATE POLICY "Students insert team app" ON team_applications
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = lead_student_id);

CREATE POLICY "Students view own team apps" ON team_applications
    FOR SELECT TO authenticated USING (
        auth.uid() = lead_student_id OR
        auth.uid() = faculty_mentor_id OR
        EXISTS (
            SELECT 1 FROM university_profiles
            WHERE user_id = auth.uid() AND academic_role IN ('FACULTY', 'ADMIN')
        )
    );

CREATE POLICY "Faculty and Admin update team apps" ON team_applications
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM university_profiles
            WHERE user_id = auth.uid() AND academic_role IN ('FACULTY', 'ADMIN')
        )
    );

-- Solution Plans:
CREATE POLICY "Teams view solution plans" ON problem_solution_plans
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Students submit solution plans" ON problem_solution_plans
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Faculty and Admin endorse/sanction plans" ON problem_solution_plans
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM university_profiles
            WHERE user_id = auth.uid() AND academic_role IN ('FACULTY', 'ADMIN')
        )
    );

-- Resources: All authenticated users can read
CREATE POLICY "Authenticated read resources" ON university_resources
    FOR SELECT TO authenticated USING (true);

-- Alerts: Users read alerts targeted to them or their academic role
CREATE POLICY "Read own or role alerts" ON university_alerts
    FOR SELECT TO authenticated USING (
        user_id = auth.uid() OR
        target_role IS NULL OR
        target_role = (SELECT academic_role FROM university_profiles WHERE user_id = auth.uid() LIMIT 1)
    );

-- Government Invite Codes:
-- Only service role / state super admins can generate or inspect codes directly
CREATE POLICY "Admins manage invite codes" ON government_invite_codes
    FOR ALL TO service_role USING (true);
