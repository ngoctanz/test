export const ROUTES = {
  HOME: "/",
  POLICIES: "/policies",
  LOGIN: "/login",
  REGISTER: "/register",
  DEPOSIT: "/deposit",
  HISTORIES: "/histories",
} as const;

export const AdminRoutes = {
  DASHBOARD: "/admin",
  ACCOUNTS: "/admin/accounts",
  USERS: "/admin/users",
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  SETTINGS: "/admin/settings",
} as const;

export const GameRoutes = {
  game: (slug: string) => `/games/${slug}`,
  accountType: (slug: string, type: string) => `/games/${slug}/${type}`,
  accountDetail: (slug: string, type: string, id: string) =>
    `/games/${slug}/${type}/${id}`,
  accountPayment: (slug: string, type: string, id: string) =>
    `/games/${slug}/${type}/${id}/payment`,
  accountList: (slug: string, type: string) => `/games/${slug}/${type}`,
} as const;

export enum GameSlug {
  GENSHIN_IMPACT = "genshin-impact",
  HONKAI_STAR_RAIL = "honkai-star-rail",
  ZENLESS_ZONE_ZERO = "zenless-zone-zero",
  WUTHERING_WAVES = "wuthering-waves",
}

export enum AccountType {
  VIP = "vip",
  REROLL = "reroll",
  NORMAL = "normal",
}

export type Route =
  | (typeof ROUTES)[keyof typeof ROUTES]
  | ReturnType<(typeof GameRoutes)[keyof typeof GameRoutes]>;

export const isValidGameSlug = (slug: string): slug is GameSlug => {
  return Object.values(GameSlug).includes(slug as GameSlug);
};

export const isValidAccountType = (type: string): type is AccountType => {
  return Object.values(AccountType).includes(type as AccountType);
};

export default {
  ...ROUTES,
  admin: AdminRoutes,
  games: GameRoutes,
  GameSlug,
  AccountType,
};
