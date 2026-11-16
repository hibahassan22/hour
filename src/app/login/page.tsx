"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/");
  }, [ready, user, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login({ email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/");
  }

  return (
    <AuthShell title="تسجيل الدخول" subtitle="ادخل لحسابك لمتابعة ساعاتك الموفَّرة وقراراتك.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block space-y-2">
          <span className="label">البريد الإلكتروني</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="name@email.com"
            autoComplete="email"
          />
        </label>

        <label className="block space-y-2">
          <span className="label">كلمة المرور</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-error-container px-3.5 py-2.5 text-body-sm font-medium text-on-error-container">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>

      <p className="mt-7 text-center text-body-sm text-on-surface-variant">
        ما عندك حساب؟{" "}
        <Link href="/register" className="font-semibold text-primary transition hover:underline">
          إنشاء حساب
        </Link>
      </p>
    </AuthShell>
  );
}
