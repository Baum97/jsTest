// Dünner fetch-Wrapper mit generischem Rückgabetyp.
const BASE_URL = "/api";

interface RequestOptions {
  method?: string;
  body?: unknown;
}

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

async function request<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(BASE_URL + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204 No Content -> kein Body
  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error: ApiError = new Error(
      (data as { error?: string })?.error ?? `HTTP ${response.status}`,
    );
    error.status = response.status;
    error.details = (data as { details?: unknown })?.details;
    throw error;
  }

  return data as T;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
