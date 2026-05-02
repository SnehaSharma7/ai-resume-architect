import Link from "next/link";
import Footer from "@/app/components/Footer";
import BackendResumes from "@/app/dashboard/BackendResumes";
import AuthGuard from "@/app/components/AuthGuard";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const metadata: Metadata = {
  title: "Dashboard – CareerForge Pro",
  description: "Manage your resumes and cover letters in one place.",
};

function hasValidLocalSessionCookie(raw: string | undefined): boolean {
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as { email?: unknown; token?: unknown };
    return (
      typeof parsed.email === "string" &&
      parsed.email.length > 0 &&
      typeof parsed.token === "string" &&
      parsed.token.startsWith("local:")
    );
  } catch {
    return false;
  }
}

export default async function DashboardPage() {
  const [oauthSession, cookieStore] = await Promise.all([
    getServerSession(authOptions),
    cookies(),
  ]);

  const localSessionCookie = cookieStore.get("cf_session")?.value;
  const isAuthenticated = Boolean(oauthSession?.user?.email) || hasValidLocalSessionCookie(localSessionCookie);

  if (!isAuthenticated) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Auth status + logout */}
        <AuthGuard />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your resumes and track your job search progress.
            </p>
          </div>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/50 hover:-translate-y-0.5 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Resume
          </Link>
        </div>

        {/* Plan Banner */}
        <div className="relative bg-gradient-to-r from-violet-900/40 to-[#111122] border border-violet-700/40 rounded-2xl p-5 mb-8 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 80% at 0% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)",
            }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-slate-700/50 border border-slate-600/50 text-slate-300 px-2.5 py-1 rounded-full">
                  Free Plan
                </span>
                <span className="text-xs text-slate-500">1 of 1 resume used</span>
              </div>
              <p className="text-white font-semibold">Unlock Unlimited Resumes with Pro</p>
              <p className="text-slate-400 text-sm mt-0.5">
                Get AI rewrites, cover letter generation & premium PDF templates.
              </p>
            </div>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg shadow-violet-900/50"
            >
              Upgrade to Pro
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Resumes List */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">My Resumes</h2>
          <BackendResumes />
        </div>
      </div>

      <Footer />
    </div>
  );
}

