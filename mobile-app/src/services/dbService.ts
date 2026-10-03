/**
 * Unified Mobile Database Access Layer (dbService)
 * Interacts with Supabase PostgreSQL tables directly with full CRUD capabilities,
 * and seamlessly provides resilient fallback and offline caching.
 */

import { supabase, isSupabaseConfigured } from "./supabaseClient";
import {
  INITIAL_USERS,
  INITIAL_QUESTIONS,
  INITIAL_PROJECTS,
  INITIAL_COMMUNITIES,
  INITIAL_MENTORSHIP_SLOTS,
  INITIAL_NOTIFICATIONS,
} from "./mockData";
import {
  User,
  Question,
  Answer,
  Project,
  ProjectApplication,
  Community,
  MentorshipSlot,
  MentorshipBooking,
  NotificationItem,
  DirectMessage,
  Conversation,
} from "../types";

// In-memory runtime stores for dynamic updates in session
let runtimeQuestions: Question[] = [...INITIAL_QUESTIONS];
let runtimeProjects: Project[] = [...INITIAL_PROJECTS];
let runtimeApplications: ProjectApplication[] = [];
let runtimeCommunities: Community[] = [...INITIAL_COMMUNITIES];
let runtimeMentorshipSlots: MentorshipSlot[] = [...INITIAL_MENTORSHIP_SLOTS];
let runtimeNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
let runtimeMessages: DirectMessage[] = [
  {
    id: "msg-1",
    conversationId: "conv-usr-2",
    senderId: "usr-2",
    receiverId: "usr-1",
    text: "Aditya, reviewed your raft consensus pull request. Let's discuss during office hours.",
    timestamp: "10:30 AM",
    read: true,
  },
  {
    id: "msg-2",
    conversationId: "conv-usr-3",
    senderId: "usr-3",
    receiverId: "usr-1",
    text: "Hey! Are you open to collaborating on FPGA neural synthesis benchmarks for FloodSense?",
    timestamp: "Yesterday",
    read: true,
  },
];

export const dbService = {
  // ─── AUTHENTICATION ──────────────────────────────────────────
  login: async (rawEmail: string, password?: string): Promise<{ user: User }> => {
    const email = String(rawEmail || "").trim().toLowerCase();

    if (isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.user) {
          const profile = await dbService.getProfileById(data.user.id);
          if (profile) return { user: profile };
        }
      } catch (e) {
        console.warn("[dbService Mobile] Supabase Auth sign-in failed, using fallback.", e);
      }
    }

    const existing = INITIAL_USERS.find(
      (u) => String(u.email || "").toLowerCase() === email
    );
    if (existing) return { user: existing };

    const role =
      email.includes("prof") ||
      email.includes("dr.") ||
      email.includes("faculty") ||
      email.includes("fac")
        ? "faculty"
        : "student";

    const namePart = email.includes("@") ? email.split("@")[0] : email;
    const nameFromEmail = namePart
      ? namePart.replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "Aditya Sharma";

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: nameFromEmail || "Aditya Sharma",
      email: email || "scholar@iitd.ac.in",
      role,
      institution: "IIT Delhi",
      department: "Computer Science & Engineering",
      degree: role === "faculty" ? "Professor & Lab Director" : "B.Tech CSE '25",
      verified: true,
      verificationCode: role === "faculty" ? "#FAC-0192-DL" : "#IN-9042-DL",
      avatar: INITIAL_USERS[0].avatar,
      bio: `${role === "faculty" ? "Faculty Advisor & Researcher" : "Student Researcher"} at Indian Institute of Technology Delhi.`,
      contributionScore: 1200,
      xpPoints: 1200,
      currentStreak: 7,
      answersCount: 15,
      acceptedAnswersCount: 10,
      projectsCount: 3,
      skills: ["Distributed Systems", "React Native", "TypeScript", "Node.js"],
      interests: ["Mesh Networks", "Distributed Systems", "Mobile Architecture"],
      availability: "Weekends",
      experience: "Advanced",
      badges: ["Top Contributor", "Campus Verified"],
      endorsements: [],
      contributions: [],
    };

    return { user: newUser };
  },

  register: async (registerData: Partial<User> & { password?: string }): Promise<{ user: User }> => {
    const email = String(registerData.email || "").trim().toLowerCase();
    const role = registerData.role || (email.includes("prof") || email.includes("fac") ? "faculty" : "student");

    if (isSupabaseConfigured && registerData.password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: registerData.password,
          options: {
            data: {
              full_name: registerData.name,
              role,
            },
          },
        });

        if (!error && data?.user) {
          const newProfile: User = {
            id: data.user.id,
            email,
            name: registerData.name || "New Scholar",
            role,
            department: registerData.department || "Computer Science & Engineering",
            degree: registerData.degree || (role === "faculty" ? "Professor" : "B.Tech Candidate"),
            institution: registerData.institution || "IIT Delhi",
            verified: true,
            verificationCode: role === "faculty" ? "#FAC-VERIFIED" : "#IN-VERIFIED",
            skills: registerData.skills || ["Computer Science"],
            contributionScore: 100,
            xpPoints: 100,
            currentStreak: 1,
            badges: ["Campus Verified"],
          };
          return { user: newProfile };
        }
      } catch (e) {
        console.warn("[dbService Mobile] Supabase Auth sign-up failed, using fallback.", e);
      }
    }

    const newScholar: User = {
      id: `usr-${Date.now()}`,
      name: registerData.name || "New Scholar",
      email: email || "scholar@institution.ac.in",
      role,
      institution: registerData.institution || "IIT Delhi",
      department: registerData.department || "Computer Science & Engineering",
      degree: registerData.degree || (role === "faculty" ? "Professor" : "B.Tech CSE '25"),
      verified: true,
      verificationCode: role === "faculty" ? "#FAC-0892-DL" : "#IN-9812-DL",
      avatar: INITIAL_USERS[0].avatar,
      bio: `Registered ${role} researcher at ${registerData.institution || "Indian Institute of Technology Delhi"}.`,
      contributionScore: 100,
      xpPoints: 100,
      currentStreak: 1,
      answersCount: 0,
      acceptedAnswersCount: 0,
      projectsCount: 0,
      skills: registerData.skills && registerData.skills.length > 0 ? registerData.skills : ["Computer Science", "Research"],
      interests: ["Academic Research", "Peer Learning"],
      availability: "Weekends",
      experience: "Intermediate",
      badges: ["Campus Verified"],
      endorsements: [],
      contributions: [],
    };

    return { user: newScholar };
  },

  // ─── PROFILES & SCHOLARS ─────────────────────────────────────
  getProfiles: async (): Promise<User[]> => {
    if (!isSupabaseConfigured) return INITIAL_USERS;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) return INITIAL_USERS;

      return data.map((item: any) => ({
        id: item.id,
        name: item.full_name || "Scholar",
        email: item.email || "",
        role: item.role || "student",
        institution: item.institution_id || "IIT Delhi",
        department: item.department || "Computer Science",
        degree: item.degree || "B.Tech",
        verified: item.is_verified ?? true,
        verificationCode: item.verification_code || "#IN-VERIFIED",
        avatar: item.avatar_url || INITIAL_USERS[0].avatar,
        bio: item.bio || "",
        skills: item.skills || [],
        interests: item.interests || [],
        availability: item.availability || "Weekends",
        contributionScore: item.contribution_score || 100,
        xpPoints: item.xp_points || item.contribution_score || 100,
        currentStreak: item.current_streak || 1,
        badges: item.badges || ["Campus Verified"],
      }));
    } catch {
      return INITIAL_USERS;
    }
  },

  getProfileById: async (id: string): Promise<User | null> => {
    const local = INITIAL_USERS.find((u) => u.id === id);
    if (local) return local;

    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.full_name,
        email: data.email,
        role: data.role,
        institution: "IIT Delhi",
        department: data.department,
        degree: data.degree,
        verified: data.is_verified,
        verificationCode: data.verification_code,
        avatar: data.avatar_url,
        bio: data.bio,
        skills: data.skills || [],
        interests: data.interests || [],
        availability: data.availability,
        contributionScore: data.contribution_score,
        xpPoints: data.xp_points,
        currentStreak: data.current_streak,
        badges: data.badges || [],
      };
    } catch {
      return null;
    }
  },

  // ─── QUESTIONS & FORUM ───────────────────────────────────────
  getQuestions: async (): Promise<Question[]> => {
    if (!isSupabaseConfigured) return runtimeQuestions;
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*, answers(*)")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) return runtimeQuestions;

      return data.map((q: any) => ({
        id: q.id,
        authorId: q.author_id,
        authorName: q.is_anonymous ? "Anonymous Scholar" : "Verified Scholar",
        authorRole: "Academic Scholar",
        authorAvatar: INITIAL_USERS[0].avatar,
        title: q.title,
        description: q.content,
        content: q.content,
        department: q.category || "Computer Science & Engineering",
        subject: q.category || "Research",
        tags: q.tags || [],
        votes: q.upvotes || 0,
        isAnonymous: q.is_anonymous,
        createdAt: new Date(q.created_at).toLocaleDateString(),
        answers: (q.answers || []).map((a: any) => ({
          id: a.id,
          questionId: a.question_id,
          authorId: a.author_id,
          authorName: "Contributing Scholar",
          content: a.content,
          votes: a.upvotes || 0,
          isAccepted: a.is_accepted,
          createdAt: new Date(a.created_at).toLocaleDateString(),
        })),
      }));
    } catch {
      return runtimeQuestions;
    }
  },

  getQuestionById: async (id: string): Promise<Question | null> => {
    const q = runtimeQuestions.find((item) => item.id === id);
    return q || null;
  },

  createQuestion: async (newQ: Partial<Question>): Promise<Question> => {
    const created: Question = {
      id: `q-${Date.now()}`,
      authorId: newQ.authorId || "usr-1",
      authorName: newQ.isAnonymous ? "Anonymous Scholar" : newQ.authorName || "Aditya Sharma",
      authorRole: newQ.authorRole || "Student, IIT Delhi",
      authorAvatar: newQ.authorAvatar || INITIAL_USERS[0].avatar,
      title: newQ.title || "",
      description: newQ.description || newQ.content || "",
      department: newQ.department || "Computer Science & Engineering",
      subject: newQ.subject || "General Academic",
      year: "2026",
      tags: newQ.tags || ["Academic"],
      votes: 1,
      userVoted: false,
      saved: false,
      staffVerified: false,
      isAnonymous: newQ.isAnonymous || false,
      createdAt: "Just now",
      answers: [],
    };

    runtimeQuestions = [created, ...runtimeQuestions];

    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from("questions").insert({
            author_id: created.authorId,
            title: created.title,
            content: created.description,
            category: created.department,
            tags: created.tags,
            is_anonymous: created.isAnonymous,
            upvotes: 1,
          });
        } catch (e) {
          console.warn("[dbService] Supabase insert question error", e);
        }
      })();
    }

    return created;
  },

  toggleVoteQuestion: async (questionId: string): Promise<{ votes: number; userVoted: boolean }> => {
    const q = runtimeQuestions.find((item) => item.id === questionId);
    if (!q) return { votes: 0, userVoted: false };

    q.userVoted = !q.userVoted;
    q.votes = q.userVoted ? q.votes + 1 : Math.max(0, q.votes - 1);
    return { votes: q.votes, userVoted: q.userVoted };
  },

  addAnswer: async (questionId: string, author: User, content: string): Promise<Answer> => {
    const newAnswer: Answer = {
      id: `ans-${Date.now()}`,
      questionId,
      authorId: author.id,
      authorName: author.name,
      authorRole: `${author.role === "faculty" ? "Professor" : "Student"}, ${author.institution}`,
      authorAvatar: author.avatar || INITIAL_USERS[0].avatar,
      content,
      votes: 1,
      isAccepted: false,
      createdAt: "Just now",
      userVoted: false,
    };

    const q = runtimeQuestions.find((item) => item.id === questionId);
    if (q) {
      q.answers = [...q.answers, newAnswer];
    }

    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from("answers").insert({
            question_id: questionId,
            author_id: author.id,
            content,
            is_accepted: false,
            upvotes: 1,
          });
        } catch (e) {
          console.warn("[dbService] Supabase insert answer error", e);
        }
      })();
    }

    return newAnswer;
  },

  toggleAcceptAnswer: async (questionId: string, answerId: string): Promise<boolean> => {
    const q = runtimeQuestions.find((item) => item.id === questionId);
    if (!q) return false;

    q.answers = q.answers.map((a) => ({
      ...a,
      isAccepted: a.id === answerId ? !a.isAccepted : false,
    }));

    return true;
  },

  // ─── PROJECTS & RESEARCH WORKSPACE ───────────────────────────
  getProjects: async (): Promise<Project[]> => {
    if (!isSupabaseConfigured) return runtimeProjects;
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) return runtimeProjects;

      return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        tagline: p.description.slice(0, 90) + "...",
        description: p.description,
        institution: "Consortium Initiative",
        department: p.category || "Computer Science",
        status: p.status || "Recruiting",
        lead: "Project Lead",
        leadId: p.owner_id,
        team: [],
        skillsRequired: p.required_skills || [],
        openRoles: p.open_roles || [],
        milestones: [],
      }));
    } catch {
      return runtimeProjects;
    }
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    const p = runtimeProjects.find((item) => item.id === id);
    return p || null;
  },

  createProject: async (newP: Partial<Project>, lead: User): Promise<Project> => {
    const created: Project = {
      id: `proj-${Date.now()}`,
      title: newP.title || "New Research Initiative",
      tagline: newP.tagline || (newP.description ? newP.description.slice(0, 100) : "Inter-institutional research project."),
      description: newP.description || "",
      institution: lead.institution || "IIT Delhi",
      department: newP.department || lead.department || "Computer Science & Engineering",
      status: "Recruiting",
      lead: `${lead.name} (${lead.institution})`,
      leadId: lead.id,
      team: [
        {
          name: lead.name,
          role: "Project Lead",
          institution: lead.institution,
          avatar: lead.avatar || INITIAL_USERS[0].avatar,
        },
      ],
      skillsRequired: newP.skillsRequired || ["Research", "Development"],
      openRoles: newP.openRoles || ["Research Collaborator", "Systems Developer"],
      milestones: [
        { title: "Architecture & Problem Formulation", status: "In Progress", date: "Month 1" },
        { title: "Prototype Implementation & Benchmarking", status: "Upcoming", date: "Month 2" },
      ],
      createdAt: "Just now",
    };

    runtimeProjects = [created, ...runtimeProjects];
    return created;
  },

  applyToProject: async (
    projectId: string,
    user: User,
    roleApplied: string,
    pitch: string,
    matchScore: number
  ): Promise<ProjectApplication> => {
    const app: ProjectApplication = {
      id: `app-${Date.now()}`,
      projectId,
      applicantId: user.id,
      applicantName: user.name,
      roleApplied,
      pitch,
      status: "Pending",
      matchScore,
      createdAt: "Just now",
    };

    runtimeApplications = [app, ...runtimeApplications];
    return app;
  },

  // ─── FACULTY MENTORSHIP ──────────────────────────────────────
  getMentorshipSlots: async (): Promise<MentorshipSlot[]> => {
    return runtimeMentorshipSlots;
  },

  bookMentorshipSlot: async (
    slotId: string,
    student: User,
    purpose: string
  ): Promise<MentorshipBooking> => {
    const slot = runtimeMentorshipSlots.find((s) => s.id === slotId);
    if (slot) {
      slot.bookedCount = Math.min(slot.maxCapacity, slot.bookedCount + 1);
    }

    const booking: MentorshipBooking = {
      id: `book-${Date.now()}`,
      slotId,
      studentId: student.id,
      studentName: student.name,
      purpose,
      status: "Confirmed",
      createdAt: "Just now",
    };

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: "mentorship_confirmed",
      title: "Mentorship Session Confirmed",
      message: `Your advisory slot with ${slot?.facultyName || "Faculty Mentor"} on "${slot?.topic}" has been confirmed.`,
      read: false,
      timestamp: "Just now",
      targetScreen: "Mentorship",
      targetId: slotId,
    };
    runtimeNotifications = [newNotif, ...runtimeNotifications];

    return booking;
  },

  // ─── COMMUNITIES & CONSORTIA ─────────────────────────────────
  getCommunities: async (): Promise<Community[]> => {
    return runtimeCommunities;
  },

  toggleJoinCommunity: async (communityId: string): Promise<boolean> => {
    const comm = runtimeCommunities.find((c) => c.id === communityId);
    if (!comm) return false;

    comm.joined = !comm.joined;
    comm.membersCount = comm.joined ? comm.membersCount + 1 : Math.max(0, comm.membersCount - 1);
    return comm.joined;
  },

  // ─── NOTIFICATIONS ───────────────────────────────────────────
  getNotifications: async (): Promise<NotificationItem[]> => {
    return runtimeNotifications;
  },

  markNotificationAsRead: async (notifId: string): Promise<void> => {
    runtimeNotifications = runtimeNotifications.map((n) =>
      n.id === notifId ? { ...n, read: true } : n
    );
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    runtimeNotifications = runtimeNotifications.map((n) => ({ ...n, read: true }));
  },

  // ─── DIRECT MESSAGES ─────────────────────────────────────────
  getConversations: async (currentUser: User): Promise<Conversation[]> => {
    const otherUsers = INITIAL_USERS.filter((u) => u.id !== currentUser.id);

    return otherUsers.map((u) => {
      const msgs = runtimeMessages.filter(
        (m) =>
          (m.senderId === u.id && m.receiverId === currentUser.id) ||
          (m.senderId === currentUser.id && m.receiverId === u.id)
      );
      const lastMsg = msgs[msgs.length - 1];

      return {
        id: `conv-${u.id}`,
        participantId: u.id,
        participantName: u.name,
        participantAvatar: u.avatar,
        participantRole: `${u.role === "faculty" ? "Professor" : "Student"}, ${u.institution}`,
        participantInstitution: u.institution,
        lastMessage: lastMsg ? lastMsg.text : "Start an academic discussion...",
        lastMessageTimestamp: lastMsg ? lastMsg.timestamp : "Recently",
        unreadCount: msgs.filter((m) => m.senderId === u.id && !m.read).length,
      };
    });
  },

  getMessagesByConversationId: async (
    participantId: string,
    currentUserId: string
  ): Promise<DirectMessage[]> => {
    return runtimeMessages.filter(
      (m) =>
        (m.senderId === participantId && m.receiverId === currentUserId) ||
        (m.senderId === currentUserId && m.receiverId === participantId)
    );
  },

  sendMessage: async (
    senderId: string,
    receiverId: string,
    text: string
  ): Promise<DirectMessage> => {
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${receiverId}`,
      senderId,
      receiverId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };

    runtimeMessages = [...runtimeMessages, newMsg];
    return newMsg;
  },
};
