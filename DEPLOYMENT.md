# PooKar / JanSahyog (SIH PS-43) - Production Deployment Guide

## 1. System Overview & Architecture
PooKar / JanSahyog is a societal innovation intelligence and citizen grievance redressal engine built for the Government of Jharkhand.

```
                    ┌─────────────────────────┐
                    │  React 18 SPA (Vite)    │
                    └────────────┬────────────┘
                                 │
                            HTTPS / Nginx
                                 │
                    ┌────────────▼────────────┐
                    │  Node.js / Express API  │
                    │      (backend-new)      │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
        Citizen Portal   Government Portal   Institution Portal
                 │               │               │
                 └───────────────┼───────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       PostgreSQL 16 + pgvector          Google Gemini AI
     (Strict SQL RAG Domain Isolation)  (Zod + BoM Guard)
```

---

## 2. Environment Configuration

### Backend Environment Variables (`backend-new/.env`)
```env
NODE_ENV=production
PORT=5000

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/jharkhand_innovation_db
PG_POOL_MIN=2
PG_POOL_MAX=20
PG_IDLE_TIMEOUT=30000
PG_CONNECTION_TIMEOUT=5000

JWT_SECRET=your-production-256-bit-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGINS=https://pookar.jharkhand.gov.in,http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
```

### Frontend Environment Variables (`.env`)
```env
VITE_API_BASE_URL=/api/v1
```

---

## 3. Production Deployment with Docker Compose

### Prerequisites
- Docker Engine 24.0+ & Docker Compose V2
- Ports 80, 443, 5000, and 5432 available

### Step 1: Clone and Configure
```bash
git clone https://github.com/zencoders-prob43-sih26.git
cd zencoders-prob43-sih26
cp backend-new/.env.example backend-new/.env
# Update .env with production credentials
```

### Step 2: Build and Run Services
```bash
# Build production bundle for React frontend
npm ci
npm run build

# Start Docker containers
docker compose build
docker compose up -d

# Verify service health
docker compose ps
docker compose logs -f backend
```

---

## 4. Database Migrations & Seeding
Database migrations and schema synchronization run automatically on server bootstrap.
To execute migrations manually:
```bash
cd backend-new
npm run build
node dist/config/migrate.js
```

---

## 5. Security & Isolation Verification

### Mandatory Security Invariants
1. **RAG Domain Isolation**: All semantic vector queries in PostgreSQL strictly enforce `WHERE domain = $2`. Cross-domain document retrieval is impossible at the SQL query level.
2. **Deterministic BoM Guard**: Hardware recommendations from Gemini are verified deterministically through the domain BoM rules before being saved or returned (e.g. Water flow sensors are rejected in Education DPRs).
3. **Multi-Portal RBAC**: JWT tokens are verified server-side with portal-specific middlewares (`requireRole`, `requireInstitutionScope`, `requireDistrictScope`).

---

## 6. Backup & Disaster Recovery Procedures

### Automated Daily PostgreSQL Backup
```bash
# Run pg_dump within the container
docker exec -t pookar-postgres pg_dump -U postgres -d jharkhand_innovation_db -F c -b -v -f /var/lib/postgresql/data/backup_$(date +%Y%m%d).dump
```

### Database Restore Procedure
```bash
docker exec -t pookar-postgres pg_restore -U postgres -d jharkhand_innovation_db -v -c /var/lib/postgresql/data/backup_20260910.dump
```

---

## 7. Production Commands Reference
```bash
# Run Unit & Integration Tests (RAG domain isolation, BoM Guard, etc.)
cd backend-new && npm test

# Typecheck backend
cd backend-new && npx tsc --noEmit

# Typecheck frontend
npm run build
```
