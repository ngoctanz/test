// SEO Constants for Best Game Account Store

export const SITE_CONFIG = {
  name: "Best Game Account Store",
  shortName: "Best Game Accounts",
  description:
    "Buy premium game accounts for League of Legends, Genshin Impact, Arknights, Mobile Legends, Honkai Star Rail, Wuthering Waves & more. Instant delivery, secure transactions, lifetime support. Trusted by 50,000+ gamers worldwide.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://game-account-shop-next-js.vercel.app",
  locale: "en_US",
  defaultLanguage: "en",
};

export const GAME_CATEGORIES = {
  "League of Legends": {
    slug: "league-of-legends",
    description:
      "Buy League of Legends accounts with rare skins, high ranks, and champions",
    keywords: [
      "LoL accounts",
      "League accounts",
      "LoL smurf",
      "League of Legends accounts for sale",
    ],
  },
  "Genshin Impact": {
    slug: "genshin-impact",
    description:
      "Premium Genshin Impact accounts with 5-star characters and weapons",
    keywords: [
      "Genshin accounts",
      "Genshin Impact accounts",
      "5-star Genshin",
      "AR55+ accounts",
    ],
  },
  Arknights: {
    slug: "arknights",
    description: "Arknights accounts with rare operators and high progression",
    keywords: [
      "Arknights accounts",
      "AK accounts",
      "6-star operators",
      "Arknights starter accounts",
    ],
  },
  "Mobile Legends": {
    slug: "mobile-legends",
    description: "Mobile Legends accounts with high ranks and exclusive skins",
    keywords: [
      "ML accounts",
      "Mobile Legends accounts",
      "MLBB accounts",
      "Mythic accounts",
    ],
  },
  "Honkai Star Rail": {
    slug: "honkai-star-rail",
    description:
      "Honkai Star Rail accounts with powerful characters and light cones",
    keywords: [
      "HSR accounts",
      "Star Rail accounts",
      "Honkai accounts",
      "5-star characters",
    ],
  },
  "Wuthering Waves": {
    slug: "wuthering-waves",
    description:
      "Wuthering Waves accounts with premium resonators and progression",
    keywords: ["Wuthering Waves accounts", "WW accounts", "5-star resonators"],
  },
};

export const SEO_KEYWORDS = {
  primary: [
    "buy game accounts",
    "gaming accounts for sale",
    "premium game accounts",
    "verified game accounts",
    "instant delivery gaming accounts",
  ],
  secondary: [
    "cheap gaming accounts",
    "leveled game accounts",
    "rare skin accounts",
    "game account marketplace",
    "trusted game seller",
    "gaming account shop",
    "buy accounts online",
    "game accounts worldwide",
  ],
  games: [
    "League of Legends accounts",
    "LoL account shop",
    "Genshin Impact accounts",
    "Arknights accounts",
    "Mobile Legends accounts",
    "Honkai Star Rail accounts",
    "Wuthering Waves accounts",
    "buy LoL smurf accounts",
  ],
  categories: [
    "3D game accounts",
    "MMO accounts for sale",
    "MOBA accounts",
    "RPG game accounts",
    "gacha game accounts",
  ],
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/bestgameaccounts",
  twitter: "https://twitter.com/bestgameaccounts",
  discord: "https://discord.com/invite/v2DfZ5tm9",
  instagram: "https://instagram.com/bestgameaccounts",
  youtube: "https://youtube.com/@bestgameaccounts",
};

export const TRUST_INDICATORS = [
  "50,000+ Happy Gamers",
  "Instant Account Delivery",
  "Secure Transactions",
  "24/7 Customer Support",
  "Lifetime Warranty",
  "Money-Back Guarantee",
  "Verified Sellers",
  "SSL Encrypted",
];

export const META_DEFAULTS = {
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterCreator: "@BestGameAccounts",
  robots: "index, follow",
  googleBot:
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
};
