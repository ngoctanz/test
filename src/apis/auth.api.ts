import { apiFetch } from "./client";
import type { ApiResponse } from "../types/api.type";

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

export async function login(payload: LoginPayload) {
  return apiFetch<ApiResponse<null>>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload) {
  return apiFetch<ApiResponse<null>>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function profile() {
  return apiFetch<ApiResponse<Profile>>("/auth/profile", { method: "GET" });
}

export async function refresh() {
  return apiFetch<ApiResponse<null>>("/auth/refresh", { method: "POST" });
}

export async function logout() {
  return apiFetch<ApiResponse<null>>("/auth/logout", { method: "POST" });
}
