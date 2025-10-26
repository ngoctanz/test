import HomeBannerSection from "@/sections/home-sections/banner.home.section";
import ListGameHomeSection from "@/sections/home-sections/list-game.home.section";
import RechargeHomeSection from "@/sections/home-sections/recharge.home.section";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Game Account Store - Buy Premium Gaming Accounts",
  description:
    "Buy verified gaming accounts for League of Legends, Genshin Impact, Arknights, Mobile Legends, Honkai Star Rail & more. Instant delivery, secure payment, 24/7 support. Trusted by 50,000+ gamers worldwide.",
  keywords: [
    "buy game accounts",
    "premium gaming accounts",
    "League of Legends accounts",
    "Genshin Impact accounts",
    "gaming marketplace",
  ],
  openGraph: {
    title: "Best Game Account Store - Premium Gaming Accounts",
    description:
      "The most trusted marketplace for gaming accounts. Instant delivery & secure transactions.",
    type: "website",
    images: ["/logo.jpg"],
  },
};

export default function Home() {
  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <Image
          src="/images/background_hks_2.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <HomeBannerSection />
        <ListGameHomeSection />
        <RechargeHomeSection />
      </div>
    </>
  );
}
