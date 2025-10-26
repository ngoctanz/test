import { PaymentMethod } from "@/types/payment-type";

export const validateBalance = (
  userBalance: number | string | undefined,
  requiredAmount: number | string | undefined
): boolean => {
  // Handle undefined or null values
  if (userBalance === undefined || userBalance === null) return false;
  if (requiredAmount === undefined || requiredAmount === null) return false;

  // Force to number and fix string input like "10000.00"
  const balNum =
    typeof userBalance === "string" ? Number(userBalance) : userBalance;
  const reqNum =
    typeof requiredAmount === "string"
      ? Number(requiredAmount)
      : requiredAmount;

  if (Number.isNaN(balNum) || Number.isNaN(reqNum)) return false;

  // Round to 2 decimals
  const balance = Math.round(Number(balNum) * 100) / 100;
  const required = Math.round(Number(reqNum) * 100) / 100;

  return balance >= required && required > 0;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string | undefined): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate payment data before processing
 */
export const validatePaymentData = (data: {
  paymentMethod: PaymentMethod;
  email: string;
  accountPrice: number | string;
  userBalance: number | string;
}): { isValid: boolean; error?: string } => {
  // Validate email only for balance payment
  if (data.paymentMethod === "balance" && !validateEmail(data.email)) {
    return { isValid: false, error: "Email không hợp lệ" };
  }

  // Force to number for validation
  const accountPriceNum =
    typeof data.accountPrice === "string"
      ? Number(data.accountPrice)
      : data.accountPrice;
  const userBalanceNum =
    typeof data.userBalance === "string"
      ? Number(data.userBalance)
      : data.userBalance;

  // Validate account price
  if (!accountPriceNum || accountPriceNum <= 0) {
    return { isValid: false, error: "Giá tài khoản không hợp lệ" };
  }

  // Validate balance if paying with balance
  if (data.paymentMethod === "balance") {
    if (!userBalanceNum || !validateBalance(userBalanceNum, accountPriceNum)) {
      return {
        isValid: false,
        error: `Số dư không đủ. Cần: $${accountPriceNum}, Có: $${
          userBalanceNum || 0
        }`,
      };
    }
  }

  return { isValid: true };
};
