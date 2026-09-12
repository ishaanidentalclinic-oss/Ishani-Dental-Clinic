import { API_BASE_URL } from "./apiBaseUrl";

export interface ApiFieldError {
  field?: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  errors: ApiFieldError[];

  constructor(message: string, status: number, errors: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface ApiFetchOptions extends RequestInit {
  /** Skip the automatic silent-refresh-and-retry-once on a 401 (used by login/refresh/logout themselves). */
  skipAuthRetry?: boolean;
}

async function rawRequest(path: string, options: RequestInit) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: isFormData
      ? options.headers
      : { "Content-Type": "application/json", ...options.headers },
  });

  const json = await res.json().catch(() => null);
  return { res, json };
}

/**
 * Every admin-panel API call goes through this. A 401 triggers exactly one
 * silent `POST /auth/refresh` + retry of the original request — if that
 * also fails, the caller sees the original 401 and the auth context treats
 * it as "logged out".
 */
export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { skipAuthRetry, ...rest } = options;

  let { res, json } = await rawRequest(path, rest);

  if (res.status === 401 && !skipAuthRetry) {
    const refreshed = await rawRequest("/auth/refresh", { method: "POST" });
    if (refreshed.res.ok) {
      ({ res, json } = await rawRequest(path, rest));
    }
  }

  if (!res.ok) {
    throw new ApiError(json?.message ?? "Something went wrong", res.status, json?.errors ?? []);
  }

  return json?.data as T;
}
