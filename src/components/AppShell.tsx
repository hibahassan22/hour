"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { Footer } from "./Footer";
import { Header } from "./Header";

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main
        className={
          isAuth
            ? "mx-auto flex w-full max-w-[1100px] flex-1 items-center px-4 py-8 sm:px-6"
            : "mx-auto w-full max-w-[1240px] flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8"
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <ShellInner>{children}</ShellInner>
      </AppProvider>
    </AuthProvider>
  );
}
