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
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary?: string;
  skills: string;
  education: string;
  experience: string;
};

export type GenerateResumeResponse = {
  resume: string;
  resumeId?: number;
};

export type ResumeRecord = {
  id: number;
  title: string;
  content: string;
};

export type ResumeListResponse = {
  resumes: ResumeRecord[];
};

type ResumeItemResponse = {
  resume: ResumeRecord;
};

function extractNameFromContent(content: string): string {
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith("name:")) {
      const value = trimmed.split(":", 2)[1]?.trim() ?? "";
      return value || "Untitled Resume";
    }
  }

  return content.trim() || "Untitled Resume";
}

function normalizeResume(item: unknown, fallbackId: number): ResumeRecord {
  if (typeof item === "string") {
    return {
      id: fallbackId,
      title: extractNameFromContent(item),
      content: item,
    };
  }

  if (typeof item === "object" && item) {
    const maybeItem = item as {
      id?: unknown;
      title?: unknown;
      content?: unknown;
    };

    const content = typeof maybeItem.content === "string" ? maybeItem.content : "";
    const title =
      typeof maybeItem.title === "string" && maybeItem.title.trim().length > 0
        ? maybeItem.title
        : extractNameFromContent(content);

    return {
      id: typeof maybeItem.id === "number" ? maybeItem.id : fallbackId,
      title,
      content,
    };
  }

  return {
    id: fallbackId,
    title: "Untitled Resume",
    content: "",
  };
}

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
  return localRequest<GenerateResumeResponse>("/api/resumes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getResumes() {
  return localRequest<{ resumes: unknown[] }>("/api/resumes", {
    method: "GET",
  })
    .then((response) => ({
      resumes: Array.isArray(response.resumes)
        ? response.resumes.map((item, index) => normalizeResume(item, index + 1))
        : [],
    }));
}

export function getResumeById(id: number) {
  return localRequest<ResumeItemResponse>(`/api/resumes/${id}`, {
    method: "GET",
  }).then((response) => ({
    resume: normalizeResume(response.resume, id),
  }));
}

export function updateResume(id: number, payload: GenerateResumePayload) {
  return localRequest<ResumeItemResponse>(`/api/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }).then((response) => ({
    resume: normalizeResume(response.resume, id),
  }));
}

export function deleteResume(id: number) {
  return localRequest<{ id: number; message?: string }>(`/api/resumes/${id}`, {
    method: "DELETE",
  });
}
