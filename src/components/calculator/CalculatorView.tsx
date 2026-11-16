"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  formatHours,
  formatMoney,
  hoursToWorkDays,
  minutesPerCurrency,
  percentOfMonthly,
} from "@/lib/calc";
import { QUICK_ITEMS, type DecisionCategory } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

export function CalculatorView() {
  const router = useRouter();
  const { user } = useAuth();
  const { settings, rate, monthHours, calcHours, addDecision, decisions, updateSettings } =
    useApp();
  const [name, setName] = useState("حذاء رياضي مخصص");
  const [price, setPrice] = useState(400);
  const [category, setCategory] = useState<DecisionCategory>("fashion");
  const [flash, setFlash] = useState<string | null>(null);
  const [bump, setBump] = useState(0);

  const hours = calcHours(price);
  const days = hoursToWorkDays(hours);
  const pct = percentOfMonthly(hours, settings);
  const mpm = minutesPerCurrency(settings);
  const hoursLabel = formatHours(hours);

  const recent = useMemo(() => decisions.slice(0, 3), [decisions]);
  const [nowMs, setNowMs] = useState(0);
  useEffect(() => setNowMs(Date.now()), []);
  const weekSaved = useMemo(
    () =>
      decisions
        .filter((d) => d.kind === "saved")
        .filter((d) => nowMs - new Date(d.createdAt).getTime() < 7 * 86400000)
        .reduce((s, d) => s + d.hours, 0),
    [decisions, nowMs],
  );

  useEffect(() => {
    setBump((n) => n + 1);
  }, [price, name]);

  function pickQuick(item: (typeof QUICK_ITEMS)[number]) {
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
  }

  function decide(kind: "saved" | "bought") {
    if (!user) {
      router.push("/login");
      return;
    }
    addDecision({ name, price, kind, category });
    setFlash(
      kind === "saved"
        ? `تم التراجع — وفّرت ${hoursLabel} ساعة`
        : `تم تسجيل الشراء — ${hoursLabel} ساعة`,
    );
    setTimeout(() => setFlash(null), 2500);
  }

  return (
    <div className="space-y-5">
      {!user && (
        <div className="glass-banner animate-fade-up flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3.5">
          <p className="text-[14px] text-[#524a39]">لحفظ قراراتك سجّل حساباً.</p>
          <div className="flex gap-2">
            <Link href="/login" className="btn-secondary !py-2">
              دخول
            </Link>
            <Link href="/register" className="btn-primary !py-2">
              إنشاء حساب
            </Link>
          </div>
        </div>
      )}

      {flash && (
        <div className="animate-pop rounded-2xl border border-[#d4a017]/50 bg-gradient-to-l from-[#ffe59a]/70 to-[#ffd45e]/45 px-4 py-3 text-[14px] font-semibold text-[#3f2f00]">
          {flash}
        </div>
      )}

      <div className="glass-banner animate-fade-up flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="icon-glow animate-float flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4a017] to-[#ffd45e] text-[#3f2f00]">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hourglass_top
            </span>
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[#1c1916]">أهلاً بك، قبل أن تشتري...</p>
            <p className="text-[13px] text-[#524a39]">المال اقتطاع مباشر من وقت حياتك.</p>
          </div>
        </div>
        <p className="rounded-full bg-white/80 px-3.5 py-1.5 text-[12px] text-[#524a39] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffe59a]/55">
          ساعتك:{" "}
          <strong className="text-[#6f5600]">{formatMoney(rate, settings.currency)}</strong>
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <section className="card animate-fade-up-delay-1 space-y-4 p-5 lg:col-span-7 lg:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffe59a]/45 text-[#d4a017]">
                <span className="material-symbols-outlined text-[20px]">calculate</span>
              </span>
              <h1 className="text-[17px] font-semibold text-[#1c1916]">حساب تكلفة السلعة</h1>
            </div>
            <span className="rounded-full bg-gradient-to-l from-[#ffe59a]/60 to-[#ffd45e]/35 px-2.5 py-1 text-[11px] font-semibold text-[#6f5600]">
              تحديث فوري
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="label">اسم السلعة</span>
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: حذاء رياضي"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="label">السعر</span>
              <div className="money-wrap">
                <input
                  className="font-semibold tabular-nums"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                />
                <select
                  className="money-badge cursor-pointer border-0 outline-none transition hover:brightness-105"
                  value={settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value })}
                >
                  <option value="ج.م">ج.م</option>
                  <option value="$">$</option>
                  <option value="ر.س">ر.س</option>
                  <option value="د.إ">د.إ</option>
                </select>
              </div>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_ITEMS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => pickQuick(item)}
                className={name === item.name ? "chip chip-active" : "chip"}
              >
                {item.name} · {item.price}
              </button>
            ))}
          </div>

          <p className="rounded-xl bg-gradient-to-l from-[#faf3ec] to-[#ffe59a]/25 px-3 py-2.5 text-[12px] leading-relaxed text-[#524a39]">
            دخل {formatMoney(settings.monthlyIncome, settings.currency)} ·{" "}
            {settings.hoursPerWeek} س/أسبوع · قيمة الساعة{" "}
            <strong className="text-[#6f5600]">{formatMoney(rate, settings.currency)}</strong> (
            {formatHours(monthHours)} س/شهر)
          </p>

          <div className="border-t border-[#ede6df] pt-4">
            <p className="mb-3 text-[15px] font-semibold text-[#1c1916]">
              هل «{name || "المنتج"}» يستحق {hoursLabel} ساعة من عمرك؟
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => decide("saved")}
                className="hover-lift hover-glow rounded-2xl bg-gradient-to-l from-[#d4a017] to-[#ffd45e] p-4 text-right"
              >
                <p className="text-[14px] font-bold text-[#3f2f00]">تراجعت ووفّرت</p>
                <p className="mt-1 text-[12px] text-[#3f2f00]/85">+{hoursLabel} ساعة حرّة</p>
              </button>
              <button
                type="button"
                onClick={() => decide("bought")}
                className="hover-lift rounded-2xl border border-[#e8e0d9] bg-[#faf3ec] p-4 text-right hover:border-[rgba(212,160,23,0.45)] hover:bg-[#fff9f3]"
              >
                <p className="text-[14px] font-semibold text-[#1c1916]">اشتريت بوعي</p>
                <p className="mt-1 text-[12px] text-[#524a39]">تسجيل الشراء بالساعات</p>
              </button>
            </div>
          </div>
        </section>

        <section className="card-elevated animate-fade-up-delay-2 space-y-4 p-5 lg:col-span-5 lg:p-6">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold tracking-wide text-[#6f5600]">
              النتيجة الحقيقية
            </p>
            <span className="material-symbols-outlined animate-float text-[18px] text-[#d4a017]">
              timelapse
            </span>
          </div>

          <div key={bump} className="animate-pop">
            <p className="text-[13px] text-[#524a39]">تكلفة {name || "السلعة"} تعادل</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="bg-gradient-to-l from-[#6f5600] to-[#d4a017] bg-clip-text text-[44px] font-bold leading-none tabular-nums text-transparent">
                {hoursLabel}
              </span>
              <span className="text-[18px] font-medium text-[#1c1916]">ساعة عمل</span>
            </p>
            <p className="mt-3 rounded-xl bg-[#faf3ec] px-3 py-2.5 text-[13px] text-[#524a39]">
              تعادل <strong className="text-[#1c1916]">{formatHours(days)}</strong> يوم عمل كامل.
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex justify-between text-[12px] text-[#524a39]">
              <span>من ساعات الشهر</span>
              <span className="font-semibold tabular-nums text-[#6f5600]">{pct.toFixed(1)}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(Math.max(pct, 3), 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="hover-lift rounded-xl bg-[#faf3ec] px-3 py-3">
              <p className="text-[11px] text-[#7a7160]">دقيقة / وحدة</p>
              <p className="text-[17px] font-bold tabular-nums text-[#1c1916]">{mpm.toFixed(1)}</p>
            </div>
            <div className="hover-lift rounded-xl bg-[#faf3ec] px-3 py-3">
              <p className="text-[11px] text-[#7a7160]">أيام عمل</p>
              <p className="text-[17px] font-bold tabular-nums text-[#1c1916]">
                {formatHours(days)}
              </p>
            </div>
          </div>

          <p className="border-t border-[#ede6df] pt-3 text-[13px] text-[#524a39]">
            هل المقايضة عادلة؟ أنت تتبادل وقتاً من عمرك.
          </p>

          <div className="rounded-2xl bg-gradient-to-br from-[#1c1916] to-[#2d261f] px-4 py-3.5 text-center text-white transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(28,25,22,0.55)]">
            <p className="text-[11px] text-white/50">ودجت سريع</p>
            <p className="mt-1 text-[15px] font-semibold tabular-nums">
              {formatMoney(price, settings.currency)} ={" "}
              <span className="text-[#ffd45e]">{hoursLabel} ساعة</span>
            </p>
          </div>
        </section>
      </div>

      <section className="card animate-fade-up-delay-3 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-[#1c1916]">آخر القرارات</h2>
          <span className="rounded-full bg-[#d4a017]/15 px-2.5 py-1 text-[12px] font-semibold text-[#6f5600]">
            +{formatHours(weekSaved)} س هذا الأسبوع
          </span>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {recent.map((d, i) => (
            <div
              key={d.id}
              className="hover-lift flex items-center justify-between gap-2 rounded-xl bg-[#faf3ec] px-3 py-2.5"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-[#1c1916]">
                  {d.kind === "saved" ? "تراجع ·" : "شراء ·"} {d.name}
                </p>
                <p className="text-[11px] text-[#7a7160]">
                  {formatMoney(d.price, settings.currency)}
                </p>
              </div>
              <span
                className={`shrink-0 text-[13px] font-bold tabular-nums ${
                  d.kind === "saved" ? "text-[#6f5600]" : "text-[#524a39]"
                }`}
              >
                {d.kind === "saved" ? "+" : "−"}
                {formatHours(d.hours)}
              </span>
            </div>
          ))}
          {recent.length === 0 && (
            <p className="text-[13px] text-[#524a39] md:col-span-3">لا قرارات بعد.</p>
          )}
        </div>
      </section>
    </div>
  );
}
