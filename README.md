# 🎓 CampusLink — Nationwide Student & Staff Collaboration Portal (PS004)

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_IDE-007ACC?logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CampusLink Academic Network** is a nationwide, inter-institutional collaboration and knowledge exchange platform connecting students, researchers, and faculty across accredited Indian universities and research institutes (IIT Delhi, IIT Bombay, IISc Bangalore, BITS Pilani, IIIT Hyderabad, IIT Madras, NIT Trichy).

CampusLink is engineered as a clean, monolithic, relational web system powered by **React 18 + Vite** (frontend), **Express 4 + TypeScript** (REST API backend), and **Prisma ORM on PostgreSQL** (data persistence).

---

## 🏛️ Comprehensive Transformation Log: What Was Done & Why

From the initial baseline repository to the current production-ready platform, the architecture underwent a systematic consolidation from a fragmented prototype into a **single relational source of truth**:

### 1. Why Changes Were Made
- **Fixed Authentication & Session Drop:** The initial codebase had dummy credentials (`scholar@iitd.ac.in`) that didn't exist in PostgreSQL, and cookies were dropped due to cross-origin port isolation (`5173` vs `5000`).
- **Eliminated Data Loss & Volatile Mock State:** The previous prototype lacked an `/api/applications` backend route, silently writing application pitches into browser `localStorage` via a fallback shim (`dbService.js`). Applications vanished across different browsers and incognito tabs.
- **Created a Single Relational Source of Truth:** Replaced the split prototype setup (unreachable Supabase project + localStorage + partial 6 Express routes) with a clean, monolithic architecture: **React 18 + Express 4 + TypeScript + Prisma ORM on PostgreSQL 18**.

### 2. What Was Added
- **`vite.config.js`:** Reverse proxy routing `/api` -> `http://localhost:5000` to eliminate cross-origin cookie drops.
- **7 New Backend Domain Modules:**
  - `applications/`: Relational application review, pitches, and status updates.
  - `mentorship/`: Faculty office hours generation and slot reservation.
  - `notifications/`: Event-driven alerts with unread badge counters.
  - `communities/`: Inter-campus discipline hubs (AI/ML, Cybersecurity, Distributed Systems) with join/leave actions.
  - `matching/`: Heuristic candidate compatibility calculation engine (0–100%).
  - `messages/`: Inter-scholar collaboration chat.
  - `audit/`: Administrative audit logging.
- **4 Security & Observability Middlewares:** `requestIdMiddleware` (`X-Request-ID`), `authorization` (RBAC), `ownership`, and `rateLimit`.
- **2 Automated Verification Suites:**
  - `npm run test:jury` (`scripts/test-jury-e2e.cjs`): 9-criteria end-to-end acceptance suite.
  - `npm run test:audit` (`scripts/test-comprehensive-audit.cjs`): 14-subsystem architecture and security audit suite.

### 3. What Was Removed
- **`src/services/dbService.js` (440 lines):** Removed client-side mock database fallback.
- **`src/services/supabaseClient.js` (34 lines):** Removed dead Supabase client targeting unreachable remote host.
- **18 Stitch Downloaded HTML Mockups (13,000+ lines):** Deleted unused static prototype files from `stitch_downloaded/`.
- **Diagnostic Scripts:** Cleaned up `download_stitch.py` and `scratch/`.

### 4. What Was Updated
- **`backend/prisma/schema.prisma`:** Expanded to all **30 canonical relational models** with foreign key cascades (`onDelete: Cascade`).
- **`backend/prisma/seed.ts`:** Pre-seeds 7 universities, 18 skills, 4 badges, 5 demo accounts, projects with open roles, applications, mentorship slots, faculty endorsements, and communities.
- **`src/context/AppContext.jsx`:** Converted all mutations into live API transactions (`createProject`, `applyToProject`, `updateApplicationStatus`, `bookMentorshipSlot`, `voteQuestion`, `submitAnswer`, `joinCommunity`).
- **Frontend Pages:** Wired `LoginPage`, `ProjectDetailPage`, `MentorshipPage`, `QuestionsFeedPage`, `PeoplePage`, and `CommunitiesPage` to real database APIs.

### 5. UI/UX Modernization Showcase (`/ui-ux-pro-max`)
- **🎨 Human-Crafted Academic Aesthetic:** Implemented a tailored, high-density scholarly color system featuring Royal Blue (`#00236f`), Emerald (`#006c4a`), and Warm Amber (`#ea580c`), paired with `Newsreader` editorial serif headlines and `Public Sans` body text.
- **⚡ 100% Crisp Lucide SVG Vector Icons:** Replaced all raw font-text material symbols across 20+ pages and components with responsive `lucide-react` SVG components (`Landmark`, `GraduationCap`, `CheckCircle2`, `ShieldCheck`, `TrendingUp`, `BarChart2`, `Database`, `Search`, etc.) eliminating raw font text rendering bugs.
- **✨ Glassmorphic Backdrop Header & Micro-Elevations:** Added translucent sticky topbars (`backdrop-blur-md bg-surface-container-lowest/85`), card elevation micro-interactions (`hover:-translate-y-0.5 hover:shadow-md`), and explicit keyboard focus rings.
- **⌨️ Global Power-User Shortcut (`⌘K` / `Ctrl+K`):** Integrated a global keyboard listener across the navigation header with `Esc` dismissal for rapid inter-campus search.
- **♿ Accessibility & Motion Control:** Added `@media (prefers-reduced-motion: reduce)` rules and accessible ARIA attributes across interactive components.

---

## ⏱️ Jury Step-by-Step Acceptance Walkthrough (Time-to-Time)

To evaluate the system live, the jury can execute this chronological, step-by-step verification flow:

```mermaid
sequenceDiagram
    autonumber
    actor Lead as Project Lead (Rahul @ IITD)
    participant UI as CampusLink React UI
    participant API as Express API (:5000)
    participant DB as PostgreSQL 18
    actor Cand as Candidate (Ananya @ IITB)

    Note over Lead,Cand: T+0:00 — CLI Automated Verification
    Lead->>API: Run npm run test:jury & test:audit
    API->>DB: Verify 14 Subsystems & 9 Criteria
    DB-->>Lead: 100% Tests Pass

    Note over Lead,Cand: T+0:30 — Candidate Applies (Browser A)
    Cand->>UI: Log in as Ananya (1-Click Demo)
    Cand->>UI: Apply for "Computer Vision Engineer" on FloodSense AI
    UI->>API: POST /api/projects/:id/apply (Pitch + Match Score: 94.5%)
    API->>DB: INSERT into ProjectApplication

    Note over Lead,Cand: T+1:00 — Lead Reviews & Enrolls (Browser B)
    Lead->>UI: Log in as Rahul (1-Click Demo)
    UI->>API: GET /api/projects/:id (Fetch Applications)
    Lead->>UI: Click [Accept into Project]
    UI->>API: PATCH /api/applications/:id/status (ACCEPTED)
    API->>DB: Transaction: UPDATE Application & UPSERT ProjectMember
    API->>DB: INSERT Notification (APPLICATION_ACCEPTED)

    Note over Lead,Cand: T+1:30 — Candidate Verification (Browser A)
    Cand->>UI: Real-time Notification Received: "Application Accepted! 🎉"
    Cand->>UI: Team Member Count Increments & Active Member Badge shown

    Note over Lead,Cand: T+2:00 — Mentorship Booking
    Cand->>UI: Book Faculty Slot with Dr. Rajesh Sharma
    UI->>API: POST /api/mentorship/slots/:id/book
    API->>DB: Reserve Slot & Decrement Capacity
```

### Chronological Step Breakdown:

| Time | Step Name | Actor & Environment | Action & Expected Verification |
| :---: | :--- | :--- | :--- |
| **T+0:00** | **Automated Suite Execution** | Terminal CLI | Run `npm run test:jury` and `npm run test:audit`. All 23 tests pass with 100% green checkmarks. |
| **T+0:30** | **Lead Session Sign-In** | Browser A (`127.0.0.1:5173/login`) | Click **Rahul (Lead)** button. Authenticates instantly with JWT, displays IIT Delhi institutional trust badge. |
| **T+1:00** | **Applicant Session Sign-In** | Browser B (Incognito) | Click **Ananya (Candidate)** button. Authenticates as IIT Bombay M.Tech scholar. Browse to **Projects** -> **FloodSense AI**. |
| **T+1:30** | **Candidate Application** | Browser B | Submit application for *Computer Vision & Remote Sensing Engineer*. Pitch and 94.5% heuristic match score recorded in PostgreSQL. |
| **T+2:00** | **Lead Review & Acceptance** | Browser A | Switch to Rahul's browser. Notification badge lights up. Open FloodSense AI -> **Applications** tab -> Click **[Accept into Project]**. |
| **T+2:30** | **Relational Team Enrollment** | Browser A & B | Ananya is enrolled as an active `ProjectMember`. Team member count increments from 1 to 2 in real-time. |
| **T+3:00** | **Notification Receipt** | Browser B | Ananya receives instant notification: *"Application Accepted! Congratulations..."* linked to workspace. |
| **T+3:30** | **Faculty Office Hours Reservation** | Browser B (`/mentorship`) | Browse faculty slots -> Book 45-min research session with Dr. Rajesh Sharma. Slot status updates to `BOOKED`. |
| **T+4:00** | **Q&A Knowledge Exchange** | Browser A (`/questions`) | Upvote technical questions, review official faculty endorsement seals, and submit peer answers with proof attachments. |
| **T+4:30** | **Persistence Verification** | Both Browsers | Hard refresh (`Ctrl + F5`) or restart browsers. All sessions, team memberships, and bookings remain intact in PostgreSQL. |

---

## 🎯 Test Results & Audit Matrix (100% Passing)

### 1. Jury Acceptance Suite (`npm run test:jury`) — 9/9 Criteria
```
═══════════════════════════════════════════════════════════════
 🧪 CAMPUSLINK JURY ACCEPTANCE END-TO-END TEST
═══════════════════════════════════════════════════════════════
1️⃣  Verifying Backend Health & Canonical Envelopes...       ✅ PASS
2️⃣  Authenticating Project Lead (Rahul Sharma @ IITD)...     ✅ PASS
3️⃣  Authenticating Candidate (Ananya Iyer @ IITB)...        ✅ PASS
4️⃣  Fetching FloodSense Research Project Workspace...       ✅ PASS
5️⃣  Lead Reviews & Clicks [ACCEPT] Application...           ✅ PASS
6️⃣  Verifying Project Membership in PostgreSQL...           ✅ PASS
7️⃣  Verifying Notification delivered to Ananya...           ✅ PASS
8️⃣  Testing Faculty Mentorship Slot Booking...              ✅ PASS
9️⃣  Testing Q&A Thread & Endorsement Engine...               ✅ PASS
═══════════════════════════════════════════════════════════════
 🎯 JURY ACCEPTANCE TEST RESULT: 100% PASSED (ALL 9 CRITERIA)
═══════════════════════════════════════════════════════════════
```

### 2. Comprehensive Subsystems Audit (`npm run test:audit`) — 14/14 Tests
```
════════════════════════════════════════════════════════════════════════════════
 🧪 CAMPUSLINK CANONICAL SYSTEM & AUDIT TEST SUITE (14 SUBSYSTEMS)
════════════════════════════════════════════════════════════════════════════════
  ✅ [Infra] Backend Health & X-Request-ID Telemetry (REQ-...)
  ✅ [Auth] Student Lead JWT Authentication (Rahul Sharma @ IITD)
  ✅ [Auth] Candidate Scholar JWT Authentication (Ananya Iyer @ IITB)
  ✅ [Auth] Faculty Mentor Authentication (Dr. Rajesh Sharma @ IITD)
  ✅ [Auth] Consortium Admin Authentication (SuperAdmin)
  ✅ [Directory] Institutional Directory Retrieval (7 Tier-1 Nodes)
  ✅ [Directory] Verified Technical Skills Registry (18 Skills)
  ✅ [Projects] Project Workspace Listing & Open Roles Retrieval
  ✅ [Matching] Candidate Application & Heuristic Match Computation (94.5%)
  ✅ [Workflow] Atomic Lead Review & [Accept into Project] Transaction
  ✅ [Database] PostgreSQL ProjectMember Relational Enrollment
  ✅ [Notifications] Application Acceptance Event Notification Delivery
  ✅ [Q&A] Inter-Campus Q&A Engine & Official Faculty Endorsements
  ✅ [Communities] Inter-Campus Communities & Discipline Guilds (3 Hubs)
════════════════════════════════════════════════════════════════════════════════
 🎯 COMPREHENSIVE AUDIT RESULT: 14/14 TESTS PASSED (100%)
════════════════════════════════════════════════════════════════════════════════
```

---

## 🔑 Canonical Demo Accounts

The database includes pre-seeded verified accounts across key consortium institutions. You can use the **1-Click Demo Login** buttons on the sign-in page (`/login`) or enter the credentials below:

| Role | Name | Institution | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Project Lead** | Rahul Sharma | IIT Delhi | `rahul.sharma@iitd.ac.in` | `Password@123` |
| **Candidate / Applicant** | Ananya Iyer | IIT Bombay | `ananya.iyer@iitb.ac.in` | `Password@123` |
| **Faculty Mentor** | Dr. Rajesh Sharma | IIT Delhi | `prof.sharma@cse.iitd.ac.in` | `Password@123` |
| **Peer Scholar** | Rohan Verma | IIIT Hyderabad | `rohan.verma@iiit.ac.in` | `Password@123` |
| **Consortium Admin** | SuperAdmin | Academic Affairs | `admin@campuslink.ac.in` | `AdminPassword@123` |

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite, React Router v6, TailwindCSS |
| **Design System & Icons** | `/ui-ux-pro-max` Scholarly Tokens, `lucide-react` SVG Icons, Glassmorphic CSS |
| **Typography** | `Newsreader` (Editorial Serif), `Public Sans`, `JetBrains Mono` |
| **Backend Framework** | Node.js, Express 4, TypeScript |
| **Database & ORM** | PostgreSQL 16+, Prisma ORM 5.x (30 Relational Models) |
| **Security & Auth** | JWT, HttpOnly Cookies, Bearer Auth, Bcrypt, Zod |
| **Code Workspace** | `@monaco-editor/react` (Embedded Monaco IDE) |
| **Testing Harnesses** | Node test runners (`scripts/test-jury-e2e.cjs`, `scripts/test-comprehensive-audit.cjs`) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0+
- **PostgreSQL**: Local instance running on port 5432

### 2. Configure Environment

**Root `.env`:**
```env
VITE_API_BASE_URL=/api
```

**Backend `backend/.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/campuslink?schema=public"
JWT_SECRET="campuslink_jwt_access_secret_key_2026_super_secure_key"
REFRESH_TOKEN_SECRET="campuslink_jwt_refresh_secret_key_2026_super_secure_key"
FRONTEND_URL="http://127.0.0.1:5173"
NODE_ENV="development"
PORT=5000
```

### 3. Initialize Database & Seed
```bash
cd backend
npx prisma db push
npm run prisma:seed
cd ..
```

### 4. Start Development Servers
```bash
# Terminal 1: Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (Port 5173 with API Proxy)
npm run dev
```

Visit **`http://127.0.0.1:5173`** and click any demo account button to log in!

---

## 📜 License
Distributed under the **MIT License**.