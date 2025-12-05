"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface GameUser {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  level?: number | null;
  xp?: number | null;
}

interface AuthContextType {
  user: GameUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<GameUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getSessionUser = async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  };

  const refreshUser = async () => {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      setUser(null);
      if (typeof window !== "undefined") localStorage.removeItem("gs_user");
      return;
    }

    const cleaned: GameUser = {
      ...sessionUser,
      avatar: sessionUser.avatar || null,
      level: sessionUser.level || null,
      xp: sessionUser.xp || null,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("gs_user", JSON.stringify(cleaned));
    }

    setUser(cleaned);
  };

  useEffect(() => {
    const init = async () => {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("gs_user") : null;

      if (stored) setUser(JSON.parse(stored));
      await refreshUser();
      setIsLoading(false);
    };

    init();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid username or password");
        return false;
      }

      const cleaned: GameUser = {
        ...data.user,
        avatar: data.user.avatar || null,
        level: data.user.level || null,
        xp: data.user.xp || null,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("gs_user", JSON.stringify(cleaned));
      }

      setUser(cleaned);
      return true;
    } catch {
      toast.error("Failed to sign in");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}

    if (typeof window !== "undefined") {
      localStorage.removeItem("gs_user");
    }

    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshUser,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
