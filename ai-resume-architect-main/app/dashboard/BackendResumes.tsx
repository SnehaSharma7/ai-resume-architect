"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getResumes, type ResumeRecord } from "@/lib/api";

export default function BackendResumes() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadResumes = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await getResumes();
        if (isMounted) {
          setResumes(response.resumes || []);
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

  if (resumes.length === 0) return null;

  return (
    <>
      {resumes.map((resume, index) => (
        <div
          key={`backend-${index}`}
          className="bg-[#111122] border border-slate-800/60 hover:border-violet-700/40 rounded-2xl p-5 transition-all duration-200 group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="hidden sm:flex w-14 h-16 bg-gradient-to-b from-emerald-900/30 to-[#1a1a2e] border border-emerald-800/40 rounded-lg flex-shrink-0 items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-white font-semibold text-sm truncate">{resume.title}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full border bg-emerald-900/30 text-emerald-400 border-emerald-700/40">Saved</span>
              </div>
              <div className="text-xs text-slate-500">Generated via Builder</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/builder"
                className="text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 px-3 py-2 rounded-lg transition-colors"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
