/**
 * Deposit Request Status - trạng thái yêu cầu nạp tiền
 */
export type DepositRequestStatus = "pending" | "approved" | "rejected";

/**
 * Deposit Request - Yêu cầu nạp tiền từ user
 */
export interface DepositRequest {
  requestDepositId: number;
  userId: number;
  description: string;
  imgUrl: string;
  status: DepositRequestStatus;
  createdAt: string;
  updatedAt?: string;
  user?: {
    email: string;
    money: number;
  };
}

export interface DepositHistory {
  requestDepositId: number;
  userId: number;
  description: string;
  imgUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface GetDepositHistoryParams {
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected";
}
/**
 * API Response for list deposit requests
 */
export interface ListDepositRequestsResponse {
  requests: DepositRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
