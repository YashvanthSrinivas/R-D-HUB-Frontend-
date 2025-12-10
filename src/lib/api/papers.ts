import { API_BASE_URL, getHeaders, handleResponse } from "./config";

/* =========================================================
   AI ASSISTANT TYPES (MOVED TO TOP – IMPORTANT)
   ========================================================= */
export interface AssistantTimeline {
  design: string;
  implementation: string;
  mvp: string;
}

export interface AssistantAnalysis {
  overview: string;
  steps: string[];
  tools: string[];
  timeline: AssistantTimeline;
  competitors: string[];
  risks: string[];
  strategies: string[];
  summary: string;
}

/* =========================================================
   GENERAL TYPES
   ========================================================= */

export interface ResearchPaper {
  id: number;
  file: string;
  title: string;
  uploaded_at: string;
}

export interface ResearcherProfile {
  id: number;
  user: number;

  full_name: string;
  qualifications: string;
  institution: string;
  contact_email: string;
  bio: string;

  photo?: string;
  research_papers?: string;
  papers?: ResearchPaper[];
}

export interface CreateProfileData {
  full_name: string;
  qualifications: string;
  institution: string;
  contact_email: string;
  bio: string;
  photo?: string;
  research_papers?: string[];
}

export interface CollaborationRequest {
  id: number;
  from_user: number;
  to_researcher: number;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface IEEEPaper {
  title: string;
  authors: string;
  publisher: string;
  doi: string;
  published?: string;
  link?: string;
}

export interface IEEESearchResponse {
  results?: IEEEPaper[];
}

/* =========================================================
   RESEARCHER ENDPOINTS
   ========================================================= */

export const getResearchers = async (): Promise<ResearcherProfile[]> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/researcher/`, {
    method: "GET",
    headers: getHeaders(false),
  });
  return handleResponse(response);
};

export const getResearcherById = async (
  id: number
): Promise<ResearcherProfile> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/researcher/${id}/`, {
    method: "GET",
    headers: getHeaders(false),
  });
  return handleResponse(response);
};

export const createResearcherProfile = async (
  formData: FormData
): Promise<ResearcherProfile> => {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(
    `${API_BASE_URL}/api/papers/researcher/create/`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  return handleResponse(response);
};

/* =========================================================
   COLLABORATION REQUESTS
   ========================================================= */

export const sendCollaborationRequest = async (
  toResearcher: number,
  message: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/papers/collaboration/send/`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ to_researcher: toResearcher, message }),
    }
  );
  return handleResponse(response);
};

export const getSentRequests = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/papers/collaboration/sent/`,
    { method: "GET", headers: getHeaders(true) }
  );
  return handleResponse(response);
};

export const getReceivedRequests = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/papers/collaboration/received/`,
    { method: "GET", headers: getHeaders(true) }
  );
  return handleResponse(response);
};

export const updateCollaborationStatus = async (
  id: number,
  status: "accepted" | "rejected"
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/papers/collaboration/update/${id}/`,
    {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify({ status }),
    }
  );
  return handleResponse(response);
};

/* =========================================================
   IEEE SEARCH
   ========================================================= */

export const searchIEEE = async (query: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/papers/search/ieee/?query=${encodeURIComponent(
      query
    )}`,
    { method: "GET", headers: getHeaders(false) }
  );

  const data = await handleResponse<IEEESearchResponse | IEEEPaper[]>(response);
  return Array.isArray(data) ? data : data.results || [];
};

/* =========================================================
   AI ASSISTANT QUERY
   ========================================================= */

export const queryAssistant = async (query: string) => {
  const token = localStorage.getItem("access");

  const response = await fetch(`${API_BASE_URL}/api/papers/assistant/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.json();
};

/* =========================================================
   RESEARCH PAPER UPLOAD / DELETE
   ========================================================= */

export const uploadResearchPaper = async (file: File) => {
  const fd = new FormData();
  fd.append("paper", file);

  const response = await fetch(`${API_BASE_URL}/api/papers/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: fd,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to upload paper");
  }
};

export const deleteResearchPaper = async (paperId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/papers/delete/${paperId}/`,
    {
      method: "DELETE",
      headers: getHeaders(true),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete paper");
  }
};

/* =========================================================
   PROFILE PHOTO UPLOAD / DELETE
   ========================================================= */

export async function uploadProfilePhoto(file: File) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch(
    `${API_BASE_URL}/api/papers/researcher/photo/upload/`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to upload profile photo");
  }

  return res.json();
}

export async function removeProfilePhoto() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${API_BASE_URL}/api/papers/researcher/photo/remove/`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to remove profile photo");
  }

  return res.json();
}
