export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function parseSlugWithId(slug: string): {
  gameName: string;
  gameId: string;
} {
  const slugParts = slug.split("-");
  const gameId = slugParts[slugParts.length - 1];
  const gameName = slugParts
    .slice(0, -1)
    .join(" ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());

  return { gameName, gameId };
}

// Account type utilities
const ACCOUNT_TYPES = {
  vip: { slug: "vip", display: "VIP", apiValue: "VIP" },
  normal: { slug: "normal", display: "Normal", apiValue: "Normal" },
} as const;

export type AccountTypeSlug = keyof typeof ACCOUNT_TYPES;

export function normalizeAccountType(type: string) {
  const normalized = type.toLowerCase() as AccountTypeSlug;
  const accountType = ACCOUNT_TYPES[normalized];

  if (!accountType) {
    return null;
  }

  return {
    slug: accountType.slug,
    display: accountType.display,
    apiValue: accountType.apiValue,
  };
}
