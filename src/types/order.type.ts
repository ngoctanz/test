/**
 * Order status types
 */
export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

/**
 * Payment method types
 */
export type PaymentMethod = "balance" | "admin";

/**
 * Order interface - Main structure for orders/transactions
 */
export interface Order {
  orderId: number;
  userId: number;
  gameAccountId: number;
  price: string;
  createdAt: string;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  note?: string;
  updatedAt?: string;
  completedAt?: string;
}

/**
 * Purchase history types
 */
export type PurchaseStatus = "completed" | "processing" | "failed" | "refunded";
export type PurchasePaymentMethod = "balance" | "admin";

/**
 * Purchase History interface
 */
export interface PurchaseHistory {
  id: string;
  userId: string;
  accountId: string;
  gameName: string;
  gameSlug: string;
  accountType: string;
  accountTitle: string;
  accountDescription: string;
  coverImage: string;
  price: number; // Price in USD
  priceVND: number; // Price in VND
  paymentMethod: PurchasePaymentMethod;
  email: string; // Email to receive account
  status: PurchaseStatus;
  transactionId: string;
  purchasedAt: string;
  deliveredAt?: string;
  refundedAt?: string;
  refundReason?: string;
  accountCredentials?: {
    username?: string;
    password?: string;
    note?: string;
  };
}
