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
];

export default async function DashboardPage() {
  const [oauthSession, cookieStore] = await Promise.all([
    getServerSession(authOptions),
    cookies(),
  ]);

  const localSessionCookie = cookieStore.get("cf_session")?.value;
  const isAuthenticated =
    Boolean(oauthSession?.user?.email) ||
    hasValidLocalSessionCookie(localSessionCookie);

  if (!isAuthenticated) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">

        <AuthGuard />

        <h1 className="text-2xl font-bold text-white mb-6">
          My Dashboard
        </h1>

        {/* RESUMES */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            My Resumes
          </h2>

          <div className="space-y-4">

            {/* REAL DATA */}
            <BackendResumes />

            {/* MOCK DATA */}
            {mockResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-[#111122] border border-slate-800 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-white font-semibold">
                    {resume.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Updated {resume.updatedAt}
                  </p>
                </div>

                {/* ✅ FIXED BUTTONS */}
                <div className="flex gap-2">

                  {/* EDIT */}
                  <Link
                    href={`/builder?id=${resume.id}`}
                    className="px-3 py-1 text-xs bg-slate-700 text-white rounded"
                  >
                    Edit
                  </Link>

                  {/* PDF */}
                 <a
                   href={`/api/pdf?id=${resume.id}`}
                   className="px-3 py-1 text-xs bg-violet-600 text-white rounded"
                   >
                    PDF
                  </a>

                  {/* DELETE */}
                  <form
                   action={`/api/resumes/${resume.id}`}
                    method="POST"
                  >
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </form>

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}