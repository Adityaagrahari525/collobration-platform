import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { dbService } from "../services/dbService";
import { storage } from "../services/storage";
import { INITIAL_USERS } from "../services/mockData";
import { calculateUpdatedStreak, checkBadges } from "../utils/userStats";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<User> & { password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  switchDemoUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const cached = await storage.getAuthUser<User>();
        if (cached) {
          // Calculate streak
          const { streak, updated } = calculateUpdatedStreak(cached.lastActiveDate, cached.currentStreak);
          const updatedUser = {
            ...cached,
            currentStreak: streak,
            lastActiveDate: new Date().toISOString(),
            badges: checkBadges(cached),
          };
          setUser(updatedUser);
          if (updated) {
            await storage.setAuthUser(updatedUser);
          }
        } else {
          // Default to first scholar (Aditya Sharma) for immediate out-of-the-box demo experience
          const defaultScholar = INITIAL_USERS[0];
          setUser(defaultScholar);
          await storage.setAuthUser(defaultScholar);
        }
      } catch (e) {
        console.warn("Error restoring auth session:", e);
        setUser(INITIAL_USERS[0]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await dbService.login(email, password);
      if (res && res.user) {
        const userWithBadges = {
          ...res.user,
          badges: checkBadges(res.user),
        };
        setUser(userWithBadges);
        await storage.setAuthUser(userWithBadges);
        return { success: true };
      }
      return { success: false, error: "Invalid credentials." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Login failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<User> & { password?: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await dbService.register(data);
      if (res && res.user) {
        const userWithBadges = {
          ...res.user,
          badges: checkBadges(res.user),
        };
        setUser(userWithBadges);
        await storage.setAuthUser(userWithBadges);
        return { success: true };
      }
      return { success: false, error: "Registration failed." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Registration failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await storage.removeAuthUser();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<User>): Promise<void> => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...updatedData,
      badges: checkBadges({ ...user, ...updatedData }),
    };
    setUser(updatedUser);
    await storage.setAuthUser(updatedUser);
  };

  const switchDemoUser = async (userId: string): Promise<void> => {
    const target = INITIAL_USERS.find((u) => u.id === userId);
    if (target) {
      const targetWithBadges = {
        ...target,
        badges: checkBadges(target),
      };
      setUser(targetWithBadges);
      await storage.setAuthUser(targetWithBadges);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
