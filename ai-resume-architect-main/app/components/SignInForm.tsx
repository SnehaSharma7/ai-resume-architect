"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SignInFormProps = {
  callbackUrl: string;
};

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TEMP LOGIN (no backend)
    router.push(callbackUrl || "/dashboard");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#1a1a2e] text-white border border-gray-600"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#1a1a2e] text-white border border-gray-600"
      />

      <button
        type="submit"
        className="w-full p-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white"
      >
        Sign In
      </button>
    </form>
  );
}