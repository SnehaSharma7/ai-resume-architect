import { NextResponse } from "next/server";

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
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const users = getUsersStore();
  const alreadyExists = users.some((user) => user.email === email);
  if (alreadyExists) {
    return NextResponse.json({ message: "Account already exists." }, { status: 409 });
  }

  users.push({ email, password });

  return NextResponse.json({ message: "Account created successfully." });
}
