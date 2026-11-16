"use client";

import Link from "next/link";
import {
  Award,
  Brain,
  Clock3,
  Laptop,
  Shirt,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatHours,
  formatMoney,
  hoursToWorkDays,
  savedDecisions,
  decisionsThisMonth,
} from "@/lib/calc";
import { CATEGORY_LABELS, type DecisionCategory } from "@/lib/types";
import { useApp } from "@/context/AppContext";

const CAT_META: Record<
  DecisionCategory,
  { icon: typeof Shirt; hint: string }
> = {
  fashion: { icon: Shirt, hint: "تجنّب مشتريات موسمية غير ضرورية" },
  electronics: { icon: Laptop, hint: "تأجيل أجهزة ترفيهية" },
  food: { icon: UtensilsCrossed, hint: "تقليل خروج فاخر" },
  travel: { icon: Clock3, hint: "إعادة ترتيب خطط السفر" },
  other: { icon: Award, hint: "قرارات متنوعة واعية" },
};

export function ChallengeView() {
  const {
    settings,
    decisions,
    monthSavedHours,
    monthSavedMoney,
    rate,
  } = useApp();

  const [now, setNow] = useState(() => new Date(0));
  useEffect(() => {
    setNow(new Date());
  }, []);
  const month = decisionsThisMonth(decisions, now);
  const saved = savedDecisions(month);
  const goal = settings.monthlyGoalHours;
  const progress = Math.min((monthSavedHours / Math.max(goal, 1)) * 100, 100);
  const remaining = Math.max(goal - monthSavedHours, 0);
  const vacationDays = hoursToWorkDays(monthSavedHours);

  const byCat = (Object.keys(CATEGORY_LABELS) as DecisionCategory[])
    .map((cat) => {
      const items = saved.filter((d) => d.category === cat);
      const hours = items.reduce((s, d) => s + d.hours, 0);
      return { cat, hours, share: monthSavedHours > 0 ? (hours / monthSavedHours) * 100 : 0 };
    })
    .filter((c) => c.hours > 0)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 3);

  const badges = [
    {
      title: "سيّد الوقت",
      desc: "ثبات أسبوعي في التراجع الواعي",
      pct: Math.min(progress, 100),
      done: progress >= 50,
      icon: Clock3,
    },
    {
      title: "حارس الساعات",
      desc: "توفير أسبوع عمل كامل (40 ساعة)",
      pct: Math.min((monthSavedHours / 40) * 100, 100),
      done: monthSavedHours >= 40,
      icon: Award,
    },
    {
      title: "مفكر عميق",
      desc: "استخدام قاعدة الانتظار قبل الشراء",
      pct: saved.length >= 3 ? 100 : (saved.length / 3) * 100,
      done: saved.length >= 3,
      icon: Brain,
    },
  ];

  return (
    <div className="space-y-5">
      <section className="animate-fade-up flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(197,160,40,0.28)] bg-gradient-to-l from-[#fff8f4] to-[#ffe08b]/40 px-5 py-4 shadow-[0_10px_28px_-20px_rgba(116,91,0,0.3)]">
        <div>
          <p className="font-semibold text-[#1e1b18]">
            مبروك {settings.userName}! وفّرت {formatHours(monthSavedHours)} ساعة راحة هذا
            الشهر بتجنّب الشراء الاندفاعي.
          </p>
          <p className="mt-1 text-[13px] text-[#4d4635]">
            كل ساعة محفوظة = ساعة تعيشها بحرّيتك.
          </p>
        </div>
        <button type="button" className="btn-secondary shrink-0">
          مشاركة الإنجاز
        </button>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="card animate-fade-up-delay-1 space-y-1 p-5 md:p-6">
          <h1 className="text-[17px] font-semibold text-[#1e1b18]">تحدي الوعي الشهري بالوقت</h1>
          <div className="mt-5 flex flex-wrap items-center gap-8">
            <Ring value={progress} label={`${Math.round(progress)}%`} />
            <div>
              <p className="stat-value text-[#745b00]">{formatHours(monthSavedHours)}</p>
              <p className="text-[13px] text-[#4d4635]">ساعة حرية محفوظة</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                <div className="hover-lift rounded-xl bg-[#faf2ed] px-3 py-2.5">
                  <p className="text-[11px] text-[#7f7663]">المتبقي للهدف</p>
                  <p className="font-semibold tabular-nums text-[#1e1b18]">
                    {formatHours(remaining)} س
                  </p>
                </div>
                <div className="hover-lift rounded-xl bg-[#faf2ed] px-3 py-2.5">
                  <p className="text-[11px] text-[#7f7663]">عدد القرارات</p>
                  <p className="font-semibold tabular-nums text-[#1e1b18]">{month.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4">
          <section className="card-elevated animate-fade-up-delay-2 p-5">
            <p className="text-[13px] text-[#4d4635]">إجمالي المبلغ المتجنَّب</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[#745b00]">
              {formatMoney(monthSavedMoney, settings.currency)}
            </p>
            <p className="mt-2 text-[13px] text-[#4d4635]">بعيداً عن فخ الشراء العاطفي.</p>
          </section>
          <section className="card hover-lift p-5">
            <p className="text-[13px] text-[#4d4635]">ترجمة الوقت</p>
            <p className="mt-1 text-2xl font-semibold text-[#1e1b18]">
              {formatHours(vacationDays)} يوم إجازة مدفوعة
            </p>
            <p className="mt-2 text-[13px] text-[#4d4635]">
              بقيمة ساعة ≈ {formatMoney(rate, settings.currency)}
            </p>
          </section>
        </div>
      </div>

      <section className="animate-fade-up">
        <h2 className="mb-3 text-[16px] font-semibold text-[#1e1b18]">
          توزيع الساعات الموفَّرة حسب الفئة
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {byCat.length === 0 && (
            <p className="text-[13px] text-[#4d4635] md:col-span-3">
              سجّل تراجعات من الحاسبة لتظهر الفئات هنا.
            </p>
          )}
          {byCat.map(({ cat, hours, share }) => {
            const Meta = CAT_META[cat];
            const Icon = Meta.icon;
            return (
              <article key={cat} className="card hover-lift p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-[#ffe08b]/45 p-2 text-[#745b00]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-semibold text-[#1e1b18]">{CATEGORY_LABELS[cat]}</h3>
                </div>
                <p className="mt-3 text-2xl font-semibold tabular-nums text-[#1e1b18]">
                  {formatHours(hours)}{" "}
                  <span className="text-[13px] font-medium text-[#4d4635]">ساعة</span>
                </p>
                <div className="progress-track mt-2 !h-1.5">
                  <div className="progress-fill" style={{ width: `${share}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-[#7f7663]">
                  {share.toFixed(0)}% من الإجمالي · {Meta.hint}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card overflow-hidden hover-lift">
        <div className="grid md:grid-cols-2">
          <div
            className="min-h-[160px] bg-cover bg-center transition duration-500 hover:scale-[1.02]"
            style={{
              backgroundImage:
                "linear-gradient(135deg,rgba(30,27,24,.55),rgba(30,27,24,.2)), url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80')",
            }}
          />
          <div
            className="flex min-h-[160px] items-end bg-cover bg-center p-5"
            style={{
              backgroundImage:
                "linear-gradient(135deg,rgba(30,27,24,.5),rgba(30,27,24,.15)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80')",
            }}
          >
            <p className="text-lg font-semibold text-white drop-shadow">
              كل ساعة توفّرها هي ساعة تعيشها بحرّية كاملة.
            </p>
          </div>
        </div>
      </section>

      <section className="animate-fade-up">
        <h2 className="mb-3 text-[16px] font-semibold text-[#1e1b18]">شارات حرية الوقت</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <article
                key={b.title}
                className="card hover-lift flex flex-col items-center p-5 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#fed65b] to-[#c5a028] text-[#493800] shadow-[0_0_20px_rgba(197,160,40,0.35)] transition hover:scale-105">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-3 font-semibold text-[#1e1b18]">{b.title}</h3>
                <p className="mt-1 text-[12px] text-[#4d4635]">{b.desc}</p>
                <p className="mt-3 text-[13px] font-semibold tabular-nums text-[#745b00]">
                  {Math.round(b.pct)}%
                </p>
                <span
                  className={`mt-2 rounded-full px-3 py-1 text-[11px] font-medium ${
                    b.done
                      ? "bg-[rgba(0,150,104,0.12)] text-[#009668]"
                      : "bg-[#faf2ed] text-[#4d4635]"
                  }`}
                >
                  {b.done ? "مفعّلة" : "قيد التقدم"}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <blockquote className="rounded-2xl bg-[#faf2ed] px-6 py-5 text-center text-[14px] text-[#4d4635]">
        الوقت هو العملة الحقيقية لحياتك — عندما تنفق مالاً، فأنت تنفق ساعات لن تعود.
      </blockquote>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(197,160,40,0.3)] bg-white/90 px-5 py-4 shadow-[0_10px_28px_-20px_rgba(116,91,0,0.25)]">
        <p className="text-[14px] text-[#1e1b18]">هل تراجعت مؤخراً عن شراء؟</p>
        <Link href="/" className="btn-primary">
          تسجيل تراجع جديد
        </Link>
      </div>
    </div>
  );
}

function Ring({ value, label }: { value: number; label: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(value, 100) / 100) * c;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#EEE7E1" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="#C5A028"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums text-[#1e1b18]">
        {label}
      </span>
    </div>
  );
}
