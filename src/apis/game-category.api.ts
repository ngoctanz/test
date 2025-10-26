import { apiFetch } from "./client";
import type { ApiResponse } from "../types/api.type";
import type { GameCategory } from "../types/game-category.type";

export async function listGameCategories() {
  return apiFetch<ApiResponse<GameCategory[]>>("/game-category", {
    method: "GET",
  });
}

export async function getGameCategory(id: number) {
  return apiFetch<ApiResponse<GameCategory>>(`/game-category/${id}`, {
    method: "GET",
  });
}

export async function createGameCategory(formData: FormData) {
  return apiFetch<ApiResponse<GameCategory>>("/game-category", {
    method: "POST",
    body: formData,
  });
}

export async function updateGameCategory(id: number, formData: FormData) {
  return apiFetch<ApiResponse<GameCategory>>(`/game-category/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteGameCategory(id: number) {
  return apiFetch<ApiResponse<null>>(`/game-category/${id}`, {
    method: "DELETE",
  });
}
