# 📱 CampusLink — Standalone Mobile Application (React Native / Expo)

[![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK_57-000000?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Test Status](https://img.shields.io/badge/Tests-46_Passed-brightgreen.svg)]()
[![OTA Updates](https://img.shields.io/badge/OTA_Updates-Active-006c4a.svg)](https://docs.expo.dev/eas-update/introduction/)

This document provides a dedicated guide for the **CampusLink Standalone Mobile Application** built alongside the existing web platform using React Native, Expo SDK 57, and TypeScript.

---

## 📲 Direct APK Download & Installation

You can download and install the standalone Android APK directly on your device without using the Google Play Store:

| Download Option | Direct Link | File Size | Version |
| :--- | :--- | :--- | :--- |
| **🚀 Latest Release APK** | [**Download CampusLink.apk**](https://github.com/Adityaagrahari525/collobration-platform/releases/latest/download/CampusLink.apk) | ~32 MB | `v1.0.0` |
| **📦 EAS Preview Build Artifact** | [**Download via EAS Build**](https://expo.dev/accounts/campuslink/projects/campuslink-academic/builds) | ~32 MB | `v1.0.0` |

### 🛠️ Quick Installation Instructions (Android)
1. Download the `CampusLink.apk` using the link above.
2. Open the file on your Android mobile device.
3. Enable **"Install from unknown sources"** if prompted by Android security.
4. Tap **Install** and open the app!

---

## ⚡ Over-The-Air (OTA) Updates — No Re-Installation Required!

The CampusLink Mobile App features **Expo EAS Over-The-Air (OTA) Updates**. 

### Key Benefits:
* **Instant Delivery:** When code or design updates are made to the mobile app, users get the update automatically when opening the app.
* **No Re-installation Needed:** The user keeps the same installed application on their device — **zero re-installation required**.
* **Automatic Fetching:** `checkAutomatically: "ON_LOAD"` handles downloading updates in the background.

### Developer OTA Release Command:
```bash
# Push an instant OTA update to all installed mobile devices
cd mobile-app
npm run update:ota
```

---

## 📌 Versioning Strategy

CampusLink uses **Semantic Versioning (`MAJOR.MINOR.PATCH`)**:

| Version Field | Location | Usage |
| :--- | :--- | :--- |
| **`version`** | `app.json` & `package.json` | User-facing release version (e.g., `1.0.0`, `1.0.1`) |
| **`versionCode`** | `app.json` | Incrementing integer for Android native builds (`1`, `2`, `3`) |

### Command to Bump Version:
```bash
cd mobile-app
npm run version:bump
```

---

## 📂 Mobile Application Structure

```
mobile-app/
├── assets/                  # App icons, splash screens & graphics
├── src/
│   ├── components/          # 20+ Reusable UI components
│   │   ├── common/          # Headers, Buttons, Inputs, Cards, Badges, SkillTags
│   │   ├── gamification/    # XP progress bar, Streak badges, BadgeGrid, Roadmap
│   │   ├── mentorship/      # Slot cards, booking modal
│   │   ├── projects/        # Project cards, Apply modal, Monaco code viewer
│   │   └── questions/       # Question cards, Answer items, Duplicate warning
│   ├── context/             # AuthContext & AppContext
│   ├── navigation/          # Native Stack & 5-Tab Bottom Navigator
│   ├── screens/             # 20+ Mobile Screens (Home, Questions, Projects, Profile, etc.)
│   ├── services/            # Supabase API, Storage wrapper, Mock seed data
│   ├── theme/               # M3 Surface system, colors, spacing, typography
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Heuristic algorithms (Skill-matching, Duplicate check, AI roadmap)
├── tests/                   # 46 Automated Unit & E2E Integration tests
├── app.json                 # Expo SDK & OTA config
└── package.json             # Mobile npm dependencies
```

---

## 🧪 Testing & Verification Summary

The mobile app includes **46 automated unit and E2E integration test cases** (100% passing):

```bash
cd mobile-app
npm test
```

### Test Coverage:
* ✅ Heuristic Skill-Matching Algorithm (0–100% weighted scoring)
* ✅ Jaccard Duplicate Question Detection
* ✅ AI Skill Gap & 4-Phase Learning Pathway Generator
* ✅ Gamification, Streaks & XP Level Progression
* ✅ Complete E2E User Journey (Auth, Q&A, Projects, Mentorship, Consortia DMs)

---

## 🚀 Running Locally

```bash
# 1. Enter mobile directory
cd mobile-app

# 2. Install dependencies
npm install

# 3. Start Expo dev server
npm start

# 4. Open in Web browser
npm run web
```
