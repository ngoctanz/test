import { apiFetch } from "./client";
import type { ApiResponse } from "../types/api.type";
import { saveTokensToLocal, getLocalRefreshToken } from "@/lib/auth.client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {}

export interface Profile {
  userId: number;
  email: string;
  money: number;
  role: string;
}

/* ============================================================
   🔹 LOGIN
   -> Lưu cả access + refresh token fallback vào localStorage
============================================================ */
export async function login(payload: LoginPayload) {
  const res = await apiFetch<ApiResponse<{ tokens?: any }>>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.data?.tokens) {
    saveTokensToLocal(res.data.tokens);
  }

  return res;
}

/* ============================================================
   🔹 REGISTER
   -> Hành vi giống login
============================================================ */
export async function register(payload: RegisterPayload) {
  const res = await apiFetch<ApiResponse<{ tokens?: any }>>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.data?.tokens) {
    saveTokensToLocal(res.data.tokens);
  }

  return res;
}

/* ============================================================
   🔹 PROFILE
   -> Sử dụng apiFetch tự động thử cookie -> local -> refresh
============================================================ */
export async function profile() {
  return apiFetch<ApiResponse<Profile>>("/auth/profile", { method: "GET" });
}

/* ============================================================
   🔹 REFRESH TOKEN
   -> Ưu tiên cookie, fallback header Bearer nếu cookie bị xoá
============================================================ */
export async function refresh() {
  const localRefreshToken = getLocalRefreshToken();
  const headers: Record<string, string> = {};

  if (localRefreshToken) {
    headers["Authorization"] = `Bearer ${localRefreshToken}`;
  }

  const res = await apiFetch<ApiResponse<{ tokens?: any }>>("/auth/refresh", {
    method: "POST",
    headers,
  });

  if (res.data?.tokens?.accessToken) {
    saveTokensToLocal({
      accessToken: res.data.tokens.accessToken,
    });
  }

  return res;
}

/* ============================================================
   🔹 LOGOUT
   -> Xóa cookie + localStorage
============================================================ */
export async function logout() {
  return apiFetch<ApiResponse<null>>("/auth/logout", { method: "POST" });
}
