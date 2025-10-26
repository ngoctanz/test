import { apiFetch } from "./client";
import type { ApiResponse } from "../types/api.type";

export async function purchaseGameAccount(data: {
  gameAccountId: number;
  email: string;
}) {
  return apiFetch<ApiResponse<any>>("/order/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function myOrders(query?: Record<string, any>) {
  return apiFetch<ApiResponse<any>>("/order/my-orders", {
    method: "GET",
    query,
  });
}

export async function getOrder(id: number) {
  return apiFetch<ApiResponse<any>>(`/order/${id}`, { method: "GET" });
}

export async function getRecentOrdersForBanner() {
  return apiFetch<ApiResponse<any>>("/order/recent-banner", { method: "GET" });
}
