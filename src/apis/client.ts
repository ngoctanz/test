export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://fix-deploy-be.onrender.com";

export type FetchOptions = RequestInit & { query?: Record<string, any> };

// ==================== TOKEN STORAGE ====================
const TokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

// ==================== HELPERS ====================
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

// ==================== REFRESH TOKEN ====================
async function refreshToken(): Promise<string | null> {
  const storedRefreshToken = TokenStorage.getRefreshToken();

  if (!storedRefreshToken) {
    throw new Error("No refresh token available");
  }

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: storedRefreshToken }),
  });

  if (!res.ok) {
    TokenStorage.clearTokens();
    throw new Error("Refresh token failed");
  }

  const data = await handleResponse<any>(res);

  // Lưu accessToken mới
  if (data.data?.accessToken) {
    TokenStorage.setTokens(data.data.accessToken, storedRefreshToken);
    return data.data.accessToken;
  }

  return null;
}

// ==================== API FETCH ====================
export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { query, ...rest } = options;
  const url = `${API_BASE}${path}${buildQuery(query)}`;

  const makeRequest = (token?: string): Promise<Response> => {
    // ✅ Ép kiểu headers về Record<string, string> để TypeScript hiểu rõ
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(rest.headers as Record<string, string>),
    };

    // ✅ Thêm Authorization header nếu có token
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      credentials: "include",
      ...rest,
      headers,
    });
  };

  // Lấy token từ localStorage
  const storedToken = TokenStorage.getAccessToken();
  let res = await makeRequest(storedToken || undefined);

  // Auto refresh nếu 401
  if (res.status === 401 && !path.includes("/auth/refresh")) {
    try {
      const newToken = await refreshToken();
      res = await makeRequest(newToken || undefined);
    } catch (refreshError) {
      console.warn("Refresh failed:", refreshError);
      TokenStorage.clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw refreshError;
    }
  }

  return handleResponse<T>(res);
}

// ==================== AUTH FUNCTIONS ====================
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse<any>(res);

  // Lưu tokens vào localStorage (cho iPhone)
  if (data.data?.tokens) {
    TokenStorage.setTokens(
      data.data.tokens.accessToken,
      data.data.tokens.refreshToken
    );
  }

  return data;
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse<any>(res);

  // Lưu tokens vào localStorage
  if (data.data?.tokens) {
    TokenStorage.setTokens(
      data.data.tokens.accessToken,
      data.data.tokens.refreshToken
    );
  }

  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    TokenStorage.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}

export async function getProfile() {
  return apiFetch("/auth/profile", { method: "GET" });
}
