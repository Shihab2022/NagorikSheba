"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { registerUser } from "@/service/auth";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await registerUser({ name, email, password });
    setLoading(false);
    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <form className="mt-7 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="reg-name" className="mb-1.5 block text-sm font-bold text-slate-700">Name</label>
        <input id="reg-name" required autoComplete="name" placeholder="Your full name"
          value={name} onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
      </div>
      <div className="mt-4">
        <label htmlFor="reg-email" className="mb-1.5 block text-sm font-bold text-slate-700">Email</label>
        <input id="reg-email" type="email" required autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-pass" className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
          <input id="reg-pass" type="password" required autoComplete="new-password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="reg-pass2" className="mb-1.5 block text-sm font-bold text-slate-700">Confirm Password</label>
          <input id="reg-pass2" type="password" required autoComplete="new-password" placeholder="••••••••"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-flag-600">{error}</p>
      )}
      <Button type="submit" className="mt-5 w-full" size="lg" disabled={loading}>
        {loading ? "Creating account…" : "Create Account"}
      </Button>
      <div className="my-5 flex items-center gap-3 text-xs font-bold text-slate-400" aria-hidden="true">
        <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleSignInButton onSuccess={() => { router.push("/"); router.refresh(); }} />
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account? <Link href="/login" className="font-bold text-brand-700 hover:text-brand-800">Log in</Link>
      </p>
    </form>
  );
}
export default RegisterForm;
