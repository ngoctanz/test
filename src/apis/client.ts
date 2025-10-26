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
  const s = params.toString();
  return s ? `?${s}` : "";
}

/**
 * 🔁 Refresh token khi access token hết hạn
 */
async function refreshToken(): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("No valid refresh token");

  const body = await res.json();

  // ✅ Nếu response body có token (fallback cho iOS)
  if (body?.data?.tokens?.accessToken) {
    saveTokensToLocal({
      accessToken: body.data.tokens.accessToken,
    });
  }
}

/**
 * ✅ Xử lý response
 */
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

/**
 * ⚙️ Gọi API kèm cookie hoặc header fallback
 */
export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { query, ...rest } = options;
  const url = `${API_BASE}${path}${buildQuery(query)}`;

  const cookieSupported = canUseCookies();
  const localAccessToken = getLocalAccessToken();

  console.log(
    cookieSupported
      ? "🍪 Using cookie-based auth"
      : "📦 Using localStorage-based auth (Safari fallback)"
  );

  const makeRequest = (useLocalToken = false): Promise<Response> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(rest.headers as Record<string, string>),
    };

    if (useLocalToken && localAccessToken) {
      headers["Authorization"] = `Bearer ${localAccessToken}`;
    }

    return fetch(url, {
      ...rest,
      headers,
      credentials: cookieSupported ? "include" : "omit",
    });
  };

  let res = await makeRequest(false);

  // 🔁 Nếu cookie-based fail và Safari không dùng được cookie → thử token local
  if (res.status === 401 && !path.includes("/auth/refresh")) {
    if (!cookieSupported && localAccessToken) {
      console.warn("🔄 Fallback to localStorage token...");
      res = await makeRequest(true);
    } else {
      try {
        await refreshToken();
        res = await makeRequest(false);
      } catch (err) {
        console.warn("Refresh token failed:", err);
        throw err;
      }
    }
  }

  return handleResponse<T>(res);
}

/**
 * 🚪 LOGOUT
 */
export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    clearLocalTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
