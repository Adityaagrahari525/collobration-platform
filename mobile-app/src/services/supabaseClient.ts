import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase credentials matching the web application configuration
export const SUPABASE_URL = "https://vqhriwufmkxwyrilsqeq.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxaHJpd3VmbWt4d3lyaWxzcWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MzUwODcsImV4cCI6MjEwNjUxMTA4N30.KUdDmWbH5VT5gUfnmA443mYTwv07rkOMMqMob0PfX-w";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  !SUPABASE_URL.includes("placeholder") &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes("placeholder")
);

// Resilient universal storage provider for Mobile, Web, and Node environments
const memoryStore: Record<string, string> = {};
const universalStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      const val = await AsyncStorage.getItem(key);
      return val ?? memoryStore[key] ?? null;
    } catch {
      return memoryStore[key] ?? null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      memoryStore[key] = value;
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch {
      memoryStore[key] = value;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      delete memoryStore[key];
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch {
      delete memoryStore[key];
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: universalStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
