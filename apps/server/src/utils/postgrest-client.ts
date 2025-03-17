// Use environment variable with fallback
const POSTGREST_URL = process.env.POSTGREST_URL || 'http://localhost:3001';

class PostgRESTClient {
  private baseURL: string;

  constructor(baseURL: string = POSTGREST_URL) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash if present
    console.log('[PostgREST Client] Initialized with baseURL:', this.baseURL);
  }

  private async request<T>(endpoint: string, options: {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    params?: Record<string, any>;
    data?: any;
    headers?: Record<string, string>;
  }): Promise<T> {
    const { method, params, data, headers = {} } = options;
    
    // Ensure endpoint doesn't start with a slash
    const cleanEndpoint = endpoint.replace(/^\//, '');
    
    // Handle PostgREST specific query parameters
    const urlString = `${this.baseURL}/${cleanEndpoint}`;
    console.log('[PostgREST Client] Making request to:', urlString);
    
    let url: URL;
    try {
      url = new URL(urlString);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }
    } catch (error) {
      console.error('[PostgREST Client] Invalid URL:', urlString);
      throw new Error(`Invalid URL: ${urlString}`);
    }

    try {
      console.log('[PostgREST Client] Sending request:', {
        method,
        url: url.toString(),
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          'Accept': 'application/json',
          ...headers,
        }
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          'Accept': 'application/json',
          ...headers,
        },
        ...(data && { body: JSON.stringify(data) }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('[PostgREST Client] Request failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData?.message || response.statusText);
      }

      // For DELETE requests or when no content
      if (response.status === 204) {
        return undefined as T;
      }

      const result = await response.json();
      console.log('[PostgREST Client] Request successful');
      return result;
    } catch (error) {
      console.error('[PostgREST Client] Request error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = `${this.baseURL}/${endpoint}`;
    console.log('[PostgREST Client] GET request to:', url);
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.baseURL}/${endpoint}`;
    console.log('[PostgREST Client] POST request to:', url);
    return this.request<T>(endpoint, { method: 'POST', data });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.baseURL}/${endpoint}`;
    console.log('[PostgREST Client] PATCH request to:', url);
    return this.request<T>(endpoint, { method: 'PATCH', data });
  }

  async delete(endpoint: string): Promise<void> {
    const url = `${this.baseURL}/${endpoint}`;
    console.log('[PostgREST Client] DELETE request to:', url);
    await this.request(endpoint, { method: 'DELETE' });
  }
}

export const postgrestClient = new PostgRESTClient(); 