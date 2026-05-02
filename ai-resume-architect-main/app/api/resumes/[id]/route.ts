import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  console.log("Deleting resume:", id);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}