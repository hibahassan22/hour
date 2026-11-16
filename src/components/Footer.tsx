"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="mt-auto border-t border-[rgba(212,160,23,0.12)] bg-[#faf3ec]/75 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-[12px] text-[#524a39] sm:px-6 lg:px-10">
        <p>© 2026 كم ساعة من عمرك؟</p>
        <div className="flex gap-4">
          <Link href="/settings" className="transition hover:text-[#1c1916]">
            المنهجية
          </Link>
          <span>الخصوصية</span>
          <span>الشروط</span>
        </div>
      </div>
    </footer>
  );
}
