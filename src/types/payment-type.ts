import { GameAccount } from "./game-account.type";

export type PaymentMethod = "balance" | "admin";

export type PaymentStatus =
  | "success"
  | "error"
  | "insufficient_balance"
  | "pending_admin";

export interface PaymentResult {
  status: PaymentStatus;
  message: string;
  newBalance?: number;
  transactionId?: string;
}

export interface PaymentSectionProps {
  account: GameAccount;
  gameName: string;
}

export interface PaymentData {
  accountId: string;
  accountPrice: number;
  email: string;
  paymentMethod: PaymentMethod;
  userBalance: number;
}
