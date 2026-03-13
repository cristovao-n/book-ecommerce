"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Role = "admin" | "cliente";

type AuthContextValue = {
  role: Role;
  loginAsAdmin: () => void;
  logoutToClient: () => void;
};

const ROLE_STORAGE_KEY = "role";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("cliente");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (stored === "admin" || stored === "cliente") {
      setRole(stored);
    }
  }, []);

  const loginAsAdmin = useCallback(() => {
    setRole("admin");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ROLE_STORAGE_KEY, "admin");
    }
  }, []);

  const logoutToClient = useCallback(() => {
    setRole("cliente");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ROLE_STORAGE_KEY, "cliente");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, loginAsAdmin, logoutToClient }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

