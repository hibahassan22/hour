"use client";

import { formatMoney, hourlyRate, monthlyHours } from "@/lib/calc";
import { useApp } from "@/context/AppContext";

export function SettingsView() {
  const { settings, updateSettings } = useApp();
  const rate = hourlyRate(settings);
  const hours = monthlyHours(settings);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="animate-fade-up">
        <h1 className="text-xl font-semibold text-[#1c1916] md:text-2xl">
          إعداد الدخل وقيمة الساعة
        </h1>
        <p className="mt-1 text-[14px] text-[#524a39]">
          أدخل دخلك وساعات عملك مرة واحدة — الحاسبة تعتمد عليها في كل مكان.
        </p>
      </div>

      <section className="card animate-fade-up-delay-1 space-y-4 p-5 md:p-6">
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
          hint="مواصلات، وجبات عمل…"
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

      <section className="card-elevated animate-pop p-6 text-center">
        <p className="text-[13px] font-medium text-[#524a39]">قيمة الساعة الصافية الحقيقية</p>
        <p className="mt-2 text-4xl font-bold tabular-nums">
          <span className="bg-gradient-to-l from-[#6f5600] to-[#d4a017] bg-clip-text text-transparent">
            {formatMoney(rate, settings.currency)}
          </span>
          <span className="text-lg font-medium text-[#7a7160]"> / ساعة</span>
        </p>
        <p className="mt-3 text-[13px] text-[#524a39]">
          صافي {(settings.monthlyIncome - settings.extraCosts).toLocaleString("en-US")} ÷{" "}
          {hours.toFixed(0)} ساعة عمل شهرية
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
        {hint && <span className="text-[11px] text-[#7a7160]">{hint}</span>}
      </span>
      <div className="money-wrap">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="money-badge">{negative ? `− ${currency}` : currency}</span>
      </div>
    </label>
  );
}
