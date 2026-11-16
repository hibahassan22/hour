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
import {
  hourlyRate,
  monthlyHours,
  priceToHours,
  totalSavedHours,
  decisionsThisMonth,
  savedDecisions,
  weeklyDiscipline,
} from "@/lib/calc";
import { loadState, saveState } from "@/lib/storage";
import {
  DEFAULT_SETTINGS,
  type Decision,
  type DecisionCategory,
  type DecisionKind,
  type Settings,
} from "@/lib/types";
import { useAuth } from "./AuthContext";

interface AppContextValue {
  ready: boolean;
  settings: Settings;
  decisions: Decision[];
  rate: number;
  monthHours: number;
  monthSavedHours: number;
  monthSavedMoney: number;
  allSavedHours: number;
  discipline: number;
  updateSettings: (patch: Partial<Settings>) => void;
  addDecision: (input: {
    name: string;
    price: number;
    kind: DecisionKind;
    category?: DecisionCategory;
  }) => Decision;
  removeDecision: (id: string) => void;
  calcHours: (price: number) => number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const userId = user?.id ?? null;
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    if (!authReady) return;
    setReady(false);
    const state = loadState(userId);
    if (user?.name) {
      state.settings = { ...state.settings, userName: user.name };
    }
    setSettings(state.settings);
    setDecisions(state.decisions);
    setReady(true);
  }, [authReady, userId, user?.name]);

  useEffect(() => {
    if (!ready || !authReady) return;
    saveState({ settings, decisions }, userId);
  }, [ready, authReady, settings, decisions, userId]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const addDecision = useCallback(
    (input: {
      name: string;
      price: number;
      kind: DecisionKind;
      category?: DecisionCategory;
    }) => {
      const hours = priceToHours(input.price, settings);
      const decision: Decision = {
        id: crypto.randomUUID(),
        name: input.name.trim() || "سلعة بدون اسم",
        price: input.price,
        hours,
        kind: input.kind,
        category: input.category ?? "other",
        createdAt: new Date().toISOString(),
      };
      setDecisions((prev) => [decision, ...prev]);
      return decision;
    },
    [settings],
  );

  const removeDecision = useCallback((id: string) => {
    setDecisions((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const calcHours = useCallback(
    (price: number) => priceToHours(price, settings),
    [settings],
  );

  const value = useMemo<AppContextValue>(() => {
    const now = ready ? new Date() : new Date(0);
    const month = decisionsThisMonth(decisions, now);
    const monthSaved = savedDecisions(month);
    return {
      ready,
      settings,
      decisions,
      rate: hourlyRate(settings),
      monthHours: monthlyHours(settings),
      monthSavedHours: monthSaved.reduce((s, d) => s + d.hours, 0),
      monthSavedMoney: monthSaved.reduce((s, d) => s + d.price, 0),
      allSavedHours: totalSavedHours(decisions),
      discipline: weeklyDiscipline(decisions, now.getTime()),
      updateSettings,
      addDecision,
      removeDecision,
      calcHours,
    };
  }, [
    ready,
    settings,
    decisions,
    updateSettings,
    addDecision,
    removeDecision,
    calcHours,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
