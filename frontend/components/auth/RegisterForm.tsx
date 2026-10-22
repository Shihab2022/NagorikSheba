
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { getMe, registerUser } from "@/service/auth";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    name: "নাম",
    namePlaceholder: "আপনার পুরো নাম",
    email: "ইমেইল",
    emailPlaceholder: "you@example.com",
    password: "পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    passwordMismatch: "পাসওয়ার্ড মিলছে না।",
    creating: "অ্যাকাউন্ট তৈরি হচ্ছে…",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    or: "অথবা",
    haveAccount: "আগে থেকেই অ্যাকাউন্ট আছে?",
    login: "লগইন",
    registrationFailed:
      "রেজিস্ট্রেশন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
  },
  en: {
    name: "Name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    confirmPassword: "Confirm Password",
    passwordMismatch: "Passwords do not match.",
    creating: "Creating account…",
    createAccount: "Create Account",
    or: "OR",
    haveAccount: "Already have an account?",
    login: "Log in",
    registrationFailed: "Registration failed. Please try again.",
  },
};

export function RegisterForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const s = t(STRINGS);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRedirectByRole = async (
    user?: { role?: string },
  ) => {
    let role = user?.role;

    if (!role) {
      const meRes = await getMe();
      role = meRes?.data?.role;
    }

    if (role?.toUpperCase() === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }

    router.refresh();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(s.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        name,
        email,
        password,
      });

      if (result.success) {
        await handleRedirectByRole(result.data?.user);
      } else {
        setError(result.message || s.registrationFailed);
      }
    } catch {
      setError(s.registrationFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mt-7 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor="reg-name"
          className="mb-1.5 block text-sm font-bold text-slate-700"
        >
          {s.name}
        </label>

        <input
          id="reg-name"
          type="text"
          required
          autoComplete="name"
          placeholder={s.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="reg-email"
          className="mb-1.5 block text-sm font-bold text-slate-700"
        >
          {s.email}
        </label>

        <input
          id="reg-email"
          type="email"
          required
          autoComplete="off"
          placeholder={s.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="reg-pass"
            className="mb-1.5 block text-sm font-bold text-slate-700"
          >
            {s.password}
          </label>

          <div className="relative">
            <input
              id="reg-pass"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 pr-12 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              title={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-500 transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="reg-pass2"
            className="mb-1.5 block text-sm font-bold text-slate-700"
          >
            {s.confirmPassword}
          </label>

          <div className="relative">
            <input
              id="reg-pass2"
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 pr-12 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              title={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-500 transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm font-semibold text-flag-600"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="mt-5 w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? s.creating : s.createAccount}
      </Button>

      <div
        className="my-5 flex items-center gap-3 text-xs font-bold text-slate-400"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-line" />
        {s.or}
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleSignInButton
        onSuccess={(user) => handleRedirectByRole(user)}
      />

      <p className="mt-5 text-center text-sm text-slate-500">
        {s.haveAccount}{" "}
        <Link
          href="/login"
          className="font-bold text-brand-700 hover:text-brand-800"
        >
          {s.login}
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
