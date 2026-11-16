import { DEFAULT_SETTINGS, type AppState, type Decision, type Settings } from "./types";

const BASE = "cost-in-hours-v2";

function keyFor(userId?: string | null) {
  return userId ? `${BASE}:${userId}` : `${BASE}:guest`;
}

export function loadState(userId?: string | null): AppState {
  if (typeof window === "undefined") {
    return { settings: DEFAULT_SETTINGS, decisions: [] };
  }
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) {
      const seeded: AppState = {
        settings: DEFAULT_SETTINGS,
        decisions: userId ? seedDecisions() : [],
      };
      localStorage.setItem(keyFor(userId), JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
    if (settings.currency === "$") settings.currency = "ج.م";
    return {
      settings,
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
    };
  } catch {
    return { settings: DEFAULT_SETTINGS, decisions: [] };
  }
}

export function saveState(state: AppState, userId?: string | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(keyFor(userId), JSON.stringify(state));
}

export function saveSettings(settings: Settings, decisions: Decision[], userId?: string | null) {
  saveState({ settings, decisions }, userId);
}

function seedDecisions(): Decision[] {
  const now = Date.now();
  return [
    {
      id: "seed-1",
      name: "عشاء مطعم فاخر",
      price: 180,
      hours: 7.5,
      kind: "saved",
      category: "food",
      createdAt: new Date(now - 2 * 86400000).toISOString(),
    },
    {
      id: "seed-2",
      name: "شاشة كمبيوتر للعمل",
      price: 350,
      hours: 14.7,
      kind: "bought",
      category: "electronics",
      createdAt: new Date(now - 4 * 86400000).toISOString(),
    },
    {
      id: "seed-3",
      name: "حقيبة جلد ماركة",
      price: 850,
      hours: 35.7,
      kind: "saved",
      category: "fashion",
      createdAt: new Date(now - 6 * 86400000).toISOString(),
    },
  ];
}
