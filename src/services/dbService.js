import { supabase, isSupabaseConfigured } from "./supabaseClient";
import {
  INITIAL_USERS,
  INITIAL_QUESTIONS,
  INITIAL_PROJECTS
} from "../data/mockData";

/**
 * Unified Database Access Layer (dbService)
 * Interacts with Supabase PostgreSQL tables directly when configured,
 * with full Create, Read, Update, and Delete (CRUD) persistence.
 */

export const dbService = {
  // ─── AUTHENTICATION (SUPABASE + GRACEFUL FALLBACK) ────────
  login: async (rawEmail, password) => {
    const email = String(rawEmail || "").trim();
    const safeEmailLower = email.toLowerCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data?.user) {
          const profile = await dbService.getProfileById(data.user.id);
          return {
            user: profile || {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || email.split("@")[0] || "Scholar",
              email: data.user.email || email,
              role: "student",
              institution: "IIT Delhi",
              department: "Computer Science & Engineering",
              verified: true,
              verificationCode: "#IN-9042-DL",
              avatar: INITIAL_USERS[0].avatar,
              contributionScore: 500,
              skills: ["Distributed Systems", "React", "Node.js"]
            }
          };
        }
      } catch (e) {
        console.warn("[dbService] Supabase Auth login attempt failed, using fallback.", e);
      }
    }

    const existing = INITIAL_USERS.find(u => String(u.email || "").toLowerCase() === safeEmailLower);
    if (existing) return { user: existing };

    const role = safeEmailLower.includes("prof") || safeEmailLower.includes("dr.") || safeEmailLower.includes("faculty") || safeEmailLower.includes("fac") ? "faculty" : "student";
    const namePart = email.includes("@") ? email.split("@")[0] : email;
    const nameFromEmail = namePart ? namePart.replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Aditya Sharma";

    return {
      user: {
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
        answersCount: 15,
        acceptedAnswersCount: 10,
        projectsCount: 3,
        skills: ["Distributed Systems", "React", "Python", "Node.js"],
        endorsements: [],
        contributions: []
      }
    };
  },

  register: async (registerData = {}) => {
    const email = String(registerData.email || "").trim();
    const rawRoleStr = String(registerData.role || "").toLowerCase();
    const role = rawRoleStr.includes("fac") || rawRoleStr.includes("prof") ? "faculty" : "student";

    if (isSupabaseConfigured && registerData.password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: registerData.password,
          options: {
            data: {
              full_name: registerData.fullName || registerData.name || registerData.firstName,
              role
            }
          }
        });

        if (!error && data?.user) {
          const newProfile = {
            id: data.user.id,
            email,
            name: registerData.fullName || registerData.name || (email.includes("@") ? email.split("@")[0] : "New Scholar"),
            role,
            department: registerData.department || "Computer Science & Engineering",
            degree: registerData.academicYear || registerData.degree || (role === "faculty" ? "Professor" : "B.Tech Candidate"),
            institution: registerData.institution || "IIT Delhi",
            verified: true,
            verificationCode: role === "faculty" ? "#FAC-VERIFIED" : "#IN-VERIFIED",
            skills: registerData.skills || ["Computer Science"],
            contributionScore: 100
          };
          await dbService.upsertProfile(newProfile).catch(() => {});
          return { user: newProfile };
        }
      } catch (e) {
        console.warn("[dbService] Supabase Auth sign up failed, using fallback.", e);
      }
    }

    const nameString = registerData.fullName || registerData.name || (registerData.firstName ? `${registerData.firstName} ${registerData.lastName || ''}`.trim() : (email.includes("@") ? email.split("@")[0] : "New Scholar"));

    const newScholar = {
      id: `usr-${Date.now()}`,
      name: nameString || "New Scholar",
      email: email || "scholar@institution.ac.in",
      role,
      institution: registerData.institution || "IIT Delhi",
      department: registerData.department || "Computer Science & Engineering",
      degree: registerData.academicYear || registerData.degree || (role === "faculty" ? "Professor" : "B.Tech CSE '25"),
      verified: true,
      verificationCode: role === "faculty" ? "#FAC-0892-DL" : "#IN-9812-DL",
      avatar: INITIAL_USERS[0].avatar,
      bio: `Registered ${role} researcher at ${registerData.institution || 'Indian Institute of Technology Delhi'}.`,
      contributionScore: 100,
      answersCount: 0,
      acceptedAnswersCount: 0,
      projectsCount: 0,
      skills: registerData.skills || ["Computer Science", "Research"],
      endorsements: [],
      contributions: []
    };

    return { user: newScholar };
  },

  // ─── PROFILES & USERS CRUD ───────────────────────────────────────
  getProfiles: async () => {
    if (!isSupabaseConfigured) return INITIAL_USERS;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*, user_profiles(*), institutions(*)")
        .order("createdAt", { ascending: false });

      if (error || !data || data.length === 0) {
        return INITIAL_USERS;
      }

      return data.map(item => ({
        id: item.id,
        name: `${item.firstName} ${item.lastName}`,
        email: item.email,
        role: String(item.role || "student").toLowerCase(),
        institution: item.institutions?.name || "IIT Delhi",
        department: item.user_profiles?.department || "Computer Science",
        degree: item.user_profiles?.academicYear || "B.Tech",
        verified: item.isEmailVerified ?? true,
        verificationCode: "#IN-VERIFIED",
        avatar: item.user_profiles?.avatarUrl,
        bio: item.user_profiles?.bio,
        skills: [],
        availability: item.user_profiles?.availability || "Available for collaboration",
        contributionScore: 100,
      }));
    } catch (err) {
      return INITIAL_USERS;
    }
  },

  getProfileById: async (id) => {
    if (!isSupabaseConfigured) {
      return INITIAL_USERS.find(u => u.id === id) || null;
    }
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*, user_profiles(*), institutions(*)")
        .eq("id", id)
        .single();

      if (error || !data) return INITIAL_USERS.find(u => u.id === id) || null;

      return {
        id: data.id,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: String(data.role || "student").toLowerCase(),
        department: data.user_profiles?.department,
        degree: data.user_profiles?.academicYear,
        verified: data.isEmailVerified ?? true,
        verificationCode: "#IN-VERIFIED",
        avatar: data.user_profiles?.avatarUrl,
        bio: data.user_profiles?.bio,
        availability: data.user_profiles?.availability,
        skills: [],
        contributionScore: 100,
      };
    } catch (err) {
      return INITIAL_USERS.find(u => u.id === id) || null;
    }
  },

  deleteUser: async (userId) => {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from("users").delete().eq("id", userId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("[dbService] Error deleting user:", err);
      return false;
    }
  },

  // ─── QUESTIONS & ANSWERS CRUD ───────────────────────
  getQuestions: async () => {
    if (!isSupabaseConfigured) return INITIAL_QUESTIONS;
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*, answers(*)")
        .order("createdAt", { ascending: false });

      if (error || !data || data.length === 0) {
        return INITIAL_QUESTIONS;
      }

      return data.map(q => ({
        id: q.id,
        authorId: q.authorId,
        title: q.title,
        description: q.description,
        content: q.description,
        department: q.department,
        subject: q.subject,
        tags: q.tags || [],
        isAnonymous: q.isAnonymous,
        votes: q.votes || 0,
        answersCount: q.answers ? q.answers.length : 0,
        createdAt: q.createdAt,
        answers: (q.answers || []).map(a => ({
          id: a.id,
          questionId: a.questionId,
          authorId: a.authorId,
          content: a.content,
          isAccepted: a.isAccepted,
          votes: a.upvotes || 0,
          createdAt: a.createdAt
        }))
      }));
    } catch (err) {
      return INITIAL_QUESTIONS;
    }
  },

  createQuestion: async (questionData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from("questions")
        .insert({
          authorId: questionData.authorId,
          title: questionData.title,
          description: questionData.description || questionData.content,
          department: questionData.department || "Computer Science",
          subject: questionData.subject || "General Academic",
          tags: questionData.tags || [],
          isAnonymous: questionData.isAnonymous || false,
          votes: 1
        })
        .select()
        .single();

      if (error) {
        console.error("[dbService] Error creating question:", error);
        return null;
      }
      return data;
    } catch (err) {
      return null;
    }
  },

  updateQuestion: async (id, updateData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from("questions")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      return null;
    }
  },

  deleteQuestion: async (id) => {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      return false;
    }
  },

  addAnswer: async (questionId, answerData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from("answers")
        .insert({
          questionId,
          authorId: answerData.authorId,
          content: answerData.content,
          upvotes: 1
        })
        .select()
        .single();

      if (error) {
        console.error("[dbService] Error adding answer:", error);
        return null;
      }

      return data;
    } catch (err) {
      return null;
    }
  },

  deleteAnswer: async (answerId) => {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from("answers").delete().eq("id", answerId);
      if (error) throw error;
      return true;
    } catch (err) {
      return false;
    }
  },

  // ─── PROJECTS CRUD ──────────────────────────────
  getProjects: async () => {
    if (!isSupabaseConfigured) return INITIAL_PROJECTS;
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error || !data || data.length === 0) {
        return INITIAL_PROJECTS;
      }

      return data.map(p => ({
        id: p.id,
        leadId: p.leadId,
        title: p.title,
        description: p.description,
        domain: p.domain,
        sprintPhase: p.sprintPhase,
        requiredSkills: p.requiredSkills || [],
        openRoles: p.recruitingRoles || [],
        status: p.status || "Recruiting",
        teamMemberCount: p.teamMemberCount || 1,
        createdAt: p.createdAt
      }));
    } catch (err) {
      return INITIAL_PROJECTS;
    }
  },

  createProject: async (projectData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          leadId: projectData.leadId,
          title: projectData.title,
          description: projectData.description,
          domain: projectData.domain || "Research & Engineering",
          sprintPhase: projectData.sprintPhase || "Phase 1: Architecture",
          requiredSkills: projectData.requiredSkills || [],
          recruitingRoles: projectData.openRoles || [],
          status: projectData.status || "Recruiting",
          teamMemberCount: 1
        })
        .select()
        .single();

      if (error) {
        console.error("[dbService] Error creating project:", error);
        return null;
      }
      return data;
    } catch (err) {
      return null;
    }
  },

  updateProject: async (id, updateData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      return null;
    }
  },

  deleteProject: async (id) => {
    if (!isSupabaseConfigured) return true;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      return false;
    }
  },
};
