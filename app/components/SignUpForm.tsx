"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api";
import { signupSchema } from "@/lib/validations";

export default function SignUpForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateFields = (values: { email: string; password: string }) => {
    const parsed = signupSchema.safeParse(values);
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
    setSuccess("");
    const nextFieldErrors = validateFields({ email, password });
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    if (!agree) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(email, password);
      setSuccess("Account created. Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signin?registered=1");
      }, 900);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-slate-300">First Name</span>
          <input
            type="text"
            required
            placeholder="Ayaan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-700/70 bg-[#0d0d1a] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Last Name</span>
          <input
            type="text"
            required
            placeholder="Khan"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-700/70 bg-[#0d0d1a] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
          />
        </label>
      </div>

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
        <span className="text-sm text-slate-300">Password</span>
        <input
          type="password"
          required
          minLength={8}
          placeholder="Create a strong password"
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

      <label className="flex items-start gap-3 text-sm text-slate-400">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 accent-violet-500"
        />
        <span>I agree to the Terms of Service and Privacy Policy.</span>
      </label>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-all duration-200 shadow-lg shadow-violet-900/50"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
