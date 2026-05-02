const SESSION_KEY = "cf_session";
const SESSION_COOKIE = "cf_session";

export type Session = {
  email: string;
  token: string;
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Session;
    const encoded = encodeURIComponent(JSON.stringify(parsed));
    document.cookie = `${SESSION_COOKIE}=${encoded}; Path=/; Max-Age=2592000; SameSite=Lax`;

    return parsed;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  // Mirror session in a cookie so server components can protect routes before render.
  const encoded = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${SESSION_COOKIE}=${encoded}; Path=/; Max-Age=2592000; SameSite=Lax`;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
