"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  generateResume as generateResumeRequest,
  getResumeById,
  updateResume,
} from "@/lib/api";

type Section = "personal" | "experience" | "education" | "skills" | "jd" | "coverletter";

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
}

interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

interface BuilderState {
  personal: PersonalInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string;
  jobDescription: string;
  atsScore: number | null;
  keywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  coverLetter: string;
}

const defaultState: BuilderState = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
  },
  experience: [
    {
      id: "1",
      company: "",
      role: "",
      period: "",
      bullets: [""],
    },
  ],
  education: [{ id: "1", institution: "", degree: "", year: "" }],
  skills: "",
  jobDescription: "",
  atsScore: null,
  keywords: [],
  matchedKeywords: [],
  missingKeywords: [],
  suggestions: [],
  coverLetter: "",
};

function parseResumeContent(content: string): Partial<BuilderState> {
  const lines = content.split("\n").map((line) => line.trim());
  const personal = {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
  };
  const sections: Record<"skills" | "education" | "experience", string[]> = {
    skills: [],
    education: [],
    experience: [],
  };
  let current: keyof typeof sections | null = null;

  for (const line of lines) {
    if (!line || line.startsWith("====")) continue;

    if (line.toLowerCase().startsWith("name:")) {
      personal.name = line.split(":", 2)[1]?.trim() ?? "";
      current = null;
      continue;
    }

    if (line.toLowerCase().startsWith("title:")) {
      personal.title = line.split(":", 2)[1]?.trim() ?? "";
      current = null;
      continue;
    }

    if (line.toLowerCase().startsWith("email:")) {
      personal.email = line.split(":", 2)[1]?.trim() ?? "";
      current = null;
      continue;
    }

    if (line.toLowerCase().startsWith("phone:")) {
      personal.phone = line.split(":", 2)[1]?.trim() ?? "";
      current = null;
      continue;
    }

    if (line.toLowerCase().startsWith("location:")) {
      personal.location = line.split(":", 2)[1]?.trim() ?? "";
      current = null;
      continue;
    }

    if (line.toLowerCase().startsWith("linkedin:")) {
      personal.linkedin = line.split(":", 2)[1]?.trim() ?? "";
      current = null;
      continue;
    }

    if (line.toLowerCase().startsWith("summary:")) {
      personal.summary = line.split(":", 2)[1]?.trim() ?? "";
      current = null;
      continue;
    }

    if (line.toLowerCase() === "skills:") {
      current = "skills";
      continue;
    }

    if (line.toLowerCase() === "education:") {
      current = "education";
      continue;
    }

    if (line.toLowerCase() === "experience:") {
      current = "experience";
      continue;
    }

    if (current) sections[current].push(line);
  }

  const experienceRows = sections.experience.length > 0 ? sections.experience : [""];
  const parsedExperience = experienceRows.map((row, index) => {
    const [headline, details] = row.split(":", 2);
    const headlineParts = (headline || "").split("-").map((part) => part.trim()).filter(Boolean);

    return {
      id: `${index + 1}`,
      role: headlineParts[0] || "",
      company: headlineParts[1] || "",
      period: headlineParts[2] || "",
      bullets:
        details
          ?.split(";")
          .map((bullet) => bullet.trim())
          .filter(Boolean) ?? [""],
    };
  });

  return {
    personal: {
      ...defaultState.personal,
      ...personal,
      title: personal.title || parsedExperience[0]?.role || "",
      summary: personal.summary || sections.experience.join(" "),
    },
    skills: sections.skills.join("\n"),
    education:
      sections.education.length > 0
        ? sections.education.map((entry, index) => ({
            id: `${index + 1}`,
            institution: "",
            degree: entry,
            year: "",
          }))
        : defaultState.education,
    experience: parsedExperience,
  };
}

function buildResumePayloadFromState(state: BuilderState) {
  const name = state.personal.name.trim();
  const title = state.personal.title.trim();
  const email = state.personal.email.trim();
  const phone = state.personal.phone.trim();
  const location = state.personal.location.trim();
  const linkedin = state.personal.linkedin.trim();
  const summary = state.personal.summary.trim();
  const skills = state.skills.trim();
  const education = state.education
    .map((item) => [item.degree, item.institution, item.year].filter(Boolean).join(" - "))
    .filter(Boolean)
    .join("\n");
  const experience = state.experience
    .map((item) => {
      const headline = [item.role, item.company, item.period].filter(Boolean).join(" - ");
      const bullets = item.bullets.filter(Boolean).join("; ");
      return [headline, bullets].filter(Boolean).join(": ");
    })
    .filter(Boolean)
    .join("\n");

  return {
    name,
    title,
    email,
    phone,
    location,
    linkedin,
    summary,
    skills,
    education,
    experience,
  };
}

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" className="-rotate-90">
        <circle cx="44" cy="44" r={radius} strokeWidth="6" stroke="#1e1e3a" fill="none" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          strokeWidth="6"
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="text-center -mt-[62px] mb-[14px]">
        <div className="text-2xl font-black" style={{ color }}>
          {score}%
        </div>
      </div>
    </div>
  );
}

type BuilderClientProps = {
  resumeId?: number | null;
};

export default function BuilderClient({ resumeId = null }: BuilderClientProps) {
  const searchParams = useSearchParams();
  const resumeIdFromQueryRaw = Number(searchParams.get("resumeId"));
  const resumeIdFromQuery =
    Number.isInteger(resumeIdFromQueryRaw) && resumeIdFromQueryRaw > 0
      ? resumeIdFromQueryRaw
      : null;
  const effectiveResumeId = resumeIdFromQuery ?? resumeId;

  const [state, setState] = useState<BuilderState>(defaultState);
  const [currentResumeId, setCurrentResumeId] = useState<number | null>(effectiveResumeId);
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [isHydrating, setIsHydrating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [rewritingBullet, setRewritingBullet] = useState<string | null>(null); // "expId-idx"
  const [rewriteError, setRewriteError] = useState("");
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [coverLetterError, setCoverLetterError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!effectiveResumeId) return;

    let isMounted = true;

    const loadResume = async () => {
      setIsHydrating(true);
      setExportError("");

      try {
        const response = await getResumeById(effectiveResumeId);
        if (!isMounted) return;

        const parsed = parseResumeContent(response.resume.content);
        setState((prev) => ({
          ...prev,
          ...parsed,
          personal: {
            ...prev.personal,
            ...(parsed.personal || {}),
          },
        }));
      } catch (error) {
        if (!isMounted) return;
        setExportError(error instanceof Error ? error.message : "Unable to load resume for editing.");
      } finally {
        if (isMounted) setIsHydrating(false);
      }
    };

    void loadResume();

    return () => {
      isMounted = false;
    };
  }, [effectiveResumeId]);

  useEffect(() => {
    setCurrentResumeId(effectiveResumeId);
  }, [effectiveResumeId]);

  const updatePersonal = (field: keyof PersonalInfo, value: string) => {
    setState((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const addExperience = () => {
    setState((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), company: "", role: "", period: "", bullets: [""] },
      ],
    }));
  };

  const updateExperience = (id: string, field: keyof Omit<ExperienceEntry, "id" | "bullets">, value: string) => {
    setState((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const updateBullet = (expId: string, idx: number, value: string) => {
    setState((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId
          ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? value : b)) }
          : e
      ),
    }));
  };

  const addBullet = (expId: string) => {
    setState((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setState((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const updateEducation = (id: string, field: keyof Omit<EducationEntry, "id">, value: string) => {
    setState((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const addEducation = () => {
    setState((prev) => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), institution: "", degree: "", year: "" }],
    }));
  };

  const analyzeJD = async () => {
    if (!state.jobDescription.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError("");

    try {
      const resumeText = [
        state.personal.summary,
        ...state.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
        state.skills,
      ].join(" ");

      const res = await fetch("/api/ai/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: state.jobDescription, resumeText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unable to analyze job description.");
      }

      setState((prev) => ({
        ...prev,
        atsScore: data.score ?? 0,
        keywords: data.keywords ?? [],
        matchedKeywords: data.matched ?? [],
        missingKeywords: data.missing ?? [],
        suggestions: data.suggestions ?? [],
      }));
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Unable to analyze job description.");
      // Fallback to simple analysis
      setState((prev) => ({
        ...prev,
        atsScore: 30,
        keywords: [],
        matchedKeywords: [],
        missingKeywords: [],
        suggestions: ["Unable to analyze — check your connection and try again."],
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const rewriteBullet = async (expId: string, bulletIdx: number) => {
    const key = `${expId}-${bulletIdx}`;
    setRewritingBullet(key);
    setRewriteError("");

    try {
      const exp = state.experience.find((e) => e.id === expId);
      const bullet = exp?.bullets[bulletIdx] ?? "";
      if (!bullet.trim()) {
        setRewritingBullet(null);
        return;
      }

      const res = await fetch("/api/ai/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet,
          keywords: state.missingKeywords.length > 0 ? state.missingKeywords : state.keywords,
          role: exp?.role,
          company: exp?.company,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to rewrite bullet.");
      }

      if (data.rewritten) {
        updateBullet(expId, bulletIdx, data.rewritten);
      }
    } catch (error) {
      setRewriteError(error instanceof Error ? error.message : "Failed to rewrite bullet.");
    } finally {
      setRewritingBullet(null);
    }
  };

  const generateCoverLetter = async () => {
    if (!state.personal.name || !state.jobDescription) return;
    setIsGeneratingCL(true);
    setCoverLetterError("");

    try {
      const experience = state.experience
        .filter((e) => e.company || e.role)
        .map((e) => {
          const headline = [e.role, e.company, e.period].filter(Boolean).join(" at ");
          const bullets = e.bullets.filter(Boolean).join(". ");
          return [headline, bullets].filter(Boolean).join(": ");
        })
        .join("\n");

      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.personal.name,
          title: state.personal.title,
          experience,
          skills: state.skills,
          jobDescription: state.jobDescription,
          companyName: "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate cover letter.");
      }

      setState((prev) => ({ ...prev, coverLetter: data.coverLetter ?? "" }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate cover letter.";
      setCoverLetterError(message);
      setState((prev) => ({
        ...prev,
        coverLetter: message,
      }));
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const handleExportPDF = async () => {
    setExportError("");
    setSaveMessage("");

    const payload = buildResumePayloadFromState(state);
    const { name } = payload;

    if (!name) {
      setExportError("Please fill in at least your name before exporting.");
      return;
    }

    setIsExporting(true);
    try {
      if (currentResumeId) {
        await updateResume(currentResumeId, payload);
      } else {
        const created = await generateResumeRequest(payload);
        if (typeof created.resumeId === "number") {
          setCurrentResumeId(created.resumeId);
        }
      }

      // Print the resume preview as PDF
      const resumeEl = resumeRef.current;
      if (!resumeEl) return;

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        setExportError("Pop-up blocked. Please allow pop-ups and try again.");
        return;
      }

      // Collect all stylesheets from the current page
      const styleSheets = Array.from(document.styleSheets);
      let cssText = "";
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          cssText += rules.map((r) => r.cssText).join("\n");
        } catch {
          // cross-origin sheets – copy via link tag instead
          if (sheet.href) {
            cssText += `@import url("${sheet.href}");\n`;
          }
        }
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${name} - Resume</title>
          <style>
            ${cssText}
            @page { margin: 0; }
            @media print {
              html, body { margin: 0; padding: 0; }
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
            body { margin: 0; padding: 20px 0; background: white; display: flex; justify-content: center; }
            .resume-root { width: 100%; max-width: 672px; margin: 0 auto; border-radius: 0 !important; box-shadow: none !important; min-height: auto !important; }
          </style>
        </head>
        <body>
          <div class="resume-root">${resumeEl.innerHTML}</div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => { printWindow.print(); printWindow.close(); }, 600);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveResume = async () => {
    setExportError("");
    setSaveMessage("");

    const name = state.personal.name.trim();
    if (!name) {
      setExportError("Please fill in at least your name before saving.");
      return;
    }

    const payload = buildResumePayloadFromState(state);

    setIsSaving(true);
    try {
      if (currentResumeId) {
        await updateResume(currentResumeId, payload);
      } else {
        const created = await generateResumeRequest(payload);
        if (typeof created.resumeId === "number") {
          setCurrentResumeId(created.resumeId);
        }
      }

      setSaveMessage("Resume saved. It is now visible on your dashboard.");
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyCoverLetter = async () => {
    try {
      await navigator.clipboard.writeText(state.coverLetter);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setCoverLetterError("Failed to copy cover letter. Please try again.");
    }
  };

  const sections: { id: Section; label: string }[] = [
    { id: "personal", label: "Personal" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "jd", label: "JD Analysis" },
    { id: "coverletter", label: "Cover Letter" },
  ];

  const inputClass =
    "w-full bg-[#1a1a2e] border border-slate-700/50 focus:border-violet-500/70 text-slate-200 placeholder-slate-600 text-sm rounded-lg px-3 py-2.5 outline-none transition-colors";
  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-[#0d0d1a]">
      {/* ── LEFT: Form Panel ── */}
      <div className="lg:w-[46%] xl:w-2/5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800/50 overflow-y-auto">
        {/* Section tabs */}
        <div className="sticky top-0 z-10 bg-[#0d0d1a] border-b border-slate-800/50 px-4 py-3">
          {isHydrating && (
            <div className="mb-3 rounded-lg border border-violet-700/40 bg-violet-900/20 px-3 py-2 text-xs text-violet-200">
              Loading resume data...
            </div>
          )}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex-shrink-0 text-xs font-medium px-3.5 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === s.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {/* Personal Info */}
          {activeSection === "personal" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Jane Doe"
                    value={state.personal.name}
                    onChange={(e) => updatePersonal("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Professional Title</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Senior Software Engineer"
                    value={state.personal.title}
                    onChange={(e) => updatePersonal("title", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="jane@example.com"
                    value={state.personal.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    className={inputClass}
                    placeholder="+1 (555) 000-0000"
                    value={state.personal.phone}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="San Francisco, CA"
                    value={state.personal.location}
                    onChange={(e) => updatePersonal("location", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input
                    type="url"
                    className={inputClass}
                    placeholder="linkedin.com/in/janedoe"
                    value={state.personal.linkedin}
                    onChange={(e) => updatePersonal("linkedin", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Professional Summary</label>
                <textarea
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="A brief summary of your professional background, key skills, and career goals..."
                  value={state.personal.summary}
                  onChange={(e) => updatePersonal("summary", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Experience */}
          {activeSection === "experience" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Work Experience</h2>
                <button
                  onClick={addExperience}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Entry
                </button>
              </div>
              {state.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#111122] border border-slate-800/60 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className={labelClass}>Company</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Acme Corp"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Role</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Software Engineer"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Period</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Jan 2022 – Present"
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
                        />
                      </div>
                    </div>
                    {state.experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors mt-1 flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Bullet Points</label>
                    <div className="space-y-2">
                      {exp.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-violet-500 mt-2.5 text-xs">•</span>
                          <input
                            type="text"
                            className={`${inputClass} flex-1`}
                            placeholder="Achieved X by doing Y which resulted in Z..."
                            value={bullet}
                            onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                          />
                          <button
                            onClick={() => rewriteBullet(exp.id, idx)}
                            disabled={rewritingBullet === `${exp.id}-${idx}` || !bullet.trim()}
                            title="AI Rewrite – optimize this bullet for ATS"
                            className="mt-1 p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                          >
                            {rewritingBullet === `${exp.id}-${idx}` ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addBullet(exp.id)}
                      className="mt-2 text-xs text-slate-500 hover:text-violet-400 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {activeSection === "education" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Education</h2>
                <button
                  onClick={addEducation}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Entry
                </button>
              </div>
              {state.education.map((edu) => (
                <div key={edu.id} className="bg-[#111122] border border-slate-800/60 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Institution</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="MIT"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Degree</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="B.S. Computer Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Graduation Year</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="2022"
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {activeSection === "skills" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white">Skills</h2>
              <p className="text-slate-500 text-xs">
                Enter your skills separated by commas or new lines. These will be displayed in a clean
                tag format on your resume.
              </p>
              <textarea
                rows={8}
                className={`${inputClass} resize-none`}
                placeholder="Python, React, TypeScript, Node.js, AWS, Leadership, Agile, Communication..."
                value={state.skills}
                onChange={(e) => setState((prev) => ({ ...prev, skills: e.target.value }))}
              />
              {/* Preview tags */}
              {state.skills.trim() && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {state.skills
                    .split(/[,\n]/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="bg-violet-900/30 border border-violet-700/40 text-violet-300 text-xs px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* JD Analysis */}
          {activeSection === "jd" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white">JD Analysis Agent</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Paste the target Job Description below. Our AI will extract critical keywords and calculate
                your ATS match score.
              </p>
              <textarea
                rows={10}
                className={`${inputClass} resize-none`}
                placeholder="Paste the full Job Description here..."
                value={state.jobDescription}
                onChange={(e) => setState((prev) => ({ ...prev, jobDescription: e.target.value }))}
              />
              <button
                onClick={analyzeJD}
                disabled={isAnalyzing || !state.jobDescription.trim()}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/50"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing Job Description...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze & Score
                  </>
                )}
              </button>

              {analysisError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {analysisError}
                </div>
              )}

              {rewriteError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {rewriteError}
                </div>
              )}

              {state.atsScore !== null && (
                <div className="bg-[#111122] border border-violet-800/40 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-5">
                    <ScoreRing score={state.atsScore} />
                    <div>
                      <div className="text-white font-semibold text-sm">ATS Match Score</div>
                      <div className="text-slate-400 text-xs mt-1">
                        {state.atsScore >= 75
                          ? "Great match! Keep optimizing."
                          : state.atsScore >= 50
                          ? "Good start — add more keywords."
                          : "Low match — use the AI Rewriter."}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Extracted Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {state.keywords.map((kw) => {
                        const matched = state.matchedKeywords.map(k => k.toLowerCase()).includes(kw.toLowerCase());
                        return (
                          <span
                            key={kw}
                            className={`text-xs px-2.5 py-1 rounded-full border ${
                              matched
                                ? "bg-emerald-900/30 border-emerald-700/40 text-emerald-400"
                                : "bg-slate-800/50 border-slate-700/40 text-slate-400"
                            }`}
                          >
                            {matched ? "✓ " : "✗ "}
                            {kw}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {state.suggestions.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Suggestions</div>
                      <ul className="space-y-1.5">
                        {state.suggestions.map((s, i) => (
                          <li key={i} className="text-xs text-amber-300/80 flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">→</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cover Letter Generator */}
          {activeSection === "coverletter" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white">Cover Letter Generator</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate a tailored cover letter based on your resume and the Job Description.
                {!state.jobDescription.trim() && (
                  <span className="text-amber-400 block mt-1">
                    Tip: Paste a Job Description in the &quot;JD Analysis&quot; tab first for best results.
                  </span>
                )}
              </p>
              <button
                onClick={generateCoverLetter}
                disabled={isGeneratingCL || !state.personal.name.trim() || !state.jobDescription.trim()}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/50"
              >
                {isGeneratingCL ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating Cover Letter...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate Cover Letter
                  </>
                )}
              </button>

              {coverLetterError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {coverLetterError}
                </div>
              )}

              {state.coverLetter && (
                <div className="space-y-3">
                  <textarea
                    rows={18}
                    className={`${inputClass} resize-none`}
                    value={state.coverLetter}
                    onChange={(e) => setState((prev) => ({ ...prev, coverLetter: e.target.value }))}
                  />
                  <button
                    onClick={() => void handleCopyCoverLetter()}
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy to Clipboard
                  </button>
                  {isCopied ? (
                    <p className="text-xs text-emerald-400">Copied!</p>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Live Preview Pane ── */}
      <div className="flex-1 flex flex-col bg-[#0a0a14] overflow-hidden">
        {/* Preview header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-[#0d0d1a]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            {state.atsScore !== null && (
              <div className="flex items-center gap-1.5 bg-violet-900/30 border border-violet-700/40 rounded-lg px-2.5 py-1">
                <span className="text-xs text-slate-400">ATS:</span>
                <span className="text-xs font-bold text-violet-300">{state.atsScore}%</span>
              </div>
            )}
            <button
              onClick={handleSaveResume}
              disabled={isSaving}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-900/40"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isSaving ? "Saving..." : currentResumeId ? "Save Changes" : "Save Resume"}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-violet-900/50"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>
          {saveMessage ? (
            <div className="mx-4 mt-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              {saveMessage}
            </div>
          ) : null}
          {exportError ? (
            <div className="mx-4 mt-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {exportError}
            </div>
          ) : null}
        </div>

        {/* Resume preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
          <div ref={resumeRef} className="w-full max-w-2xl bg-white text-gray-900 rounded-xl shadow-2xl shadow-black/40 min-h-[900px] overflow-hidden" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            {/* Resume Header */}
            <div className="px-10 pt-10 pb-2 text-center border-b-2 border-gray-800">
              <h1 className="text-2xl font-bold tracking-wide text-gray-900 uppercase">
                {state.personal.name || (
                  <span className="opacity-30 italic font-normal text-lg normal-case">Your Name</span>
                )}
              </h1>
              {state.personal.title && (
                <p className="text-sm text-gray-600 mt-1">{state.personal.title}</p>
              )}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 mt-2 text-xs text-gray-600">
                {state.personal.email && <span>{state.personal.email}</span>}
                {state.personal.phone && (
                  <><span className="text-gray-400">|</span><span>{state.personal.phone}</span></>
                )}
                {state.personal.location && (
                  <><span className="text-gray-400">|</span><span>{state.personal.location}</span></>
                )}
                {state.personal.linkedin && (
                  <><span className="text-gray-400">|</span><span>{state.personal.linkedin}</span></>
                )}
              </div>
            </div>

            <div className="px-10 py-6 space-y-5 text-sm">
              {/* Summary */}
              {state.personal.summary && (
                <section>
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] border-b border-gray-300 pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-[13px]">{state.personal.summary}</p>
                </section>
              )}

              {/* Experience */}
              {state.experience.some((e) => e.company || e.role) && (
                <section>
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] border-b border-gray-300 pb-1 mb-3">
                    Professional Experience
                  </h2>
                  <div className="space-y-4">
                    {state.experience
                      .filter((e) => e.company || e.role)
                      .map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-bold text-gray-900 text-[13px]">{exp.role}</div>
                              <div className="text-gray-600 text-xs italic">{exp.company}</div>
                            </div>
                            {exp.period && (
                              <div className="text-gray-500 text-xs flex-shrink-0 ml-4 font-medium">{exp.period}</div>
                            )}
                          </div>
                          {exp.bullets.filter(Boolean).length > 0 && (
                            <ul className="mt-1.5 space-y-1 ml-4 list-disc">
                              {exp.bullets.filter(Boolean).map((b, i) => (
                                <li key={i} className="text-gray-700 text-[13px] leading-snug">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {state.education.some((e) => e.institution) && (
                <section>
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] border-b border-gray-300 pb-1 mb-3">
                    Education
                  </h2>
                  <div className="space-y-2">
                    {state.education
                      .filter((e) => e.institution)
                      .map((edu) => (
                        <div key={edu.id} className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-gray-900 text-[13px]">{edu.degree}</div>
                            <div className="text-gray-600 text-xs italic">{edu.institution}</div>
                          </div>
                          {edu.year && <div className="text-gray-500 text-xs flex-shrink-0 ml-4 font-medium">{edu.year}</div>}
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {state.skills.trim() && (
                <section>
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] border-b border-gray-300 pb-1 mb-2">
                    Technical Skills
                  </h2>
                  <p className="text-gray-700 text-[13px] leading-relaxed">
                    {state.skills
                      .split(/[,\n]/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .join("  \u00B7  ")}
                  </p>
                </section>
              )}

              {/* Empty state */}
              {!state.personal.name &&
                !state.experience.some((e) => e.company) &&
                !state.education.some((e) => e.institution) &&
                !state.skills.trim() && (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Start filling in your details on the left
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      Your resume preview will appear here
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
