"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { listGameCategories } from "@/apis/game-category.api";
import type { GameCategory } from "@/types/game-category.type";
import { isVideoUrl } from "@/utils/format-image.util";
import { createSlug } from "@/utils/format-slug.util";

function ListGameHomeSection() {
  const t = useTranslations("home.list_game_section");
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGameCategories() {
      try {
        setLoading(true);
        const response = await listGameCategories();
        setGameCategories(response.data || []);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch game categories:", err);
        setError(err.message || "Failed to load game categories");
      } finally {
        setLoading(false);
      }
    }

    fetchGameCategories();
  }, []);
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Game Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {gameCategories.map((game) => {
              const gameSlug = `${createSlug(game.gameCategoryName)}-${
                game.gameCategoryId
              }`;
              return (
                <Link
                  key={game.gameCategoryId}
                  href={`/games/${gameSlug}` as any}
                  className="group bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-blue-400/50 hover:bg-black/60 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:transform hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Video/Image Container with padding and border */}
                  <div className="p-3">
                    <div className="relative w-full aspect-video bg-black/50 overflow-hidden rounded-lg border-2 border-white/10 group-hover:border-blue-400/30">
                      {isVideoUrl(game.imageGameCategory) ? (
                        <video
                          src={game.imageGameCategory}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <img
                          src={
                            game.imageGameCategory || "/images/placeholder.jpg"
                          }
                          alt={game.gameCategoryName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-4">
                    <h3 className="text-lg font-bold text-white mb-3 text-center group-hover:text-blue-300 transition-colors">
                      {game.gameCategoryName}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{t("available")}</span>
                        <span className="text-green-400 font-semibold">
                          {game.availableAccounts ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{t("sold")}</span>
                        <span className="text-blue-300 font-semibold">
                          {game.soldAccounts ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="w-full bg-blue-600/80 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-blue-500/20 text-center">
                      {t("view_now")}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListGameHomeSection;
