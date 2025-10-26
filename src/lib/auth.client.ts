export const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
};

/**
 * Kiểm tra xem trình duyệt có hỗ trợ cookie cross-site không
 * => Safari iOS thường fail ở đây
 */
export function canUseCookies(): boolean {
  try {
    document.cookie = "cookie_test=1; SameSite=None; Secure";
    const supported = document.cookie.includes("cookie_test=");
    // Xóa test cookie
    document.cookie =
      "cookie_test=1; Max-Age=0; path=/; SameSite=None; Secure;";
    return supported;
  } catch {
    return false;
  }
}

/**
 * Lưu token fallback vào localStorage
 */
export function saveTokensToLocal(tokens: {
  accessToken: string;
  refreshToken?: string;
}) {
  if (tokens.accessToken)
    localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.accessToken);
  if (tokens.refreshToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refreshToken);
}

/**
 * Lấy access token fallback (nếu có)
 */
export function getLocalAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.ACCESS);
}

/**
 * 🔹 Lấy refresh token fallback (nếu có)
 */
export function getLocalRefreshToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.REFRESH);
}

/**
 * Xóa toàn bộ token fallback
 */
export function clearLocalTokens() {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
}
