"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

type SignInFormProps = {
  callbackUrl: string;
};

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateFields = (values: { email: string; password: string }) => {
    const parsed = loginSchema.safeParse(values);
    if (parsed.success) {
      return {} as { email?: string; password?: string };
    }

    const nextErrors: { email?: string; password?: string } = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "email" || field === "password") && !nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const nextFieldErrors = validateFields({ email, password });
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      setSession({ email: result.email, token: result.token });
      router.push(callbackUrl || "/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <label className="block">
        <span className="text-sm text-slate-300">Email Address</span>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
            setError("");
          }}
          className="mt-1.5 w-full rounded-xl border border-slate-700/70 bg-[#0d0d1a] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
        />
        {fieldErrors.email ? (
          <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>
        ) : null}
      </label>

      <label className="block">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Password</span>
          <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            Forgot password?
          </a>
        </div>
        <input
          type="password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
            setError("");
          }}
          className="mt-1.5 w-full rounded-xl border border-slate-700/70 bg-[#0d0d1a] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
        />
        {fieldErrors.password ? (
          <p className="mt-1 text-xs text-red-300">{fieldErrors.password}</p>
        ) : null}
      </label>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-all duration-200 shadow-lg shadow-violet-900/50"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
