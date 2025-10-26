import type { GameAccount } from "@/types/game-account.type";

export interface FilterOption {
  label: string;
  value: string;
}

export function getFilterOptions(t: (key: string) => string) {
  return {
    sortOptions: [
      { label: t("sort_default"), value: "default" },
      { label: t("sort_price_asc"), value: "price-asc" },
      { label: t("sort_price_desc"), value: "price-desc" },
      { label: t("sort_newest"), value: "newest" },
    ],
    priceFilterOptions: [
      { label: t("price_all"), value: "all" },
      { label: t("price_under10"), value: "0-10" },
      { label: t("price_10to20"), value: "10-20" },
      { label: t("price_20to50"), value: "20-50" },
      { label: t("price_50to100"), value: "50-100" },
      { label: t("price_over100"), value: "100-999999" },
    ],
    statusFilterOptions: [
      { label: t("status_all"), value: "all" },
      { label: t("status_available"), value: "available" },
      { label: t("status_reserved"), value: "reserved" },
    ],
  };
}

export function filterByPrice(accounts: GameAccount[], priceFilter: string) {
  if (priceFilter === "all") return accounts;
  const [min, max] = priceFilter.split("-").map(Number);
  return accounts.filter(
    (acc) => Number(acc.currentPrice) >= min && Number(acc.currentPrice) <= max
  );
}

export function filterByStatus(accounts: GameAccount[], statusFilter: string) {
  if (statusFilter === "all") return accounts;
  return accounts.filter((acc) => acc.status === statusFilter);
}

export function sortAccounts(accounts: GameAccount[], sortBy: string) {
  const sorted = [...accounts];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort(
        (a, b) => Number(a.currentPrice) - Number(b.currentPrice)
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => Number(b.currentPrice) - Number(a.currentPrice)
      );
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    default:
      return sorted;
  }
}

export function applyFilters(
  accounts: GameAccount[],
  priceFilter: string,
  statusFilter: string,
  sortBy: string,
  searchQuery?: string
): GameAccount[] {
  let filtered = [...accounts];

  if (searchQuery?.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((acc) =>
      acc.description?.toLowerCase().includes(query)
    );
  }

  filtered = filterByPrice(filtered, priceFilter);
  filtered = filterByStatus(filtered, statusFilter);
  filtered = sortAccounts(filtered, sortBy);

  return filtered;
}
