import { NextRequest, NextResponse } from "next/server";

function isAuthorized(req: NextRequest) {
  const configuredToken = process.env.RESUME_DELETE_API_TOKEN;

  if (!configuredToken) {
    return { ok: false as const, reason: "server-misconfigured" };
  }

  const authorization = req.headers.get("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token || token !== configuredToken) {
    return { ok: false as const, reason: "unauthorized" };
  }

  return { ok: true as const };
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = isAuthorized(req);

  if (!auth.ok) {
    if (auth.reason === "server-misconfigured") {
      return NextResponse.json(
        { error: "Resume deletion is not configured on this server." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  if (typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json({ error: "Invalid resume id" }, { status: 400 });
  }

  console.log("Delete requested for resume:", id);

  return NextResponse.json(
    {
      error: "Resume deletion is not implemented.",
      id,
    },
    { status: 501 }
  );
}
