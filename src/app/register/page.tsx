"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, ready } = useAuth();
  const [name, setName] = useState("");
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
    const result = register({ name, email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/settings");
  }

  return (
    <AuthShell
      title="إنشاء حساب"
      subtitle="ابدأ بحسابك واحسب تكلفة كل شراء من ساعات حياتك."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block space-y-2">
          <span className="label">الاسم</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
            placeholder="أحمد"
            autoComplete="name"
          />
        </label>

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
            placeholder="6 أحرف على الأقل"
            autoComplete="new-password"
            minLength={6}
          />
        </label>

        {error && (
          <p className="rounded-xl bg-error-container px-3.5 py-2.5 text-body-sm font-medium text-on-error-container">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>
      </form>

      <p className="mt-7 text-center text-body-sm text-on-surface-variant">
        عندك حساب؟{" "}
        <Link href="/login" className="font-semibold text-primary transition hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </AuthShell>
  );
}
