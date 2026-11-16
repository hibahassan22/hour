"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="px-4 pb-4 sm:px-6 lg:px-8">
      <footer className="footer-glass">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[12px] text-[#737373] sm:px-5">
          <p>© 2026 كم ساعة من عمرك؟</p>
          <Link href="/settings" className="transition hover:text-[#1c1916]">
            الإعدادات
          </Link>
        </div>
      </footer>
    </div>
  );
}
