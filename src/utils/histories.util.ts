import { PurchaseHistory, PurchaseStatus } from "@/types/order.type";
import { DepositHistory } from "@/types/deposit-request.type";

// ===========================
// DEPOSIT FILTER FUNCTIONS
// ===========================

export function filterDepositsBySearch(
  deposits: DepositHistory[],
  searchQuery: string
): DepositHistory[] {
  if (!searchQuery.trim()) return deposits;

  const searchLower = searchQuery.toLowerCase();
  return deposits.filter(
    (deposit) =>
      deposit.requestDepositId.toString().toLowerCase().includes(searchLower) ||
      deposit.description?.toLowerCase().includes(searchLower) ||
      deposit.status?.toLowerCase().includes(searchLower)
  );
}

export function filterDepositsByStatus(
  deposits: DepositHistory[],
  status: string
): DepositHistory[] {
  if (status === "all") return deposits;
  return deposits.filter((deposit) => deposit.status === status);
}

export function filterDepositsByDate(
  deposits: DepositHistory[],
  dateFilter: string
): DepositHistory[] {
  if (dateFilter === "all") return deposits;

  const now = new Date();
  return deposits.filter((deposit) => {
    const depositDate = new Date(deposit.createdAt);

    switch (dateFilter) {
      case "today":
        return depositDate.toDateString() === now.toDateString();
      case "this_week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return depositDate >= weekAgo;
      case "this_month":
        return (
          depositDate.getMonth() === now.getMonth() &&
          depositDate.getFullYear() === now.getFullYear()
        );
      case "last_3_months":
        const threeMonthsAgo = new Date(
          now.getTime() - 90 * 24 * 60 * 60 * 1000
        );
        return depositDate >= threeMonthsAgo;
      default:
        return true;
    }
  });
}

export function applyDepositFilters(
  deposits: DepositHistory[],
  searchQuery: string,
  statusFilter: string,
  dateFilter: string
): DepositHistory[] {
  let filtered = deposits;

  filtered = filterDepositsByStatus(filtered, statusFilter);
  filtered = filterDepositsBySearch(filtered, searchQuery);
  filtered = filterDepositsByDate(filtered, dateFilter);

  return filtered;
}

// ===========================
// PURCHASE FILTER FUNCTIONS
// ===========================

export function filterPurchasesBySearch(
  purchases: PurchaseHistory[],
  searchQuery: string
): PurchaseHistory[] {
  if (!searchQuery.trim()) return purchases;

  const searchLower = searchQuery.toLowerCase();
  return purchases.filter(
    (purchase) =>
      purchase.transactionId.toLowerCase().includes(searchLower) ||
      purchase.gameName.toLowerCase().includes(searchLower) ||
      purchase.accountTitle.toLowerCase().includes(searchLower) ||
      purchase.email.toLowerCase().includes(searchLower)
  );
}

export function filterPurchasesByStatus(
  purchases: PurchaseHistory[],
  status: string
): PurchaseHistory[] {
  if (status === "all") return purchases;
  return purchases.filter((purchase) => purchase.status === status);
}

export function filterPurchasesByDate(
  purchases: PurchaseHistory[],
  dateFilter: string
): PurchaseHistory[] {
  if (dateFilter === "all") return purchases;

  const now = new Date();
  return purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.purchasedAt);

    switch (dateFilter) {
      case "today":
        return purchaseDate.toDateString() === now.toDateString();
      case "this_week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return purchaseDate >= weekAgo;
      case "this_month":
        return (
          purchaseDate.getMonth() === now.getMonth() &&
          purchaseDate.getFullYear() === now.getFullYear()
        );
      case "last_3_months":
        const threeMonthsAgo = new Date(
          now.getTime() - 90 * 24 * 60 * 60 * 1000
        );
        return purchaseDate >= threeMonthsAgo;
      default:
        return true;
    }
  });
}

export function applyPurchaseFilters(
  purchases: PurchaseHistory[],
  searchQuery: string,
  statusFilter: string,
  dateFilter: string
): PurchaseHistory[] {
  let filtered = purchases;

  filtered = filterPurchasesByStatus(filtered, statusFilter);
  filtered = filterPurchasesBySearch(filtered, searchQuery);
  filtered = filterPurchasesByDate(filtered, dateFilter);

  return filtered;
}

// ===========================
// STATS CALCULATION FUNCTIONS
// ===========================

export function calculateDepositStats(deposits: DepositHistory[]) {
  return {
    total: deposits.length,
    pending: deposits.filter((d) => d.status === "pending").length,
    approved: deposits.filter((d) => d.status === "approved").length,
    rejected: deposits.filter((d) => d.status === "rejected").length,
  };
}

export function calculatePurchaseStats(purchases: PurchaseHistory[]) {
  return {
    total: purchases.length,
    completed: purchases.filter((p) => p.status === "completed").length,
    processing: purchases.filter((p) => p.status === "processing").length,
    failed: purchases.filter((p) => p.status === "failed").length,
    refunded: purchases.filter((p) => p.status === "refunded").length,
  };
}
