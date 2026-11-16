"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { formatMoney } from "@/lib/calc";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const LOGO =
  "https://lh3.googleusercontent.com/aida/ALJJyrAuhEuhBR7WzOQ0Nn5m8r9TgXV-hrvSQne2t7U1xrmZ-cRp_0nEvpZsj8A3j02VyUaYPx4UPH9Fq5OvoJTiumzFFKJexiPEvpTcWXQLj8_ns7lvWRGopVK7R7WL3KLrOLgOuiaiwchlgDje74NGeyQ6asoqH4Xq-NslHDOBSieTbY2v77EMMPLuwacHjsDTGjco9EvS7GlGgAvi_xupIONEIngmqq1yfGVmy8hX6cK3mg";

const NAV = [
  { href: "/", label: "الحاسبة", full: "الحاسبة الفورية" },
  { href: "/challenge", label: "التحدي", full: "تحدي ساعات الحياة" },
  { href: "/log", label: "السجل", full: "سجل القرارات والادخار" },
  { href: "/compare", label: "المقارنة", full: "مقارنة الجهد والأساسيات" },
  { href: "/settings", label: "الإعدادات", full: "الإعدادات ومعدل الدخل" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { rate, settings } = useApp();
  const { user, logout, ready } = useAuth();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(212,160,23,0.12)] bg-[#fffaf4]/90 shadow-[0_8px_28px_-20px_rgba(111,86,0,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 transition hover:-translate-y-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={LOGO} className="h-7 w-auto transition group-hover:scale-105" />
          <span className="hidden leading-tight md:block">
            <span className="block text-[15px] font-semibold text-[#1c1916]">
              كم ساعة من عمرك؟
            </span>
          </span>
        </Link>

        <nav className="mx-2 hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.full}
                className={
                  active
                    ? "nav-link rounded-xl bg-gradient-to-l from-[#d4a017] to-[#ffd45e] px-3 py-1.5 text-[13px] font-semibold text-[#3f2f00] shadow-[0_8px_18px_-8px_rgba(212,160,23,0.75)]"
                    : "nav-link rounded-xl px-3 py-1.5 text-[13px] text-[#524a39] hover:bg-[#f3ebe4] hover:text-[#1c1916]"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-2">
          <Link
            href="/settings"
            className="hidden items-center gap-1.5 rounded-full bg-[#faf3ec] px-3 py-1.5 text-[12px] text-[#524a39] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffe59a]/55 hover:shadow-md sm:inline-flex"
          >
            <span className="hidden xl:inline">ساعتك</span>
            <span className="font-semibold tabular-nums text-[#6f5600]">
              {formatMoney(rate, settings.currency)}
            </span>
          </Link>

          <Link
            href="/log#widget"
            className="hidden items-center gap-1 rounded-xl bg-gradient-to-l from-[#d4a017] to-[#ffd45e] px-3 py-1.5 text-[12px] font-semibold text-[#3f2f00] shadow-[0_8px_18px_-8px_rgba(212,160,23,0.6)] transition hover:-translate-y-0.5 hover:brightness-105 md:inline-flex"
          >
            <span className="material-symbols-outlined text-[16px]">widgets</span>
            ودجت
          </Link>

          {ready && user ? (
            <>
              <Link
                href="/settings"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6f5600] to-[#d4a017] text-[12px] font-bold text-white shadow-[0_6px_14px_-6px_rgba(111,86,0,0.55)] transition hover:scale-110"
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
                className="hidden text-[12px] text-[#524a39] transition hover:text-[#1c1916] lg:inline"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-2.5 py-1.5 text-[12px] font-medium text-[#524a39] transition hover:bg-[#f3ebe4]"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-l from-[#d4a017] to-[#ffd45e] px-2.5 py-1.5 text-[12px] font-semibold text-[#3f2f00] shadow-[0_8px_16px_-8px_rgba(212,160,23,0.65)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                حساب
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-[rgba(212,160,23,0.1)] lg:hidden">
        <nav className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "nav-link shrink-0 rounded-xl bg-gradient-to-l from-[#d4a017] to-[#ffd45e] px-3 py-1.5 text-[12px] font-semibold text-[#3f2f00]"
                    : "nav-link shrink-0 rounded-xl px-3 py-1.5 text-[12px] text-[#524a39] hover:bg-[#f3ebe4]"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
