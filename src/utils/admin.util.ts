import type { GameAccount } from "@/types/game-account.type";
import type { User } from "@/types/user.type";
import type { Order } from "@/types/order.type";
import { listAllUsers } from "@/apis/admin.api";

// recent orders utils
export const sortOrdersByDate = (orders: Order[]): Order[] => {
  return [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const searchOrders = (orders: any[], searchQuery: string): any[] => {
  if (!searchQuery.trim()) return orders;

  const query = searchQuery.toLowerCase();
  return orders.filter(
    (order) =>
      order.orderId?.toString().toLowerCase().includes(query) ||
      order.userId?.toString().toLowerCase().includes(query) ||
      order.gameAccountId?.toString().toLowerCase().includes(query) ||
      order.user?.email?.toLowerCase().includes(query) ||
      order.gameAccount?.gameCategory?.gameCategoryName
        ?.toLowerCase()
        .includes(query) ||
      // Fallback for old format
      order.id?.toString().toLowerCase().includes(query) ||
      order.accountId?.toString().toLowerCase().includes(query) ||
      order.userEmail?.toLowerCase().includes(query) ||
      order.accountTitle?.toLowerCase().includes(query)
  );
};

export const transformOrdersForDisplay = (
  orders: any[]
): Array<{
  id: string;
  userId: string;
  email?: string;
  accountId: string;
  accountTitle: string;
  amount: number;
  status: string;
  createdAt: string;
}> => {
  return orders.map((order) => ({
    id: order.id || order.orderId,
    userId: order.userId,
    email: order.userEmail || "N/A",
    accountId: order.accountId || order.gameAccountId,
    accountTitle: order.accountTitle || order.description || "N/A",
    amount: order.amount,
    status: order.status,
    createdAt: order.createdAt,
  }));
};

export const getRecentOrdersForDisplay = (
  orders: Order[]
): ReturnType<typeof transformOrdersForDisplay> => {
  const sortedOrders = sortOrdersByDate(orders);
  return transformOrdersForDisplay(sortedOrders);
};

//game account utils
export const searchAccounts = (
  accounts: GameAccount[],
  searchQuery: string
): GameAccount[] => {
  if (!searchQuery.trim()) return accounts;

  const query = searchQuery.toLowerCase();
  return accounts.filter(
    (account) =>
      account.gameAccountId.toString().includes(query) ||
      account.description?.toLowerCase().includes(query) ||
      account.gameCategory?.gameCategoryName.toLowerCase().includes(query)
  );
};

export const sortAccountsByStatus = (
  accounts: GameAccount[]
): GameAccount[] => {
  return [...accounts].sort((a, b) => {
    const statusOrder = { available: 0, reserved: 1, sold: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
};

export const filterAccountsByPrice = (
  accounts: GameAccount[],
  priceRange: string
): GameAccount[] => {
  if (!priceRange || priceRange === "all") return accounts;

  return accounts.filter((account) => {
    const price = Number(account.currentPrice);
    switch (priceRange) {
      case "under100":
        return price < 100;
      case "100to200":
        return price >= 100 && price < 200;
      case "200to500":
        return price >= 200 && price < 500;
      case "over500":
        return price >= 500;
      default:
        return true;
    }
  });
};

export const filterAccountsByGame = (
  accounts: GameAccount[],
  gameCategoryId: string
): GameAccount[] => {
  if (!gameCategoryId || gameCategoryId === "all") return accounts;
  return accounts.filter(
    (account) => account.gameCategoryId.toString() === gameCategoryId
  );
};

export const filterAccountsByType = (
  accounts: GameAccount[],
  accountType: string
): GameAccount[] => {
  if (!accountType || accountType === "all") return accounts;
  return accounts.filter((account) => account.typeAccount === accountType);
};

export const getUniqueGameIds = (accounts: GameAccount[]): number[] => {
  const gameIds = new Set(accounts.map((acc) => acc.gameCategoryId));
  return Array.from(gameIds);
};

export const filterAccounts = (
  accounts: GameAccount[],
  searchQuery?: string,
  gameCategoryId?: string,
  accountType?: string,
  priceRange?: string
): GameAccount[] => {
  let filtered = accounts;

  if (searchQuery) {
    filtered = searchAccounts(filtered, searchQuery);
  }

  if (gameCategoryId) {
    filtered = filterAccountsByGame(filtered, gameCategoryId);
  }

  if (accountType) {
    filtered = filterAccountsByType(filtered, accountType);
  }

  if (priceRange) {
    filtered = filterAccountsByPrice(filtered, priceRange);
  }

  return filtered;
};

//common utils
export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

//user utils
export function mapUserResponseToList(usersData: any[]): User[] {
  if (!Array.isArray(usersData)) return [];

  return usersData.map((user: any) => ({
    id: String(user.userId),
    email: user.email,
    role: user.role || "USER",
    balance:
      typeof user.money === "string" ? parseFloat(user.money) : user.money || 0,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  }));
}
export function extractUserData(response: any): any[] {
  return response?.data?.data || response?.data?.users || [];
}
export const sortUsersByBalance = (users: User[]): User[] => {
  return [...users].sort((a, b) => b.balance - a.balance);
};

export const searchUsers = (users: User[], searchQuery: string): User[] => {
  if (!searchQuery.trim()) return users;

  const query = searchQuery.toLowerCase();
  return users.filter(
    (user) =>
      user.id.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );
};

export async function fetchAllUsers(limit = 1000): Promise<User[]> {
  const response = await listAllUsers({ limit });
  const usersData = extractUserData(response);
  return mapUserResponseToList(usersData);
}
