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

## 🎯 Jury Acceptance Suite (100% Verified)

To execute the automated end-to-end relational acceptance tests covering all 9 jury evaluation criteria, run:

```bash
npm run test:jury
```

### Verified Criteria:
1. **Canonical Backend Health & Envelopes:** `{ success: true, data: ..., requestId: "REQ-..." }` with `X-Request-ID` telemetry.
2. **Project Lead JWT Authentication:** Hybrid HttpOnly cookies + Bearer auth headers.
3. **Candidate Scholar Authentication:** Multi-user cross-session authentication.
4. **Project Workspace Retrieval:** Relational projects, roles, and pending applications.
5. **Interactive Application Review:** Express + Prisma relational status updates (`[Accept into Project]`).
6. **Active Project Membership:** Atomic enrollment into `ProjectMember` in PostgreSQL.
7. **Real-time Event Notifications:** Dispatch of `APPLICATION_ACCEPTED` and `PROJECT_APPLICATION` notifications.
8. **Faculty Mentorship Booking:** Relational office hours reservation with capacity tracking.
9. **Q&A Knowledge Exchange:** Inter-campus discussions, voting, and official faculty endorsements.

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

## 🌟 Key Architecture & Capabilities

### 1. 🗄️ Relational PostgreSQL Single Source of Truth
- **30 Canonical Relational Models:** `User`, `UserProfile`, `Institution`, `Skill`, `UserSkill`, `Project`, `ProjectRole`, `ProjectApplication`, `ProjectMember`, `Question`, `Answer`, `QuestionVote`, `AnswerVote`, `MentorshipSlot`, `MentorshipBooking`, `Community`, `CommunityMember`, `Notification`, and more.
- **Zero Mock State:** All actions persist directly to PostgreSQL; data survives page reloads, browser restarts, and cross-browser logins.

### 2. 🔐 Robust Enterprise Authentication
- **Dual Authentication Protocol:** Dual support for `HttpOnly` secure cookies and `Authorization: Bearer <token>` headers with local storage synchronization.
- **Role-Based Access Control (RBAC):** Middleware checks for `STUDENT`, `FACULTY`, `ADMIN`, and project ownership.

### 3. 🤝 Project Matching & Teammate Recruitment
- **Heuristic Compatibility Scoring:** Multi-factor algorithm evaluating skill overlap, experience level, and domain interest (e.g., 94.5% match for Remote Sensing).
- **Interactive Review Workspace:** Leads review pitch submissions, match badges, and approve candidates with instant team enrollment.

### 4. 🎓 Faculty Mentorship & Office Hours
- Real-time slot booking with capacity limits and status tracking (`AVAILABLE`, `BOOKED`, `COMPLETED`).
- Direct integration with calendar links and student notification feeds.

### 5. 💡 Academic Q&A & Knowledge Exchange
- Inquiries tagged by department, academic year, and domain specializations.
- Double-blind peer evaluations, upvoting mechanics, and official faculty endorsement seals.

### 6. 💻 Embedded Monaco IDE Code Workspace
- In-browser code editing inside project detail views supporting Python, JavaScript, TypeScript, C++, and JSON.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, TailwindCSS |
| **Backend** | Node.js, Express 4, TypeScript |
| **Database & ORM** | PostgreSQL 16+, Prisma ORM 5.x |
| **Authentication** | JWT, HttpOnly Cookies, Bearer Tokens, Bcrypt |
| **Code Workspace** | `@monaco-editor/react` (Monaco Editor) |
| **Testing** | Node test harness (`scripts/test-jury-e2e.cjs`) |

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