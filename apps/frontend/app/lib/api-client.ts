import { z } from "zod";
import { redirect } from "react-router";

const API_URL = process.env.API_URL || "http://localhost:8080/api";

type RequestOptions = {
  headers?: HeadersInit;
  params?: Record<string, string>;
  accessToken?: string;
};

type ValidatedRequestOptions<T> = RequestOptions & {
  schema: z.ZodType<T>;
};

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class ApiClient {
  static async get<T>(
    endpoint: string,
    options: ValidatedRequestOptions<T>
  ): Promise<T> {
    const url = new URL(`${API_URL}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (options.accessToken) {
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw redirect("/logout");
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return options.schema.parse(data);
  }

  static async post<T>(
    endpoint: string,
    data: any,
    options: ValidatedRequestOptions<T>
  ): Promise<T> {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (options.accessToken) {
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw redirect("/logout");
      }
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
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (options.accessToken) {
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw redirect("/logout");
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async patch<T>(
    endpoint: string,
    data: any,
    options: ValidatedRequestOptions<T>
  ): Promise<T> {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (options.accessToken) {
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw redirect("/logout");
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async delete<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (options.accessToken) {
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw redirect("/logout");
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Helper method for endpoints that return no content
  static async deleteNoContent(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<void> {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (options.accessToken) {
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw redirect("/logout");
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
  }

  static async getBinary(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    const url = new URL(`${API_URL}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers = new Headers({
      ...options.headers,
    });

    if (options.accessToken) {
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw redirect("/logout");
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response;
  }

  // Add other methods as needed (PUT, DELETE, etc.)
}