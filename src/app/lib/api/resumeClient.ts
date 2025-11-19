const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const apiFetch = async (path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

export const resumeClient = {
  save: (payload: {
    userId: string;
    editedBy?: string;
    resume: any;
    pdfDownloadUrl?: string;
  }) => apiFetch("/resume/save", { method: "POST", body: JSON.stringify(payload) }),
  listVersions: (userId: string) => apiFetch(`/resume/list/${userId}`),
  getVersion: (userId: string, versionNumber?: number) => {
    const params = new URLSearchParams({ userId });
    if (versionNumber) params.append("versionNumber", String(versionNumber));
    return apiFetch(`/resume/version?${params.toString()}`);
  },
  addComment: (payload: { userId: string; author?: string; message: string }) =>
    apiFetch("/resume/comments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getComments: (userId: string) => apiFetch(`/resume/comments/${userId}`),
  getPublicProfile: (slug: string) => apiFetch(`/resume/public/${slug}`),
};

export const aiClient = {
  summarize: (resumeText: string) =>
    apiFetch("/ai/summarize", {
      method: "POST",
      body: JSON.stringify({ resumeText }),
    }),
  inferSkills: (text: string) =>
    apiFetch("/ai/skills", { method: "POST", body: JSON.stringify({ text }) }),
  translate: (text: string, targetLanguage: string) =>
    apiFetch("/ai/translate", {
      method: "POST",
      body: JSON.stringify({ text, targetLanguage }),
    }),
};


