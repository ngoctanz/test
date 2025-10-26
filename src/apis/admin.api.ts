import { apiFetch } from "./client";
import type { ApiResponse } from "../types/api.type";
import type {
  GameAccount,
  ListGameAccountsResponse,
} from "../types/game-account.type";

export async function listAllUsers(query?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) {
  return apiFetch<
    ApiResponse<{
      users: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  >("/user/admin/all", {
    method: "GET",
    query,
  });
}

export async function getUserById(id: number) {
  return apiFetch<ApiResponse<any>>(`/user/${id}`, {
    method: "GET",
  });
}

export async function updateUser(
  id: number,
  data: {
    email?: string;
    role?: string;
    money?: number;
  }
) {
  return apiFetch<ApiResponse<any>>(`/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function deleteUser(id: number) {
  return apiFetch<ApiResponse<null>>(`/user/${id}`, {
    method: "DELETE",
  });
}

export async function listGameCategories() {
  return apiFetch<ApiResponse<any[]>>("/game-category", {
    method: "GET",
  });
}

export async function getGameCategoryById(id: number) {
  return apiFetch<ApiResponse<any>>(`/game-category/${id}`, {
    method: "GET",
  });
}

export async function createGameCategory(formData: FormData) {
  return apiFetch<ApiResponse<any>>("/game-category", {
    method: "POST",
    body: formData,
  });
}

export async function updateGameCategory(id: number, formData: FormData) {
  return apiFetch<ApiResponse<any>>(`/game-category/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteGameCategory(id: number) {
  return apiFetch<ApiResponse<null>>(`/game-category/${id}`, {
    method: "DELETE",
  });
}

export async function listGameAccounts(query?: {
  page?: number;
  limit?: number;
  gameCategoryId?: number;
  status?: string;
  typeAccount?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}) {
  const response = await apiFetch<
    ApiResponse<{
      data: GameAccount[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  >("/game-account", {
    method: "GET",
    query,
  });

  // Normalize response to match ListGameAccountsResponse structure
  return {
    ...response,
    data:
      response.data?.data && response.data?.pagination
        ? {
            data: response.data.data,
            pagination: response.data.pagination,
          }
        : response.data,
  };
}

export async function getGameAccountById(id: number) {
  return apiFetch<ApiResponse<GameAccount>>(`/game-account/${id}`, {
    method: "GET",
  });
}

export async function createGameAccount(formData: FormData) {
  return apiFetch<ApiResponse<GameAccount>>("/game-account", {
    method: "POST",
    body: formData,
  });
}

export async function updateGameAccount(id: number, formData: FormData) {
  return apiFetch<ApiResponse<GameAccount>>(`/game-account/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteGameAccount(id: number) {
  return apiFetch<ApiResponse<null>>(`/game-account/${id}`, {
    method: "DELETE",
  });
}

export async function purchaseGameAccount(data: { gameAccountId: number }) {
  return apiFetch<
    ApiResponse<{
      orderId: number;
      userId: number;
      gameAccountId: number;
      price: string;
      createdAt: string;
    }>
  >("/order/purchase", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getMyOrders(query?: {
  page?: number;
  limit?: number;
  gameAccountId?: number;
}) {
  return apiFetch<
    ApiResponse<{
      orders: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  >("/order/my-orders", {
    method: "GET",
    query,
  });
}

export async function getOrdersByUserId(
  userId: number,
  query?: { page?: number; limit?: number }
) {
  // Admin endpoint to get orders by user id
  return apiFetch<ApiResponse<any[]>>(`/order/admin/user/${userId}`, {
    method: "GET",
    query,
  });
}

export async function listAllOrders(query?: {
  page?: number;
  limit?: number;
  userId?: number;
  gameAccountId?: number;
}) {
  return apiFetch<
    ApiResponse<{
      orders: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  >("/order/admin/all", {
    method: "GET",
    query,
  });
}

export async function getOrderById(id: number) {
  return apiFetch<ApiResponse<any>>(`/order/${id}`, {
    method: "GET",
  });
}

export async function createDepositRequest(formData: FormData) {
  return apiFetch<
    ApiResponse<{
      requestDepositId: number;
      userId: number;
      description: string;
      imgUrl: string;
      status: string;
      createdAt: string;
    }>
  >("/request-deposit", {
    method: "POST",
    body: formData,
  });
}

export async function getMyDepositRequests(query?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return apiFetch<
    ApiResponse<{
      requests: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  >("/request-deposit/my-requests", {
    method: "GET",
    query,
  });
}

export async function getUserDepositRequests(
  userId: number,
  query?: {
    page?: number;
    limit?: number;
    status?: string;
  }
) {
  return apiFetch<ApiResponse<any[]>>(`/request-deposit/admin/user/${userId}`, {
    method: "GET",
    query,
  });
}

export async function listAllDepositRequests(query?: {
  page?: number;
  limit?: number;
  status?: string;
  userId?: number;
}) {
  return apiFetch<
    ApiResponse<{
      requests: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  >("/request-deposit/admin/all", {
    method: "GET",
    query,
  });
}

export async function getDepositRequestById(id: number) {
  return apiFetch<ApiResponse<any>>(`/request-deposit/${id}`, {
    method: "GET",
  });
}

export async function updateDepositRequestStatus(
  id: number,
  data: { status: "approved" | "rejected" }
) {
  return apiFetch<
    ApiResponse<{
      requestDepositId: number;
      status: string;
      updatedAt: string;
    }>
  >(`/request-deposit/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function addMoneyToUser(data: { userId: number; amount: number }) {
  return apiFetch<
    ApiResponse<{
      userId: number;
      email: string;
      money: number;
    }>
  >("/request-deposit/admin/add-money", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function deleteDepositRequest(id: number) {
  return apiFetch<ApiResponse<null>>(`/request-deposit/${id}`, {
    method: "DELETE",
  });
}
