import { API_BASE_URL, getHeaders, handleResponse } from './config';

export interface User {
  id: number;
  username: string;
  email: string;
  is_researcher: boolean;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  is_researcher?: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

export const register = async (data: RegisterData): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Registration failed');
  }
};

export const login = async (data: LoginData): Promise<TokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/token/`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  
  return handleResponse<TokenResponse>(response);
};

export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ refresh }),
  });
  
  return handleResponse<{ access: string }>(response);
};

export const getMe = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
    method: 'GET',
    headers: getHeaders(true),
  });
  
  return handleResponse<User>(response);
};

export const deleteAccount = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/delete/`, {
    method: "DELETE",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || "Failed to delete account");
  }
};
