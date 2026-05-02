import { NextRequest } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:5000";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resumeId = Number(id);

  if (!Number.isInteger(resumeId) || resumeId <= 0) {
    return new Response("Invalid resume id", { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return new Response("Unable to load resume for PDF export", { status: response.status });
    }

    const body = (await response.json().catch(() => ({}))) as {
      resume?: { title?: string; content?: string };
    };

    const title = body.resume?.title?.trim() || `Resume ${resumeId}`;
    const content = body.resume?.content?.trim() || "No resume content available.";

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} - PDF</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; margin: 0; background: #f5f5f5; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: white; padding: 18mm; box-sizing: border-box; }
    h1 { margin: 0 0 14px; font-size: 24px; }
    pre { white-space: pre-wrap; font-size: 13px; line-height: 1.5; margin: 0; }
    @media print {
      body { background: white; }
      .page { margin: 0; width: auto; min-height: auto; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <h1>${escapeHtml(title)}</h1>
    <pre>${escapeHtml(content)}</pre>
  </div>
  <script>window.print();</script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("PDF export failed. Please ensure backend is running.", { status: 500 });
  }
}
