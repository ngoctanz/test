import {
  canUseCookies,
  getLocalAccessToken,
  saveTokensToLocal,
  clearLocalTokens,
  getLocalRefreshToken,
} from "@/lib/auth.client";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fix-deploy-be.onrender.com";

export type FetchOptions = RequestInit & { query?: Record<string, any> };

function buildQuery(q?: Record<string, any>): string {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/** 🔧 Chuẩn hóa xử lý response */
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

async function refreshToken(): Promise<void> {
  const localRefreshToken = getLocalRefreshToken();
  const headers: Record<string, string> = {};

  if (localRefreshToken) {
    console.log("[Auth] Refresh via header:", localRefreshToken);
    headers["Authorization"] = `Bearer ${localRefreshToken}`;
  }

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers,
  });

  if (!res.ok) throw new Error("No valid refresh token");

  const body = await res.json();
  const token = body?.data?.tokens?.accessToken;
  if (token) {
    saveTokensToLocal({ accessToken: token });
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
    ...(rest.headers as Record<string, string>),
  };

  // Chỉ thêm Content-Type nếu không phải FormData
  if (!(rest.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const doFetch = (useLocalToken = false) => {
    const h = { ...headers };
    if (useLocalToken && localAccessToken) {
      h["Authorization"] = `Bearer ${localAccessToken}`;
    }

    return fetch(url, {
      ...rest,
      headers: h,
      credentials: cookieSupported ? "include" : "omit",
    });
  };

  let res = await doFetch(false);

  // nếu cookie fail → thử localStorage token
  if (res.status === 401 && localAccessToken) {
    console.warn("Cookie auth failed → retrying with localStorage token");
    res = await doFetch(true);
  }

  // nếu vẫn fail → thử refresh token (qua cookie)
  if (res.status === 401 && !path.includes("/auth/refresh")) {
    try {
      await refreshToken();
      res = await doFetch(false);
    } catch (err) {
      console.warn("Refresh token failed:", err);
      throw err;
    }
  }

  // Bước 4: parse và return
  return handleResponse<T>(res);
}

/** Logout — xóa cookie + localStorage */
export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    clearLocalTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
