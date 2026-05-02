import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  console.log("Deleting resume:", id);

  return NextResponse.json({ message: "Deleted successfully", id });
}
