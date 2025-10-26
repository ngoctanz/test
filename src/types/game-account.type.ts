/**
 * Game Account Image
 */
export interface GameAccountImage {
  imageId: number;
  imageUrl: string;
  publicId?: string;
}

/**
 * Game Account Category
 */
export interface GameAccountCategory {
  gameCategoryId: number;
  gameCategoryName: string;
  imageGameCategory?: string;
}

/**
 * Game Account Status
 */
export type GameAccountStatus = "available" | "sold" | "reserved";

/**
 * Game Account Type
 */
export type GameAccountType = "VIP" | "Normal" | "Reroll";

export interface GameAccount {
  gameAccountId: number;
  status: GameAccountStatus;
  gameCategoryId: number;
  title?: string;
  originalPrice: string | number;
  currentPrice: string | number;
  description?: string;
  mainImageUrl?: string;
  typeAccount?: GameAccountType;
  createdAt?: string;
  updatedAt?: string;
  gameCategory?: GameAccountCategory;
  images?: GameAccountImage[];
}

/**
 * List Game Accounts Response
 */
export interface ListGameAccountsResponse {
  data: GameAccount[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * List Game Accounts Query Parameters
 */
export interface ListGameAccountsParams {
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
}
