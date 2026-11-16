"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Hourglass } from "lucide-react";
import { formatMoney } from "@/lib/calc";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/", label: "الحاسبة" },
  { href: "/challenge", label: "التحدي" },
  { href: "/log", label: "السجل" },
  { href: "/compare", label: "المقارنة" },
  { href: "/settings", label: "الإعدادات" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { rate, settings } = useApp();
  const { user, logout, ready } = useAuth();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="nav-shell">
      <header className="nav-glass">
        <div className="flex h-[3.65rem] items-center gap-3 px-3.5 sm:px-4 lg:px-5">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#171717] text-white shadow-[0_6px_16px_-8px_rgba(23,23,23,0.55)] transition group-hover:scale-[1.03]">
              <Hourglass className="h-4 w-4" strokeWidth={2.3} />
            </span>
            <span className="hidden text-[14px] font-semibold tracking-tight text-[#1c1916] md:block">
              كم ساعة من عمرك؟
            </span>
          </Link>

          <nav className="mx-1 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
            <div className="flex items-center gap-0.5 rounded-full bg-white/35 p-1 ring-1 ring-black/[0.04]">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "nav-link nav-link-active rounded-full px-3.5 py-1.5 text-[13px] font-medium"
                        : "nav-link rounded-full px-3.5 py-1.5 text-[13px] text-[#524a39] hover:bg-white/70 hover:text-[#1c1916]"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="ms-auto flex shrink-0 items-center gap-2">
            <Link
              href="/settings"
              className="hidden items-center gap-1.5 rounded-full border border-white/50 bg-white/45 px-3 py-1.5 text-[12px] text-[#524a39] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-md transition hover:bg-white/70 sm:inline-flex"
            >
              <span className="hidden xl:inline">قيمة الساعة</span>
              <span className="font-semibold tabular-nums text-[#1c1916]">
                {formatMoney(rate, settings.currency)}
              </span>
            </Link>

            {ready && user ? (
              <>
                <Link
                  href="/settings"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-[12px] font-semibold text-white ring-2 ring-white/40 transition hover:scale-105"
                  title={user.name}
                >
                  {user.name.slice(0, 1)}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="hidden rounded-full px-2.5 py-1.5 text-[12px] text-[#524a39] transition hover:bg-white/55 hover:text-[#1c1916] lg:inline"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#524a39] transition hover:bg-white/55 hover:text-[#1c1916]"
                >
                  دخول
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[#171717] px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_8px_18px_-10px_rgba(23,23,23,0.55)] transition hover:bg-[#2a2a2a]"
                >
                  حساب
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-black/[0.04] px-3 pb-2.5 pt-2 lg:hidden">
          <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "nav-link nav-link-active shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium"
                      : "nav-link shrink-0 rounded-full bg-white/35 px-3 py-1.5 text-[12px] text-[#524a39] ring-1 ring-black/[0.04] hover:bg-white/70"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </div>
  );
}
