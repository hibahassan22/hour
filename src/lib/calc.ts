import type { Decision, Settings } from "./types";

/** ساعات العمل الشهرية من الإعدادات */
export function monthlyHours(settings: Settings): number {
  const weeks = settings.daysPerMonth / 5;
  return Math.max(settings.hoursPerWeek * weeks, 1);
}

/** قيمة الساعة الصافية */
export function hourlyRate(settings: Settings): number {
  const net = Math.max(settings.monthlyIncome - settings.extraCosts, 0);
  return net / monthlyHours(settings);
}

export function priceToHours(price: number, settings: Settings): number {
  const rate = hourlyRate(settings);
  if (rate <= 0) return 0;
  return price / rate;
}

export function hoursToWorkDays(hours: number, hoursPerDay = 8): number {
  return hours / hoursPerDay;
}

export function minutesPerCurrency(settings: Settings): number {
  const rate = hourlyRate(settings);
  if (rate <= 0) return 0;
  return 60 / rate;
}

export function percentOfMonthly(hours: number, settings: Settings): number {
  return (hours / monthlyHours(settings)) * 100;
}

export function formatMoney(amount: number, currency: string): string {
  const n = amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  // الجنيه والرموز العربية تظهر بعد الرقم
  if (currency === "$" || currency === "€" || currency === "£") {
    return `${currency}${n}`;
  }
  return `${n} ${currency}`;
}

export function formatHours(hours: number): string {
  return hours.toLocaleString("en-US", {
    minimumFractionDigits: hours % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

export function savedDecisions(decisions: Decision[]): Decision[] {
  return decisions.filter((d) => d.kind === "saved");
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

export function decisionsThisMonth(
  decisions: Decision[],
  now: Date = new Date(0),
): Decision[] {
  const key = monthKey(now);
  return decisions.filter((d) => {
    const dt = new Date(d.createdAt);
    return monthKey(dt) === key;
  });
}

export function totalSavedHours(decisions: Decision[]): number {
  return savedDecisions(decisions).reduce((sum, d) => sum + d.hours, 0);
}

export function totalSavedMoney(decisions: Decision[]): number {
  return savedDecisions(decisions).reduce((sum, d) => sum + d.price, 0);
}

export function weeklyDiscipline(decisions: Decision[], nowMs = 0): number {
  const weekAgo = nowMs - 7 * 24 * 60 * 60 * 1000;
  const recent = decisions.filter((d) => new Date(d.createdAt).getTime() >= weekAgo);
  if (recent.length === 0) return 0;
  const saved = recent.filter((d) => d.kind === "saved").length;
  return Math.round((saved / recent.length) * 100);
}

/** بدائل تقريبية لما يشتريه نفس المبلغ */
export function alternativesFor(price: number) {
  return [
    {
      id: "rent",
      title: "إيجار سكن",
      detail: `${(price / 800).toFixed(1)} شهر إيجار استوديو`,
      icon: "home" as const,
    },
    {
      id: "food",
      title: "مشتريات منزل",
      detail: `${(price / 400).toFixed(1)} شهر بقالة عائلية`,
      icon: "utensils" as const,
    },
    {
      id: "travel",
      title: "سفر عائلي",
      detail: price >= 2000 ? "رحلة قصيرة للعائلة" : "يوم ترفيه عائلي",
      icon: "plane" as const,
    },
    {
      id: "buffer",
      title: "صندوق طوارئ",
      detail: `${(price / 2000).toFixed(1)} شهر حرية مالية`,
      icon: "shield" as const,
    },
  ];
}
