
// API BASE URL

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// AUTH HEADER (USES `access` token)

export const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GENERAL HEADERS

export const getHeaders = (auth = false, isForm = false): HeadersInit => {
  const headers: Record<string, string> = {};

  // JSON content type unless sending FormData
  if (!isForm) headers["Content-Type"] = "application/json";

  // Add Authorization only when requested
  if (auth) {
    const token = localStorage.getItem("access");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// UNIFIED RESPONSE HANDLER

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail ||
        errorData.message ||
        `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};
