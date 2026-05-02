"use client";

import Link from "next/link";

type MockResume = {
  id: string;
  title: string;
  updatedAt: string;
  atsScore: number;
  template: string;
  status: string;
};

type MockResumesProps = {
  resumes: MockResume[];
};

export default function MockResumes({ resumes }: MockResumesProps) {
  if (resumes.length === 0) return null;

  return (
    <>
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="bg-[#111122] border border-slate-800 rounded-xl p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-white font-semibold">{resume.title}</h3>
            <p className="text-xs text-slate-400">Updated {resume.updatedAt}</p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/builder?id=${resume.id}`}
              className="px-3 py-1 text-xs bg-slate-700 text-white rounded"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => window.open(`/api/pdf?id=${resume.id}`)}
              className="px-3 py-1 text-xs bg-violet-600 text-white rounded"
            >
              PDF
            </button>

            <button
              type="button"
              onClick={async () => {
                await fetch(`/api/resumes/${resume.id}`, { method: "DELETE" });
                alert("Deleted!");
              }}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
