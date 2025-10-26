import { notFound } from "next/navigation";
import PaymentSection from "@/sections/payment-section/payment.section";
import { parseSlugWithId } from "@/utils/format-slug.util";
import { getGameAccount } from "@/apis/game-account.api";
import { getGameCategory } from "@/apis/game-category.api";
import type { Metadata } from "next";

interface PaymentPageProps {
  params: Promise<{
    slug: string;
    type: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PaymentPageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const { gameName: slugGameName } = parseSlugWithId(slug);

  let gameName = slugGameName;
  let price = 0;

  try {
    const accountData = await getGameAccount(Number(id));
    const account = accountData.data;
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

  return {
    title: `Payment - Complete Your ${gameName} Account Purchase`,
    description: `Securely complete your ${gameName} account purchase for $${price}. Multiple payment methods available. Instant delivery after payment confirmation.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Payment - ${gameName} Account`,
      description: "Complete your secure payment for gaming account purchase",
      type: "website",
    },
  };
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { slug, id } = await params;
  const { gameName: slugGameName, gameId } = parseSlugWithId(slug);

  // Fetch the account from API
  let account;
  let gameName = slugGameName;

  try {
    const accountData = await getGameAccount(Number(id));
    account = accountData.data;

    // Fetch game category name if available
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

  return <PaymentSection account={account} gameName={gameName} />;
}
