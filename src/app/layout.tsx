import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default:
      "Best Game Account Store - Buy Premium Gaming Accounts | League of Legends, Genshin Impact & More",
    template: "%s | Best Game Account Store - Premium Gaming Accounts",
  },
  description:
    "Buy premium game accounts for League of Legends, Genshin Impact, Arknights, Mobile Legends, Honkai Star Rail, Wuthering Waves & more. Instant delivery, secure transactions, lifetime support. Trusted by 50,000+ gamers worldwide.",
  keywords: [
    "buy game accounts",
    "gaming accounts for sale",
    "League of Legends accounts",
    "LoL account shop",
    "Genshin Impact accounts",
    "Arknights accounts",
    "Mobile Legends accounts",
    "Honkai Star Rail accounts",
    "Wuthering Waves accounts",
    "premium gaming accounts",
    "verified game accounts",
    "instant delivery gaming accounts",
    "secure game account store",
    "buy LoL smurf accounts",
    "cheap gaming accounts",
    "leveled game accounts",
    "rare skin accounts",
    "game account marketplace",
    "trusted game seller",
    "gaming account shop",
    "buy accounts online",
    "game accounts worldwide",
    "3D game accounts",
    "MMO accounts for sale",
    "MOBA accounts",
  ],
  authors: [
    {
      name: "Best Game Account Store",
      url:
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://game-account-shop-next-js.vercel.app",
    },
  ],
  creator: "Best Game Account Store",
  publisher: "Best Game Account Store",
  formatDetection: {
    email: true,
    address: false,
    telephone: true,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://game-account-shop-next-js.vercel.app"
  ),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title:
      "Best Game Account Store - Buy Premium Gaming Accounts | League of Legends, Genshin Impact & More",
    description:
      "Buy premium game accounts for League of Legends, Genshin Impact, Arknights, Mobile Legends, Honkai Star Rail & more. Instant delivery, secure transactions, trusted by 50,000+ gamers worldwide.",
    siteName: "Best Game Account Store",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Best Game Account Store - Premium Gaming Accounts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Game Account Store - Premium Gaming Accounts",
    description:
      "Buy premium game accounts: League of Legends, Genshin Impact, Arknights, Mobile Legends, Star Rail & more. Instant delivery, secure & trusted.",
    images: ["/logo.jpg"],
    creator: "@BestGameAccounts",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add after registering with Google Search Console
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "gaming",
  applicationName: "Best Game Account Store",
  referrer: "origin-when-cross-origin",
  appleWebApp: {
    capable: true,
    title: "Best Game Account Store",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
