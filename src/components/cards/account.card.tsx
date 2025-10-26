"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { GameAccountStatus } from "@/types/game-account.type";
import { GameRoutes } from "@/routes";

interface AccountCardProps {
  id: string;
  slug: string;
  type: string;
  title: string;
  description?: string;
  originalPrice?: number;
  actualPrice: number;
  status: GameAccountStatus;
  coverImage: string;
  images?: string[];
}

function AccountCard({
  id,
  slug,
  type,
  title,
  description,
  originalPrice,
  actualPrice,
  status = "available",
  coverImage,
  images = [],
}: AccountCardProps) {
  const t = useTranslations("AccountCard");

  const statusConfig: Record<
    GameAccountStatus,
    { label: string; color: string }
  > = {
    available: { label: t("status.available"), color: "bg-green-600" },
    sold: { label: t("status.sold"), color: "bg-red-600" },
    reserved: { label: t("status.reserved"), color: "bg-yellow-600" },
  };

  const currentStatus = statusConfig[status] || statusConfig.available;
  const hasDiscount = originalPrice && originalPrice > actualPrice;

  return (
    <div className="group bg-[#1a1d29] rounded-xl overflow-hidden border border-[#2a2d3a] hover:border-blue-500/50 transition-all duration-300 flex flex-col">
      {/* Image with Badges */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div
          className={`absolute top-3 left-3 ${currentStatus.color} text-white px-3 py-1 rounded-md text-xs font-bold`}
        >
          {currentStatus.label}
        </div>

        {/* ID Badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-md text-xs font-bold">
          #{id}
        </div>

        {/* Images count */}
        {images.length > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            {t("imagesCount", { count: images.length })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-white text-base font-semibold mb-2 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price Section */}
        <div className="mb-4 mt-auto">
          {hasDiscount && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 text-sm line-through">
                ${originalPrice?.toLocaleString("en-US")}
              </span>
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">
                -
                {Math.round(
                  ((originalPrice! - actualPrice) / originalPrice!) * 100
                )}
                %
              </span>
            </div>
          )}
          <p className="text-blue-400 font-bold text-2xl">
            ${actualPrice.toLocaleString("en-US")}
          </p>
        </div>

        {/* Button */}
        <Link
          href={GameRoutes.accountDetail(slug, type, id) as any}
          className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
            status === "available"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-600 cursor-not-allowed text-gray-300"
          }`}
        >
          {status === "available"
            ? t("buttons.viewDetails")
            : t("buttons.notAvailable")}
        </Link>
      </div>
    </div>
  );
}

export default AccountCard;
