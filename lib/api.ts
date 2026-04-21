const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:5000";

type ApiRequestOptions = RequestInit & {
  timeoutMs?: number;
};

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { timeoutMs = 15000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers || {}),
      },
      signal: controller.signal,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = body?.error || body?.message || "Request failed";
      throw new Error(message);
    }

    return body as T;
  } finally {
    clearTimeout(timeout);
  }
}

export type AuthResponse = {
  message: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  email: string;
};

export type MeResponse = {
  email: string;
  id: number;
};

export type GenerateResumePayload = {
  name: string;
  skills: string;
  education: string;
  experience: string;
};

export type GenerateResumeResponse = {
  resume: string;
};

export type ResumeListResponse = {
  resumes: string[];
};

export function signup(email: string, password: string) {
  return apiRequest<AuthResponse>("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(token: string) {
  return apiRequest<MeResponse>("/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function generateResume(payload: GenerateResumePayload) {
  return apiRequest<GenerateResumeResponse>("/generate-resume", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getResumes() {
  return apiRequest<ResumeListResponse>("/resumes", {
    method: "GET",
  });
}
