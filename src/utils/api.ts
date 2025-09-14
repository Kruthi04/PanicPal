// API configuration for different environments
const getApiBaseUrl = (): string => {
  // In production (Vercel), use the current domain
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin;
  }
  
  // In development, use localhost
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to make API calls with proper error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Auth-specific API calls
export const authAPI = {
  register: async (email: string, password: string, name: string) => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  login: async (email: string, password: string) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async (token: string) => {
    return apiCall('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  getProfile: async (token: string) => {
    return apiCall('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};