/**
 * Game Category
 */
export interface GameCategory {
  gameCategoryId: number;
  gameCategoryName: string;
  imageGameCategory?: string;
  availableAccounts?: number;
  soldAccounts?: number;
  createdAt?: string;
  updatedAt?: string;
}
