-- ==============================================================================
-- SOCIETAL INNOVATION INTELLIGENCE ENGINE (SIH PS-43) - PRODUCTION SCHEMA
-- Government of Jharkhand Innovation Coordination & Citizen Grievance Redressal
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ticket ID Generator Sequence
CREATE SEQUENCE IF NOT EXISTS grievance_ticket_seq START WITH 1001 INCREMENT BY 1;

-- 3. Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. Geographic Districts & Departments
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Jharkhand',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    population INT DEFAULT 1000000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Academic & Research Institutions
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'University',
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Jharkhand',
    contact_email VARCHAR(255),
    capabilities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CITIZEN',
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    refresh_token TEXT,
    reset_otp VARCHAR(10),
    reset_otp_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 7. Citizen Grievances
CREATE TABLE IF NOT EXISTS grievances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    citizen_id UUID REFERENCES users(id) ON DELETE SET NULL,
    anonymous_session_id VARCHAR(100),
    raw_text TEXT NOT NULL,
    normalized_text TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'English',
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    domain VARCHAR(100) NOT NULL,
    sub_domain VARCHAR(100),
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    priority VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
    classification_confidence NUMERIC DEFAULT 0.85,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    embedding vector(768),
    is_simulation BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grievances_ticket_id ON grievances (ticket_id);
CREATE INDEX IF NOT EXISTS idx_grievances_district ON grievances (district);
CREATE INDEX IF NOT EXISTS idx_grievances_domain ON grievances (domain);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances (status);
CREATE INDEX IF NOT EXISTS idx_grievances_priority ON grievances (priority);
CREATE INDEX IF NOT EXISTS idx_grievances_created_at ON grievances (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_grievances_is_sim ON grievances (is_simulation);

-- 8. Grievance State Machine Events
CREATE TABLE IF NOT EXISTS grievance_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID REFERENCES grievances(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(50),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grievance_events_grievance_id ON grievance_events (grievance_id);

-- 9. Anonymous Grievance Claims
CREATE TABLE IF NOT EXISTS grievance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID REFERENCES grievances(id) ON DELETE CASCADE,
    claim_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    claimed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grievance_claims_token ON grievance_claims (claim_token);

-- 10. Ecosystem Entities
CREATE TABLE IF NOT EXISTS ecosystem_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    domain VARCHAR(100),
    capabilities TEXT[] NOT NULL DEFAULT '{}',
    embedding vector(768),
    contact_email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ecosystem_district ON ecosystem_entities (district);
CREATE INDEX IF NOT EXISTS idx_ecosystem_capabilities ON ecosystem_entities USING GIN (capabilities);

-- 11. DPR Allocations & Workbench
CREATE TABLE IF NOT EXISTS dpr_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    allocated_budget NUMERIC DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ASSIGNED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dpr_institution_id ON dpr_allocations (institution_id);

CREATE TABLE IF NOT EXISTS dpr_workbenches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dpr_id UUID REFERENCES dpr_allocations(id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    technical_summary TEXT,
    proposed_solution TEXT,
    bom_items JSONB DEFAULT '[]',
    bom_validated BOOLEAN DEFAULT FALSE,
    bom_violations TEXT[] DEFAULT '{}',
    calibration_score NUMERIC DEFAULT 0,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dpr_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dpr_id UUID REFERENCES dpr_allocations(id) ON DELETE CASCADE,
    version INT NOT NULL,
    snapshot JSONB NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. RAG Knowledge Base & Isolated Chunks
CREATE TABLE IF NOT EXISTS rag_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    source_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rag_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES rag_documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    embedding vector(768) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rag_chunks_domain ON rag_chunks (domain);

-- 13. Legacy / Benchmark Innovation Memory
CREATE TABLE IF NOT EXISTS innovation_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    problem_summary TEXT NOT NULL,
    solution_summary TEXT,
    outcome TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    source_url TEXT,
    raw_content TEXT,
    credibility_score NUMERIC DEFAULT 85,
    audit_details JSONB,
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_innovation_memory_domain ON innovation_memory (domain);

-- 14. AI Analysis Records & BoM Audit
CREATE TABLE IF NOT EXISTS ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    domain VARCHAR(100) NOT NULL,
    prompt TEXT,
    summary TEXT NOT NULL,
    root_cause TEXT,
    recommendations TEXT[] DEFAULT '{}',
    bom_analysis JSONB DEFAULT '[]',
    confidence NUMERIC DEFAULT 0.85,
    model_version VARCHAR(50),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Calibration Metrics
CREATE TABLE IF NOT EXISTS calibration_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dpr_id UUID REFERENCES dpr_allocations(id) ON DELETE CASCADE,
    prediction_confidence NUMERIC,
    rag_relevance NUMERIC,
    domain_consistency NUMERIC,
    bom_compliance NUMERIC,
    constraint_violations TEXT[] DEFAULT '{}',
    review_outcome VARCHAR(50),
    model_version VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Government Dispatch Orders & Escalations
CREATE TABLE IF NOT EXISTS dispatch_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID REFERENCES grievances(id) ON DELETE CASCADE,
    assigned_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    assigned_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'STANDARD',
    instructions TEXT,
    status VARCHAR(30) DEFAULT 'DISPATCHED',
    dispatched_by UUID REFERENCES users(id) ON DELETE SET NULL,
    dispatched_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID REFERENCES grievances(id) ON DELETE CASCADE,
    level INT DEFAULT 1,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    escalated_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 17. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    role VARCHAR(50),
    institution_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    request_id VARCHAR(100),
    ip_address VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs (timestamp DESC);

-- ==============================================================================
-- SEED INITIAL REFERENCE DATA
-- ==============================================================================

-- Seed Roles
INSERT INTO roles (name, description) VALUES
('CITIZEN', 'Citizen user with grievance submission and status tracking rights'),
('SUPER_ADMIN', 'Apex government admin with unrestricted governance oversight'),
('STATE_ADMIN', 'State-level administrator overseeing all Jharkhand districts'),
('DISTRICT_ADMIN', 'District magistrate and administrative authority'),
('DEPARTMENT_OFFICER', 'Department nodal officer managing dispatches and field work'),
('WAR_ROOM_ANALYST', 'Intelligence analyst reviewing real-time grievance trends'),
('INSTITUTION_ADMIN', 'Academic institution dean/director overseeing DPR allocations'),
('RESEARCHER', 'Faculty/Lead researcher working on DPR technical solution workbenches'),
('LAB_MEMBER', 'Student/Lab member assisting in DPR BoM validation and execution')
ON CONFLICT (name) DO NOTHING;

-- Seed Departments
INSERT INTO departments (name, code, description) VALUES
('Drinking Water & Sanitation Department', 'DWSD', 'Water pipelines, rural water supply, quality testing'),
('Department of School Education & Literacy', 'DSEL', 'Primary and secondary education, school infra, midday meals'),
('Department of Agriculture & Sugarcane Dev', 'DOA', 'Irrigation support, fertilizers, crop insurance, seeds'),
('Department of Health, Medical Edu & Family Welfare', 'DHFW', 'Hospitals, primary health centres, medicines, staff'),
('Road Construction Department', 'RCD', 'State highways, district roads, bridge construction'),
('Energy Department', 'ED', 'Power transmission, rural electrification, transformers'),
('Mines & Geology Department', 'MGD', 'Mining safety, mineral regulation, environmental impact')
ON CONFLICT (name) DO NOTHING;

-- Seed 24 Jharkhand Districts
INSERT INTO districts (name, state, latitude, longitude, population) VALUES
('Ranchi', 'Jharkhand', 23.3441, 85.3096, 2914253),
('Dhanbad', 'Jharkhand', 23.7957, 86.4304, 2684487),
('East Singhbhum', 'Jharkhand', 22.8046, 86.2029, 2293919),
('Bokaro', 'Jharkhand', 23.6693, 86.1511, 2062330),
('Palamu', 'Jharkhand', 24.0374, 84.0725, 1939869),
('Hazaribagh', 'Jharkhand', 23.9961, 85.3646, 1734495),
('Giridih', 'Jharkhand', 24.1855, 86.3082, 2445474),
('Deoghar', 'Jharkhand', 24.4826, 86.7001, 1492073),
('Dumka', 'Jharkhand', 24.2676, 87.2517, 1321442),
('Godda', 'Jharkhand', 24.8267, 87.2144, 1313551),
('Sahibganj', 'Jharkhand', 25.2425, 87.6433, 1150567),
('Pakur', 'Jharkhand', 24.6334, 87.8492, 900422),
('Jamtara', 'Jharkhand', 23.9629, 86.8029, 791042),
('Chatra', 'Jharkhand', 24.2092, 84.8714, 1042886),
('Koderma', 'Jharkhand', 24.4674, 85.5939, 716259),
('Garhwa', 'Jharkhand', 24.1812, 83.8055, 1322784),
('Latehar', 'Jharkhand', 23.7438, 84.5029, 726978),
('Lohardaga', 'Jharkhand', 23.4357, 84.6806, 461790),
('Gumla', 'Jharkhand', 23.0418, 84.5414, 1025213),
('Simdega', 'Jharkhand', 22.6157, 84.5083, 599578),
('West Singhbhum', 'Jharkhand', 22.5667, 85.8167, 1502338),
('Seraikela Kharsawan', 'Jharkhand', 22.6989, 85.9324, 1065056),
('Khunti', 'Jharkhand', 23.0736, 85.2774, 531885),
('Ramgarh', 'Jharkhand', 23.6333, 85.5167, 949443)
ON CONFLICT (name) DO NOTHING;

-- Seed Academic Institutions
INSERT INTO institutions (name, code, type, district, capabilities) VALUES
('Birla Institute of Technology (BIT) Mesra', 'BIT-MESRA', 'University', 'Ranchi', ARRAY['IoT Telemetry', 'Water Quality Analytics', 'Embedded Systems', 'Remote Sensing', 'AI Classification']),
('National Institute of Technology (NIT) Jamshedpur', 'NIT-JSR', 'University', 'East Singhbhum', ARRAY['Civil Structural Audit', 'Hydrology Engineering', 'Drainage Networks', 'Smart Grid Monitoring']),
('Indian Institute of Technology (ISM) Dhanbad', 'IIT-ISM', 'University', 'Dhanbad', ARRAY['Mining Geotech', 'Environmental Sensing', 'Groundwater Hydrogeology', 'Disaster Mitigation']),
('Birsa Agricultural University (BAU) Ranchi', 'BAU-RNC', 'University', 'Ranchi', ARRAY['Agricultural IoT', 'Soil Moisture Analytics', 'Drought Early Warning', 'Crop Health Sensing']),
('Jharkhand University of Technology (JUT)', 'JUT-RNC', 'University', 'Ranchi', ARRAY['Robotics', 'Public Infrastructure Sensors', 'Urban Smart City Analytics'])
ON CONFLICT (name) DO NOTHING;
