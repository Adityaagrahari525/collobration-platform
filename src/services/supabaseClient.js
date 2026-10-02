import { createClient } from "@supabase/supabase-js";

const getEnvVar = (key) => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnvVar("VITE_SUPABASE_URL");
const supabaseAnonKey = getEnvVar("VITE_SUPABASE_ANON_KEY");

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl !== "https://your-supabase-project-id.supabase.co" &&
    supabaseUrl !== "your_supabase_project_url" &&
    supabaseAnonKey &&
    supabaseAnonKey !== "your-supabase-anon-key-here" &&
    supabaseAnonKey !== "your_supabase_anon_key"
);

if (!isSupabaseConfigured) {
  console.warn(
    "[CampusLink] Supabase credentials are not configured yet. The application is running in local fallback mode. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable live database persistence."
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder-campuslink.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-key"
);
