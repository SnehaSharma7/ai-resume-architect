"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";
import { getSession as getNextAuthSession, signOut } from "next-auth/react";

type AuthSource = "local" | "oauth";

export default function AuthGuard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [authSource, setAuthSource] = useState<AuthSource | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveSession = async () => {
      const localSession = getSession();
      if (localSession) {
        if (!cancelled) {
          setEmail(localSession.email);
          setName(null);
          setAuthSource("local");
        }
        return;
      }

      const oauthSession = await getNextAuthSession();
      const oauthEmail = oauthSession?.user?.email;
      if (oauthEmail) {
        if (!cancelled) {
          setEmail(oauthEmail);
          setName(oauthSession?.user?.name ?? null);
          setAuthSource("oauth");
        }
        return;
      }

      if (!cancelled) {
        router.replace("/signin?callbackUrl=/dashboard");
      }
    };

    void resolveSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = () => {
    if (authSource === "oauth") {
      void signOut({ callbackUrl: "/signin" });
      return;
    }

    clearSession();
    router.replace("/signin");
  };

  if (!email) return null;

  return (
    <div className="flex items-center justify-between bg-violet-900/20 border border-violet-700/30 rounded-2xl px-5 py-3 mb-8">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold uppercase">
          {(name ?? email ?? "?")[0]}
        </div>
        <div>
          <p className="text-xs text-slate-400">Signed in as</p>
          {name ? (
            <>
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs text-slate-500">{email}</p>
            </>
          ) : (
            <p className="text-sm font-medium text-white">{email}</p>
          )}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 px-3 py-1.5 rounded-lg transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
