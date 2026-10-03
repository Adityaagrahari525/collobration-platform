# Mobile Feature Mapping & Navigation Plan

**Project:** CampusLink — Academic Network Mobile Application (Android)  
**Document Generated:** October 2026  
**Document Status:** Complete Architecture & Screen Specification

---

## 1. Feature Mapping Matrix

| ID | Feature Name | Existing Website Implementation | Required Mobile Screen / Interaction | Backend / Storage Dependency | Validation & Security Rules | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **MOB-01** | **Authentication & Role Selection** | `LoginPage.jsx`, `RegisterPage.jsx` | `(auth)/login`, `(auth)/register`, `(auth)/onboarding` | Supabase Auth / `dbService.login` | Academic email format regex, password min 6 chars, role selection (Student/Faculty) | 🟢 Complete |
| **MOB-02** | **Academic Dashboard** | `DashboardPage.jsx` | `(tabs)/index` (Home Tab) | `dbService.getQuestions`, `getProjects`, user stats | Level/XP calculation, streak counter, quick links | 🟢 Complete |
| **MOB-03** | **Q&A Forum Feed** | `QuestionsFeedPage.jsx` | `(tabs)/questions/index` | Supabase `questions`, `answers` tables | Category & department filter, search filter, sort by recent/top votes | 🟢 Complete |
| **MOB-04** | **Ask Question & Duplicate Detection** | `AskQuestionPage.jsx` | `(tabs)/questions/ask` (Modal/Screen) | `dbService.createQuestion` | Title min 10 chars, Jaccard Token Overlap warning banner ($\ge 35\%$), anonymous posting toggle | 🟢 Complete |
| **MOB-05** | **Question Details & Answer Submission** | `QuestionDetailPage.jsx` | `(tabs)/questions/[id]` | `dbService.addAnswer`, upvoting RPC | Markdown answer input, accept answer by author, upvote toggle | 🟢 Complete |
| **MOB-06** | **Collaborative Research Projects** | `ProjectsPage.jsx` | `(tabs)/projects/index` | Supabase `projects` table | Filter by domain/status, Heuristic Skill Match calculation ($0-100\%$) | 🟢 Complete |
| **MOB-07** | **Project Details & Application Pitch** | `ProjectDetailPage.jsx` | `(tabs)/projects/[id]` | `dbService.createProjectApplication` | Role selection, pitch text validation, applicant duplication check | 🟢 Complete |
| **MOB-08** | **Scholar & Faculty Directory** | `PeoplePage.jsx` | `(tabs)/people/index` | Supabase `profiles` / `INITIAL_USERS` | Filter by role, institution, department, and skill tags | 🟢 Complete |
| **MOB-09** | **Scholar Profile View** | `PersonProfilePage.jsx` | `(tabs)/people/[id]` | `dbService.getProfileById` | Endorsement list, verified academic badge display, direct message trigger | 🟢 Complete |
| **MOB-10** | **User Profile & Learning Roadmaps** | `ProfilePage.jsx` | `(tabs)/profile` | `userStats.js`, `aiService.js`, Supabase | 4-Phase Skill Gap Learning Path generator, XP progress bar, badge grid | 🟢 Complete |
| **MOB-11** | **Reputation & Contribution Scorecard** | `ContributionPage.jsx` | `profile/contribution` | `userStats.js`, contribution points | Points history breakdown, rules explanation, verified certificate card | 🟢 Complete |
| **MOB-12** | **National & College Leaderboards** | `RecognitionPage.jsx` | `(tabs)/recognition` | `dbService.getProfiles` sorted by XP | Institutional rank vs National rank toggle, top 3 podium display | 🟢 Complete |
| **MOB-13** | **Faculty Mentorship & Office Hours** | `MentorshipPage.jsx` | `mentorship/index`, `mentorship/book` | `mentorship_slots`, `mentorship_bookings` | Slot booking confirmation modal, research topic selection | 🟢 Complete |
| **MOB-14** | **Research Communities** | `CommunitiesPage.jsx` | `communities/index`, `communities/[id]` | `INITIAL_COMMUNITIES` | Member count, topic pills, join toggle, recent community discussions | 🟢 Complete |
| **MOB-15** | **Direct Messaging** | `MessagesPage.jsx` | `messages/index`, `messages/[id]` | In-memory + persistent threads | Peer-to-peer chat interface, send/receive timestamps | 🟢 Complete |
| **MOB-16** | **Notifications System** | `NotificationsPage.jsx` | `notifications/index` | System state + notifications queue | Mark as read, filter by unread/all, navigate to source event | 🟢 Complete |
| **MOB-17** | **Settings & Academic Verification** | `SettingsHelpPages.jsx` | `settings/index`, `settings/help` | Local preferences + SecureStore | Dark mode toggle, push notifications switch, FAQ accordion | 🟢 Complete |
| **MOB-18** | **Collaborative Code Preview** | `CodeEditorModal.jsx` | `projects/code-preview` modal | Syntax highlighted code viewer | Read-only & editable code snippet inspection | 🟢 Complete |

---

## 2. Mobile Navigation Hierarchy

The application employs an ergonomic **Bottom Tab + Stack Navigator** hierarchy optimized for single-handed Android operation:

```
App Root Navigation Stack
├── (auth)/
│   ├── login              # Login with email/pass or quick demo accounts
│   ├── register           # Multi-step academic registration & verification
│   └── onboarding         # Role & initial skill selection
│
├── (tabs)/                # Main Authenticated Application Shell
│   ├── (home)             # Feed Dashboard, XP status, active alerts, quick actions
│   ├── (questions)        # Q&A questions feed, search, tags
│   │   ├── ask            # Ask new question (with Jaccard live duplicate check)
│   │   └── [id]           # Question details, answers thread, voting
│   ├── (projects)         # Research projects directory, skill compatibility badges
│   │   ├── [id]           # Project details, milestones, apply modal, code preview
│   │   └── create         # Post new project
│   ├── (people)           # Scholar & faculty directory, filter by institute
│   │   └── [id]           # Public scholar profile, endorsements, contact
│   └── (profile)          # Current user profile, XP level, 4-Phase Skill Gap Roadmap
│
└── Stack Modals & Sub-routes/
    ├── messages/          # Direct messaging threads
    │   └── [id]           # Live chat window
    ├── mentorship/        # Faculty mentorship slot browser & booking
    ├── recognition/       # National & institutional scholar rankings
    ├── contribution/      # Contribution points scorecard & breakdown
    ├── communities/       # Research consortia & discussions
    ├── notifications/     # Notifications center
    ├── settings/          # App settings, account preferences
    └── help/              # Help Center & FAQ
```

---

## 3. UI/UX Native Mobile Adaptations

1. **Top Bar & Safe Area:** Dynamic header displaying CampusLink branding, active user avatar, and unread notification indicator badge.
2. **Bottom Navigation Bar:** Haptic-feeling tab bar with clean Lucide icons: Home, Questions, Projects, Scholars, and Profile.
3. **Touch Targets & Gestures:** 48dp+ interactive touch targets, pull-to-refresh on all feeds, keyboard-avoiding views for all inputs.
4. **Card Designs:** Crisp, elevated cards with rounded corners (12-16dp), subtle borders matching `#eaedff`, and high-contrast typography.
5. **State Handling:**
   - **Loading:** Skeleton loaders and native `ActivityIndicator`.
   - **Empty States:** Friendly academic illustrations, clear messages, and action buttons.
   - **Error Handling:** Non-intrusive toast notifications and inline retry controls.
