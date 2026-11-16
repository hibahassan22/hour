"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Home,
  Plane,
  Shield,
  Utensils,
} from "lucide-react";
import {
  alternativesFor,
  formatHours,
  formatMoney,
  hoursToWorkDays,
  percentOfMonthly,
} from "@/lib/calc";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const ICONS = {
  home: Home,
  utensils: Utensils,
  plane: Plane,
  shield: Shield,
};

export function CompareView() {
  const router = useRouter();
  const { user } = useAuth();
  const { settings, calcHours, addDecision } = useApp();
  const [name, setName] = useState("ساعة يد ميكانيكية فاخرة");
  const [price, setPrice] = useState(2400);
  const [leftMs, setLeftMs] = useState(48 * 60 * 60 * 1000 - 1000);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setLeftMs((ms) => Math.max(ms - 1000, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = calcHours(price);
  const weeks = hoursToWorkDays(hours) / 5;
  const pct = percentOfMonthly(hours, settings);
  const alts = useMemo(() => alternativesFor(price), [price]);
  const drain = Math.min(pct / 100, 1);

  const h = Math.floor(leftMs / 3600000);
  const m = Math.floor((leftMs % 3600000) / 60000);
  const s = Math.floor((leftMs % 60000) / 1000);

  function decide(kind: "saved" | "bought") {
    if (!user) {
      router.push("/login");
      return;
    }
    addDecision({
      name,
      price,
      kind,
      category: "electronics",
    });
    setFlash(
      kind === "saved"
        ? `تأكيد التراجع — وفّرت ${formatHours(hours)} ساعة`
        : "تم تسجيل قرار الشراء",
    );
    setTimeout(() => setFlash(null), 2500);
  }

  return (
    <div className="space-y-5">
      {flash && (
        <div className="animate-pop rounded-2xl border border-[#c5a028]/45 bg-[#ffe08b]/50 px-4 py-3 text-[14px] font-medium text-[#493800]">
          {flash}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="card animate-fade-up space-y-5 p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <label className="label">المنتج قيد التحليل</label>
              <input
                className="field mt-1.5 max-w-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <p className="text-3xl font-bold tabular-nums text-[#745b00]">
              {formatMoney(price, settings.currency)}
            </p>
          </div>

          <label className="block space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#4d4635]">ضبط السعر</span>
              <span className="tabular-nums font-medium text-[#1e1b18]">
                {formatMoney(price, settings.currency)}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={10000}
              step={50}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="slider w-full"
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <Metric label="ساعات حياتك" value={formatHours(hours)} />
            <Metric label="أسابيع عمل" value={formatHours(weeks)} />
            <Metric label="من جهد الشهر" value={`${pct.toFixed(0)}%`} />
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[#1e1b18]">مؤشر استنزاف الجهد</p>
            <div className="h-3 overflow-hidden rounded-full bg-gradient-to-l from-[#009668] via-[#F59E0B] to-[#BA1A1A]">
              <div className="relative h-full transition-all duration-300" style={{ width: `${drain * 100}%` }}>
                <span className="absolute end-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-[#1e1b18] shadow" />
              </div>
            </div>
            <p className="mt-2 text-[12px] text-[#4d4635]">
              {pct >= 40
                ? "منطقة خطر — يستحق الانتظار 48 ساعة"
                : pct >= 15
                  ? "متوسط — فكّر في البدائل"
                  : "تأثير منخفض نسبياً"}
            </p>
          </div>
        </section>

        <div className="space-y-4">
          <section className="card-elevated animate-fade-up-delay-1 p-5">
            <h2 className="font-semibold text-[#1e1b18]">قاعدة الـ 48 ساعة</h2>
            <p className="mt-1 text-[13px] text-[#4d4635]">
              انتظر قبل الشراء — الرغبة الاندفاعية غالباً تضعف مع الوقت.
            </p>
            <p className="mt-4 font-mono text-2xl font-semibold tabular-nums text-[#745b00]">
              {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
              {String(s).padStart(2, "0")}
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => decide("bought")} className="btn-secondary flex-1">
                اشتري الآن
              </button>
              <button type="button" onClick={() => decide("saved")} className="btn-primary flex-1">
                وفّر الساعات
              </button>
            </div>
          </section>

          <section className="card animate-fade-up-delay-2 p-5">
            <h3 className="text-[13px] font-semibold text-[#1e1b18]">اندفاع عاطفي × الوقت</h3>
            <ImpulseChart />
            <p className="mt-2 text-[12px] text-[#4d4635]">
              منحنى مبسّط: الحماس يهبط بعد أول يومين.
            </p>
          </section>
        </div>
      </div>

      <section className="animate-fade-up">
        <h2 className="mb-3 text-[16px] font-semibold text-[#1e1b18]">
          ماذا يشتري لك هذا المبلغ فعلياً؟
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {alts.map((a) => {
            const Icon = ICONS[a.icon];
            return (
              <article key={a.id} className="card hover-lift p-4">
                <span className="inline-flex rounded-lg bg-[#ffe08b]/40 p-2 text-[#745b00]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-2 font-semibold text-[#1e1b18]">{a.title}</h3>
                <p className="mt-1 text-[13px] text-[#4d4635]">{a.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card animate-fade-up overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead className="bg-[#faf2ed] text-[#4d4635]">
            <tr>
              <th className="px-4 py-3 text-start font-medium">الخيار</th>
              <th className="px-4 py-3 text-start font-medium">القيمة</th>
              <th className="px-4 py-3 text-start font-medium">ساعات الحياة</th>
              <th className="px-4 py-3 text-start font-medium">الأثر</th>
              <th className="px-4 py-3 text-start font-medium">التوصية</th>
            </tr>
          </thead>
          <tbody>
            <Row
              name={name}
              price={price}
              hours={hours}
              currency={settings.currency}
              impact="دفعة مؤقتة — لا تضيف لمستقبلك"
              tag="تجنّب الشراء"
              tagClass="bg-[#ffdad6] text-[#93000a]"
            />
            <Row
              name="صندوق طوارئ"
              price={price}
              hours={hours}
              currency={settings.currency}
              impact="هدوء نفسي وحرية أطول"
              tag="موصى به بقوة"
              tagClass="bg-[rgba(0,150,104,0.12)] text-[#009668]"
            />
            <Row
              name="سفر عائلي"
              price={price}
              hours={hours}
              currency={settings.currency}
              impact="ذكريات وصحة نفسية"
              tag="خيار جيد"
              tagClass="bg-[#ffe08b]/55 text-[#493800]"
            />
          </tbody>
        </table>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(197,160,40,0.3)] bg-white/90 px-5 py-4 shadow-[0_10px_28px_-20px_rgba(116,91,0,0.25)]">
        <p className="text-[14px] text-[#1e1b18]">
          تأكيد التراجع وتوثيق {formatHours(hours)} ساعة موفَّرة؟
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => decide("bought")} className="btn-secondary">
            إلغاء / اشتريت
          </button>
          <button type="button" onClick={() => decide("saved")} className="btn-primary">
            أكّد التراجع ووفّر الساعات
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="hover-lift rounded-xl bg-[#faf2ed] px-3 py-3 text-center">
      <p className="text-xl font-semibold tabular-nums text-[#745b00]">{value}</p>
      <p className="text-[11px] text-[#7f7663]">{label}</p>
    </div>
  );
}

function Row({
  name,
  price,
  hours,
  currency,
  impact,
  tag,
  tagClass,
}: {
  name: string;
  price: number;
  hours: number;
  currency: string;
  impact: string;
  tag: string;
  tagClass: string;
}) {
  return (
    <tr className="border-t border-[rgba(197,160,40,0.12)] transition hover:bg-[#fffdf9]">
      <td className="px-4 py-3 font-medium text-[#1e1b18]">{name}</td>
      <td className="px-4 py-3 tabular-nums">{formatMoney(price, currency)}</td>
      <td className="px-4 py-3 tabular-nums">{formatHours(hours)}</td>
      <td className="px-4 py-3 text-[#4d4635]">{impact}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${tagClass}`}>
          {tag}
        </span>
      </td>
    </tr>
  );
}

function ImpulseChart() {
  const points = [
    [0, 92],
    [20, 88],
    [40, 70],
    [60, 48],
    [80, 32],
    [100, 22],
  ];
  const d = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${100 - y}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="mt-3 h-24 w-full text-[#C5A028]">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path
        d={`${d} L 100 100 L 0 100 Z`}
        fill="rgba(197,160,40,0.12)"
        stroke="none"
      />
    </svg>
  );
}
