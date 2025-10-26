export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fix-deploy-be.onrender.com";

export type FetchOptions = RequestInit & { query?: Record<string, any> };

function buildQuery(q?: Record<string, any>): string {
  if (!q) return "";

  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v == null) return;

    if (Array.isArray(v)) {
      v.forEach((item) => params.append(k, String(item)));
    } else {
      params.append(k, String(v));
    }
  });

  const s = params.toString();
  return s ? `?${s}` : "";
}

async function refreshToken(): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("No valid refresh token");
  }

  await res.json();
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";

  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const err = new Error(body?.message || res.statusText || "Request failed");
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }

  return body as T;
}

export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { query, ...rest } = options;
  const url = `${API_BASE}${path}${buildQuery(query)}`;

  const makeRequest = (): Promise<Response> => {
    return fetch(url, {
      credentials: "include",
      ...rest,
      headers: {
        ...rest.headers,
      },
    });
  };

  let res = await makeRequest();

  if (res.status === 401 && !path.includes("/auth/refresh")) {
    try {
      await refreshToken();
      res = await makeRequest();
    } catch (refreshError) {
      console.warn("Refresh token failed or missing:");
    }
  }

  return handleResponse<T>(res);
}
