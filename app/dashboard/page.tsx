import Link from "next/link";
import Footer from "@/app/components/Footer";
import BackendResumes from "@/app/dashboard/BackendResumes";
import AuthGuard from "@/app/components/AuthGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard – CareerForge Pro",
  description: "Manage your resumes and cover letters in one place.",
};

const mockResumes = [
  {
    id: "1",
    title: "Frontend Engineer – Acme Corp",
    updatedAt: "2 hours ago",
    atsScore: 87,
    template: "Modern",
    status: "optimized",
  },
  {
    id: "2",
    title: "Full Stack Developer – StartupXYZ",
    updatedAt: "Yesterday",
    atsScore: 62,
    template: "Classic",
    status: "needs-work",
  },
  {
    id: "3",
    title: "Senior React Developer – TechGiant",
    updatedAt: "3 days ago",
    atsScore: 74,
    template: "Modern",
    status: "in-progress",
  },
];

const stats = [
  { label: "Resumes Created", value: "3", icon: "📄", change: "+1 this week" },
  { label: "Avg. ATS Score", value: "74%", icon: "🎯", change: "+8% from last" },
  { label: "Applications Sent", value: "12", icon: "📬", change: "+3 this week" },
  { label: "Interview Invites", value: "4", icon: "🤝", change: "33% conversion" },
];

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor =
    score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-bold ${textColor} w-10 text-right`}>{score}%</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; classes: string }> = {
    optimized: { label: "Optimized", classes: "bg-emerald-900/30 text-emerald-400 border-emerald-700/40" },
    "needs-work": { label: "Needs Work", classes: "bg-red-900/30 text-red-400 border-red-700/40" },
    "in-progress": { label: "In Progress", classes: "bg-amber-900/30 text-amber-400 border-amber-700/40" },
  };
  const { label, classes } = map[status] ?? { label: status, classes: "bg-slate-800 text-slate-400 border-slate-700" };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${classes}`}>{label}</span>
  );
}

export default function DashboardPage() {
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#111122] border border-slate-800/60 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{stat.icon}</span>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
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
          <div className="grid grid-cols-1 gap-4">
            <BackendResumes />
            {mockResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-[#111122] border border-slate-800/60 hover:border-violet-700/40 rounded-2xl p-5 transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Resume thumb mockup */}
                  <div className="hidden sm:flex w-14 h-16 bg-gradient-to-b from-violet-900/30 to-[#1a1a2e] border border-violet-800/40 rounded-lg flex-shrink-0 items-center justify-center">
                    <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm truncate">{resume.title}</h3>
                      <StatusBadge status={resume.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                      <span>Updated {resume.updatedAt}</span>
                      <span>Template: {resume.template}</span>
                    </div>
                    <ScoreBar score={resume.atsScore} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href="/builder"
                      className="text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 px-3 py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                    <button className="text-xs text-violet-400 hover:text-violet-300 bg-violet-900/20 hover:bg-violet-900/40 border border-violet-700/30 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      PDF
                    </button>
                    <button className="text-xs text-slate-500 hover:text-red-400 bg-slate-800/40 hover:bg-red-900/20 border border-slate-700/30 px-2.5 py-2 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state hint */}
        <div className="mt-6 border border-dashed border-slate-700/50 rounded-2xl p-8 text-center">
          <Link
            href="/builder"
            className="inline-flex flex-col items-center gap-3 text-slate-500 hover:text-violet-400 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 group-hover:bg-violet-900/30 group-hover:border-violet-700/30 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm">Create a new resume</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
