import Link from "next/link";
import { Suspense } from "react";
import GoogleAuthButton from "@/app/components/GoogleAuthButton";
import SignUpForm from "@/app/components/SignUpForm";

export default function SignUpPage() {
  const googleEnabled =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-14 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(109,40,217,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="rounded-3xl border border-violet-900/30 bg-[#111122] p-6 sm:p-10 shadow-2xl shadow-violet-950/40">
            <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/40 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              Start Free Today
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Create your account</h1>
            <p className="text-slate-400 mb-8">Build your first ATS-ready resume in under 10 minutes.</p>

            <SignUpForm />

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-500">or create with</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <Suspense fallback={<div className="text-xs text-slate-500">Loading Google sign-in...</div>}>
              <GoogleAuthButton
                mode="signup"
                defaultCallbackUrl="/dashboard"
                enabled={googleEnabled}
                disabledText="Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local, then restart dev server."
              />
            </Suspense>

            <p className="text-sm text-slate-400 mt-6 text-center">
              Already have an account?{" "}
              <Link href="/signin" className="text-violet-400 hover:text-violet-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <aside className="rounded-3xl border border-violet-800/20 bg-linear-to-br from-violet-900/35 to-[#0f1022] p-6 sm:p-10">
            <h2 className="text-white text-2xl font-bold mb-6">What you get in Free plan</h2>
            <ul className="space-y-4">
              {[
                "1 complete ATS-optimized resume",
                "Live split-screen editing preview",
                "Keyword extraction from any job description",
                "Basic PDF export",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 text-xs">
                    ✓
                  </span>
                  <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-violet-700/30 bg-[#0d0d1a]/70 p-5">
              <div className="text-3xl font-black text-white">92%</div>
              <p className="text-slate-400 text-sm mt-1">of users report improved interview callback rates after ATS optimization.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
