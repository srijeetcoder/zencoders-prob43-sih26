-- ==============================================================================
-- SOCIETAL INNOVATION INTELLIGENCE ENGINE (SIH PS-43) - DATABASE INITIALIZATION
-- Targeted at Government of Jharkhand Innovations & Ecosystem Coordination
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Clean Existing Schema (Safe for initialization runs)
DROP TABLE IF EXISTS problems CASCADE;
DROP TABLE IF EXISTS ecosystem_entities CASCADE;
DROP TABLE IF EXISTS innovation_memory CASCADE;

-- 3. Problems Table
CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    domain_tags TEXT[] NOT NULL DEFAULT '{}',
    root_causes TEXT[] NOT NULL DEFAULT '{}',
    disciplines TEXT[] NOT NULL DEFAULT '{}',
    priority VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
    detected_dialect VARCHAR(100),
    translated_problem TEXT,
    embedding vector(768) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_problems_district ON problems (district);
CREATE INDEX idx_problems_domain_tags ON problems USING GIN (domain_tags);

CREATE INDEX idx_problems_embedding_cosine ON problems 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 4. Ecosystem Entities Table
CREATE TABLE ecosystem_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('University', 'Startup', 'Lab', 'R&D Center', 'Government Agency')),
    district VARCHAR(100) NOT NULL,
    capabilities TEXT[] NOT NULL DEFAULT '{}',
    embedding vector(768) NOT NULL,
    contact_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ecosystem_capabilities_gin ON ecosystem_entities USING GIN (capabilities);
CREATE INDEX idx_ecosystem_district ON ecosystem_entities (district);

CREATE INDEX idx_ecosystem_embedding_cosine ON ecosystem_entities 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 5. Innovation Memory Table (RAG Knowledge Base)
CREATE TABLE innovation_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    problem_summary TEXT NOT NULL,
    solution_summary TEXT,
    outcome TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    source_url TEXT,
    raw_content TEXT,
    embedding vector(768) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_innovation_memory_embedding_cosine ON innovation_memory 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
