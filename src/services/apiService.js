const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

let isRefreshing = false;

async function request(endpoint, options = {}, isRetry = false) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
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
          throw new Error("Session expired. Please sign in again.");
        }
      }
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const apiService = {
  // Institutions
  getInstitutions: async (search) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request(`/institutions${query}`);
  },

  getInstitutionById: async (id) => {
    return request(`/institutions/${id}`);
  },

  // Auth
  register: async (registerData) => {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(registerData),
    });
  },

  login: async (email, password) => {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return request("/auth/me");
  },

  logout: async () => {
    try {
      await request("/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore network errors on logout
    }
  },

  refresh: async () => {
    return request("/auth/refresh", { method: "POST" });
  },

  // User Profile & Account Management
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

  // Skills
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

  // Directory / People
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

  // Questions & Answers Q&A
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

  submitAnswer: async (questionId, content, proofDetails) => {
    return request(`/questions/${questionId}/answers`, {
      method: "POST",
      body: JSON.stringify({ content, proofDetails }),
    });
  },

  updateAnswer: async (answerId, content) => {
    return request(`/questions/answers/${answerId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },

  deleteAnswer: async (answerId) => {
    return request(`/questions/answers/${answerId}`, {
      method: "DELETE",
    });
  },

  acceptAnswer: async (answerId) => {
    return request(`/questions/answers/${answerId}/accept`, {
      method: "PATCH",
    });
  },

  // Projects Workspace
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
};
