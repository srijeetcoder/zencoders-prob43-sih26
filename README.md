# PooKar (SIH PS-43) — Societal Innovation Intelligence Engine

<div align="center">
  <h1> SMART INDIA HACKATHON 2026 </h1>
  
  [![SIH 2026](https://img.shields.io/badge/Smart_India_Hackathon-2026-orange?style=for-the-badge)](https://sih.gov.in/)
  [![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)]()
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()
  [![Architecture](https://img.shields.io/badge/Architecture-pgvector_%2B_FastAPI_%2B_Express_%2B_React-emerald?style=for-the-badge)]()
</div>

<br/>

## 👥 Team Zencoders

| # | Name | Roles |
| :---: | :--- | :--- |
| **i)** | Srijeet Chatterjee | Backend & AI Systems Architect |
| **ii)** | Susmit Chatterjee | Frontend & UI/UX Engineer |
| **iii)** | Taiyeb Munsi | Full Stack & Data Integration |
| **iv)** | Miranda Choudhuri | UI/UX & Design Systems |
| **v)** | Subhajit Palit | Presentation & Stakeholder Strategy |

---

## 🏛️ System Architecture & Workflow Mapping

```mermaid
graph TD
    subgraph Stakeholders["👥 Stakeholder Portals"]
        C["Citizen Portal (Multilingual Grievance Intake)"]
        G["Government War Room (Executive Command Console)"]
        U["University & R&D Labs (DPR & Sensor Workbench)"]
    end

    subgraph Ingestion["⚡ Real-time Ingestion & Normalization"]
        NL["Indic Dialect Normalizer (Nagpuri / Khortha / Santali / Hindi)"]
        EMB["OpenAI text-embedding-3-small (1536-dim)"]
    end

    subgraph CoreEngine["🧠 Core Intelligence Engine"]
        PGV[("PostgreSQL + pgvector (Cos-Sim Semantic Match)")]
        DEDUP["Deduplication & Clustering Engine"]
        BOM["Negative BoM Hardware Constraint Validator"]
        SCURVE["Dynamic S-Curve & Impact Projection"]
    end

    subgraph Execution["🚀 Operational Dispatch & Governance"]
        DISP["District Nodal Officer Escalation Engine"]
        TEL["Live IoT Sensor Telemetry (LoRaWAN / 4G)"]
        DPR["Investment-Grade Bankable DPR Generator"]
    end

    C -->|Submits Problem / Audio / Text| NL
    NL --> EMB
    EMB --> PGV
    PGV --> DEDUP

    G -->|Monitor Escalations & Run AI Analysis| SCURVE
    G -->|Dispatch Directives| DISP
    
    U -->|Review Regional DPRs & Verify BoM| BOM
    U -->|Submit Calibration & Ingest Packets| TEL
    
    DEDUP --> DPR
    DPR --> U
    TEL --> G
```

---

### 1. Citizen Portal Flow

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as 👤 Citizen (Unauthenticated / Logged-in)
    participant Intake as 🌐 PooKar Intake Interface
    participant NLP as 🔤 Dialect Normalization (AI Pipeline)
    participant DB as 🗄️ pgvector Semantic Vector DB
    participant Engine as ⚙️ SIH-43 Core Engine
    participant Ledger as 🎫 Instant Ticket & Token Claim

    Citizen->>Intake: Submits Civic Issue (Text/Audio in Nagpuri/Hindi/English)
    Intake->>NLP: Transcribes & Normalizes vernacular text
    NLP->>DB: Generates 1536-dim embedding vector
    DB->>DB: Computes cosine similarity across existing cluster pool
    alt Similarity Score > 0.85 (Existing Cluster)
        DB-->>Engine: Match found! Links to existing District Ticket
    else Similarity Score <= 0.85 (Novel Anomaly)
        DB-->>Engine: Ingests as new Regional Innovation Problem
    end
    Engine->>Ledger: Assigns JS-2026-XXXX Ticket ID & SLA Timelines
    Ledger-->>Citizen: Renders Live Tracking Timeline & Post-Submission Token Claim
```

---

### 2. Government War Room Flow

```mermaid
sequenceDiagram
    autonumber
    actor Officer as 🏛️ District Magistrate / Department Head
    participant Auth as 🔐 RBAC JWT Auth Guard
    participant WarRoom as 📊 Executive Command Console
    participant AI as 🧠 AI Impact & S-Curve Simulation
    participant Dispatch as 🚨 Nodal Escalation & Action Dispatch

    Officer->>Auth: Submits Government / Admin Credentials
    Auth-->>Officer: Issues Scoped JWT Token & Authorizes Access
    Officer->>WarRoom: Ingests District Hazard Scores & Sector Analytics
    Officer->>AI: POST /api/government/ai-analysis (Title, District, Budget, Horizon)
    AI-->>WarRoom: Returns Logistic S-Curve Adoption, Green BoM Check & Lab Matches
    Officer->>Dispatch: Initiates High-Priority Field Directive to Municipal Cell
    Dispatch-->>Officer: Confirms 24hr SLA Dispatch with Dispatched Tracking ID
```

---

### 3. University & Research Lab Portal Flow

```mermaid
sequenceDiagram
    autonumber
    actor Researcher as 🔬 Academic Nodal Partner (BIT Mesra / IIT ISM / NIT JSR)
    participant Portal as 🎓 University & Lab Workbench
    participant BoMGuard as 🛡️ Negative BoM Constraint Engine
    participant Hardware as 📡 Live Sensor Telemetry (LoRaWAN/ESP32)
    participant Feedback as 📈 State Calibration Ingestion

    Researcher->>Portal: Accesses Assigned Regional DPRs & BoM Specifications
    Researcher->>BoMGuard: Inputs proposed Bill of Materials components
    BoMGuard-->>Researcher: Validates BIS IS 16046 norms & rejects Lead-Acid/Proprietary parts
    Researcher->>Hardware: Reads real-time ultrasonic depth/temperature telemetry
    Researcher->>Feedback: Submits lab bench calibration results (% accuracy, drift delta)
    Feedback-->>Portal: Elevates project readiness score & advances TRL status
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Leaflet / Google Maps API.
- **Backend API**: Node.js, Express, TypeScript, Zod Validation, JWT RBAC Middleware.
- **Intelligence Pipeline**: FastAPI, Python 3.11, OpenAI Embeddings, pgvector, SciPy S-Curve Logistics.
- **Resilience**: Client-side Circuit-Breaker fallbacks guaranteeing 100% operational demo uptime.

---

## 🚀 Getting Started

### 1. Backend Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:3000
```

### 2. Frontend Application
```bash
npm install
npm run dev
# Running on http://localhost:5173
```
