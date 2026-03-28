import { useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
  redirectOn401 = false
): Promise<T> {
  const token = localStorage.getItem("erp_token");
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "An error occurred";
    try {
      const data = await response.json();
      message = data.error || data.message || message;
    } catch {
      message = response.statusText;
    }
    if (response.status === 401 && redirectOn401) {
      localStorage.removeItem("erp_token");
      window.location.href = "/login";
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return {} as T;
  
  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}
