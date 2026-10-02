import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";

import { HeroLandingPage } from "./pages/HeroLandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { QuestionsFeedPage } from "./pages/QuestionsFeedPage";
import { AskQuestionPage } from "./pages/AskQuestionPage";
import { QuestionDetailPage } from "./pages/QuestionDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { PeoplePage } from "./pages/PeoplePage";
import { PersonProfilePage } from "./pages/PersonProfilePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ContributionPage } from "./pages/ContributionPage";
import { RecognitionPage } from "./pages/RecognitionPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { MentorshipPage } from "./pages/MentorshipPage";
import { MessagesPage } from "./pages/MessagesPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage, HelpPage } from "./pages/SettingsHelpPages";

export function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Unauthenticated Routes */}
          <Route path="/" element={<HeroLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<RegisterPage />} />

          {/* Authenticated Application Shell Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/questions" element={<QuestionsFeedPage />} />
            <Route path="/questions/ask" element={<AskQuestionPage />} />
            <Route path="/questions/:id" element={<QuestionDetailPage />} />

            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />

            <Route path="/people" element={<PeoplePage />} />
            <Route path="/people/:id" element={<PersonProfilePage />} />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contribution" element={<ContributionPage />} />
            <Route path="/recognition" element={<RecognitionPage />} />

            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:id" element={<CommunitiesPage />} />

            <Route path="/mentorship" element={<MentorshipPage />} />

            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:id" element={<MessagesPage />} />

            <Route path="/notifications" element={<NotificationsPage />} />

            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
