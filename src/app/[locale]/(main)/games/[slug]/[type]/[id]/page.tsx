import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import AccountDetailSection from "@/sections/account-sections/account-detail.section";
import { ROUTES, GameRoutes } from "@/routes";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  parseSlugWithId,
  normalizeAccountType,
} from "@/utils/format-slug.util";
import { getGameAccount } from "@/apis/game-account.api";
import { getGameCategory } from "@/apis/game-category.api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; type: string; id: string }>;
}): Promise<Metadata> {
  const { slug, id } = await params;
  const { gameName: slugGameName } = parseSlugWithId(slug);

  let account;
  let gameName = slugGameName;
  let price = 0;

  try {
    const accountData = await getGameAccount(Number(id));
    account = accountData.data;
    price = Number(account?.currentPrice) || 0;

    if (account?.gameCategoryId) {
      try {
        const categoryData = await getGameCategory(account.gameCategoryId);
        gameName = categoryData.data?.gameCategoryName || gameName;
      } catch (error) {
        console.error("Failed to fetch game category:", error);
      }
    }
  } catch (error) {
    console.error("Failed to fetch account:", error);
  }

  const accountName = account?.title || `${gameName} Account #${id}`;
  const description = account?.description
    ? account.description.substring(0, 150)
    : `Premium ${gameName} gaming account with verified credentials. Instant delivery after purchase.`;

  return {
    title: `${accountName} - Buy ${gameName} Account`,
    description: `${description}... Price: $${price}. Secure payment, instant delivery, lifetime support.`,
    keywords: [
      `buy ${gameName} account`,
      gameName,
      "gaming account for sale",
      "verified account",
      accountName,
    ],
    openGraph: {
      title: `${accountName} - ${gameName}`,
      description: `Premium ${gameName} account - $${price}`,
      type: "website",
      images: account?.mainImageUrl ? [account.mainImageUrl] : [],
    },
  };
}

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ slug: string; type: string; id: string }>;
}) {
  const { slug, type, id } = await params;
  const { gameName: slugGameName, gameId } = parseSlugWithId(slug);

  const accountType = normalizeAccountType(type);
  if (!accountType) {
    notFound();
  }

  let account;
  let gameName = slugGameName;

  try {
    const accountData = await getGameAccount(Number(id));
    account = accountData.data;

    if (account?.gameCategoryId) {
      try {
        const categoryData = await getGameCategory(account.gameCategoryId);
        gameName = categoryData.data?.gameCategoryName || gameName;
      } catch (error) {
        console.error("Failed to fetch game category:", error);
      }
    }
  } catch (error) {
    console.error("Failed to fetch account:", error);
    notFound();
  }

  if (!account) {
    notFound();
  }

  const t = await getTranslations("game.account_detail");

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
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link
              href={ROUTES.HOME as any}
              className="text-gray-400 hover:text-white"
            >
              {t("homepage")}
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <Link
              href={GameRoutes.game(slug) as any}
              className="text-gray-400 hover:text-white"
            >
              {gameName}
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <Link
              href={GameRoutes.accountType(slug, accountType.slug) as any}
              className="text-gray-400 hover:text-white"
            >
              {t("acc_prefix")} {accountType.display}
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-white">#{account.gameAccountId}</span>
          </div>

          {/* Account Detail Section */}
          <AccountDetailSection account={account} gameName={gameName} />
        </div>
      </div>
    </>
  );
}
