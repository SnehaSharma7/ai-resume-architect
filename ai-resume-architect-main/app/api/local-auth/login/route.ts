import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";

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

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ message }, { status: 400 });
  }

  const { email: rawEmail, password } = parsed.data;
  const email = rawEmail.trim().toLowerCase();

  const users = getUsersStore();
  const user = users.find((entry) => entry.email === email && entry.password === password);

  if (!user) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  return NextResponse.json({
    message: "Login successful.",
    token: `local:${email}`,
    email,
  });
}
