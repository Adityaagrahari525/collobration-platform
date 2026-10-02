import { supabase, isSupabaseConfigured } from "./supabaseClient";
import {
  INITIAL_USERS,
  INITIAL_QUESTIONS,
  INITIAL_PROJECTS
} from "../data/mockData";

/**
 * Unified Database Access Layer (dbService)
 * Interacts with Supabase PostgreSQL tables when configured,
 * with seamless fallback to initial mock datasets for offline development.
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

    // Fallback: Check INITIAL_USERS or return local session
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

  // ─── PROFILES & USERS ───────────────────────────────────────
  getProfiles: async () => {
    if (!isSupabaseConfigured) return INITIAL_USERS;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("contribution_score", { ascending: false });

      if (error || !data || data.length === 0) {
        return INITIAL_USERS;
      }

      return data.map(item => ({
        id: item.id,
        name: item.full_name,
        email: item.email,
        role: String(item.role || "student").toLowerCase(),
        institution: item.department ? `${item.department}` : "IIT Delhi",
        department: item.department,
        degree: item.degree,
        verified: item.is_verified,
        verificationCode: item.verification_code,
        avatar: item.avatar_url,
        bio: item.bio,
        skills: item.skills || [],
        interests: item.interests || [],
        availability: item.availability,
        contributionScore: item.contribution_score || 0,
        xpPoints: item.xp_points || 0,
        currentStreak: item.current_streak || 0,
        badges: item.badges || []
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
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return INITIAL_USERS.find(u => u.id === id) || null;

      return {
        id: data.id,
        name: data.full_name,
        email: data.email,
        role: String(data.role || "student").toLowerCase(),
        department: data.department,
        degree: data.degree,
        verified: data.is_verified,
        verificationCode: data.verification_code,
        avatar: data.avatar_url,
        bio: data.bio,
        skills: data.skills || [],
        interests: data.interests || [],
        availability: data.availability,
        contributionScore: data.contribution_score || 0,
        xpPoints: data.xp_points || 0,
        currentStreak: data.current_streak || 0,
        badges: data.badges || []
      };
    } catch (err) {
      return INITIAL_USERS.find(u => u.id === id) || null;
    }
  },

  upsertProfile: async (user) => {
    if (!isSupabaseConfigured) return user;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.name,
          role: String(user.role || "student").toLowerCase(),
          department: user.department || "Computer Science",
          degree: user.degree || "B.Tech",
          verification_code: user.verificationCode || "#IN-VERIFIED",
          is_verified: user.verified ?? true,
          avatar_url: user.avatar,
          bio: user.bio,
          skills: user.skills || [],
          interests: user.interests || [],
          availability: user.availability || "Weekends",
          contribution_score: user.contributionScore || 0,
          xp_points: user.xpPoints || 0,
          current_streak: user.currentStreak || 0,
          badges: user.badges || [],
          updated_at: new Date().toISOString()
        }, { onConflict: "id" })
        .select()
        .single();

      if (error) {
        console.error("[dbService] Error upserting profile:", error);
        throw error;
      }
      return data;
    } catch (err) {
      return user;
    }
  },

  // ─── QUESTIONS & ANSWERS (Q&A FORUM) ───────────────────────
  getQuestions: async () => {
    if (!isSupabaseConfigured) return INITIAL_QUESTIONS;
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*, answers(*)")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return INITIAL_QUESTIONS;
      }

      return data.map(q => ({
        id: q.id,
        authorId: q.author_id,
        title: q.title,
        content: q.content,
        category: q.category,
        tags: q.tags || [],
        isAnonymous: q.is_anonymous,
        upvotes: q.upvotes || 0,
        answersCount: q.answers_count || (q.answers ? q.answers.length : 0),
        isResolved: q.is_resolved,
        createdAt: q.created_at,
        answers: (q.answers || []).map(a => ({
          id: a.id,
          authorId: a.author_id,
          content: a.content,
          isAccepted: a.is_accepted,
          upvotes: a.upvotes || 0,
          createdAt: a.created_at
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
          author_id: questionData.authorId,
          title: questionData.title,
          content: questionData.content,
          category: questionData.category || "Engineering",
          tags: questionData.tags || [],
          is_anonymous: questionData.isAnonymous || false
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

  addAnswer: async (questionId, answerData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from("answers")
        .insert({
          question_id: questionId,
          author_id: answerData.authorId,
          content: answerData.content
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

  // ─── PROJECTS & APPLICATIONS ──────────────────────────────
  getProjects: async () => {
    if (!isSupabaseConfigured) return INITIAL_PROJECTS;
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return INITIAL_PROJECTS;
      }

      return data.map(p => ({
        id: p.id,
        ownerId: p.owner_id,
        title: p.title,
        description: p.description,
        category: p.category,
        requiredSkills: p.required_skills || [],
        openRoles: p.open_roles || [],
        status: p.status,
        teamSizeLimit: p.team_size_limit || 5,
        createdAt: p.created_at
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
          owner_id: projectData.ownerId,
          title: projectData.title,
          description: projectData.description,
          category: projectData.category || "General",
          required_skills: projectData.requiredSkills || [],
          open_roles: projectData.openRoles || [],
          status: projectData.status || "Recruiting",
          team_size_limit: projectData.teamSizeLimit || 5
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

  applyForProject: async (applicationData) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from("project_applications")
        .insert({
          project_id: applicationData.projectId,
          applicant_id: applicationData.applicantId,
          role_applied: applicationData.roleApplied,
          pitch: applicationData.pitch,
          match_score: applicationData.matchScore || 0
        })
        .select()
        .single();

      if (error) {
        console.error("[dbService] Error applying for project:", error);
        return null;
      }
      return data;
    } catch (err) {
      return null;
    }
  }
};
