import { apiFetch } from "./client";
import type { ApiResponse } from "../types/api.type";
import { saveTokensToLocal } from "@/lib/auth.client";

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

/**
 * 🔹 LOGIN
 */
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

/**
 * 🔹 REGISTER
 */
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

/**
 * 🔹 PROFILE
 */
export async function profile() {
  return apiFetch<ApiResponse<Profile>>("/auth/profile", { method: "GET" });
}

/**
 * 🔹 REFRESH TOKEN
 */
export async function refresh() {
  const res = await apiFetch<ApiResponse<{ tokens?: any }>>("/auth/refresh", {
    method: "POST",
  });

  if (res.data?.tokens?.accessToken) {
    saveTokensToLocal({
      accessToken: res.data.tokens.accessToken,
    });
  }

  return res;
}

/**
 * 🔹 LOGOUT
 */
export async function logout() {
  return apiFetch<ApiResponse<null>>("/auth/logout", { method: "POST" });
}
