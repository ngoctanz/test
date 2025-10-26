"use client";

import { useState } from "react";
import { GameAccount } from "@/types/game-account.type";
import BuyingGuideModal from "@/components/modals/buying-guide.modal";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { GameRoutes, ROUTES } from "@/routes";
import { useAuth } from "@/contexts/auth.context";
import { DISCORD_CONTACT_LINK } from "@/utils/contact.info";

interface AccountDetailSectionProps {
  account: GameAccount;
  gameName: string;
}

function AccountDetailSection({
  account,
  gameName,
}: AccountDetailSectionProps) {
  const t = useTranslations("game.account_detail");
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBuyingGuide, setShowBuyingGuide] = useState(false);

  const originalPrice = Number(account.originalPrice || "0");
  const currentPrice = Number(account.currentPrice || "0");
  const hasDiscount = originalPrice > 0 && originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Handle buy now click - check authentication first
  const handleBuyNow = () => {
    if (!isAuthenticated || !user) {
      // Redirect to login with return URL
      router.push(ROUTES.LOGIN as any);
      return;
    }

    // Navigate to payment page
    router.push(
      GameRoutes.accountPayment(
        account.gameCategoryId.toString(),
        account.typeAccount?.toLowerCase() || "normal",
        account.gameAccountId.toString()
      ) as any
    );
  };

  const allImages = account.images?.map((img) => img.imageUrl) || [];
  if (account.mainImageUrl && !allImages.includes(account.mainImageUrl)) {
    allImages.unshift(account.mainImageUrl);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Images Gallery */}
      <div className="lg:col-span-2">
        <div className="bg-[#1a1d29] rounded-xl overflow-hidden border border-[#2a2d3a] p-4">
          {/* Main Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
            <img
              src={
                allImages[selectedImage] ||
                account.mainImageUrl ||
                "/images/placeholder.png"
              }
              alt={account.description || "Account image"}
              className="w-full h-full object-cover"
            />
            {/* Status Badge on Image */}
            {account.status === "sold" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-red-600 text-white px-6 py-3 rounded-lg text-2xl font-bold">
                  {t("sold_badge")}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-blue-500"
                      : "border-[#2a2d3a] hover:border-[#3a3d4a]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          <div className="mt-6 p-4 bg-[#16171f] rounded-lg">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t("description_title")}
            </h3>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {account.description}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Account Info & Purchase */}
      <div className="lg:col-span-1">
        <div className="bg-[#1a1d29] rounded-xl border border-[#2a2d3a] p-6 sticky top-4">
          {/* Account ID */}
          <div className="mb-4 pb-4 border-b border-[#2a2d3a]">
            <p className="text-gray-400 text-xs mb-1">{t("account_code")}</p>
            <p className="text-white font-bold text-lg">
              #{account.gameAccountId}
            </p>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-white mb-4 leading-snug">
            {account.title || account.description || "Game Account"}
          </h1>

          {/* Game Info */}
          <div className="mb-4 p-3 bg-[#16171f] rounded-lg">
            <p className="text-gray-400 text-xs mb-1">{t("game")}</p>
            <p className="text-blue-400 font-semibold">{gameName}</p>
          </div>

          {/* Price Section */}
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
            <p className="text-gray-300 text-sm mb-2">{t("product_price")}</p>

            {hasDiscount && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400 text-lg line-through">
                  ${Number(account.originalPrice).toLocaleString("en-US")}
                </span>
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                  -{discountPercent}%
                </span>
              </div>
            )}

            <p className="text-blue-400 font-bold text-3xl">
              ${Number(account.currentPrice).toLocaleString("en-US")}
            </p>
          </div>

          {/* Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-3 bg-[#16171f] rounded-lg">
              <span className="text-gray-400 text-sm">{t("status")}</span>
              <span
                className={`font-semibold text-sm ${
                  account.status === "available"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {account.status === "available" ? t("in_stock") : t("sold_out")}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {account.status === "available" ? (
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 sm:py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{t("buy_now")}</span>
              </button>

              <button
                onClick={() => setShowBuyingGuide(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold py-3 sm:py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{t("buying_guide")}</span>
              </button>

              <button
                className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3 sm:py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                onClick={() => window.open(DISCORD_CONTACT_LINK, "_blank")}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{t("contact_advisor")}</span>
              </button>
            </div>
          ) : (
            <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 text-center">
              <p className="text-red-400 font-semibold">{t("sold_message")}</p>
            </div>
          )}

          {/* Buying Guide Modal */}
          <BuyingGuideModal
            open={showBuyingGuide}
            onOpenChange={setShowBuyingGuide}
          />

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-[#2a2d3a] space-y-3">
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("warranty_info")}</span>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-400">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("email_support")}</span>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-400">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span>{t("check_before_pay")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetailSection;
