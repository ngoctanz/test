"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { GameRoutes } from "@/routes";
import { useTranslations } from "next-intl";

interface TypeAccountCardProps {
  slug: string;
  type: string;
  title: string;
  image: string;
  available: number;
  sold: number;
}

function TypeAccountCard({
  slug,
  type,
  title,
  image,
  available,
  sold,
}: TypeAccountCardProps) {
  const t = useTranslations("game.card");

  return (
    <Link
      href={GameRoutes.accountType(slug, type) as any}
      className="group bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 hover:bg-black/60 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 hover:transform hover:scale-[1.02] transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-4 text-center group-hover:text-purple-300 transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{t("available")}</span>
            <span className="text-green-400 font-semibold">{available}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{t("sold")}</span>
            <span className="text-blue-300 font-semibold">{sold}</span>
          </div>
        </div>

        {/* Button - Always at bottom */}
        <div className="mt-auto w-full bg-purple-600/80 hover:bg-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 text-center shadow-lg shadow-purple-500/20">
          {t("view_now")}
        </div>
      </div>
    </Link>
  );
}

export default TypeAccountCard;
