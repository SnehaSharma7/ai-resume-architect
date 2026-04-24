import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req: NextRequest) {
  const { name, title, experience, skills, jobDescription, companyName } = await req.json();

  if (!name || !jobDescription) {
    return NextResponse.json(
      { error: "Name and job description are required" },
      { status: 400 }
    );
  }

  if (!GEMINI_API_KEY) {
    return NextResponse.json({
      coverLetter: fallbackCoverLetter(name, title, experience, skills, jobDescription, companyName),
    });
  }

  try {
    const prompt = `You are an expert career coach. Write a professional cover letter for the following candidate applying to a job.

CANDIDATE:
- Name: ${name}
- Title: ${title || "Professional"}
- Experience: ${(experience || "").slice(0, 2000)}
- Skills: ${(skills || "").slice(0, 500)}

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 3000)}
"""

${companyName ? `Company: ${companyName}` : ""}

Write a professional, compelling cover letter (3-4 paragraphs). Be specific and reference the job requirements. Use a confident but not arrogant tone. Do NOT include addresses or date headers — start directly with "Dear Hiring Manager,".

Respond with ONLY the cover letter text.`;

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        coverLetter: fallbackCoverLetter(name, title, experience, skills, jobDescription, companyName),
      });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    return NextResponse.json({ coverLetter: text });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json({
      coverLetter: fallbackCoverLetter(name, title, experience, skills, jobDescription, companyName),
    });
  }
}

function fallbackCoverLetter(
  name: string,
  title: string,
  experience: string,
  skills: string,
  jobDescription: string,
  companyName: string
): string {
  const company = companyName || "your organization";
  const role = title || "the advertised position";

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With my background and expertise${skills ? ` in ${skills.split(/[,\n]/).slice(0, 3).map(s => s.trim()).filter(Boolean).join(", ")}` : ""}, I am confident in my ability to make a meaningful contribution to your team.

${experience ? `Throughout my career, I have developed a robust skill set that aligns well with the requirements outlined in your job description. My experience includes ${experience.split(/[.\n]/).filter(Boolean).slice(0, 2).map(s => s.trim()).join(". ")}.` : "I bring a diverse set of professional experiences that have prepared me well for this opportunity."}

I am particularly drawn to this role because of the opportunity to leverage my skills in a challenging and dynamic environment. I am excited about the prospect of contributing to ${company} and am eager to bring my dedication and expertise to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how my qualifications align with your needs.

Sincerely,
${name}`;
}
