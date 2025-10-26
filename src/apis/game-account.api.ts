import { apiFetch } from "./client";
import type { ApiResponse } from "../types/api.type";
import type {
  GameAccount,
  ListGameAccountsResponse,
  ListGameAccountsParams,
} from "../types/game-account.type";

export async function getStatsByType(gameCategoryId: number) {
  return apiFetch<ApiResponse<any>>("/game-account/stats-by-type", {
    method: "GET",
    query: { gameCategoryId },
  });
}

export async function listGameAccounts(query?: ListGameAccountsParams) {
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

export async function getGameAccount(id: number) {
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
