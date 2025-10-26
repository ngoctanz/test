import {
  PaymentData,
  PaymentMethod,
  PaymentResult,
} from "@/types/payment-type";
import { validateBalance, validatePaymentData } from "./validation.util";

// Re-export for convenience
export { validateBalance, validateEmail } from "./validation.util";

export const processBalancePayment = async (
  data: PaymentData
): Promise<PaymentResult> => {
  try {
    // Validate payment data
    const validation = validatePaymentData(data);
    if (!validation.isValid) {
      return {
        status: "error",
        message: validation.error || "Dữ liệu thanh toán không hợp lệ",
      };
    }

    // Double-check balance (critical validation)
    if (
      !data.userBalance ||
      !validateBalance(data.userBalance, data.accountPrice)
    ) {
      return {
        status: "insufficient_balance",
        message: "Số dư không đủ để thực hiện giao dịch",
      };
    }

    // Calculate new balance
    const newBalance = Math.round(data.userBalance - data.accountPrice);

    // Ensure new balance is not negative (extra safety check)
    if (newBalance < 0) {
      return {
        status: "error",
        message: "Lỗi tính toán số dư. Vui lòng thử lại.",
      };
    }

    // Mock delay for API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Return success result
    return {
      status: "success",
      message: `Thanh toán thành công! Tài khoản sẽ được gửi đến ${data.email} trong ít phút.`,
      newBalance,
      transactionId,
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    return {
      status: "error",
      message: "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.",
    };
  }
};

export const processAdminPayment = async (
  data: PaymentData
): Promise<PaymentResult> => {
  try {
    // Mock delay for API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate mock request ID
    const requestId = `REQ-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    return {
      status: "pending_admin",
      message: `Yêu cầu đã được gửi! Admin sẽ liên hệ với bạn để hoàn tất giao dịch.`,
      transactionId: requestId,
    };
  } catch (error) {
    console.error("Admin payment request error:", error);
    return {
      status: "error",
      message: "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.",
    };
  }
};

export const processPayment = async (
  data: PaymentData
): Promise<PaymentResult> => {
  if (data.paymentMethod === "balance") {
    return processBalancePayment(data);
  } else if (data.paymentMethod === "admin") {
    return processAdminPayment(data);
  } else {
    return {
      status: "error",
      message: "Phương thức thanh toán không hợp lệ",
    };
  }
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
