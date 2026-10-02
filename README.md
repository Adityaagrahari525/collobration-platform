# 🎓 CampusLink — Nationwide Student & Staff Collaboration Portal (PS004)

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-IDE-007ACC?logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CampusLink Academic Network** is a centralized nationwide platform connecting students, researchers, and faculty members across accredited Indian academic institutions. It provides real-time project matching, faculty mentorship, peer-to-peer Q&A, skill gap roadmaps, embedded code IDEs, and full database persistence powered by Express, TypeScript, Prisma, and Supabase PostgreSQL.

---

## 🌟 Key Features & Updates

### 1. 🗄️ Full Database CRUD Synchronization (Supabase PostgreSQL)
- **Real Database Host:** Live connection to Supabase PostgreSQL (`vqhriwufmkxwyrilsqeq.supabase.co`).
- **Complete CRUD Lifecycle:**
  - **Users & Profiles:** Create (Register), Read (Directory), Update (Profile Edit), and Delete (Cascading Account Self-Deletion).
  - **Academic Q&A:** Post questions, submit technical answers, edit, vote, mark accepted answers, and delete questions/answers directly from PostgreSQL.
  - **Research Projects:** Create project workspaces, recruit roles, edit sprint phases, and delete project entries in real-time.
- **Prisma ORM & PostgreSQL Schema:** Fully modeled schema with relations and cascading delete rules (`onDelete: Cascade`).

### 2. 🔐 Production-Grade Authentication & Session Security
- **HttpOnly Cookie Architecture:** JWT access tokens and refresh tokens transmitted strictly via `HttpOnly`, `SameSite=Strict`, and `Secure` cookies with `credentials: "include"`.
- **Secrets & Token Rotation:** Secrets loaded exclusively from environment variables with automatic refresh token rotation and revocation.
- **RESTful Endpoints:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/refresh`, and `/api/auth/logout`.

### 3. 📎 Working Proof, Document & Image Upload System (`ProofFileUpload`)
- **Drag & Drop & Browse:** Interactive file dropzone supporting images (`PNG`, `JPG`, `WEBP`), PDFs, doc files, lab logs (`.log`, `.pcap`), and CSVs up to 25MB.
- **FileReader Base64 Encoding:** Converts files into Base64 Data URIs for instant previewing and database storage.
- **Lightbox Image Zoom & Document Downloads:** Visual image previews open a full-screen Lightbox Zoom Modal. PDF and document uploads feature downloadable attachments.
- **Q&A & Profile Integration:** Embedded in the Ask Question page, Answer submission form, and profile verification workflows.

### 4. 🤝 Intelligent Heuristic Teammate & Project Matcher
- **Compatibility Engine:** Evaluates candidate profiles against project requirements using a deterministic multi-factor algorithm.
- **Weighted Compatibility Badges (0–100%):** Weighs technical skill overlap, complementary experience gaps, domain interest alignment, and availability.

### 5. 🎯 Rule-Based Skill Gap & Learning Roadmap Engine
- **Automated Skill Audit:** Compares user competencies against target career roles (*Full-Stack*, *AI/ML*, *Distributed Systems*).
- **Interactive 4-Step Roadmap:** Renders custom step-by-step learning modules and milestone recommendations on scholar profiles.

### 6. ⚡ Jaccard Token Duplicate Question Detector
- **Real-Time Duplicate Prevention:** Analyzes question title inputs using tokenized Jaccard similarity ($J(A, B) = \frac{|A \cap B|}{|A \cup B|}$).
- **Instant Warning Banners:** Detects existing similar academic questions before submission, preventing forum fragmentation.

### 7. 💻 Embedded Monaco IDE Code Workspace
- **In-Browser IDE Modal:** Built using `@monaco-editor/react` inside project detail views supporting JavaScript, TypeScript, Python, C++, HTML/CSS, and JSON.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite, React Router DOM v6 |
| **Backend Framework** | Node.js, Express, TypeScript |
| **ORM & Database** | Prisma ORM, Supabase PostgreSQL (`vqhriwufmkxwyrilsqeq.supabase.co`) |
| **Security & Auth** | JWT, HttpOnly Cookies, Bcrypt Password Hashing, Zod Validation |
| **Styling & UI** | TailwindCSS, Material Symbols |
| **Code Workspace** | `@monaco-editor/react` (Monaco IDE) |
| **File Uploads** | `ProofFileUpload` (Base64 FileReader, Lightbox Modal, Document Previews) |

---

## 📁 Repository Directory Structure

```
csi 04/
├── backend/                    # Express + TypeScript Backend
│   ├── prisma/
│   │   └── schema.prisma       # Complete Prisma PostgreSQL Schema
│   ├── src/
│   │   ├── config/             # Database & JWT Config
│   │   ├── middleware/         # HttpOnly Auth & Error Handlers
│   │   ├── modules/            # Domain Modules (auth, users, questions, projects, skills, institutions)
│   │   ├── routes/             # Express API Router
│   │   ├── utils/              # JWT & Bcrypt password helpers
│   │   └── validators/         # Zod Request Validation Schemas
│   ├── .env                    # Backend Environment Config
│   └── package.json
├── src/                        # Vite + React Frontend
│   ├── components/
│   │   ├── AppLayout.jsx       # Main App Shell
│   │   ├── CodeEditorModal.jsx # Monaco IDE Modal
│   │   ├── ProofFileUpload.jsx # Working Proof, Image & Document Uploader
│   │   └── ProtectedRoute.jsx  # Auth & Onboarding Guard
│   ├── context/
│   │   └── AppContext.jsx      # Global React Context State & DB Sync
│   ├── pages/
│   │   ├── DashboardPage.jsx   # Student & Faculty Command Center
│   │   ├── AskQuestionPage.jsx # Q&A Form with Proof Upload & Duplicate Detector
│   │   ├── QuestionDetailPage.jsx # Q&A Detail with Answer Proof Uploads & Delete Controls
│   │   ├── ProjectsPage.jsx    # Research Workspaces & Matcher
│   │   ├── ProjectDetailPage.jsx # Project Workspace & Monaco IDE Launcher
│   │   ├── ProfilePage.jsx     # User Profile, Skill Gap Roadmap & Account Deletion
│   │   ├── PeoplePage.jsx      # Academic Directory & Search
│   │   └── MentorshipPage.jsx  # Faculty Office Hours & Booking
│   └── services/
│       ├── apiService.js       # Express Backend REST Client (HttpOnly credentials)
│       └── dbService.js        # Supabase Direct Client & Fallback Layer
├── .env                        # Frontend Supabase Config
├── README.md                   # Project Documentation
└── package.json
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Adityaagrahari525/collobration-platform.git
cd collobration-platform
```

### 2. Install Frontend & Backend Dependencies
```bash
# Install root/frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables
Create `.env` in root:
```env
VITE_SUPABASE_URL=https://vqhriwufmkxwyrilsqeq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=http://localhost:5000/api
```

Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/campuslink?schema=public"
JWT_SECRET="campuslink_jwt_access_secret_key_2026_super_secure_key"
REFRESH_TOKEN_SECRET="campuslink_jwt_refresh_secret_key_2026_super_secure_key"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
PORT=5000
```

### 4. Start Development Servers
```bash
# Terminal 1: Launch Express Backend (Port 5000)
cd backend
npm run dev

# Terminal 2: Launch Vite Frontend (Port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📜 License

Distributed under the **MIT License**.