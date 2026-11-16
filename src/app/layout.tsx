import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  variable: "--font-plex",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "كم ساعة من عمرك؟ | Cost in Hours",
  description: "حوّل سعر أي سلعة إلى ساعات عمل حقيقية من حياتك قبل ما تشتري.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${plex.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-surface font-sans text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
