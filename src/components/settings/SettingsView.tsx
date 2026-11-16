"use client";

import { formatMoney, hourlyRate, monthlyHours } from "@/lib/calc";
import { useApp } from "@/context/AppContext";

export function SettingsView() {
  const { settings, updateSettings } = useApp();
  const rate = hourlyRate(settings);
  const hours = monthlyHours(settings);

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="card animate-fade-up space-y-4 p-5 md:p-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1c1916]">
            إعداد الدخل
          </h1>
          <p className="mt-1 text-[13px] text-[#737373]">
            البيانات دي بتحدد قيمة ساعتك في كل الحسابات.
          </p>
        </div>

        <Field
          label="الاسم الظاهر"
          value={settings.userName}
          onChange={(v) => updateSettings({ userName: v })}
        />
        <MoneyField
          label="الدخل الشهري الصافي"
          currency={settings.currency}
          value={String(settings.monthlyIncome)}
          onChange={(v) => updateSettings({ monthlyIncome: Number(v) || 0 })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="ساعات العمل / أسبوع"
            type="number"
            value={String(settings.hoursPerWeek)}
            onChange={(v) => updateSettings({ hoursPerWeek: Number(v) || 0 })}
          />
          <Field
            label="أيام العمل / شهر"
            type="number"
            value={String(settings.daysPerMonth)}
            onChange={(v) => updateSettings({ daysPerMonth: Number(v) || 0 })}
          />
        </div>
        <MoneyField
          label="تكاليف إضافية شهرية"
          hint="مواصلات، وجبات…"
          currency={settings.currency}
          negative
          value={String(settings.extraCosts)}
          onChange={(v) => updateSettings({ extraCosts: Number(v) || 0 })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="label">رمز العملة</span>
            <select
              className="field"
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
            >
              <option value="ج.م">ج.م — جنيه مصري</option>
              <option value="$">$ — دولار</option>
              <option value="ر.س">ر.س — ريال سعودي</option>
              <option value="د.إ">د.إ — درهم</option>
            </select>
          </label>
          <Field
            label="هدف التوفير الشهري (ساعات)"
            type="number"
            value={String(settings.monthlyGoalHours)}
            onChange={(v) => updateSettings({ monthlyGoalHours: Number(v) || 0 })}
          />
        </div>
      </section>

      <section className="card-elevated animate-fade-up-delay-1 flex flex-col justify-center p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#737373]">
          قيمة الساعة
        </p>
        <p className="mt-3 text-4xl font-bold tracking-tight tabular-nums text-[#1c1916]">
          {formatMoney(rate, settings.currency)}
        </p>
        <p className="mt-2 text-[13px] text-[#737373]">لكل ساعة عمل صافية</p>
        <p className="mt-6 border-t border-black/[0.05] pt-4 text-[13px] text-[#524a39]">
          صافي {(settings.monthlyIncome - settings.extraCosts).toLocaleString("en-US")} ÷{" "}
          {hours.toFixed(0)} ساعة / شهر
        </p>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="label">{label}</span>
      <input
        className="field"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function MoneyField({
  label,
  hint,
  value,
  onChange,
  currency,
  negative,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  currency: string;
  negative?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between gap-2">
        <span className="label !mb-0">{label}</span>
        {hint && <span className="text-[11px] text-[#a3a3a3]">{hint}</span>}
      </span>
      <div className="money-wrap">
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} />
        <span className="money-badge">{negative ? `− ${currency}` : currency}</span>
      </div>
    </label>
  );
}
