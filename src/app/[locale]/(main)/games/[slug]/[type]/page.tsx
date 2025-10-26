import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import ListAccountSection from "@/sections/account-sections/list-account.section";
import { ROUTES, GameRoutes } from "@/routes";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  parseSlugWithId,
  normalizeAccountType,
} from "@/utils/format-slug.util";
import { listGameAccounts } from "@/apis/game-account.api";
import type { GameAccount } from "@/types/game-account.type";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; type: string }>;
}): Promise<Metadata> {
  const { slug, type } = await params;
  const { gameName } = parseSlugWithId(slug);
  const accountType = normalizeAccountType(type);

  const typeLabel = accountType?.display || type.toUpperCase();

  return {
    title: `Buy ${gameName} ${typeLabel} Accounts - Premium & Verified`,
    description: `Browse our collection of ${typeLabel.toLowerCase()} ${gameName} accounts. Verified sellers, instant delivery, secure payment. All accounts are checked and ready to play. Get your ${gameName} account now!`,
    keywords: [
      `buy ${gameName} accounts`,
      `${gameName} ${type} accounts`,
      `${gameName} accounts for sale`,
      `premium ${gameName}`,
      `verified ${gameName} accounts`,
    ],
    openGraph: {
      title: `${gameName} ${typeLabel} Accounts - Best Game Account Store`,
      description: `Premium ${gameName} ${typeLabel.toLowerCase()} accounts with instant delivery`,
      type: "website",
    },
  };
}

export default async function AccountListPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; type: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug, type } = await params;
  const { page: rawPage } = await searchParams;
  const currentPage = Math.max(Number(rawPage) || 1, 1);

  const { gameName, gameId } = parseSlugWithId(slug);
  if (isNaN(Number(gameId))) notFound();

  const accountType = normalizeAccountType(type);
  if (!accountType) notFound();

  const t = await getTranslations("game.account_list");

  let accounts: GameAccount[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const response = await listGameAccounts({
      gameCategoryId: Number(gameId),
      typeAccount: accountType.apiValue,
      status: "available",
      limit: 12,
      page: currentPage,
      sortOrder: "ASC",
    });

    accounts = response.data?.data || [];
    total = response.data?.pagination?.total || 0;
    totalPages = response.data?.pagination?.totalPages || 1;
  } catch (error) {
    console.error("❌ Failed to fetch game accounts:", error);
  }

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
            <span className="text-white">
              {t("acc_prefix")} {accountType.display}
            </span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {t("acc_prefix")} {accountType.display} {gameName}
            </h1>
            <p className="text-gray-300 text-lg">
              {t("all_available", { type: accountType.display.toLowerCase() })}
            </p>
            <div className="h-1 w-24 bg-blue-500 mt-4 rounded-full" />
          </div>

          {/* List Accounts */}
          <ListAccountSection
            accounts={accounts}
            slug={slug}
            type={accountType.slug}
          />

          {/* ✅ Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={
                    `${GameRoutes.accountList(slug, type)}?page=${p}` as any
                  }
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    p === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-[#1a1d29] hover:bg-[#2a2d3a] text-gray-300"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
