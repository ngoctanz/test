"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

const rechargeList = [
  {
    id: 1,
    nameKey: "games.genshin",
    image: "/images/genshin_avt.webp",
  },
  {
    id: 2,
    nameKey: "games.honkai",
    image: "/images/hks_avt.webp",
  },
  {
    id: 3,
    nameKey: "games.zenless",
    image: "/images/zzz_avt.webp",
  },
  {
    id: 4,
    nameKey: "games.wuthering",
    image: "/images/ww_avt.webp",
  },
];

function RechargeHomeSection() {
  const t = useTranslations("home.recharge_section");
  return (
    <div className="w-full flex flex-col justify-center py-8">
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            {t("description")}
          </p>
        </div>

        {/* Recharge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {rechargeList.map((game) => (
            <div
              key={game.id}
              className="group bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 hover:bg-black/60 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 hover:transform hover:scale-[1.02] transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square bg-black/30 overflow-hidden flex items-center justify-center p-4">
                <div className="relative w-full h-full">
                  <Image
                    src={game.image}
                    alt={t(game.nameKey)}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 text-center group-hover:text-purple-300 transition-colors flex-grow">
                  {t(game.nameKey)}
                </h3>

                {/* Button */}
                <button className="w-full bg-purple-600/80 hover:bg-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-purple-500/20 mt-auto">
                  <Link href={`/deposit`}>{t("recharge_now")}</Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RechargeHomeSection;
