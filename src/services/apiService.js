const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" ? "/api" : "http://localhost:5000/api");

let isRefreshing = false;

async function request(endpoint, options = {}, isRetry = false) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("campuslink_token") : null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...authHeaders,
      ...options.headers,
    },
    credentials: "include", // Transmit HttpOnly cookies automatically
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    // If 401 Unauthorized and not accessing auth routes, attempt silent token refresh
    if (
      response.status === 401 &&
      !isRetry &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/register") &&
      !endpoint.includes("/auth/refresh")
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await apiService.refresh();
          isRefreshing = false;
          if (refreshRes && refreshRes.success) {
            return await request(endpoint, options, true);
          }
        } catch (refreshErr) {
          isRefreshing = false;
          if (typeof window !== "undefined") {
            localStorage.removeItem("campuslink_token");
          }
          throw new Error("Session expired. Please sign in again.");
        }
      }
    }
    if (!response.ok || !data.success) {
      const err = new Error(data.error?.message || data.message || `HTTP error ${response.status}`);
      err.code = data.error?.code;
      err.requestId = data.requestId;
      throw err;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const apiService = {
  // ─── INSTITUTIONS ──────────────────────────────────────────
  getInstitutions: async (search) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request(`/institutions${query}`);
  },

  getInstitutionById: async (id) => {
    return request(`/institutions/${id}`);
  },

  // ─── AUTHENTICATION ────────────────────────────────────────
  register: async (registerData) => {
    const res = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(registerData),
    });
    const token = res?.data?.accessToken || res?.data?.token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("campuslink_token", token);
    }
    return res;
  },

  login: async (email, password) => {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const token = res?.data?.accessToken || res?.data?.token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("campuslink_token", token);
    }
    return res;
  },

  getGoogleAuthUrl: () => {
    return `${API_BASE_URL}/auth/google`;
  },

  getMe: async () => {
    return request("/auth/me");
  },

  logout: async () => {
    try {
      await request("/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("campuslink_token");
      }
    }
  },

  refresh: async () => {
    return request("/auth/refresh", { method: "POST" });
  },

  // ─── USER PROFILE & DIRECTORY ──────────────────────────────
  getCurrentUser: async () => {
    return request("/users/me");
  },

  updateMyProfile: async (profileData) => {
    return request("/users/me/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },

  deleteMyAccount: async () => {
    return request("/users/me", {
      method: "DELETE",
    });
  },

  deleteUser: async (id) => {
    return request(`/users/${id}`, {
      method: "DELETE",
    });
  },

  getPeople: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);
    if (params.institutionId) queryParams.append("institutionId", params.institutionId);
    if (params.department) queryParams.append("department", params.department);
    if (params.academicYear) queryParams.append("academicYear", params.academicYear);
    if (params.skillId) queryParams.append("skillId", params.skillId);
    if (params.availability) queryParams.append("availability", params.availability);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return request(`/users${queryString}`);
  },

  getPersonById: async (id) => {
    return request(`/users/${id}`);
  },

  // ─── SKILLS ────────────────────────────────────────────────
  getSkills: async (search) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request(`/skills${query}`);
  },

  getMySkills: async () => {
    return request("/users/me/skills");
  },

  addMySkill: async (skillId, proficiency = "INTERMEDIATE") => {
    return request("/users/me/skills", {
      method: "POST",
      body: JSON.stringify({ skillId, proficiency }),
    });
  },

  removeMySkill: async (skillId) => {
    return request(`/users/me/skills/${skillId}`, {
      method: "DELETE",
    });
  },

  // ─── PROJECTS & WORKSPACES ─────────────────────────────────
  getProjects: async (search, domain, status) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (domain) params.append("domain", domain);
    if (status) params.append("status", status);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return request(`/projects${queryString}`);
  },

  getProjectById: async (id) => {
    return request(`/projects/${id}`);
  },

  createProject: async (projectData) => {
    return request("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  updateProject: async (id, projectData) => {
    return request(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(projectData),
    });
  },

  deleteProject: async (id) => {
    return request(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  // ─── PROJECT APPLICATIONS & COLLABORATION ──────────────────
  applyToProject: async (projectId, applicationData) => {
    return request(`/projects/${projectId}/applications`, {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  },

  getProjectApplications: async (projectId) => {
    return request(`/projects/${projectId}/applications`);
  },

  updateApplicationStatus: async (applicationId, status) => {
    return request(`/applications/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  getMyApplications: async () => {
    return request("/applications/me");
  },

  // ─── Q&A KNOWLEDGE EXCHANGE ────────────────────────────────
  getQuestions: async (search, department, tag) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (department) params.append("department", department);
    if (tag) params.append("tag", tag);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return request(`/questions${queryString}`);
  },

  getQuestionById: async (id) => {
    return request(`/questions/${id}`);
  },

  createQuestion: async (questionData) => {
    return request("/questions", {
      method: "POST",
      body: JSON.stringify(questionData),
    });
  },

  updateQuestion: async (id, questionData) => {
    return request(`/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(questionData),
    });
  },

  deleteQuestion: async (id) => {
    return request(`/questions/${id}`, {
      method: "DELETE",
    });
  },

  voteQuestion: async (id) => {
    return request(`/questions/${id}/vote`, {
      method: "POST",
    });
  },

  bookmarkQuestion: async (id) => {
    return request(`/questions/${id}/bookmark`, {
      method: "POST",
    });
  },

  submitAnswer: async (questionId, content, proofDetails) => {
    return request(`/questions/${questionId}/answers`, {
      method: "POST",
      body: JSON.stringify({ content, proofDetails }),
    });
  },

  voteAnswer: async (answerId) => {
    return request(`/questions/answers/${answerId}/vote`, {
      method: "POST",
    });
  },

  acceptAnswer: async (answerId) => {
    return request(`/questions/answers/${answerId}/accept`, {
      method: "PATCH",
    });
  },

  endorseAnswer: async (answerId) => {
    return request(`/questions/answers/${answerId}/endorse`, {
      method: "POST",
    });
  },

  // ─── FACULTY MENTORSHIP ────────────────────────────────────
  getMentorshipSlots: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.mentorId) query.append("mentorId", params.mentorId);
    if (params.status) query.append("status", params.status);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request(`/mentorship/slots${qs}`);
  },

  createMentorshipSlot: async (slotData) => {
    return request("/mentorship/slots", {
      method: "POST",
      body: JSON.stringify(slotData),
    });
  },

  bookMentorshipSlot: async (slotId, purpose) => {
    return request(`/mentorship/slots/${slotId}/book`, {
      method: "POST",
      body: JSON.stringify({ purpose }),
    });
  },

  getMyMentorshipBookings: async () => {
    return request("/mentorship/bookings");
  },

  updateMentorshipBookingStatus: async (bookingId, status) => {
    return request(`/mentorship/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // ─── NOTIFICATIONS ─────────────────────────────────────────
  getNotifications: async () => {
    return request("/notifications");
  },

  markNotificationRead: async (id) => {
    return request(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  markAllNotificationsRead: async () => {
    return request("/notifications/read-all", {
      method: "PATCH",
    });
  },

  // ─── COMMUNITIES ───────────────────────────────────────────
  getCommunities: async (search, category) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return request(`/communities${qs}`);
  },

  getCommunityById: async (id) => {
    return request(`/communities/${id}`);
  },

  createCommunity: async (communityData) => {
    return request("/communities", {
      method: "POST",
      body: JSON.stringify(communityData),
    });
  },

  joinCommunity: async (communityId) => {
    return request(`/communities/${communityId}/join`, {
      method: "POST",
    });
  },

  leaveCommunity: async (communityId) => {
    return request(`/communities/${communityId}/leave`, {
      method: "DELETE",
    });
  },

  // ─── MESSAGES & CHAT ───────────────────────────────────────
  getConversations: async () => {
    return request("/messages/conversations");
  },

  getMessages: async (conversationId) => {
    return request(`/messages/conversations/${conversationId}`);
  },

  sendMessage: async (messageData) => {
    return request("/messages/send", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  },

  // ─── MATCHING & RECOMMENDATIONS ────────────────────────────
  getRecommendedProjects: async () => {
    return request("/matching/projects");
  },

  getRecommendedPeers: async () => {
    return request("/matching/people");
  },

  getProjectCandidates: async (projectId) => {
    return request(`/matching/projects/${projectId}/candidates`);
  },

  // ─── AI ASSISTANT & RAG ────────────────────────────────────
  askAssistant: async (message) => {
    return request("/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  analyzeSkillGap: async (targetRole, currentSkills = []) => {
    return request("/ai/skill-gap", {
      method: "POST",
      body: JSON.stringify({ targetRole, currentSkills }),
    });
  },

  // ─── AUDIT OBSERVABILITY (ADMIN) ───────────────────────────
  getAuditLogs: async (params = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.append("page", params.page);
    if (params.limit) q.append("limit", params.limit);
    if (params.actorId) q.append("actorId", params.actorId);
    if (params.action) q.append("action", params.action);
    const qs = q.toString() ? `?${q.toString()}` : "";
    return request(`/admin/audit-logs${qs}`);
  },
};
