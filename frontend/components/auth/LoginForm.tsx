"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { getMe, loginUser } from "@/service/auth";
import { useTranslation } from "@/lib/i18n";
import { Eye, EyeOff } from "lucide-react";
const STRINGS = {
  bn: {
    email: "ইমেইল",
    emailPlaceholder: "you@example.com",
    password: "পাসওয়ার্ড",
    loggingIn: "লগইন হচ্ছে…",
    login: "লগইন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    or: "অথবা",
    noAccount: "অ্যাকাউন্ট নেই?",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    loginFailed: "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
  },
  en: {
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    loggingIn: "Logging in…",
    login: "Login",
    forgotPassword: "Forgot password?",
    or: "OR",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
    loginFailed: "Login failed. Please try again.",
  },
};

export function LoginForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRedirectByRole = async (user?: { role?: string }) => {
    try {
      let role = user?.role;

      if (!role) {
        const meRes = await getMe();
        role = meRes?.data?.role;
      }

      if (role?.toUpperCase() === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role?.toUpperCase() === "USER") {
        router.replace("/dashboard");
      } else {
        setError("User role পাওয়া যায়নি। আবার লগইন করুন।");
        return;
      }

      router.refresh();
    } catch {
      setError("User information পাওয়া যায়নি। আবার লগইন করুন।");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await loginUser({ email, password });
    setLoading(false);
    if (result.success) {
      await handleRedirectByRole(result.data?.user);
    } else {
      setError(result.message || s.loginFailed);
    }
  };

  return (
    <form
      className="mt-7 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-sm font-bold text-slate-700"
        >
          {s.email}
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          placeholder={s.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="login-pass"
          className="mb-1.5 block text-sm font-bold text-slate-700"
        >
          {s.password}
        </label>

        <div className="relative">
          <input
            id="login-pass"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-line bg-canvas px-4 pr-12 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-500 transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-flag-600">
          {error}
        </p>
      )}
      <Button
        type="submit"
        className="mt-5 w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? s.loggingIn : s.login}
      </Button>
      <p className="mt-3 text-center">
        <a
          href="/login"
          className="text-sm font-bold text-brand-700 hover:text-brand-800"
        >
          {s.forgotPassword}
        </a>
      </p>
      <div
        className="my-5 flex items-center gap-3 text-xs font-bold text-slate-400"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-line" /> {s.or}{" "}
        <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleSignInButton onSuccess={(user) => handleRedirectByRole(user)} />
      <p className="mt-5 text-center text-sm text-slate-500">
        {s.noAccount}{" "}
        <Link
          href="/register"
          className="font-bold text-brand-700 hover:text-brand-800"
        >
          {s.createAccount}
        </Link>
      </p>
    </form>
  );
}
export default LoginForm;
