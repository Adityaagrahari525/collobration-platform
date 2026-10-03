# Project Audit: CampusLink Academic Network

**Document Generated:** October 2026  
**Auditor:** Senior Mobile Application Architect & Systems Engineer  
**Target Platform:** React Native / Expo (Android Mobile Application)  
**Audit Scope:** Full codebase audit of the existing `CampusLink` web and backend architecture.

---

## 1. Executive Summary

CampusLink is an academic collaboration and peer-learning network designed for university students, faculty researchers, and institutional labs. It bridges inter-institutional research gaps across leading institutions (e.g., IIT Delhi, IISc Bangalore, IIT Bombay, IIIT Hyderabad, BITS Pilani, NIT Trichy).

The existing web platform is built with **React 18**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL)**, with an auxiliary **Node.js/Express + Prisma** backend service.

The goal of this initiative is to develop a standalone, fully-featured, native Android mobile application in a clean, isolated `mobile-app/` directory without altering, breaking, or risking any existing website source code.

---

## 2. Codebase & Architectural Inventory

### 2.1 Project Directory Structure

```
csi 04 (2)/
├── csi 04/                              # Preserved Existing Website Codebase
│   ├── .env                             # Active Supabase API URL & Anon Key
│   ├── package.json                     # React 18, Vite 5, Tailwind 3, Supabase JS
│   ├── supabase_schema.sql              # Supabase PostgreSQL DDL Schema
│   ├── src/
│   │   ├── App.jsx                      # App Shell & React Router routes
│   │   ├── components/                  # AppLayout, Topbar, Sidebar, ProtectedRoute, etc.
│   │   ├── context/AppContext.jsx       # Application state provider (Auth, Q&A, Projects)
│   │   ├── data/mockData.js             # Rich academic seed data (Scholars, Q&A, Projects)
│   │   ├── pages/                       # 20+ specialized academic pages
│   │   ├── services/                    # dbService, supabaseClient, apiService
│   │   └── utils/                       # matchingAlgorithm, aiService, duplicateDetector, userStats
│   └── backend/                         # Node.js Express + Prisma ORM backend
├── mobile-app/                          # Isolated Native Android React Native / Expo Project
└── docs/                                # Technical Architectural Documentation
    ├── PROJECT_AUDIT.md                 # (This Document)
    ├── MOBILE_FEATURE_MAPPING.md        # Feature & Screen Mapping Matrix
    └── TESTING_REPORT.md                # QA & Automated Verification Report
```

### 2.2 Existing Frontend Stack

- **Core Framework:** React 18.2.0
- **Build Tool:** Vite 5.1.6
- **Routing:** React Router DOM 6.22.3
- **Styling System:** Tailwind CSS 3.4.1 with custom Design System tokens
- **Icons:** Lucide React
- **Code Workspace:** `@monaco-editor/react` for collaborative code editing
- **Database Client:** `@supabase/supabase-js` v2.117.2

### 2.3 Existing Backend & Database Architecture

1. **Primary Persistence:** **Supabase PostgreSQL**
   - Tables: `institutions`, `profiles`, `questions`, `answers`, `projects`, `project_applications`, `mentorship_slots`, `mentorship_bookings`.
   - RPC: `increment_answers_count(q_id)`.
   - Row-Level Security (RLS) policies configured.
2. **Data Access Layer (`dbService.js`):**
   - Unified async database client with direct Supabase calls and fallback to local in-memory mock datasets when offline or during transient network errors.
3. **Auxiliary REST API (`apiService.js` + `backend/`):**
   - Express REST API with JWT / cookie-based authentication, user profile management, questions, answers, and project CRUD.

### 2.4 Brand Identity & Visual Tokens

- **Brand Name:** CampusLink — Academic Network
- **Color Palette:**
  - `primary`: `#00236f` (Deep Academic Blue)
  - `primary-container`: `#1e3a8a` / `#00164e`
  - `secondary`: `#006c4a` (Verified Forest Green)
  - `secondary-container`: `#82f5c1`
  - `background`: `#faf8ff` (Cool Academic Paper)
  - `surface`: `#ffffff` / `#faf8ff`
  - `surface-container`: `#eaedff`
  - `surface-container-high`: `#e2e7ff`
  - `on-surface`: `#0f172a` (Deep Slate)
  - `on-surface-variant`: `#3a3d4a`
  - `tertiary` (Gamification / XP): `#fc922b` / `#ffdcc3`
  - `error`: `#ba1a1a` / `#ffdad6`
- **Typography Hierarchy:**
  - Public Sans (clean grotesque sans-serif) for high-legibility UI, labels, inputs, and body text.
  - Newsreader / Serif for academic display headlines and hero titles.
- **Badging & Reputation System:**
  - 6-Tier Level progression: Novice Academic (0-99 XP), Contributor (100-299 XP), Scholar (300-699 XP), Researcher (700-1499 XP), Master Mentor (1500-4999 XP), Academic Fellow (5000+ XP).

---

## 3. Algorithm & Logic Audit

The web platform features 4 key algorithmic engines that must be faithfully ported and optimized for the mobile application:

1. **Heuristic Skill-Matching Engine (`matchingAlgorithm.js`):**
   - Computes a candidate-to-project or peer-to-peer compatibility score (0–100%).
   - Weighted factors: Skill overlap (0–35 pts), Complementary skill gaps (up to +20 pts), Experience level delta (0–25 pts), Availability alignment (0–20 pts).
2. **Rule-Based Skill Gap & Learning Path Generator (`aiService.js`):**
   - Analyzes scholar's current skills against target academic/industry roles (e.g. *Frontend Developer*, *Distributed Systems Engineer*, *AI/ML Engineer*, *Robotics Specialist*).
   - Generates a 4-phase structured milestone roadmap to bridge technical gaps.
3. **Jaccard Token Similarity Duplicate Detector (`duplicateDetector.js`):**
   - Live question duplicate prevention engine using tokenization, stop-word elimination, and Jaccard set overlap:
     $$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
   - Displays real-time warning banners if a scholar starts asking a question similar ($\ge 35\%$ overlap) to existing answered discussions.
4. **Reputation, XP & Activity Streak Engine (`userStats.js`):**
   - Real-time XP tracking, dynamic level milestone calculations, daily streak incrementation, and badge unlocking.

---

## 4. Mobile Architecture Strategy

To deliver a high-performance Android mobile application:

1. **Framework:** **React Native** with **Expo SDK 52+** and **TypeScript**.
2. **Navigation:** **Expo Router v4 / React Navigation** utilizing native bottom tabs, stack transitions, and modal overlays.
3. **State Management:** Unified `AuthContext` + `AppContext` providing reactive updates for questions, projects, mentorship, user stats, and direct messages.
4. **Networking & Persistence:**
   - Centralized API layer supporting live Supabase queries and configurable REST endpoints.
   - `AsyncStorage` / `Expo SecureStore` for secure token and profile persistence.
   - Full offline graceful fallback mode ensuring 100% interactivity anywhere.
5. **UI & Design System:**
   - Native-optimized CampusLink theme tokens (colors, typography, elevation, spacing).
   - Reusable components: Header, SearchBar, SkillBadge, MatchBadge, QuestionCard, ProjectCard, MentorCard, StatCard, EmptyState, SkeletonLoader, ConfirmModal.
6. **Code Isolation:** Complete separation in `mobile-app/` ensuring the existing website in `csi 04/` is completely unharmed.

---

## 5. Risk Assessment & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| Unintentional website disruption | Mobile app developed strictly in isolated `/mobile-app` directory; zero writes to `/csi 04`. |
| Dependency conflicts between Node versions | Project-scoped `package.json` with compatible Expo and React Native packages. |
| Offline / Network connectivity drops | Centralized resilient data layer with cached state and fallback mock data. |
| Hardware back button navigation on Android | Proper native Stack / Tabs configuration with back handlers. |
