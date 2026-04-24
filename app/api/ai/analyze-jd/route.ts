import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req: NextRequest) {
  const { jobDescription, resumeText } = await req.json();

  if (!jobDescription || typeof jobDescription !== "string") {
    return NextResponse.json({ error: "Job description is required" }, { status: 400 });
  }

  if (!GEMINI_API_KEY) {
    // Fallback: simple keyword extraction without AI
    return NextResponse.json(fallbackAnalysis(jobDescription, resumeText ?? ""));
  }

  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyst. Analyze the following Job Description and extract the most important keywords and phrases that an ATS would look for.

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 4000)}
"""

CANDIDATE RESUME TEXT:
"""
${(resumeText ?? "").slice(0, 4000)}
"""

Respond ONLY with valid JSON (no markdown, no code fences) in this exact format:
{
  "keywords": ["keyword1", "keyword2", ...],
  "matched": ["keyword1", ...],
  "missing": ["keyword2", ...],
  "score": 72,
  "suggestions": ["Add 'keyword2' to your skills section", ...]
}

Rules:
- Extract 8-15 keywords/phrases from the JD (skills, tools, methodologies, soft skills)
- "matched" = keywords found in the resume text
- "missing" = keywords NOT found in the resume text
- "score" = percentage (0-100) based on keyword match ratio, weighted by importance
- "suggestions" = 3-5 actionable tips to improve the ATS score`;

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini API error:", err);
      return NextResponse.json(fallbackAnalysis(jobDescription, resumeText ?? ""));
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Parse JSON from Gemini response (strip code fences if present)
    const jsonStr = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(fallbackAnalysis(jobDescription, resumeText ?? ""));
  }
}

function fallbackAnalysis(jd: string, resumeText: string) {
  // Extract likely keywords from JD using common tech/skill patterns
  const techPatterns = /\b(python|java|javascript|typescript|react|angular|vue|node\.?js|sql|nosql|mongodb|aws|azure|gcp|docker|kubernetes|git|ci\/cd|agile|scrum|rest\s?apis?|graphql|html|css|tailwind|next\.?js|express|django|flask|spring|leadership|communication|problem.solving|team.?work|analytical|project.management|data.analysis|machine.learning|ai|ml|deep.learning|tensorflow|pytorch|excel|tableau|power.?bi|figma|sketch|adobe|photoshop|illustrator|jira|confluence|slack|salesforce|sap|oracle|linux|unix|bash|shell|c\+\+|c#|\.net|ruby|rails|php|laravel|go|golang|rust|swift|kotlin|flutter|react.native|mobile|responsive|accessibility|seo|devops|testing|qa|automation|selenium|cypress|jest|mocha)\b/gi;

  const jdLower = jd.toLowerCase();
  const matches = jdLower.match(techPatterns) || [];
  const uniqueKeywords = [...new Set(matches.map((k) => k.trim()))].slice(0, 12);

  // Also extract capitalized phrases (likely important nouns/tools)
  const phraseMatches = jd.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g) || [];
  const extraKeywords = phraseMatches
    .filter((p) => p.length > 3 && !["The", "This", "That", "With", "From", "Your", "Our", "You", "And", "For", "Are", "Will", "Must", "Have"].includes(p))
    .slice(0, 5);

  const allKeywords = [...new Set([...uniqueKeywords, ...extraKeywords])].slice(0, 12);

  const resumeLower = resumeText.toLowerCase();
  const matched = allKeywords.filter((k) => resumeLower.includes(k.toLowerCase()));
  const missing = allKeywords.filter((k) => !resumeLower.includes(k.toLowerCase()));
  const score = allKeywords.length > 0 ? Math.round((matched.length / allKeywords.length) * 100) : 0;

  return {
    keywords: allKeywords,
    matched,
    missing,
    score,
    suggestions: missing.slice(0, 4).map((k) => `Add "${k}" to your resume to improve your ATS match`),
  };
}
