# 📱 CampusLink — Academic Network Mobile Application

[![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK_57-000000?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![OTA Updates](https://img.shields.io/badge/OTA_Updates-Enabled-006c4a.svg)](https://docs.expo.dev/eas-update/introduction/)

Welcome to the **CampusLink Academic Network Mobile Application** — a cross-platform React Native / Expo application for inter-institutional academic collaboration, research matching, peer Q&A, faculty mentorship, and gamified scholar progression.

---

## 📥 Direct APK Download & Installation

You can download and install the standalone Android APK directly on your device without using the Google Play Store:

| Release Type | Download Link | File Size | Version |
| :--- | :--- | :--- | :--- |
| **🚀 Latest Release APK** | [**Download CampusLink.apk**](https://github.com/Adityaagrahari525/collobration-platform/releases/latest/download/CampusLink.apk) | ~32 MB | `v1.0.0` |
| **📦 EAS Preview Build** | [**Download via EAS Build Artifacts**](https://expo.dev/accounts/campuslink/projects/campuslink-academic/builds) | ~32 MB | `v1.0.0` |

### How to Install on Android:
1. Tap the download link above on your Android phone.
2. Open the downloaded `CampusLink.apk` file.
3. If prompted, toggle **"Allow installation from unknown sources"** in your device settings.
4. Tap **Install** and open CampusLink!

---

## 🔄 Over-The-Air (OTA) Updates (No Re-Installation Needed!)

CampusLink is equipped with **Expo EAS Over-The-Air (OTA) Updates**. This means:

* ⚡ **Instant In-App Updates:** Whenever a new feature, bug fix, or UI enhancement is published, your installed app will **automatically update in the background** when launched!
* 📱 **No Re-Installation Required:** You do **NOT** need to download or install a new `.apk` file every time the project is updated.
* 🛡️ **Zero Downtime:** Updates load seamlessly on launch via Expo's `checkAutomatically: "ON_LOAD"` mechanism.

### How to Push an In-App OTA Update (For Developers):
```bash
# Push an OTA update directly to all user devices instantly
npm run update:ota
```

---

## 📌 Versioning Strategy

CampusLink follows **Semantic Versioning (`MAJOR.MINOR.PATCH`)**:

1. **`version` in `app.json` & `package.json`**: Represents user-facing version (e.g., `1.0.0`, `1.0.1`).
2. **`android.versionCode`**: An incrementing integer (`1`, `2`, `3`...) updated whenever native dependencies change.

### Bump Version Command:
```bash
# Increments patch version (e.g., 1.0.0 -> 1.0.1)
npm run version:bump
```

---

## ✨ Features & Architecture

* 🧠 **Skill-Matching Engine:** Computes weighted compatibility scores (0–100%) between scholars and inter-institutional research projects.
* 🔎 **Jaccard Duplicate Inquiry Detection:** Real-time semantic duplicate check to prevent repetitive questions in academic forums.
* 🎯 **AI Skill Gap & Career Roadmap:** 4-phase milestone generator for target research roles.
* 🏆 **Gamification & XP Tiering:** 6-tier level progression (Undergraduate → Research Fellow), streaks, and badges.
* 📅 **Faculty Mentorship & Office Hours:** Real-time booking slots for 1-on-1 academic advisory sessions.
* 💬 **Consortia Hubs & DMs:** Direct messaging between scholars and inter-institutional research groups.

---

## 🛠️ Local Setup & Development

### 1. Prerequisites
* Node.js v18 or later
* npm or yarn
* Expo Go app on iOS / Android (for physical device testing)

### 2. Installation
```bash
# Navigate to mobile-app directory
cd mobile-app

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
# Start Expo Metro Bundler
npm start

# Run in Web Browser
npm run web

# Run on Android Emulator
npm run android
```

### 4. Run Automated Test Suite
```bash
# Runs 46 automated unit and E2E integration tests
npm test
```

---

## 📦 Building a New Standalone APK

If you make native configuration changes or want to generate a new `.apk` file:

```bash
# Build standalone Android APK using EAS
npm run build:apk
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
