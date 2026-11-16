"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ShoppingCart, Trash2 } from "lucide-react";
import {
  formatHours,
  formatMoney,
  hoursToWorkDays,
} from "@/lib/calc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

type Filter = "all" | "saved" | "bought";

export function LogView() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    decisions,
    settings,
    allSavedHours,
    discipline,
    calcHours,
    addDecision,
    removeDecision,
  } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [widgetPrice, setWidgetPrice] = useState(65);
  const [widgetName, setWidgetName] = useState("سلعة سريعة");

  const widgetHours = calcHours(widgetPrice);
  const list = useMemo(() => {
    if (filter === "all") return decisions;
    return decisions.filter((d) => d.kind === filter);
  }, [decisions, filter]);

  function requireAuth(action: () => void) {
    if (!user) {
      router.push("/login");
      return;
    }
    action();
  }

  return (
    <div className="space-y-4">
      <section className="glass-panel animate-fade-up p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-[#1c1916] md:text-2xl">
              سجل القرارات
            </h1>
            <p className="mt-1 text-[13px] text-[#737373]">
              {user
                ? "تتبع التراجعات والمشتريات مع حساب سريع."
                : "سجّل دخولك لعرض وحفظ سجل قراراتك."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <div className="soft-tile flex items-center gap-4 px-4 py-2.5">
              <div>
                <p className="text-[11px] text-[#737373]">ساعات موفَّرة</p>
                <p className="text-[18px] font-bold tabular-nums text-[#1c1916]">
                  {formatHours(allSavedHours)}
                </p>
              </div>
              <div className="h-8 w-px bg-black/5" />
              <div>
                <p className="text-[11px] text-[#737373]">أيام</p>
                <p className="text-[18px] font-bold tabular-nums text-[#1c1916]">
                  {formatHours(hoursToWorkDays(allSavedHours))}
                </p>
              </div>
            </div>

            {!user && (
              <Link href="/login" className="btn-primary !py-2 !text-[12px]">
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="card animate-fade-up-delay-1 p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {(
              [
                ["all", "الكل"],
                ["saved", "تراجعت"],
                ["bought", "اشتريت"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={filter === key ? "chip chip-active" : "chip"}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="space-y-3">
            {list.map((d) => (
              <li
                key={d.id}
                className="hover-lift soft-tile flex flex-wrap items-start justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-[#1e1b18]">{d.name}</p>
                  <p className="mt-0.5 text-[13px] text-[#4d4635]">
                    {formatMoney(d.price, settings.currency)} ·{" "}
                    {formatHours(d.hours)} ساعة عمل
                  </p>
                  <p
                    className={`mt-2 inline-flex items-center gap-1 text-[12px] font-medium ${
                      d.kind === "saved" ? "text-[#1c1916]" : "text-[#737373]"
                    }`}
                  >
                    {d.kind === "saved" ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        تراجعت ووفّرت (+{formatHours(d.hours)} ساعة)
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3.5 w-3.5" />
                        قرار: اشتريت
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDecision(d.id)}
                  className="rounded-lg p-2 text-[#7f7663] transition hover:bg-white hover:text-[#1e1b18] hover:shadow-sm"
                  aria-label="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
            {list.length === 0 && (
              <li className="text-[13px] text-[#4d4635]">لا عناصر في هذا التصفية.</li>
            )}
          </ul>

          <blockquote className="mt-5 rounded-xl bg-white px-4 py-3 text-[13px] text-[#4d4635]">
            المال قطعة من وقتك ومجهودك — ليس مجرد رقم على البطاقة.
          </blockquote>
        </section>

        <div className="space-y-4">
          <section id="widget" className="card-elevated animate-fade-up-delay-2 scroll-mt-28 p-5">
            <h2 className="font-semibold text-[#1e1b18]">ودجت القرار السريع</h2>
            <div className="mt-4 space-y-3">
              <input
                className="field"
                value={widgetName}
                onChange={(e) => setWidgetName(e.target.value)}
                placeholder="اسم السلعة"
              />
              <div className="money-wrap">
                <input
                  className="font-semibold tabular-nums"
                  type="number"
                  min={0}
                  value={widgetPrice}
                  onChange={(e) => setWidgetPrice(Number(e.target.value) || 0)}
                />
                <span className="money-badge">{settings.currency}</span>
              </div>
              <p className="rounded-xl bg-[#1e1b18] px-4 py-3 text-center text-white transition hover:bg-[#2a241c]">
                تكلفة القرار:{" "}
                <strong className="text-[#EAC249]">
                  {formatHours(widgetHours)} ساعة من عمرك
                </strong>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="hover-lift rounded-xl bg-[rgba(0,150,104,0.15)] px-3 py-2.5 text-[13px] font-semibold text-[#009668]"
                  onClick={() =>
                    requireAuth(() =>
                      addDecision({
                        name: widgetName,
                        price: widgetPrice,
                        kind: "saved",
                      }),
                    )
                  }
                >
                  وفّرت
                </button>
                <button
                  type="button"
                  className="hover-lift rounded-xl border border-[rgba(127,118,99,0.3)] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#1e1b18] hover:border-[rgba(197,160,40,0.4)]"
                  onClick={() =>
                    requireAuth(() =>
                      addDecision({
                        name: widgetName,
                        price: widgetPrice,
                        kind: "bought",
                      }),
                    )
                  }
                >
                  اشتريت
                </button>
              </div>
              <p className="text-[11px] text-[#7f7663]">
                إضافة للشاشة الرئيسية على الجوال/سطح المكتب قادمة لاحقاً — الودجت يعمل داخل التطبيق الآن.
              </p>
            </div>
          </section>

          <section className="card hover-lift flex items-center gap-5 p-5">
            <Ring value={discipline} />
            <div>
              <h3 className="font-semibold text-[#1e1b18]">انضباط الأسبوع</h3>
              <p className="mt-1 text-[13px] text-[#4d4635]">
                نسبة قرارات «تراجعت» خلال آخر 7 أيام.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(value, 100) / 100) * c;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#EEE7E1" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#171717"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold tabular-nums text-[#1c1916]">
        {value}%
      </span>
    </div>
  );
}
