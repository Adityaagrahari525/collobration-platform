# 🎓 CampusLink — Nationwide Student & Staff Collaboration Portal (PS004)

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-IDE-007ACC?logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CampusLink** is a centralized, nationwide academic network designed to connect students, researchers, and faculty members across institutions. It facilitates cross-college collaboration, project team formation, faculty mentorship, peer-to-peer Q&A, and technical skill development through intelligent matching algorithms and embedded code workspaces.

---

## 🌟 Key Features

### 1. 🔐 Academic Verification & Institutional Identity
- **Verified Domains:** Secure sign-up enforcing institutional emails (`@*.edu.in`, `@*.ac.in`).
- **Role-Based Access Control:** Distinct profiles and permissions for **Students**, **Faculty**, and **Researchers**.
- **Institutional Verification System:** Direct verification codes (`#IN-9042-DL`, `#FAC-0192-DL`) for immediate academic badge issuance.

### 2. 🤝 Intelligent Heuristic Teammate & Project Matcher
- **Compatibility Engine:** Evaluates candidate profiles against project requirements using a deterministic multi-factor algorithm.
- **Scoring System (0–100%):** Weighs technical skill overlap, complementary experience gaps, domain interest alignment, and availability.
- **Live Compatibility Badges:** Displays real-time match percentages and actionable match rationales on project listings.

### 3. 🎯 Rule-Based Skill Gap & Learning Roadmap Engine
- **Target Role Guidance:** Students select target careers (e.g., *Full-Stack Engineer*, *AI/ML Researcher*, *Cybersecurity Specialist*).
- **Automated Skill Audit:** Compares user skills against industry standards to compute missing competencies.
- **Interactive 4-Step Roadmap:** Renders custom step-by-step learning modules and milestone recommendations directly on user profiles.

### 4. ⚡ Jaccard Token Duplicate Question Detector
- **Real-Time Duplicate Prevention:** Analyzes question title inputs on the Q&A forum using tokenized Jaccard similarity ($\frac{|A \cap B|}{|A \cup B|}$).
- **Instant Warning Banners:** Detects existing similar academic questions before submission, preventing forum fragmentation.

### 5. 💻 Embedded Monaco IDE Code Workspace
- **In-Browser IDE Modal:** Built using `@monaco-editor/react` inside project detail views.
- **Multi-Language Support:** Supports JavaScript, TypeScript, Python, HTML/CSS, JSON, and C++.
- **Integrated Workspace:** Allows project members to prototype code, write technical documentation, and collaborate directly without leaving the portal.

### 6. 🏆 Reputation, Leaderboards & Faculty Mentorship
- **Reputation Engine:** Dynamically calculates User Levels, Badges, and Streaks based on Q&A upvotes, accepted answers, project contributions, and peer endorsements.
- **Nationwide Leaderboard:** Ranks top student and faculty contributors nationally or filterable by institution.
- **Faculty Office Hours:** Schedule research consultations and office hour slots directly with verified professors.

### 7. 🗄️ Supabase PostgreSQL Backend Layer
- **Persistent Cloud Data:** Unified Database Service (`dbService.js`) powered by Supabase PostgreSQL.
- **Row Level Security (RLS):** Enforces data privacy and user-level ownership.
- **Offline Resiliency:** Features transparent local storage fallback mechanisms ensuring unblocked UI usage during network latency.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite |
| **Styling & UI** | TailwindCSS, Lucide Icons, Headless UI |
| **Code Workspace** | `@monaco-editor/react` (Monaco Editor) |
| **Cloud Database** | Supabase (PostgreSQL, Row Level Security, Auth Services) |
| **API & Data Services** | `@supabase/supabase-js`, Custom Async Service Layer (`dbService.js`) |
| **Algorithmic Modules** | Jaccard Similarity Engine, Weighted Heuristic Matching, XP Engine |

---

## 📁 Repository Directory Structure

```
csi 04/
├── index.html                  # App HTML Entry point
├── package.json                # Project dependencies & scripts
├── tailwind.config.js          # Tailwind CSS Configuration
├── vite.config.js              # Vite Build Configuration
├── supabase_schema.sql         # Supabase PostgreSQL Database Schema
├── PROJECT_MASTER_PLAN.md      # Engineering Master Plan & Spec
├── .env.example                # Environment Variables Template
├── src/
│   ├── main.jsx                # React DOM render entry
│   ├── App.jsx                 # App router & main layout
│   ├── components/
│   │   ├── AppLayout.jsx       # Persistent Navigation & Header Shell
│   │   ├── CodeEditorModal.jsx # Monaco Code Editor Modal
│   │   ├── Sidebar.jsx         # Navigation Sidebar
│   │   ├── Topbar.jsx          # User Header & Notifications Bar
│   │   └── ProtectedRoute.jsx  # Auth & Onboarding Guard
│   ├── context/
│   │   └── AppContext.jsx      # Global React Context State
│   ├── pages/
│   │   ├── DashboardPage.jsx      # Student & Faculty Command Center
│   │   ├── ProjectsPage.jsx       # Filterable Projects & Match Engine
│   │   ├── ProjectDetailPage.jsx  # Workspace & Monaco IDE Launcher
│   │   ├── AskQuestionPage.jsx    # Q&A Form with Duplicate Detector
│   │   ├── QuestionsFeedPage.jsx  # Forum Feed & Upvoting System
│   │   ├── ProfilePage.jsx        # User Profile & Skill Gap Roadmap
│   │   ├── PeoplePage.jsx         # Directory & Filterable Search
│   │   ├── RecognitionPage.jsx    # Nationwide & Campus Leaderboard
│   │   ├── MentorshipPage.jsx     # Faculty Booking & Office Hours
│   │   ├── LoginPage.jsx          # Academic Login Screen
│   │   ├── RegisterPage.jsx       # Academic Registration & Verification
│   │   └── OnboardingPage.jsx     # Profile Setup Wizard
│   ├── services/
│   │   ├── supabaseClient.js   # Supabase Client Initialization
│   │   ├── dbService.js        # Supabase CRUD Database Abstraction
│   │   └── apiService.js       # Local Storage Fallback Service
│   └── utils/
│       ├── matchingAlgorithm.js # 0-100 Heuristic Project Matching
│       ├── duplicateDetector.js # Jaccard Token Overlap Calculator
│       ├── aiService.js         # Skill Gap & Career Path Generator
│       └── userStats.js         # XP, Level, & Badge Engine
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

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (or copy `.env.example`):
```env
VITE_SUPABASE_URL=https://vqhriwufmkxwyrilsqeq.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
To generate a production-ready build:
```bash
npm run build
```

---

## 📊 Database Setup (Supabase)

If you are deploying your own Supabase backend, run the SQL script provided in [`supabase_schema.sql`](file:///d:/USER/Desktop/csi%2004/supabase_schema.sql) in your Supabase SQL Editor.

It initializes:
- `profiles`: User information, academic credentials, skills, XP, and badges.
- `projects`: Collaborative projects, required skills, and team vacancies.
- `project_applications`: Student applications and pitch proposals.
- `questions` & `answers`: Q&A forum content, upvote metrics, accepted solution flags.
- `mentorships`: Faculty office hours schedules and student appointment bookings.

---

## 📐 Algorithmic Implementation Breakdown

### 1. Skill Matcher Formula
$$\text{Match Score} = w_1 \cdot \left(\frac{|S_{\text{user}} \cap S_{\text{project}}|}{|S_{\text{project}}|}\right) + w_2 \cdot \text{ExperienceFactor} + w_3 \cdot \text{AvailabilityFactor}$$
Calculates weighted skill overlap between candidate profiles and project requirements.

### 2. Jaccard Similarity Duplicate Detector
$$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
Tokenizes incoming question titles, removes common stop-words, and calculates exact set overlap ratios against existing forum titles to trigger early warnings.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve CampusLink:
1. Fork the Repository.
2. Create a Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.