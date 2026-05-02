type ResumeRecord = {
  id: number;
  title: string;
  content: string;
};

type GenerateResumePayload = {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary?: string;
  skills?: string;
  education?: string;
  experience?: string;
};

declare global {
  var __cfResumeStore: ResumeRecord[] | undefined;
  var __cfResumeStoreId: number | undefined;
}

function getStore(): ResumeRecord[] {
  if (!globalThis.__cfResumeStore) {
    globalThis.__cfResumeStore = [];
    globalThis.__cfResumeStoreId = 1;
  }
  return globalThis.__cfResumeStore;
}

function nextId(): number {
  if (!globalThis.__cfResumeStoreId) {
    globalThis.__cfResumeStoreId = 1;
  }

  const id = globalThis.__cfResumeStoreId;
  globalThis.__cfResumeStoreId += 1;
  return id;
}

function buildResumeContent(payload: GenerateResumePayload): string {
  return `
    ===== RESUME =====

    Name: ${payload.name ?? ""}
    Title: ${payload.title ?? ""}
    Email: ${payload.email ?? ""}
    Phone: ${payload.phone ?? ""}
    Location: ${payload.location ?? ""}
    LinkedIn: ${payload.linkedin ?? ""}
    Summary: ${payload.summary ?? ""}

    Skills:
    ${payload.skills ?? ""}

    Education:
    ${payload.education ?? ""}

    Experience:
    ${payload.experience ?? ""}

    ==================
  `;
}

function extractTitle(content: string): string {
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith("name:")) {
      const title = trimmed.split(":", 2)[1]?.trim() ?? "";
      return title || "Untitled Resume";
    }
  }

  return "Untitled Resume";
}

export function listLocalResumes(): ResumeRecord[] {
  return [...getStore()];
}

export function getLocalResumeById(id: number): ResumeRecord | null {
  return getStore().find((resume) => resume.id === id) ?? null;
}

export function createLocalResume(payload: GenerateResumePayload): ResumeRecord {
  const content = buildResumeContent(payload);
  const record: ResumeRecord = {
    id: nextId(),
    title: extractTitle(content),
    content,
  };

  const store = getStore();
  store.push(record);
  return record;
}

export function updateLocalResume(id: number, payload: GenerateResumePayload): ResumeRecord | null {
  const store = getStore();
  const resume = store.find((item) => item.id === id);
  if (!resume) return null;

  const content = buildResumeContent(payload);
  resume.content = content;
  resume.title = extractTitle(content);
  return resume;
}

export function deleteLocalResume(id: number): boolean {
  const store = getStore();
  const index = store.findIndex((resume) => resume.id === id);
  if (index === -1) return false;

  store.splice(index, 1);
  return true;
}
