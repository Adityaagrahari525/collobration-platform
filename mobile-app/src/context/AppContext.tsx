import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  Question,
  Project,
  User,
  Community,
  MentorshipSlot,
  NotificationItem,
  ProjectApplication,
  MentorshipBooking,
} from "../types";
import { dbService } from "../services/dbService";
import { storage } from "../services/storage";
import { useAuth } from "./AuthContext";

interface AppContextType {
  questions: Question[];
  projects: Project[];
  scholars: User[];
  communities: Community[];
  mentorshipSlots: MentorshipSlot[];
  notifications: NotificationItem[];
  savedQuestionIds: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  unreadNotificationsCount: number;

  // Question actions
  fetchQuestions: () => Promise<void>;
  createQuestion: (data: Partial<Question>) => Promise<Question>;
  voteQuestion: (questionId: string) => Promise<void>;
  addAnswer: (questionId: string, content: string) => Promise<void>;
  acceptAnswer: (questionId: string, answerId: string) => Promise<void>;
  toggleSaveQuestion: (questionId: string) => Promise<void>;

  // Project actions
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<Project>;
  applyToProject: (projectId: string, roleApplied: string, pitch: string, matchScore: number) => Promise<ProjectApplication>;

  // Mentorship actions
  fetchMentorshipSlots: () => Promise<void>;
  bookMentorshipSlot: (slotId: string, purpose: string) => Promise<MentorshipBooking>;

  // Community actions
  fetchCommunities: () => Promise<void>;
  toggleJoinCommunity: (communityId: string) => Promise<void>;

  // Notifications
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Master refresh
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [scholars, setScholars] = useState<User[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [mentorshipSlots, setMentorshipSlots] = useState<MentorshipSlot[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadInitialData = useCallback(async () => {
    try {
      const [q, p, s, c, m, n, saved] = await Promise.all([
        dbService.getQuestions(),
        dbService.getProjects(),
        dbService.getProfiles(),
        dbService.getCommunities(),
        dbService.getMentorshipSlots(),
        dbService.getNotifications(),
        storage.getSavedQuestionIds(),
      ]);

      setQuestions(q);
      setProjects(p);
      setScholars(s);
      setCommunities(c);
      setMentorshipSlots(m);
      setNotifications(n);
      setSavedQuestionIds(saved);
    } catch (err) {
      console.warn("Error loading initial app data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const refreshAll = async () => {
    setIsRefreshing(true);
    await loadInitialData();
  };

  const fetchQuestions = async () => {
    const data = await dbService.getQuestions();
    setQuestions(data);
  };

  const createQuestion = async (data: Partial<Question>): Promise<Question> => {
    if (!user) throw new Error("User must be logged in to ask a question.");

    const created = await dbService.createQuestion({
      ...data,
      authorId: user.id,
      authorName: user.name,
      authorRole: `${user.role === "faculty" ? "Professor" : "Student"}, ${user.institution}`,
      authorAvatar: user.avatar,
    });

    setQuestions((prev) => [created, ...prev]);

    // Reward user with contribution points and XP (+5)
    await updateProfile({
      contributionScore: (user.contributionScore || 0) + 5,
      xpPoints: (user.xpPoints || 0) + 5,
    });

    return created;
  };

  const voteQuestion = async (questionId: string) => {
    const res = await dbService.toggleVoteQuestion(questionId);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, votes: res.votes, userVoted: res.userVoted } : q
      )
    );
  };

  const addAnswer = async (questionId: string, content: string) => {
    if (!user) throw new Error("User must be logged in to answer.");
    const answer = await dbService.addAnswer(questionId, user, content);

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q
      )
    );

    // Reward user with contribution points and XP (+10)
    await updateProfile({
      contributionScore: (user.contributionScore || 0) + 10,
      xpPoints: (user.xpPoints || 0) + 10,
      answersCount: (user.answersCount || 0) + 1,
    });
  };

  const acceptAnswer = async (questionId: string, answerId: string) => {
    await dbService.toggleAcceptAnswer(questionId, answerId);
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) => ({
              ...a,
              isAccepted: a.id === answerId ? !a.isAccepted : false,
            })),
          };
        }
        return q;
      })
    );
  };

  const toggleSaveQuestion = async (questionId: string) => {
    const saved = await storage.toggleSavedQuestionId(questionId);
    setSavedQuestionIds((prev) =>
      saved ? [...prev, questionId] : prev.filter((id) => id !== questionId)
    );
  };

  const fetchProjects = async () => {
    const data = await dbService.getProjects();
    setProjects(data);
  };

  const createProject = async (data: Partial<Project>): Promise<Project> => {
    if (!user) throw new Error("User must be logged in to post a project.");
    const created = await dbService.createProject(data, user);
    setProjects((prev) => [created, ...prev]);

    // Reward user for project creation (+20)
    await updateProfile({
      contributionScore: (user.contributionScore || 0) + 20,
      xpPoints: (user.xpPoints || 0) + 20,
      projectsCount: (user.projectsCount || 0) + 1,
    });

    return created;
  };

  const applyToProject = async (
    projectId: string,
    roleApplied: string,
    pitch: string,
    matchScore: number
  ): Promise<ProjectApplication> => {
    if (!user) throw new Error("User must be logged in to apply.");
    const app = await dbService.applyToProject(projectId, user, roleApplied, pitch, matchScore);

    // Reward user for application submission (+10)
    await updateProfile({
      contributionScore: (user.contributionScore || 0) + 10,
      xpPoints: (user.xpPoints || 0) + 10,
    });

    return app;
  };

  const fetchMentorshipSlots = async () => {
    const data = await dbService.getMentorshipSlots();
    setMentorshipSlots(data);
  };

  const bookMentorshipSlot = async (slotId: string, purpose: string): Promise<MentorshipBooking> => {
    if (!user) throw new Error("User must be logged in to book mentorship.");
    const booking = await dbService.bookMentorshipSlot(slotId, user, purpose);
    await fetchMentorshipSlots();
    await fetchNotifications();
    return booking;
  };

  const fetchCommunities = async () => {
    const data = await dbService.getCommunities();
    setCommunities(data);
  };

  const toggleJoinCommunity = async (communityId: string) => {
    await dbService.toggleJoinCommunity(communityId);
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? {
              ...c,
              joined: !c.joined,
              membersCount: !c.joined ? c.membersCount + 1 : Math.max(0, c.membersCount - 1),
            }
          : c
      )
    );
  };

  const fetchNotifications = async () => {
    const data = await dbService.getNotifications();
    setNotifications(data);
  };

  const markNotificationRead = async (id: string) => {
    await dbService.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    await dbService.markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        questions,
        projects,
        scholars,
        communities,
        mentorshipSlots,
        notifications,
        savedQuestionIds,
        isLoading,
        isRefreshing,
        unreadNotificationsCount,

        fetchQuestions,
        createQuestion,
        voteQuestion,
        addAnswer,
        acceptAnswer,
        toggleSaveQuestion,

        fetchProjects,
        createProject,
        applyToProject,

        fetchMentorshipSlots,
        bookMentorshipSlot,

        fetchCommunities,
        toggleJoinCommunity,

        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,

        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
};
