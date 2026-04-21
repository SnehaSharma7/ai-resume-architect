import Link from "next/link";
import { Suspense } from "react";
import GoogleAuthButton from "@/app/components/GoogleAuthButton";
import SignInForm from "@/app/components/SignInForm";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
    registered?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const query = await searchParams;
  const googleEnabled =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET);

  const showOAuthError = query.error === "google" || query.error === "OAuthSignin";
  const showRegistered = query.registered === "1";

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-14 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="rounded-3xl border border-violet-900/30 bg-[#111122] p-6 sm:p-10 shadow-2xl shadow-violet-950/40">
            <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/40 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              Welcome Back
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Sign in to CareerForge Pro</h1>
            <p className="text-slate-400 mb-8">Continue optimizing resumes and tracking your ATS scores.</p>

            {showOAuthError ? (
              <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                Google sign-in failed. Check your Google OAuth app credentials and redirect URI for port 3001.
              </div>
            ) : null}

            {showRegistered ? (
              <div className="mb-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                Account created successfully. Please sign in.
              </div>
            ) : null}

            <SignInForm callbackUrl={query.callbackUrl ?? "/dashboard"} />

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-500">or continue with</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <Suspense fallback={<div className="text-xs text-slate-500">Loading Google sign-in...</div>}>
              <GoogleAuthButton
                mode="signin"
                defaultCallbackUrl={query.callbackUrl ?? "/dashboard"}
                enabled={googleEnabled}
                disabledText="Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local, then restart dev server."
              />
            </Suspense>

            <p className="text-sm text-slate-400 mt-6 text-center">
              New here?{" "}
              <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium">
                Create an account
              </Link>
            </p>
          </div>

          <aside className="rounded-3xl border border-violet-800/20 bg-linear-to-br from-violet-900/35 to-[#0f1022] p-6 sm:p-10">
            <h2 className="text-white text-2xl font-bold mb-6">Why job seekers love us</h2>
            <ul className="space-y-4">
              {[
                "AI rewrites bullet points with high-impact ATS keywords",
                "Instant ATS score and keyword gap analysis",
                "Pixel-perfect PDF output for recruiter-ready resumes",
                "Dashboard to manage all versions and applications",
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
              <p className="text-slate-300 text-sm leading-relaxed">
                &quot;I got 3 interview calls in one week after switching to CareerForge Pro. The ATS optimization is insanely good.&quot;
              </p>
              <p className="text-violet-400 text-xs mt-3">- Product Manager Candidate</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
