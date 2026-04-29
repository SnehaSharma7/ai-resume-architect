import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  console.log("Deleting resume:", id);

  // TEMP delete (just redirect for now)
  return NextResponse.redirect(new URL("/dashboard", request.url));
}