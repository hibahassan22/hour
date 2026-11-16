import Link from "next/link";
import { Hourglass, X } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up relative mx-auto grid w-full max-w-[920px] overflow-hidden rounded-2xl border border-[rgba(197,160,40,0.22)] bg-white shadow-[0_20px_50px_-24px_rgba(116,91,0,0.28)] lg:grid-cols-2">
      <Link
        href="/"
        aria-label="إغلاق"
        className="absolute top-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#e9e1dc] bg-white text-[#4d4635] shadow-sm transition hover:scale-105 hover:bg-[#faf2ed] hover:text-[#1e1b18]"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </Link>

      <aside className="relative hidden bg-[#1e1b18] p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(400px 220px at 20% 15%, rgba(197,160,40,0.28), transparent 60%)",
          }}
        />
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c5a028] text-[#1e1b18]">
            <Hourglass className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[14px] font-semibold">كم ساعة من عمرك؟</span>
            <span className="block text-[11px] text-white/45">Cost in Hours</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#eac249]">
            LIFE CAPITAL
          </p>
          <h2 className="max-w-xs text-[22px] font-semibold leading-snug">
            السعر الحقيقي لأي سلعة هو ساعات من عمرك.
          </h2>
          <p className="max-w-xs text-[13px] leading-relaxed text-white/55">
            سجّل حسابك لتتبع قراراتك وساعاتك الموفَّرة.
          </p>
        </div>
      </aside>

      <div className="flex flex-col justify-center px-6 py-10 sm:px-8">
        <h1 className="text-[22px] font-semibold text-[#1e1b18]">{title}</h1>
        <p className="mt-1.5 text-[13px] text-[#4d4635]">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
