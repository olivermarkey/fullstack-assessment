import { z } from "zod";
import { getSession } from "~/server/session-store";

const API_URL = process.env.API_URL || "http://localhost:8080/api";

type RequestOptions = {
  headers?: HeadersInit;
  params?: Record<string, string>;
};

type ValidatedRequestOptions<T> = RequestOptions & {
  schema: z.ZodType<T>;
};

// Helper function to get auth headers from session
async function getAuthHeaders(request?: Request): Promise<HeadersInit> {
  if (!request) return {};
  
  const session = await getSession(request);
  const authTokens = session.get("auth_tokens");
  
  if (!authTokens?.AccessToken) return {};
  
  return {
    'Authorization': `Bearer ${authTokens.AccessToken}`
  };
}

export class ApiClient {
  static async get<T>(
    endpoint: string,
    options: ValidatedRequestOptions<T> & { request?: Request }
  ): Promise<T> {
    const url = new URL(`${API_URL}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const authHeaders = await getAuthHeaders(options.request);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return options.schema.parse(data);
  }

  static async post<T>(
    endpoint: string,
    data: any,
    options: ValidatedRequestOptions<T> & { request?: Request }
  ): Promise<T> {
    const authHeaders = await getAuthHeaders(options.request);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (responseData.errors) {
        // Format validation errors into a readable message
        const errorMessages = responseData.errors
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(
        responseData.message || `API Error: ${response.statusText}`
      );
    }

    return options.schema.parse(responseData);
  }

  static async put<T>(
    endpoint: string,
    data: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async patch<T>(
    endpoint: string,
    data: any,
    options: ValidatedRequestOptions<T> & { request?: Request }
  ): Promise<T> {
    const authHeaders = await getAuthHeaders(options.request);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async delete<T>(
    endpoint: string,
    options: RequestOptions & { request?: Request } = {}
  ): Promise<T> {
    const authHeaders = await getAuthHeaders(options.request);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Helper method for endpoints that return no content
  static async deleteNoContent(
    endpoint: string,
    options: RequestOptions & { request?: Request } = {}
  ): Promise<void> {
    const authHeaders = await getAuthHeaders(options.request);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
  }

  // Add other methods as needed (PUT, DELETE, etc.)
}
