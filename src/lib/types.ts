export type DecisionKind = "saved" | "bought";

export type DecisionCategory =
  | "fashion"
  | "electronics"
  | "food"
  | "travel"
  | "other";

export interface Settings {
  monthlyIncome: number;
  hoursPerWeek: number;
  daysPerMonth: number;
  extraCosts: number;
  currency: string;
  monthlyGoalHours: number;
  userName: string;
}

export interface Decision {
  id: string;
  name: string;
  price: number;
  hours: number;
  kind: DecisionKind;
  category: DecisionCategory;
  createdAt: string;
}

export interface AppState {
  settings: Settings;
  decisions: Decision[];
}

export const DEFAULT_SETTINGS: Settings = {
  monthlyIncome: 4000,
  hoursPerWeek: 40,
  daysPerMonth: 20,
  extraCosts: 200,
  currency: "ج.م",
  monthlyGoalHours: 80,
  userName: "أحمد",
};

export const QUICK_ITEMS = [
  { name: "قهوة وغداء", price: 25, category: "food" as const },
  { name: "حذاء خفيف", price: 100, category: "fashion" as const },
  { name: "سماعة فاخرة", price: 400, category: "electronics" as const },
  { name: "هاتف جديد", price: 1200, category: "electronics" as const },
  { name: "رحلة ترفيهية", price: 3500, category: "travel" as const },
];

export const CATEGORY_LABELS: Record<DecisionCategory, string> = {
  fashion: "أزياء وملابس",
  electronics: "إلكترونيات",
  food: "مطاعم وكافيهات",
  travel: "سفر وترفيه",
  other: "أخرى",
};
