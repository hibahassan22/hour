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
    <div className="relative mx-auto grid w-full max-w-[900px] overflow-hidden rounded-[1.15rem] border border-white/55 bg-gradient-to-br from-white/75 via-white/55 to-[#fff8f0]/65 shadow-[0_10px_40px_-18px_rgba(28,25,22,0.22)] backdrop-blur-[22px] lg:grid-cols-2">
      <Link
        href="/"
        aria-label="إغلاق"
        className="absolute top-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-white/50 text-[#524a39] backdrop-blur-md transition hover:bg-white/80 hover:text-[#1c1916]"
      >
        <X className="h-4 w-4" strokeWidth={2.4} />
      </Link>

      <aside className="hidden bg-[#171717] p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#171717]">
            <Hourglass className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[14px] font-semibold">كم ساعة من عمرك؟</span>
            <span className="block text-[11px] text-white/45">Cost in Hours</span>
          </span>
        </Link>

        <div className="space-y-3">
          <h2 className="max-w-xs text-[22px] font-semibold leading-snug tracking-tight">
            السعر الحقيقي لأي سلعة هو ساعات من عمرك.
          </h2>
          <p className="max-w-xs text-[13px] leading-relaxed text-white/55">
            سجّل حسابك لتتبع قراراتك وساعاتك الموفَّرة.
          </p>
        </div>
      </aside>

      <div className="flex flex-col justify-center px-6 py-10 sm:px-8">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#1c1916]">{title}</h1>
        <p className="mt-1.5 text-[13px] text-[#737373]">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
