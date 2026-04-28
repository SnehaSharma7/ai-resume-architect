import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token.startsWith("local:")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const email = token.slice("local:".length);
  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    email,
    id: 1,
  });
}
