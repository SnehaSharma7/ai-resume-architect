const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:5000";

type ApiRequestOptions = RequestInit & {
  timeoutMs?: number;
};

function isBackendUnavailable(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("Unable to reach backend API at");
}

async function localRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = body?.error || body?.message || "Request failed";
    throw new Error(message);
  }

  return body as T;
}

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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    // Browsers throw a TypeError("Failed to fetch") when the API host is unreachable.
    if (error instanceof TypeError) {
      throw new Error(
        `Unable to reach backend API at ${API_BASE_URL}. Start the backend server and verify NEXT_PUBLIC_API_BASE_URL.`
      );
    }

    throw error;
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
  }).catch((error) => {
    if (!isBackendUnavailable(error)) throw error;
    return localRequest<AuthResponse>("/api/local-auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  });
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).catch((error) => {
    if (!isBackendUnavailable(error)) throw error;
    return localRequest<LoginResponse>("/api/local-auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  });
}

export function getMe(token: string) {
  return apiRequest<MeResponse>("/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).catch((error) => {
    if (!isBackendUnavailable(error)) throw error;
    return localRequest<MeResponse>("/api/local-auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
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
  }).catch(async (backendError) => {
    // Fallback to local Next API so dashboard still works when external backend is offline.
    const response = await fetch("/api/resumes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw backendError;
    }

    const body = await response.json().catch(() => ({}));

    if (Array.isArray(body?.resumes)) {
      return { resumes: body.resumes.map((item: unknown) => String(item)) };
    }

    // Backward compatibility in case local route returns a bare array.
    if (Array.isArray(body)) {
      return {
        resumes: body.map((item: unknown) => {
          if (typeof item === "string") return item;
          if (typeof item === "object" && item && "title" in item) {
            const title = (item as { title?: unknown }).title;
            return typeof title === "string" ? title : "Untitled Resume";
          }
          return "Untitled Resume";
        }),
      };
    }

    throw backendError;
  });
}
