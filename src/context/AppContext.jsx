import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_USERS,
  INITIAL_QUESTIONS,
  INITIAL_PROJECTS,
  INITIAL_COMMUNITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES,
} from "../data/mockData";
import { CONTRIBUTION_VALUES } from "../services/contributionService";
import { apiService } from "../services/apiService";
import { dbService } from "../services/dbService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load session state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("campuslink_user");
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem("campuslink_auth");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(() => {
    const saved = localStorage.getItem("campuslink_onboarding");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [authLoading, setAuthLoading] = useState(true);

  // Synchronize authenticated user state with backend /api/users/me on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuthStatus() {
      try {
        const res = await apiService.getCurrentUser();
        if (res.success && res.data && isMounted) {
          const backendUser = res.data;
          const mergedUser = {
            id: backendUser.id,
            firstName: backendUser.firstName,
            lastName: backendUser.lastName,
            name: backendUser.name || `${backendUser.firstName} ${backendUser.lastName}`,
            email: backendUser.email,
            institution: backendUser.institution?.name || "IIT Delhi",
            institutionDetail: backendUser.institution,
            department: backendUser.profile?.department || "Computer Science & Engineering",
            degree: backendUser.profile?.academicYear || "B.Tech CSE '25",
            role: backendUser.role?.toLowerCase() || "student",
            rawRole: backendUser.role,
            verified: backendUser.isEmailVerified ?? true,
            verificationCode: "#IN-9042-DL",
            avatar: backendUser.profile?.avatarUrl || INITIAL_USERS[0].avatar,
            bio: backendUser.profile?.bio || INITIAL_USERS[0].bio,
            headline: backendUser.profile?.headline || "",
            availability: backendUser.profile?.availability || "",
            city: backendUser.profile?.city || "",
            state: backendUser.profile?.state || "",
            preferredCollaborationMode: backendUser.profile?.preferredCollaborationMode || "HYBRID",
            profileCompletion: backendUser.profile?.profileCompletion || 100,
            isProfileComplete: backendUser.profile?.isProfileComplete ?? true,
            contributionScore: INITIAL_USERS[0].contributionScore,
            answersCount: INITIAL_USERS[0].answersCount,
            acceptedAnswersCount: INITIAL_USERS[0].acceptedAnswersCount,
            projectsCount: INITIAL_USERS[0].projectsCount,
            skills: backendUser.skills?.map((s) => s.name) || INITIAL_USERS[0].skills,
            skillsDetail: backendUser.skills || [],
            endorsements: INITIAL_USERS[0].endorsements,
            contributions: INITIAL_USERS[0].contributions,
          };

          setCurrentUser(mergedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Unauthenticated or backend offline - fallback to saved session state
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    checkAuthStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  // Datasets state
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("campuslink_users_data");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem("campuslink_questions_data");
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("campuslink_projects_data");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [communities] = useState(INITIAL_COMMUNITIES);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("campuslink_notifications_data");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("campuslink_messages_data");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [connections, setConnections] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch initial questions, projects, and users from backend API
  const refreshDatabaseContent = async () => {
    try {
      const [qRes, pRes, uRes] = await Promise.all([
        apiService.getQuestions().catch(() => null),
        apiService.getProjects().catch(() => null),
        apiService.getPeople().catch(() => null),
      ]);

      if (qRes && qRes.success && qRes.data && qRes.data.length > 0) {
        setQuestions(qRes.data);
      }
      if (pRes && pRes.success && pRes.data && pRes.data.length > 0) {
        setProjects(pRes.data);
      }
      if (uRes && uRes.success && uRes.data && uRes.data.length > 0) {
        setUsers(uRes.data);
      }
    } catch (e) {
      console.warn("[AppContext] Initial database fetch fallback.", e);
    }
  };

  useEffect(() => {
    refreshDatabaseContent();
  }, [isAuthenticated]);

  // Persist local storage fallbacks
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("campuslink_user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("campuslink_auth", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("campuslink_onboarding", JSON.stringify(isOnboardingCompleted));
  }, [isOnboardingCompleted]);

  useEffect(() => {
    localStorage.setItem("campuslink_questions_data", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("campuslink_projects_data", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("campuslink_notifications_data", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("campuslink_messages_data", JSON.stringify(messages));
  }, [messages]);

  // Contribution Helper
  const addContributionEvent = (userId, type, description) => {
    const points = CONTRIBUTION_VALUES[type] || 0;
    const newEvent = {
      id: `cnt-${Date.now()}`,
      type,
      description,
      points,
      date: "Just now",
    };

    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        contributionScore: (prev.contributionScore || 0) + points,
        contributions: [newEvent, ...(prev.contributions || [])],
      };
    });
  };

  // Real Backend Auth Integration with Graceful Fallback
  const login = async (email, password) => {
    try {
      const res = await apiService.login(email, password);
      if (res && res.success && res.data) {
        const backendUser = res.data.user;
        const mergedUser = {
          id: backendUser.id,
          name: backendUser.name || `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || "Scholar User",
          email: backendUser.email || email,
          institution: backendUser.institution?.name || "IIT Delhi",
          department: backendUser.profile?.department || "Computer Science & Engineering",
          degree: backendUser.profile?.academicYear || "B.Tech CSE '25",
          role: String(backendUser.role || "student").toLowerCase(),
          verified: backendUser.isEmailVerified ?? true,
          verificationCode: "#IN-9042-DL",
          avatar: backendUser.profile?.avatarUrl || INITIAL_USERS[0].avatar,
          bio: backendUser.profile?.bio || INITIAL_USERS[0].bio,
          contributionScore: INITIAL_USERS[0].contributionScore,
          answersCount: INITIAL_USERS[0].answersCount,
          acceptedAnswersCount: INITIAL_USERS[0].acceptedAnswersCount,
          projectsCount: INITIAL_USERS[0].projectsCount,
          skills: INITIAL_USERS[0].skills,
          endorsements: INITIAL_USERS[0].endorsements,
          contributions: INITIAL_USERS[0].contributions,
        };

        setCurrentUser(mergedUser);
        setIsAuthenticated(true);
        setIsOnboardingCompleted(true);
        localStorage.setItem("campuslink_user", JSON.stringify(mergedUser));
        localStorage.setItem("campuslink_auth", JSON.stringify(true));
        localStorage.setItem("campuslink_onboarding", JSON.stringify(true));
        refreshDatabaseContent();
        return res.data;
      }
    } catch (err) {
      console.warn("[AppContext] REST API login failed. Falling back to dbService.", err);
    }

    const dbRes = await dbService.login(email, password);
    if (dbRes && dbRes.user) {
      const safeUser = {
        ...dbRes.user,
        role: String(dbRes.user.role || "student").toLowerCase()
      };
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      setIsOnboardingCompleted(true);
      localStorage.setItem("campuslink_user", JSON.stringify(safeUser));
      localStorage.setItem("campuslink_auth", JSON.stringify(true));
      localStorage.setItem("campuslink_onboarding", JSON.stringify(true));
      return dbRes;
    }
  };

  const register = async (registerInput = {}) => {
    try {
      const res = await apiService.register(registerInput);
      if (res && res.success && res.data) {
        const backendUser = res.data.user;
        const mergedUser = {
          id: backendUser.id,
          name: backendUser.name || `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || "Scholar User",
          email: backendUser.email || registerInput.email,
          institution: backendUser.institution?.name || "IIT Delhi",
          department: backendUser.profile?.department || "Computer Science & Engineering",
          degree: backendUser.profile?.academicYear || "B.Tech CSE '25",
          role: String(backendUser.role || "student").toLowerCase(),
          verified: backendUser.isEmailVerified ?? true,
          verificationCode: "#IN-9042-DL",
          avatar: INITIAL_USERS[0].avatar,
          bio: `${backendUser.role || 'Scholar'} researcher at ${backendUser.institution?.name || 'Academic Institution'}`,
          contributionScore: 100,
          answersCount: 0,
          acceptedAnswersCount: 0,
          projectsCount: 0,
          skills: registerInput.skills || ["Distributed Systems"],
          endorsements: [],
          contributions: [],
        };

        setCurrentUser(mergedUser);
        setIsAuthenticated(true);
        setIsOnboardingCompleted(true);
        localStorage.setItem("campuslink_user", JSON.stringify(mergedUser));
        localStorage.setItem("campuslink_auth", JSON.stringify(true));
        localStorage.setItem("campuslink_onboarding", JSON.stringify(true));
        refreshDatabaseContent();
        return res.data;
      }
    } catch (err) {
      console.warn("[AppContext] REST API register failed. Falling back to dbService.", err);
    }

    const dbRes = await dbService.register(registerInput);
    if (dbRes && dbRes.user) {
      const safeUser = {
        ...dbRes.user,
        role: String(dbRes.user.role || "student").toLowerCase()
      };
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      setIsOnboardingCompleted(true);
      localStorage.setItem("campuslink_user", JSON.stringify(safeUser));
      localStorage.setItem("campuslink_auth", JSON.stringify(true));
      localStorage.setItem("campuslink_onboarding", JSON.stringify(true));
      return dbRes;
    }
  };

  const logout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("campuslink_user");
    localStorage.removeItem("campuslink_auth");
  };

  const deleteUserAccount = async (userId) => {
    try {
      if (userId === currentUser?.id) {
        await apiService.deleteMyAccount();
        await logout();
      } else {
        await apiService.deleteUser(userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
      refreshDatabaseContent();
    } catch (err) {
      console.error("[AppContext] User deletion failed:", err);
      // Fallback state removal
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await apiService.updateMyProfile(profileData);
      if (res.success && res.data) {
        const backendUser = res.data;
        setCurrentUser((prev) => ({
          ...prev,
          firstName: backendUser.firstName,
          lastName: backendUser.lastName,
          name: backendUser.name,
          department: backendUser.profile.department,
          degree: backendUser.profile.academicYear,
          bio: backendUser.profile.bio,
          avatar: backendUser.profile.avatarUrl || prev?.avatar,
          headline: backendUser.profile.headline,
          availability: backendUser.profile.availability,
          city: backendUser.profile.city,
          state: backendUser.profile.state,
          preferredCollaborationMode: backendUser.profile.preferredCollaborationMode,
          profileCompletion: backendUser.profile.profileCompletion,
          isProfileComplete: backendUser.profile.isProfileComplete,
        }));
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  const addSkillToProfile = async (skillId, proficiency = "INTERMEDIATE") => {
    const res = await apiService.addMySkill(skillId, proficiency);
    if (res.success) {
      const userRes = await apiService.getCurrentUser();
      if (userRes.success && userRes.data) {
        setCurrentUser((prev) => ({
          ...prev,
          skills: userRes.data.skills.map((s) => s.name),
          skillsDetail: userRes.data.skills,
        }));
      }
    }
    return res;
  };

  const removeSkillFromProfile = async (skillId) => {
    const res = await apiService.removeMySkill(skillId);
    if (res.success) {
      const userRes = await apiService.getCurrentUser();
      if (userRes.success && userRes.data) {
        setCurrentUser((prev) => ({
          ...prev,
          skills: userRes.data.skills.map((s) => s.name),
          skillsDetail: userRes.data.skills,
        }));
      }
    }
    return res;
  };

  const completeOnboarding = async (profileData) => {
    try {
      if (profileData && Object.keys(profileData).length > 0) {
        await apiService.updateMyProfile(profileData);
      }
      setIsOnboardingCompleted(true);
      const userRes = await apiService.getCurrentUser();
      if (userRes.success && userRes.data) {
        const backendUser = userRes.data;
        setCurrentUser((prev) => ({
          ...prev,
          department: backendUser.profile.department,
          degree: backendUser.profile.academicYear,
          bio: backendUser.profile.bio,
          availability: backendUser.profile.availability,
          headline: backendUser.profile.headline,
          isProfileComplete: backendUser.profile.isProfileComplete,
        }));
      }
    } catch (err) {
      setIsOnboardingCompleted(true);
    }
  };

  // Notification Methods
  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: "Just now",
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Questions & Answers Methods with Database Persistence
  const createQuestion = async (questionData) => {
    try {
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
    } catch (err) {
      console.warn("[AppContext] createQuestion API fallback to local state", err);
    }

    const newQ = {
      id: `q-${Date.now()}`,
      title: questionData.title,
      description: questionData.description || questionData.content || "",
      authorId: currentUser?.id || "usr-1",
      isAnonymous: questionData.isAnonymous || false,
      department: questionData.department || currentUser?.department,
      subject: questionData.subject || "General Academic",
      year: questionData.year || "2026",
      tags: questionData.tags || ["Academic"],
      votes: 1,
      userVoted: false,
      saved: false,
      createdAt: "Just now",
      answers: [],
    };

    setQuestions((prev) => [newQ, ...prev]);
    if (currentUser?.id) {
      addContributionEvent(currentUser.id, "QUESTION_CREATED", `Posted question: '${questionData.title.slice(0, 45)}...'`);
    }
    return newQ.id;
  };

  const deleteQuestion = async (questionId) => {
    try {
      await apiService.deleteQuestion(questionId);
    } catch (err) {
      console.warn("[AppContext] deleteQuestion API fallback to local state", err);
    }
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const voteQuestion = async (questionId) => {
    try {
      await apiService.voteQuestion(questionId);
    } catch (err) {
      // local vote toggle
    }
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newUserVoted = !q.userVoted;
          return {
            ...q,
            userVoted: newUserVoted,
            votes: newUserVoted ? q.votes + 1 : q.votes - 1,
          };
        }
        return q;
      })
    );
  };

  const toggleSaveQuestion = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, saved: !q.saved } : q))
    );
  };

  const submitAnswer = async (questionId, content) => {
    try {
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
        return;
      }
    } catch (err) {
      console.warn("[AppContext] submitAnswer API fallback to local state", err);
    }

    const newAns = {
      id: `ans-${Date.now()}`,
      authorId: currentUser?.id || "usr-1",
      authorName: currentUser?.name || "Aditya Sharma",
      authorRole: `${currentUser?.degree || 'Student'}, ${currentUser?.institution || 'IIT Delhi'}`,
      authorAvatar: currentUser?.avatar || INITIAL_USERS[0].avatar,
      content,
      votes: 1,
      isAccepted: false,
      createdAt: "Just now",
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...(q.answers || []), newAns],
          };
        }
        return q;
      })
    );
  };

  const deleteAnswer = async (questionId, answerId) => {
    try {
      await apiService.deleteAnswer(answerId);
    } catch (err) {
      console.warn("[AppContext] deleteAnswer API fallback to local state", err);
    }

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: (q.answers || []).filter((a) => a.id !== answerId),
          };
        }
        return q;
      })
    );
  };

  const acceptAnswer = async (questionId, answerId) => {
    try {
      const res = await apiService.acceptAnswer(answerId);
      if (res && res.success && res.data) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? res.data : q))
        );
        return;
      }
    } catch (err) {
      console.warn("[AppContext] acceptAnswer API fallback to local state", err);
    }

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const updatedAns = (q.answers || []).map((a) => {
            if (a.id === answerId) {
              return { ...a, isAccepted: true };
            }
            return { ...a, isAccepted: false };
          });
          return { ...q, answers: updatedAns };
        }
        return q;
      })
    );
  };

  // Projects Methods with Database Persistence
  const createProject = async (projectData) => {
    try {
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
    } catch (err) {
      console.warn("[AppContext] createProject API fallback to local state", err);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await apiService.deleteProject(projectId);
    } catch (err) {
      console.warn("[AppContext] deleteProject API fallback to local state", err);
    }
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const requestJoinProject = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, requestSent: true };
        }
        return p;
      })
    );

    if (currentUser?.id) {
      addContributionEvent(currentUser.id, "PROJECT_JOINED", "Requested to join research workspace");
    }
    addNotification({
      title: "Project Request Sent",
      message: "Your request to join the project workspace has been delivered to the lead.",
      type: "project",
      link: `/projects/${projectId}`,
    });
  };

  // People & Connection Methods
  const sendConnectionRequest = (personId) => {
    setConnections((prev) => [...prev, personId]);
    addNotification({
      title: "Connection Request Sent",
      message: "Collaboration connection invite sent to scholar.",
      type: "people",
      link: `/people/${personId}`,
    });
  };

  const sendMentorshipRequest = (mentorId, note) => {
    setMentorshipRequests((prev) => [...prev, { mentorId, note, status: "pending" }]);
    addNotification({
      title: "Mentorship Requested",
      message: "Mentorship request submitted to faculty mentor.",
      type: "mentorship",
      link: `/mentorship`,
    });
  };

  // Messaging Methods
  const sendMessage = (conversationId, text) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === conversationId) {
          return {
            ...m,
            conversation: [
              ...m.conversation,
              { id: `m-${Date.now()}`, senderId: currentUser?.id || "usr-1", text, time: "Just now" },
            ],
          };
        }
        return m;
      })
    );
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
        connections,
        mentorshipRequests,
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
        requestJoinProject,
        sendConnectionRequest,
        sendMentorshipRequest,
        sendMessage,
        refreshDatabaseContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
