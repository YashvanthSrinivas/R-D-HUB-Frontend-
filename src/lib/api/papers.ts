import { API_BASE_URL, getHeaders, handleResponse } from './config';

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
}

export interface CreateProfileData {
  full_name: string;
  qualifications: string;
  institution: string;
  contact_email: string;
  bio: string;
  photo?: string;
  research_papers?: string;
}

export interface CollaborationRequest {
  id: number;
  from_user: number;
  from_user_username?: string;
  to_researcher: number;
  to_researcher_name?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface IEEEPaper {
  title: string;
  authors: string;
  publisher: string;
  doi: string;
  published?: string;
  published_date?: string;
  link?: string;
}

export interface IEEESearchResponse {
  results?: IEEEPaper[];
}

export interface AssistantResponse {
  response: string;
}

// Researcher endpoints
export const getResearchers = async (): Promise<ResearcherProfile[]> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/researcher/`, {
    method: 'GET',
    headers: getHeaders(false),
  });
  
  return handleResponse<ResearcherProfile[]>(response);
};

export const getResearcherById = async (id: number): Promise<ResearcherProfile> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/researcher/${id}/`, {
    method: 'GET',
    headers: getHeaders(false),
  });
  
  return handleResponse<ResearcherProfile>(response);
};

export const createResearcherProfile = async (data: CreateProfileData): Promise<ResearcherProfile> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/researcher/create/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  
  return handleResponse<ResearcherProfile>(response);
};

// Collaboration endpoints
export const sendCollaborationRequest = async (toResearcher: number, message: string): Promise<CollaborationRequest> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/collaboration/send/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ to_researcher: toResearcher, message }),
  });
  
  return handleResponse<CollaborationRequest>(response);
};

export const getSentRequests = async (): Promise<CollaborationRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/collaboration/sent/`, {
    method: 'GET',
    headers: getHeaders(true),
  });
  
  return handleResponse<CollaborationRequest[]>(response);
};

export const getReceivedRequests = async (): Promise<CollaborationRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/collaboration/received/`, {
    method: 'GET',
    headers: getHeaders(true),
  });
  
  return handleResponse<CollaborationRequest[]>(response);
};

export const updateCollaborationStatus = async (id: number, status: 'accepted' | 'rejected'): Promise<CollaborationRequest> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/collaboration/update/${id}/`, {
    method: 'PATCH',
    headers: getHeaders(true),
    body: JSON.stringify({ status }),
  });
  
  return handleResponse<CollaborationRequest>(response);
};

// IEEE Search endpoint
export const searchIEEE = async (query: string): Promise<IEEEPaper[]> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/search/ieee/?query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: getHeaders(false),
  });
  
  const data = await handleResponse<IEEESearchResponse | IEEEPaper[]>(response);
  
  // Handle both response formats
  if (Array.isArray(data)) {
    return data;
  }
  return data.results || [];
};

// AI Assistant endpoint
export const queryAssistant = async (query: string): Promise<AssistantResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/papers/assistant/query/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ query }),
  });
  
  return handleResponse<AssistantResponse>(response);
};
