import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    resumes: ["Frontend Engineer - Acme Corp", "Product Manager - Growth Team"],
  });
}
