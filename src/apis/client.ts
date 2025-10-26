import {
  canUseCookies,
  getLocalAccessToken,
  saveTokensToLocal,
  clearLocalTokens,
} from "@/lib/auth.client";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fix-deploy-be.onrender.com";

export type FetchOptions = RequestInit & { query?: Record<string, any> };

function buildQuery(q?: Record<string, any>): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v == null) return;
    Array.isArray(v)
      ? v.forEach((item) => params.append(k, String(item)))
      : params.append(k, String(v));
  });
  return params.toString() ? `?${params.toString()}` : "";
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    const err = new Error(body?.message || res.statusText);
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }
  return body as T;
}

async function refreshToken(): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("No valid refresh token");
  const body = await res.json();
  if (body?.data?.tokens?.accessToken) {
    saveTokensToLocal({ accessToken: body.data.tokens.accessToken });
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { query, ...rest } = options;
  const url = `${API_BASE}${path}${buildQuery(query)}`;

  const cookieSupported = canUseCookies();
  const localAccessToken = getLocalAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string>),
  };

  const doFetch = (useLocal = false) => {
    const h = { ...headers };
    if (useLocal && localAccessToken) {
      h["Authorization"] = `Bearer ${localAccessToken}`;
    }
    return fetch(url, {
      ...rest,
      headers: h,
      credentials: cookieSupported ? "include" : "omit",
    });
  };

  let res = await doFetch(false);

  // nếu cookie fail (401) -> thử local token
  if (res.status === 401 && localAccessToken) {
    console.warn("🍪 Cookie failed → retry with localStorage token");
    res = await doFetch(true);
  }

  // nếu vẫn fail -> thử refresh
  if (res.status === 401 && !path.includes("/auth/refresh")) {
    try {
      await refreshToken();
      res = await doFetch(false);
    } catch (e) {
      console.warn("🔁 Refresh failed:", e);
      throw e;
    }
  }

  return handleResponse<T>(res);
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch (e) {
    console.error("Logout error:", e);
  } finally {
    clearLocalTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
