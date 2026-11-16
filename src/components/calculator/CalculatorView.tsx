"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Calculator, Hourglass } from "lucide-react";
import {
  formatHours,
  formatMoney,
  hoursToWorkDays,
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
    <div className="space-y-4">
      {flash && (
        <div className="glass-panel animate-pop px-4 py-3 text-[13px] font-medium text-[#1c1916]">
          {flash}
        </div>
      )}

      <div className="glass-panel animate-fade-up flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-white">
            <Hourglass className="h-4 w-4" strokeWidth={2.3} />
          </span>
          <div>
            <p className="text-[14px] font-semibold text-[#1c1916]">قبل ما تشتري</p>
            <p className="text-[12px] text-[#737373]">
              {user
                ? "حوّل السعر لساعات من وقتك."
                : "سجّل حساباً لحفظ قراراتك وحساب الساعات."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <p className="rounded-full border border-[#e8e0d4] bg-white/80 px-3 py-1.5 text-[12px] text-[#524a39]">
            ساعتك{" "}
            <strong className="tabular-nums text-[#1c1916]">
              {formatMoney(rate, settings.currency)}
            </strong>
          </p>
          {!user && (
            <>
              <Link href="/login" className="btn-secondary !py-1.5 !text-[12px]">
                دخول
              </Link>
              <Link href="/register" className="btn-primary !py-1.5 !text-[12px]">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="card animate-fade-up-delay-1 space-y-4 p-5 lg:col-span-7 lg:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/50 text-[#1c1916] ring-1 ring-white/60">
              <Calculator className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div>
              <h1 className="text-[16px] font-semibold tracking-tight text-[#1c1916]">
                حساب تكلفة السلعة
              </h1>
              <p className="text-[12px] text-[#737373]">
                دخل {formatMoney(settings.monthlyIncome, settings.currency)} ·{" "}
                {formatHours(monthHours)} س/شهر
              </p>
            </div>
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
                  className="money-badge cursor-pointer outline-none"
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

          <div className="flex flex-wrap gap-1.5">
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

          <div className="border-t border-black/[0.05] pt-4">
            <p className="mb-3 text-[14px] font-medium text-[#1c1916]">
              هل «{name || "المنتج"}» يستحق {hoursLabel} ساعة؟
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => decide("saved")}
                className="action-dark p-4 text-right"
              >
                <p className="text-[14px] font-semibold">تراجعت ووفّرت</p>
                <p className="mt-1 text-[12px] text-white/55">+{hoursLabel} ساعة</p>
              </button>
              <button
                type="button"
                onClick={() => decide("bought")}
                className="action-glass p-4 text-right"
              >
                <p className="text-[14px] font-semibold text-[#1c1916]">اشتريت بوعي</p>
                <p className="mt-1 text-[12px] text-[#737373]">تسجيل الشراء</p>
              </button>
            </div>
          </div>
        </section>

        <section className="card-elevated animate-fade-up-delay-2 flex flex-col gap-4 p-5 lg:col-span-5 lg:p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#737373]">
            النتيجة
          </p>

          <div key={bump} className="animate-pop">
            <p className="text-[13px] text-[#737373]">تكلفة {name || "السلعة"} تعادل</p>
            <p className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-[46px] font-bold leading-none tracking-tight tabular-nums text-[#1c1916]">
                {hoursLabel}
              </span>
              <span className="text-[16px] font-medium text-[#524a39]">ساعة عمل</span>
            </p>
            <p className="mt-3 text-[13px] text-[#524a39]">
              ≈ <strong className="text-[#1c1916]">{formatHours(days)}</strong> يوم عمل
            </p>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-[12px] text-[#737373]">
              <span>من جهد الشهر</span>
              <span className="font-semibold tabular-nums text-[#1c1916]">{pct.toFixed(1)}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(Math.max(pct, 2), 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-black/[0.05] pt-4">
            <div className="soft-tile px-3 py-3">
              <p className="text-[11px] text-[#737373]">السعر</p>
              <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-[#1c1916]">
                {formatMoney(price, settings.currency)}
              </p>
            </div>
            <div className="soft-tile px-3 py-3">
              <p className="text-[11px] text-[#737373]">أيام عمل</p>
              <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-[#1c1916]">
                {formatHours(days)}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="card animate-fade-up-delay-3 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[14px] font-semibold text-[#1c1916]">آخر القرارات</h2>
          <span className="rounded-full border border-white/50 bg-white/40 px-2.5 py-1 text-[12px] font-medium text-[#524a39]">
            +{formatHours(weekSaved)} س هذا الأسبوع
          </span>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {recent.map((d) => (
            <div
              key={d.id}
              className="hover-lift soft-tile flex items-center justify-between gap-2 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-[#1c1916]">
                  {d.kind === "saved" ? "تراجع ·" : "شراء ·"} {d.name}
                </p>
                <p className="text-[11px] text-[#737373]">
                  {formatMoney(d.price, settings.currency)}
                </p>
              </div>
              <span
                className={`shrink-0 text-[13px] font-bold tabular-nums ${
                  d.kind === "saved" ? "text-[#1c1916]" : "text-[#737373]"
                }`}
              >
                {d.kind === "saved" ? "+" : "−"}
                {formatHours(d.hours)}
              </span>
            </div>
          ))}
          {recent.length === 0 && (
            <p className="text-[13px] text-[#737373] md:col-span-3">لا قرارات بعد.</p>
          )}
        </div>
      </section>
    </div>
  );
}
