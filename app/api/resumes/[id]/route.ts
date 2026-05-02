import { NextRequest, NextResponse } from "next/server";
import {
  deleteLocalResume,
  getLocalResumeById,
  updateLocalResume,
} from "@/lib/resumeStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:5000";

async function proxyResumeRequest(
  method: "GET" | "PUT" | "DELETE",
  request: NextRequest,
  id: string
) {
  const resumeId = Number(id);

  if (!Number.isInteger(resumeId) || resumeId <= 0) {
    return NextResponse.json({ error: "Invalid resume id" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "PUT" ? await request.text() : undefined,
      cache: "no-store",
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok && method === "GET") {
      const local = getLocalResumeById(resumeId);
      if (local) {
        return NextResponse.json({ resume: local });
      }
    }

    return NextResponse.json(body, { status: response.status });
  } catch {
    if (method === "GET") {
      const local = getLocalResumeById(resumeId);
      if (!local) {
        return NextResponse.json({ error: "Resume not found" }, { status: 404 });
      }
      return NextResponse.json({ resume: local });
    }

    if (method === "PUT") {
      const payload = (await request.json().catch(() => ({}))) as {
        name?: string;
        skills?: string;
        education?: string;
        experience?: string;
      };

      const updated = updateLocalResume(resumeId, payload);
      if (!updated) {
        return NextResponse.json({ error: "Resume not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Resume updated", resume: updated });
    }

    const deleted = deleteLocalResume(resumeId);
    if (!deleted) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted", id: resumeId });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyResumeRequest("GET", request, id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyResumeRequest("PUT", request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyResumeRequest("DELETE", request, id);
}
