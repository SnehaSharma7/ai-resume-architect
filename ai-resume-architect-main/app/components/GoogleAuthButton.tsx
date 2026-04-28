"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type GoogleAuthButtonProps = {
  mode: "signin" | "signup";
  defaultCallbackUrl?: string;
  enabled?: boolean;
  disabledText?: string;
};

export default function GoogleAuthButton({
  mode,
  defaultCallbackUrl = "/dashboard",
  enabled = true,
  disabledText = "Google login is not configured yet.",
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const callbackUrl = useMemo(() => {
    const queryCallback = searchParams.get("callbackUrl");
    if (!queryCallback) return defaultCallbackUrl;

    // Prevent open redirects by allowing only relative in-app destinations.
    if (queryCallback.startsWith("/")) return queryCallback;
    return defaultCallbackUrl;
  }, [defaultCallbackUrl, searchParams]);

  const label = mode === "signup" ? "Create with Google" : "Continue with Google";

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await signIn("google", { callbackUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={enabled ? handleGoogleAuth : undefined}
        disabled={loading || !enabled}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/40 hover:bg-slate-800/50 text-slate-200 font-medium py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting..." : label}
      </button>
      {!enabled ? (
        <p className="mt-2 text-xs text-amber-400">{disabledText}</p>
      ) : null}
    </div>
  );
}
