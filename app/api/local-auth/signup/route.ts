import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations";

type LocalUser = {
  email: string;
  password: string;
};

declare global {
  var __cfLocalUsers: LocalUser[] | undefined;
}

function getUsersStore(): LocalUser[] {
  if (!globalThis.__cfLocalUsers) {
    globalThis.__cfLocalUsers = [];
  }
  return globalThis.__cfLocalUsers;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ message }, { status: 400 });
  }

  const { email: rawEmail, password } = parsed.data;
  const email = rawEmail.trim().toLowerCase();

  const users = getUsersStore();
  const alreadyExists = users.some((user) => user.email === email);
  if (alreadyExists) {
    return NextResponse.json({ message: "Account already exists." }, { status: 409 });
  }

  users.push({ email, password });

  return NextResponse.json({ message: "Account created successfully." });
}
