import { NextResponse } from "next/server";
import { createLocalResume, listLocalResumes } from "@/lib/resumeStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:5000";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (body as { error?: string; message?: string })?.error ||
        (body as { error?: string; message?: string })?.message ||
        "Unable to fetch resumes.";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ resumes: listLocalResumes() });
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  try {
    const response = await fetch(`${API_BASE_URL}/generate-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (body as { error?: string; message?: string })?.error ||
        (body as { error?: string; message?: string })?.message ||
        "Unable to generate resume.";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(body, { status: response.status });
  } catch {
    const created = createLocalResume(payload as {
      name?: string;
      skills?: string;
      education?: string;
      experience?: string;
    });

    return NextResponse.json({ resume: created.content, resumeId: created.id });
  }
}
