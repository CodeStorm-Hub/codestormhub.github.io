import { ContactForm, Project, ProjectCategory } from '@/types';

// API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'API request failed',
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Network error occurred',
        0,
        { originalError: error }
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params) : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Typed API services
export class ContactApiService {
  private client = new ApiClient();

  async submitContactForm(formData: ContactForm): Promise<{
    success: boolean;
    message: string;
    submissionId: string;
  }> {
    return this.client.post('/contact', formData);
  }

  async getSubmissions(adminKey: string): Promise<{
    success: boolean;
    submissions: unknown[];
  }> {
    return this.client.get('/contact', { key: adminKey });
  }
}

export class ProjectsApiService {
  private client = new ApiClient();

  async getProjects(filters?: {
    category?: ProjectCategory;
    status?: Project['status'];
    featured?: boolean;
    search?: string;
  }): Promise<{
    success: boolean;
    data: Project[];
    stats: unknown;
    filters?: unknown;
  }> {
    const params: Record<string, string> = {};
    
    if (filters?.category) params.category = filters.category;
    if (filters?.status) params.status = filters.status;
    if (filters?.featured !== undefined) params.featured = filters.featured.toString();
    if (filters?.search) params.search = filters.search;

    return this.client.get('/projects', Object.keys(params).length > 0 ? params : undefined);
  }

  async getProject(id: string): Promise<{
    success: boolean;
    data: {
      project: Project;
      related: Project[];
      viewedAt: string;
    };
  }> {
    return this.client.get(`/projects/${id}`);
  }

  async createProject(projectData: Omit<Project, 'id'>, adminToken: string): Promise<{
    success: boolean;
    data: Project;
    message: string;
  }> {
    const client = new ApiClient();
    return client.request(`/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, updates: Partial<Project>, adminToken: string): Promise<{
    success: boolean;
    data: Project;
    message: string;
  }> {
    const client = new ApiClient();
    return client.request(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string, adminToken: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const client = new ApiClient();
    return client.request(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
  }
}

export class HealthApiService {
  private client = new ApiClient();

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    version: string;
    services: Record<string, 'up' | 'down'>;
    uptime: number;
    memory: {
      used: number;
      free: number;
      total: number;
    };
  }> {
    return this.client.get('/health');
  }

  async getDetailedHealth(): Promise<{
    status: string;
    detailed: Record<string, any>;
    timestamp: string;
  }> {
    return this.client.post('/health');
  }
}

export class AdminApiService {
  private client = new ApiClient();

  async getDashboardData(section: string = 'overview', adminToken: string): Promise<{
    success: boolean;
    data: unknown;
  }> {
    const client = new ApiClient();
    return client.request(`/api/admin?section=${section}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
  }

  async performAction(action: string, params: unknown, adminToken: string): Promise<{
    success: boolean;
    data?: unknown;
    message: string;
  }> {
    const client = new ApiClient();
    return client.request('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ action, ...(params as Record<string, unknown>) }),
    });
  }

  async updateConfiguration(type: string, configuration: unknown, adminToken: string): Promise<{
    success: boolean;
    message: string;
    type: string;
    timestamp: string;
  }> {
    const client = new ApiClient();
    return client.request('/api/admin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ type, configuration }),
    });
  }
}

// Singleton instances
export const contactApi = new ContactApiService();
export const projectsApi = new ProjectsApiService();
export const healthApi = new HealthApiService();
export const adminApi = new AdminApiService();

// Hook for API error handling
export function useApiErrorHandler() {
  const handleError = (error: unknown) => {
    if (error instanceof ApiError) {
      console.error(`API Error (${error.status}):`, error.message);
      
      // You can integrate with a toast system here
      if (typeof window !== 'undefined') {
        // Example: showToast({ type: 'error', message: error.message });
      }
      
      return {
        message: error.message,
        status: error.status,
        response: error.response,
      };
    }
    
    console.error('Unknown error:', error);
    return {
      message: 'An unexpected error occurred',
      status: 0,
      response: null,
    };
  };

  return { handleError };
}

// Utility for handling async API calls with loading states
export function useAsyncApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, execute };
}

// Export for direct usage
export { ApiError };

// Import React hooks for the utility hook
import { useState } from 'react';