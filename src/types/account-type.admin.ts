import { GameAccount, GameAccountCategory } from "@/types/game-account.type";

export interface AccountFormDialogProps {
  account?: GameAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (account: GameAccount) => void;
  games?: GameAccountCategory[];
  accountTypes?: Array<{ id: string; name: string }>;
}

export interface FormDataType extends Partial<GameAccount> {
  mainImageUrl?: string; // Ảnh bìa chính
  mainImageFile?: File; // File ảnh bìa
  newMainImageFile?: File; // File ảnh bìa mới khi edit
  additionalImageFiles?: File[]; // Files ảnh phụ khi tạo
  newAdditionalImageFiles?: File[]; // Files ảnh phụ mới khi edit
  deleteImageIds?: number[]; // IDs ảnh cần xóa khi edit
}

export interface AccountTypeItem {
  id: string; // "vip" | "reroll" | "normal"
  name: string; // Display name
  description?: string;
  color?: string; // Color code for UI display
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function getInitialFormData(): FormDataType {
  return {
    gameCategoryId: 0,
    description: "",
    originalPrice: "0",
    currentPrice: "0",
    status: "available",
    typeAccount: "Normal",
    mainImageUrl: "",
    images: [],
  };
}
