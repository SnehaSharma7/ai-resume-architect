"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteResume, getResumes, type ResumeRecord } from "@/lib/api";

function estimateAtsScore(content: string): number {
  const tokens = content.toLowerCase();
  const keywordHits = ["experience", "skills", "education", "project", "impact"].reduce(
    (acc, keyword) => (tokens.includes(keyword) ? acc + 1 : acc),
    0
  );
  const lengthFactor = Math.min(30, Math.floor(content.length / 60));
  return Math.max(40, Math.min(95, 45 + keywordHits * 6 + lengthFactor));
}

function getStatus(score: number): "optimized" | "needs-work" | "in-progress" {
  if (score >= 80) return "optimized";
  if (score < 65) return "needs-work";
  return "in-progress";
}

function StatusBadge({ status }: { status: "optimized" | "needs-work" | "in-progress" }) {
  const map = {
    optimized: "bg-emerald-900/30 text-emerald-400 border-emerald-700/40",
    "needs-work": "bg-red-900/30 text-red-400 border-red-700/40",
    "in-progress": "bg-amber-900/30 text-amber-400 border-amber-700/40",
  };

  const label =
    status === "optimized" ? "Optimized" : status === "needs-work" ? "Needs Work" : "In Progress";

  return <span className={`text-xs px-2.5 py-1 rounded-full border ${map[status]}`}>{label}</span>;
}

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

export default function BackendResumes() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadResumes = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await getResumes();
        if (isMounted) {
          const sorted = [...(response.resumes || [])].sort((a, b) => b.id - a.id);
          setResumes(sorted);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load resumes.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadResumes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError("");
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((resume) => resume.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete resume.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalResumes = resumes.length;
  const averageScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce((sum, resume) => sum + estimateAtsScore(resume.content), 0) / resumes.length
        )
      : 0;
  const latestResumeTitle = resumes[0]?.title ?? "No resumes yet";

  if (isLoading) {
    return <p className="text-sm text-slate-400 py-4">Loading saved resumes...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="mt-2 border border-dashed border-slate-700/50 rounded-2xl p-8 text-center">
        <Link
          href="/builder"
          className="inline-flex flex-col items-center gap-3 text-slate-500 hover:text-violet-400 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 group-hover:bg-violet-900/30 group-hover:border-violet-700/30 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm">Create your first resume</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#111122] border border-slate-800/60 rounded-2xl p-5">
          <div className="text-2xl font-black text-white mb-1">{totalResumes}</div>
          <div className="text-xs text-slate-500">Resumes Created</div>
        </div>
        <div className="bg-[#111122] border border-slate-800/60 rounded-2xl p-5">
          <div className="text-2xl font-black text-white mb-1">{averageScore}%</div>
          <div className="text-xs text-slate-500">Estimated ATS Score</div>
        </div>
        <div className="bg-[#111122] border border-slate-800/60 rounded-2xl p-5 col-span-2 lg:col-span-1">
          <div className="text-sm font-semibold text-white truncate mb-1">{latestResumeTitle}</div>
          <div className="text-xs text-slate-500">Latest Resume</div>
        </div>
      </div>

      {resumes.map((resume) => {
        const score = estimateAtsScore(resume.content);
        const status = getStatus(score);

        return (
        <div
          key={`backend-${resume.id}`}
          className="bg-[#111122] border border-slate-800/60 hover:border-violet-700/40 rounded-2xl p-5 transition-all duration-200 group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="hidden sm:flex w-14 h-16 bg-gradient-to-b from-violet-900/30 to-[#1a1a2e] border border-violet-800/40 rounded-lg flex-shrink-0 items-center justify-center">
              <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-white font-semibold text-sm truncate">{resume.title}</h3>
                <StatusBadge status={status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                <span>Resume ID: {resume.id}</span>
                <span>Generated via Builder</span>
              </div>
              <ScoreBar score={score} />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href={`/builder?resumeId=${resume.id}`}
                className="text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 px-3 py-2 rounded-lg transition-colors"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => void handleDelete(resume.id)}
                disabled={deletingId === resume.id}
                className="text-xs text-slate-500 hover:text-red-400 bg-slate-800/40 hover:bg-red-900/20 border border-slate-700/30 px-2.5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingId === resume.id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}
