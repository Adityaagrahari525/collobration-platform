import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_USERS } from "../data/mockData";
import { apiService } from "../services/apiService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Session & Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("campuslink_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem("campuslink_auth");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(() => {
    const saved = localStorage.getItem("campuslink_onboarding");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [authLoading, setAuthLoading] = useState(true);

  // Live Database Datasets
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Synchronize authenticated user state with backend /api/users/me on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await apiService.getCurrentUser();
      if (res.success && res.data) {
        const backendUser = res.data;
        const mappedUser = {
          id: backendUser.id,
          firstName: backendUser.firstName,
          lastName: backendUser.lastName,
          name: backendUser.name || `${backendUser.firstName} ${backendUser.lastName}`,
          email: backendUser.email,
          institution: backendUser.institution?.name || "IIT Delhi",
          institutionDetail: backendUser.institution,
          department: backendUser.profile?.department || "Computer Science & Engineering",
          degree: backendUser.profile?.academicYear || "Scholar",
          role: backendUser.role?.toLowerCase() || "student",
          rawRole: backendUser.role,
          verified: backendUser.isEmailVerified ?? true,
          verificationCode: "#IN-9042-DL",
          avatar: backendUser.profile?.avatarUrl || INITIAL_USERS[0].avatar,
          bio: backendUser.profile?.bio || "",
          headline: backendUser.profile?.headline || "",
          availability: backendUser.profile?.availability || "",
          city: backendUser.profile?.city || "",
          state: backendUser.profile?.state || "",
          preferredCollaborationMode: backendUser.profile?.preferredCollaborationMode || "HYBRID",
          profileCompletion: backendUser.profile?.profileCompletion || 100,
          isProfileComplete: backendUser.profile?.isProfileComplete ?? true,
          contributionScore: 1200,
          answersCount: 5,
          acceptedAnswersCount: 2,
          projectsCount: 1,
          skills: backendUser.skills?.map((s) => s.name) || [],
          skillsDetail: backendUser.skills || [],
          endorsements: [],
          contributions: [],
        };

        setCurrentUser(mappedUser);
        setIsAuthenticated(true);
        localStorage.setItem("campuslink_user", JSON.stringify(mappedUser));
        localStorage.setItem("campuslink_auth", JSON.stringify(true));
      }
    } catch (err) {
      // Unauthenticated
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem("campuslink_user");
      localStorage.removeItem("campuslink_auth");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Fetch canonical datasets from Express API & PostgreSQL
  const refreshDatabaseContent = useCallback(async () => {
    try {
      const [qRes, pRes, uRes, cRes] = await Promise.all([
        apiService.getQuestions().catch(() => null),
        apiService.getProjects().catch(() => null),
        apiService.getPeople().catch(() => null),
        apiService.getCommunities().catch(() => null),
      ]);

      if (qRes?.success && qRes.data) {
        setQuestions(qRes.data);
      }
      if (pRes?.success && pRes.data) {
        setProjects(pRes.data);
      }
      if (uRes?.success && uRes.data) {
        setUsers(Array.isArray(uRes.data) ? uRes.data : (uRes.data.items || []));
      }
      if (cRes?.success && cRes.data) {
        setCommunities(cRes.data);
      }

      if (isAuthenticated) {
        const notifRes = await apiService.getNotifications().catch(() => null);
        if (notifRes?.success && notifRes.data?.notifications) {
          setNotifications(notifRes.data.notifications);
        }
      }
    } catch (e) {
      console.warn("[AppContext] refreshDatabaseContent error:", e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshDatabaseContent();
  }, [refreshDatabaseContent]);

  // Authentication Handlers
  const login = async (email, password) => {
    const res = await apiService.login(email, password);
    if (res && res.success && res.data) {
      if (res.data.user) {
        const u = res.data.user;
        const mapped = {
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          name: u.name || `${u.firstName} ${u.lastName}`,
          email: u.email,
          institution: u.institution?.name || "IIT Delhi",
          institutionDetail: u.institution,
          department: u.profile?.department || "Computer Science & Engineering",
          degree: u.profile?.academicYear || "Scholar",
          role: u.role?.toLowerCase() || "student",
          rawRole: u.role,
          verified: u.isEmailVerified ?? true,
          verificationCode: "#IN-9042-DL",
          avatar: u.profile?.avatarUrl || INITIAL_USERS[0].avatar,
          bio: u.profile?.bio || "",
          headline: u.profile?.headline || "",
          skills: [],
          skillsDetail: [],
        };
        setCurrentUser(mapped);
        setIsAuthenticated(true);
        localStorage.setItem("campuslink_user", JSON.stringify(mapped));
        localStorage.setItem("campuslink_auth", JSON.stringify(true));
      }
      await checkAuthStatus().catch(() => {});
      await refreshDatabaseContent().catch(() => {});
      return res.data;
    }
    throw new Error(res?.message || "Invalid credentials.");
  };

  const register = async (registerInput = {}) => {
    const res = await apiService.register(registerInput);
    if (res && res.success && res.data) {
      await checkAuthStatus().catch(() => {});
      await refreshDatabaseContent().catch(() => {});
      return res.data;
    }
    throw new Error(res?.message || "Registration failed.");
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem("campuslink_user");
      localStorage.removeItem("campuslink_auth");
      localStorage.removeItem("campuslink_token");
    }
  };

  const deleteUserAccount = async (userId) => {
    if (userId === currentUser?.id) {
      await apiService.deleteMyAccount();
      await logout();
    } else {
      await apiService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
    refreshDatabaseContent();
  };

  const updateProfile = async (profileData) => {
    const res = await apiService.updateMyProfile(profileData);
    if (res.success && res.data) {
      await checkAuthStatus();
      return res;
    }
  };

  const addSkillToProfile = async (skillId, proficiency = "INTERMEDIATE") => {
    const res = await apiService.addMySkill(skillId, proficiency);
    if (res.success) {
      await checkAuthStatus();
    }
    return res;
  };

  const removeSkillFromProfile = async (skillId) => {
    const res = await apiService.removeMySkill(skillId);
    if (res.success) {
      await checkAuthStatus();
    }
    return res;
  };

  const completeOnboarding = async (profileData) => {
    if (profileData && Object.keys(profileData).length > 0) {
      await apiService.updateMyProfile(profileData);
    }
    setIsOnboardingCompleted(true);
    localStorage.setItem("campuslink_onboarding", JSON.stringify(true));
    await checkAuthStatus();
  };

  // Notification Methods
  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      read: false,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = async (id) => {
    try {
      await apiService.markNotificationRead(id);
    } catch (e) {
      // Local optimistic update
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, isRead: true } : n))
    );
  };

  // Questions & Answers Methods (Database-backed)
  const createQuestion = async (questionData) => {
    const res = await apiService.createQuestion({
      title: questionData.title,
      description: questionData.description || questionData.content || "",
      department: questionData.department || currentUser?.department,
      subject: questionData.subject || "General Academic",
      academicYear: questionData.year || "2026",
      isAnonymous: questionData.isAnonymous || false,
      tags: questionData.tags || ["Academic"],
    });

    if (res && res.success && res.data) {
      setQuestions((prev) => [res.data, ...prev]);
      addNotification({
        title: "Question Published",
        message: `Your question '${res.data.title.slice(0, 40)}...' was posted to the network feed.`,
        type: "question",
        link: `/questions/${res.data.id}`,
      });
      return res.data.id;
    }
  };

  const deleteQuestion = async (questionId) => {
    await apiService.deleteQuestion(questionId);
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const voteQuestion = async (questionId) => {
    const res = await apiService.voteQuestion(questionId);
    if (res && res.success && res.data) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, votes: res.data.votes, userVoted: res.data.userVoted }
            : q
        )
      );
    }
  };

  const toggleSaveQuestion = async (questionId) => {
    const res = await apiService.bookmarkQuestion(questionId);
    if (res && res.success && res.data) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, saved: res.data.saved } : q))
      );
    }
  };

  const submitAnswer = async (questionId, content) => {
    const res = await apiService.submitAnswer(questionId, content);
    if (res && res.success && res.data) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? res.data : q))
      );
      addNotification({
        title: "Answer Submitted",
        message: "Your answer was recorded in the database.",
        type: "answer",
        link: `/questions/${questionId}`,
      });
    }
  };

  const deleteAnswer = async (questionId, answerId) => {
    await apiService.deleteAnswer(answerId);
    refreshDatabaseContent();
  };

  const acceptAnswer = async (questionId, answerId) => {
    const res = await apiService.acceptAnswer(answerId);
    if (res && res.success && res.data) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? res.data : q))
      );
    }
  };

  // Projects Methods (Database-backed)
  const createProject = async (projectData) => {
    const res = await apiService.createProject({
      title: projectData.title,
      description: projectData.description,
      domain: projectData.category || projectData.domain || "Research & Engineering",
      sprintPhase: projectData.sprintPhase || "Phase 1: Architecture",
      status: projectData.status || "Recruiting",
      recruitingRoles: projectData.openRoles || [],
      requiredSkills: projectData.requiredSkills || [],
    });

    if (res && res.success && res.data) {
      setProjects((prev) => [res.data, ...prev]);
      addNotification({
        title: "Project Workspace Created",
        message: `Research workspace '${res.data.title}' was created in the network database.`,
        type: "project",
        link: `/projects/${res.data.id}`,
      });
      return res.data.id;
    }
  };

  const deleteProject = async (projectId) => {
    await apiService.deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const applyToProject = async (projectId, applicationData) => {
    const res = await apiService.applyToProject(projectId, applicationData);
    if (res && res.success) {
      refreshDatabaseContent();
      addNotification({
        title: "Application Submitted! 🚀",
        message: "Your application was recorded in PostgreSQL and delivered to the project lead.",
        type: "project",
        link: `/projects/${projectId}`,
      });
      return res.data;
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    const res = await apiService.updateApplicationStatus(applicationId, status);
    if (res && res.success) {
      refreshDatabaseContent();
      return res.data;
    }
  };

  // Faculty Mentorship
  const bookMentorshipSlot = async (slotId, purpose) => {
    const res = await apiService.bookMentorshipSlot(slotId, purpose);
    if (res && res.success) {
      refreshDatabaseContent();
      addNotification({
        title: "Office Hour Reserved! 🗓️",
        message: "Your mentorship session has been booked with faculty in the database.",
        type: "mentorship",
        link: "/mentorship",
      });
      return res.data;
    }
  };

  // Messaging
  const sendMessage = async (conversationId, text, receiverId) => {
    const res = await apiService.sendMessage({ conversationId, text, receiverId });
    if (res && res.success) {
      return res.data;
    }
  };

  // Communities
  const joinCommunity = async (communityId) => {
    const res = await apiService.joinCommunity(communityId);
    if (res && res.success) {
      refreshDatabaseContent();
      return res.data;
    }
  };

  const leaveCommunity = async (communityId) => {
    const res = await apiService.leaveCommunity(communityId);
    if (res && res.success) {
      refreshDatabaseContent();
      return res.data;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        isOnboardingCompleted,
        authLoading,
        login,
        register,
        logout,
        deleteUserAccount,
        completeOnboarding,
        updateProfile,
        addSkillToProfile,
        removeSkillFromProfile,
        users,
        questions,
        projects,
        communities,
        notifications,
        messages,
        searchQuery,
        setSearchQuery,
        addNotification,
        markNotificationRead,
        createQuestion,
        deleteQuestion,
        voteQuestion,
        toggleSaveQuestion,
        submitAnswer,
        deleteAnswer,
        acceptAnswer,
        createProject,
        deleteProject,
        applyToProject,
        updateApplicationStatus,
        bookMentorshipSlot,
        sendMessage,
        joinCommunity,
        leaveCommunity,
        refreshDatabaseContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
