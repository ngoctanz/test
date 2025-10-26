import { apiFetch } from "./client";
import type { ApiResponse } from "../types/api.type";
import {
  DepositHistory,
  GetDepositHistoryParams,
} from "@/types/deposit-request.type";

/** ========================
 *  TYPES
 *  ======================== */

/** ========================
 *  GET: Lấy danh sách yêu cầu nạp tiền của user
 *  ======================== */
export async function getMyDepositRequests(
  params: GetDepositHistoryParams = {}
) {
  return apiFetch<
    ApiResponse<{
      data: DepositHistory[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  >("/request-deposit/my-requests", {
    method: "GET",
    query: params,
  });
}

/** ========================
 *  POST: Gửi yêu cầu nạp tiền mới
 *  ======================== */
export interface CreateDepositRequestParams {
  description: string;
  billImage: File;
}

export async function createDepositRequest(
  params: CreateDepositRequestParams
): Promise<ApiResponse<DepositHistory>> {
  const formData = new FormData();
  formData.append("description", params.description);
  formData.append("billImage", params.billImage);

  return apiFetch<ApiResponse<DepositHistory>>("/request-deposit", {
    method: "POST",
    body: formData,
  });
}
