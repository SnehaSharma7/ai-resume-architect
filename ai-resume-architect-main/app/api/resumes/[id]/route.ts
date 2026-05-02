import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // delete logic here (DB or mock)
  console.log("Deleting resume:", id);

  return NextResponse.json({ success: true });
}