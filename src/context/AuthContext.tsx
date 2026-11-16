"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type PublicUser = Omit<User, "password">;

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: PublicUser | null;
  ready: boolean;
  register: (input: {
    name: string;
    email: string;
    password: string;
  }) => AuthResult;
  login: (input: { email: string; password: string }) => AuthResult;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "cost-in-hours-users";
const SESSION_KEY = "cost-in-hours-session";

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toPublic(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const found = readUsers().find((item) => item.id === sessionId);
        if (found) setUser(toPublic(found));
      }
    } finally {
      setReady(true);
    }
  }, []);

  const register = useCallback(
    (input: { name: string; email: string; password: string }): AuthResult => {
      const users = readUsers();
      const email = input.email.trim().toLowerCase();
      const name = input.name.trim();

      if (!name) return { ok: false, error: "اكتب اسمك." };
      if (!email.includes("@")) return { ok: false, error: "البريد غير صحيح." };
      if (users.some((item) => item.email === email)) {
        return { ok: false, error: "البريد مسجّل مسبقاً." };
      }
      if (input.password.length < 6) {
        return { ok: false, error: "كلمة المرور 6 أحرف على الأقل." };
      }

      const newUser: User = {
        id: `USR-${Date.now().toString(36).toUpperCase()}`,
        name,
        email,
        password: input.password,
      };

      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      localStorage.setItem(SESSION_KEY, newUser.id);
      setUser(toPublic(newUser));
      return { ok: true };
    },
    [],
  );

  const login = useCallback((input: { email: string; password: string }): AuthResult => {
    const users = readUsers();
    const email = input.email.trim().toLowerCase();
    const found = users.find(
      (item) => item.email === email && item.password === input.password,
    );
    if (!found) return { ok: false, error: "البريد أو كلمة المرور غير صحيحة." };
    localStorage.setItem(SESSION_KEY, found.id);
    setUser(toPublic(found));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, register, login, logout }),
    [user, ready, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
