# CampusLink — Academic Network Mobile Application (Android)

> **Official Android Mobile Application for the CampusLink Academic Network (PS004)**  
> Developed using React Native, Expo SDK, TypeScript, and Native Bottom Tab Navigation.

---

## 1. Project Overview

CampusLink is an academic collaboration and peer-learning network designed for university students, faculty researchers, and institutional labs. It bridges inter-institutional research gaps across leading institutions (IIT Delhi, IISc Bangalore, IIT Bombay, IIIT Hyderabad, BITS Pilani, NIT Trichy).

This mobile application provides a purpose-built, responsive Android experience with:
- **Heuristic Skill-Matching Engine:** Calculates candidate-to-project compatibility scores (0–100%).
- **Rule-Based AI Skill Gap & Learning Roadmap:** 4-phase structured milestone roadmap for 7 target career tracks.
- **Jaccard Duplicate Detection:** Real-time duplicate question detection and warning banners.
- **Academic Reputation & Scorecard:** Level milestones, badges, daily streaks, and digital certificates.
- **Faculty Mentorship:** 1-on-1 office hours booking and research advisory scheduling.
- **Collaborative Research Labs:** Inter-campus project workspaces, milestones, telemetry metrics, and Monaco code inspection.

---

## 2. Directory Architecture

```
mobile-app/
├── App.tsx                          # Root App Shell (Providers & Navigation)
├── app.json                         # Expo application configuration & Android permissions
├── eas.json                         # EAS Build configuration (APK & AAB profiles)
├── package.json                     # Dependencies, scripts (start, test, typecheck)
├── tsconfig.json                    # Strict TypeScript compiler options
├── .env.example                     # Environment configuration reference
├── assets/                          # App icons, splash screens, and adaptive assets
├── docs/                            # Architectural & test documentation
│   ├── PROJECT_AUDIT.md             # Codebase audit & architecture summary
│   ├── MOBILE_FEATURE_MAPPING.md    # Feature mapping matrix & navigation plan
│   └── TESTING_REPORT.md            # Automated testing execution report
├── tests/                           # Automated test suites & test runner
│   └── algorithms.test.ts           # 23 automated tests for algorithms & stats
└── src/
    ├── components/                  # Reusable UI components
    │   ├── common/                  # Header, Button, Input, Badge, Card, SkillTag, SearchBar, SkeletonLoader
    │   ├── gamification/            # XPProgressBar, StreakBadge, BadgeGrid, LearningPathWidget
    │   ├── questions/               # QuestionCard, AnswerItem, DuplicateWarningBanner
    │   ├── projects/                # ProjectCard, ApplyModal, CodePreviewModal
    │   ├── people/                  # ScholarCard
    │   ├── mentorship/              # MentorSlotCard, BookSlotModal
    │   └── communities/             # CommunityCard
    ├── context/                     # Global state providers
    │   ├── AuthContext.tsx          # User session, login, register, demo user switcher
    │   └── AppContext.tsx           # Questions, projects, mentorship, notifications
    ├── navigation/                  # Navigation hierarchy
    │   ├── RootNavigator.tsx        # Native stack navigator & modal routing
    │   └── BottomTabNavigator.tsx   # Native bottom tab bar (Home, Q&A, Projects, Scholars, Profile)
    ├── screens/                     # Application screens
    │   ├── auth/                    # LoginScreen, RegisterScreen
    │   ├── tabs/                    # HomeScreen, QuestionsScreen, ProjectsScreen, PeopleScreen, ProfileScreen
    │   └── details/                 # QuestionDetail, AskQuestion, ProjectDetail, CreateProject,
    │                                # PersonDetail, Mentorship, Communities, Contribution,
    │                                # Recognition, Messages, Chat, Notifications, Settings, Help
    ├── services/                    # Database & network integration
    │   ├── supabaseClient.ts        # Supabase PostgreSQL client with AsyncStorage persistence
    │   ├── dbService.ts             # Centralized CRUD methods with offline fallback
    │   ├── mockData.ts              # Seed academic dataset matching web platform
    │   └── storage.ts               # AsyncStorage local persistence helper
    ├── theme/                       # Design System tokens
    │   ├── colors.ts                # Deep Academic Blue (#00236f), Forest Green (#006c4a), Surfaces
    │   ├── typography.ts            # Standardized typography scale
    │   ├── spacing.ts               # Spacing, border radius, and elevation tokens
    │   └── theme.ts                 # Unified theme export
    ├── types/                       # Core TypeScript interfaces & data models
    └── utils/                       # Algorithmic engines
        ├── matchingAlgorithm.ts     # Heuristic Skill-Matching Engine
        ├── aiService.ts             # Rule-Based Skill Gap & Learning Roadmap Engine
        ├── duplicateDetector.ts     # Jaccard Token Similarity Engine
        └── userStats.ts             # Reputation, XP progression & streak calculator
```

---

## 3. Prerequisites & Development Setup

1. **Node.js:** v18.0 or newer (v24.x recommended)
2. **npm / yarn:** npm 10+
3. **Expo Go (on physical phone):** Download from Google Play Store
4. **Android Studio (optional for local emulator/builds):** Android SDK Platform 34+, Android SDK Build-Tools, ADB

---

## 4. Quick Start: Running the App

### Step 1: Install Dependencies

```bash
cd mobile-app
npm install
```

### Step 2: Start Expo Development Server

```bash
npm start
```

### Step 3: Run on Android Emulator or Physical Device

- **Physical Device (Expo Go):** Open the Expo Go app on your Android phone and scan the QR code displayed in the terminal.
- **Android Emulator:** Press `a` in the terminal while your Android emulator is running.
- **Web Preview:** Press `w` in the terminal to inspect in browser.

---

## 5. Running Automated Checks & Tests

Execute the automated test suites to verify algorithms, duplicate detection, and TypeScript strict compliance:

```bash
# Run TypeScript compilation check
npm run typecheck

# Run full algorithmic test suite (23 passing tests)
npm test
```

---

## 6. Android APK & Production Build Guide

### Option A: Cloud APK Build using EAS Build (Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Login to your Expo account:
   ```bash
   eas login
   ```
3. Generate an installable Android APK:
   ```bash
   eas build -p android --profile preview
   ```
   *EAS Build will generate a direct download link for the `.apk` file that can be installed on any Android phone.*

4. Generate a Google Play production App Bundle (`.aab`):
   ```bash
   eas build -p android --profile production
   ```

### Option B: Local Android Native Build (with Android Studio & Java)

1. Prebuild native Android project:
   ```bash
   npx expo prebuild --platform android
   ```
2. Build debug/release APK locally using Gradle:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   *The generated APK will be available at:*  
   `android/app/build/outputs/apk/release/app-release.apk`

---

## 7. Installing the APK on a Physical Android Phone

1. Download or copy the generated `.apk` file to your Android phone (via USB or Google Drive).
2. Open the `.apk` file in your phone's File Manager.
3. Enable "Install from unknown sources" if prompted by Android Security.
4. Tap **Install** and launch **CampusLink**.

---

## 8. Backend Configuration

The application is pre-configured to connect to the live Supabase PostgreSQL backend:
- **Supabase URL:** `https://vqhriwufmkxwyrilsqeq.supabase.co`
- **Authentication:** Supported with automatic token persistence via `@react-native-async-storage/async-storage`.
- **Offline / Resilient Mode:** If network connectivity drops or the database is unreachable, `dbService.ts` automatically serves cached data and in-memory updates seamlessly without app crashes.

---

## 9. Academic Demo Accounts (Instant Testing)

For quick evaluation, click the demo buttons on the Login screen:
1. **Aditya Sharma (Student Lead, IIT Delhi):** `aditya.sharma@iitd.ac.in` (Password: `academicPass123`)
2. **Dr. Rajesh K. Varma (Faculty Mentor, IIT Delhi):** `rajesh.varma@iitd.ac.in` (Password: `academicPass123`)
3. **Priya Sundaram (Ph.D. Scholar, IISc Bangalore):** `priya.sundaram@iisc.ac.in` (Password: `academicPass123`)
