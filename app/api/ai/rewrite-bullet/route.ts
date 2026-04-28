import { NextRequest, NextResponse } from "next/server";
import { rewriteBulletSchema } from "@/lib/validations";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const parsed = rewriteBulletSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { bullet, keywords, role, company } = parsed.data;

  if (!GEMINI_API_KEY) {
    // Fallback: simple keyword insertion
    return NextResponse.json({
      rewritten: fallbackRewrite(bullet, keywords ?? []),
    });
  }

  try {
    const kwList = (keywords ?? []).slice(0, 10).join(", ");
    const context = [role, company].filter(Boolean).join(" at ");

    const prompt = `You are an expert resume writer specializing in ATS optimization. Rewrite the following resume bullet point to:
1. Sound more authoritative and results-driven
2. Naturally incorporate these target keywords where relevant: ${kwList}
3. Use strong action verbs
4. Include quantifiable achievements when possible
5. Keep it concise (1-2 lines)

${context ? `Context: This bullet is for the role of ${context}.` : ""}

ORIGINAL BULLET:
"${bullet.slice(0, 500)}"

Respond with ONLY the rewritten bullet point text. No quotes, no explanation, no preamble.`;

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        rewritten: fallbackRewrite(bullet, keywords ?? []),
      });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    return NextResponse.json({ rewritten: text || bullet });
  } catch (error) {
    console.error("AI rewrite error:", error);
    return NextResponse.json({
      rewritten: fallbackRewrite(bullet, keywords ?? []),
    });
  }
}

function fallbackRewrite(bullet: string, keywords: string[]): string {
  // Simple enhancement: capitalize action verbs, append relevant keywords
  let result = bullet.trim();

  // Replace weak openings with stronger action verbs
  const weakToStrong: Record<string, string> = {
    "worked on": "Spearheaded",
    "helped with": "Contributed to",
    "was responsible for": "Managed",
    "did": "Executed",
    "made": "Developed",
    "used": "Leveraged",
    "worked with": "Collaborated with",
  };

  for (const [weak, strong] of Object.entries(weakToStrong)) {
    const regex = new RegExp(`^${weak}\\b`, "i");
    if (regex.test(result)) {
      result = result.replace(regex, strong);
      break;
    }
  }

  // Append missing keywords naturally
  const bulletLower = result.toLowerCase();
  const missing = keywords.filter((k) => !bulletLower.includes(k.toLowerCase())).slice(0, 2);
  if (missing.length > 0) {
    result += `, utilizing ${missing.join(" and ")}`;
  }

  return result;
}
