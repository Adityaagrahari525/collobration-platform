/**
 * Local Secure & Preference Storage Helper using AsyncStorage with in-memory fallback
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const memoryStore: Record<string, string> = {};

const KEYS = {
  AUTH_USER: "@campuslink_auth_user",
  AUTH_TOKEN: "@campuslink_auth_token",
  THEME_MODE: "@campuslink_theme_mode",
  SAVED_QUESTIONS: "@campuslink_saved_questions",
  CACHED_QUESTIONS: "@campuslink_cached_questions",
  CACHED_PROJECTS: "@campuslink_cached_projects",
};

export const storage = {
  // Auth Session
  getAuthUser: async <T>(): Promise<T | null> => {
    try {
      const data = (await AsyncStorage.getItem(KEYS.AUTH_USER)) || memoryStore[KEYS.AUTH_USER];
      return data ? JSON.parse(data) : null;
    } catch {
      const fallback = memoryStore[KEYS.AUTH_USER];
      return fallback ? JSON.parse(fallback) : null;
    }
  },

  setAuthUser: async <T>(user: T): Promise<void> => {
    const val = JSON.stringify(user);
    memoryStore[KEYS.AUTH_USER] = val;
    try {
      await AsyncStorage.setItem(KEYS.AUTH_USER, val);
    } catch (e) {
      // Memory store already set
    }
  },

  removeAuthUser: async (): Promise<void> => {
    delete memoryStore[KEYS.AUTH_USER];
    delete memoryStore[KEYS.AUTH_TOKEN];
    try {
      await AsyncStorage.removeItem(KEYS.AUTH_USER);
      await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    } catch (e) {
      // Ignored
    }
  },

  // Saved / Bookmarked items
  getSavedQuestionIds: async (): Promise<string[]> => {
    try {
      const data = (await AsyncStorage.getItem(KEYS.SAVED_QUESTIONS)) || memoryStore[KEYS.SAVED_QUESTIONS];
      return data ? JSON.parse(data) : [];
    } catch {
      const fallback = memoryStore[KEYS.SAVED_QUESTIONS];
      return fallback ? JSON.parse(fallback) : [];
    }
  },

  toggleSavedQuestionId: async (id: string): Promise<boolean> => {
    try {
      const ids = await storage.getSavedQuestionIds();
      const exists = ids.includes(id);
      const newIds = exists ? ids.filter((i) => i !== id) : [...ids, id];
      const val = JSON.stringify(newIds);
      memoryStore[KEYS.SAVED_QUESTIONS] = val;
      await AsyncStorage.setItem(KEYS.SAVED_QUESTIONS, val).catch(() => {});
      return !exists;
    } catch {
      return false;
    }
  },

  // Generic key-value helpers
  setItem: async (key: string, value: any): Promise<void> => {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    memoryStore[key] = str;
    try {
      await AsyncStorage.setItem(key, str);
    } catch (e) {
      // Ignored
    }
  },

  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const val = (await AsyncStorage.getItem(key)) || memoryStore[key];
      if (!val) return null;
      try {
        return JSON.parse(val) as T;
      } catch {
        return val as unknown as T;
      }
    } catch {
      const fallback = memoryStore[key];
      if (!fallback) return null;
      try {
        return JSON.parse(fallback) as T;
      } catch {
        return fallback as unknown as T;
      }
    }
  },
};
