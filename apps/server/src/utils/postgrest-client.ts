const POSTGREST_URL = 'http://localhost:3000';

class PostgRESTClient {
  private baseURL: string;

  constructor(baseURL: string = POSTGREST_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    params?: Record<string, any>;
    data?: any;
    headers?: Record<string, string>;
  }): Promise<T> {
    const { method, params, data, headers = {} } = options;
    
    // Build URL with query parameters
    const url = new URL(`${this.baseURL}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          ...headers,
        },
        ...(data && { body: JSON.stringify(data) }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || response.statusText);
      }

      // For DELETE requests or when no content
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', data });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', data });
  }

  async delete(endpoint: string): Promise<void> {
    await this.request(endpoint, { method: 'DELETE' });
  }
}

export const postgrestClient = new PostgRESTClient(); 