"use client";

import { useState } from "react";

type Section = "personal" | "experience" | "education" | "skills" | "jd";

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
};

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

export default function BuilderClient() {
  const [state, setState] = useState<BuilderState>(defaultState);
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const analyzeJD = () => {
    if (!state.jobDescription.trim()) return;
    setIsAnalyzing(true);

    // Simulated AI JD analysis
    setTimeout(() => {
      const sampleKeywords = [
        "Python", "Agile", "Leadership", "React", "TypeScript",
        "Communication", "Problem-solving", "REST APIs",
      ];
      // Calculate a score based on how many keywords appear in resume text
      const resumeText = [
        state.personal.summary,
        ...state.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
        state.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matched = sampleKeywords.filter((k) => resumeText.includes(k.toLowerCase()));
      const score = Math.min(95, 30 + matched.length * 10);

      setState((prev) => ({
        ...prev,
        atsScore: score,
        keywords: sampleKeywords,
      }));
      setIsAnalyzing(false);
    }, 1800);
  };

  const sections: { id: Section; label: string }[] = [
    { id: "personal", label: "Personal" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "jd", label: "JD Analysis" },
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
                        const resumeText = [
                          state.personal.summary,
                          ...state.experience.flatMap((e) => [e.role, ...e.bullets]),
                          state.skills,
                        ]
                          .join(" ")
                          .toLowerCase();
                        const matched = resumeText.includes(kw.toLowerCase());
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
            <button className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-violet-900/50">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>

        {/* Resume preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
          <div className="w-full max-w-2xl bg-white text-gray-900 rounded-xl shadow-2xl shadow-black/40 min-h-[900px] overflow-hidden">
            {/* Resume Header */}
            <div className="bg-gradient-to-r from-violet-700 to-violet-900 px-8 py-7 text-white">
              <h1 className="text-2xl font-bold tracking-wide">
                {state.personal.name || (
                  <span className="opacity-40 italic font-normal text-lg">Your Name</span>
                )}
              </h1>
              {state.personal.title && (
                <p className="text-violet-200 text-sm mt-1">{state.personal.title}</p>
              )}
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-violet-200/80">
                {state.personal.email && <span>{state.personal.email}</span>}
                {state.personal.phone && <span>{state.personal.phone}</span>}
                {state.personal.location && <span>{state.personal.location}</span>}
                {state.personal.linkedin && <span>{state.personal.linkedin}</span>}
              </div>
            </div>

            <div className="px-8 py-6 space-y-6 text-sm">
              {/* Summary */}
              {state.personal.summary && (
                <section>
                  <h2 className="text-xs font-bold text-violet-700 uppercase tracking-widest border-b border-violet-200 pb-1.5 mb-3">
                    Professional Summary
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{state.personal.summary}</p>
                </section>
              )}

              {/* Experience */}
              {state.experience.some((e) => e.company || e.role) && (
                <section>
                  <h2 className="text-xs font-bold text-violet-700 uppercase tracking-widest border-b border-violet-200 pb-1.5 mb-3">
                    Work Experience
                  </h2>
                  <div className="space-y-5">
                    {state.experience
                      .filter((e) => e.company || e.role)
                      .map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">{exp.role}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{exp.company}</div>
                            </div>
                            {exp.period && (
                              <div className="text-gray-400 text-xs flex-shrink-0 ml-4">{exp.period}</div>
                            )}
                          </div>
                          {exp.bullets.filter(Boolean).length > 0 && (
                            <ul className="mt-2 space-y-1.5 ml-3">
                              {exp.bullets.filter(Boolean).map((b, i) => (
                                <li key={i} className="flex gap-2 text-gray-600">
                                  <span className="text-violet-500 flex-shrink-0">•</span>
                                  <span>{b}</span>
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
                  <h2 className="text-xs font-bold text-violet-700 uppercase tracking-widest border-b border-violet-200 pb-1.5 mb-3">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {state.education
                      .filter((e) => e.institution)
                      .map((edu) => (
                        <div key={edu.id} className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{edu.institution}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{edu.degree}</div>
                          </div>
                          {edu.year && <div className="text-gray-400 text-xs flex-shrink-0 ml-4">{edu.year}</div>}
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {state.skills.trim() && (
                <section>
                  <h2 className="text-xs font-bold text-violet-700 uppercase tracking-widest border-b border-violet-200 pb-1.5 mb-3">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {state.skills
                      .split(/[,\n]/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="bg-violet-50 border border-violet-200 text-violet-700 text-xs px-2.5 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {!state.personal.name &&
                !state.experience.some((e) => e.company) &&
                !state.education.some((e) => e.institution) &&
                !state.skills.trim() && (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
