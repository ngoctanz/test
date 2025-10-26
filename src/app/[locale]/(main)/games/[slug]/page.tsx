"use client";

import React, { use, useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ROUTES } from "@/routes";
import { parseSlugWithId } from "@/utils/format-slug.util";
import { getStatsByType } from "@/apis/game-account.api";
import TypeAccountCard from "@/components/cards/type-accout.card";
import { useTranslations } from "next-intl";

const ACCOUNT_TYPES = [
  { slug: "vip", name: "ACC VIP", image: "/images/types_account/vip.jpg" },
  {
    slug: "normal",
    name: "ACC NORMAL",
    image: "/images/types_account/normal.png",
  },
];

interface TypeStats {
  typeAccount: string;
  available: number;
  sold: number;
}

export default function GameTypesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { gameName, gameId } = parseSlugWithId(slug);

  const t = useTranslations("game.type");

  const [stats, setStats] = useState<TypeStats[]>([]);
  const [loading, setLoading] = useState(true);

  if (isNaN(Number(gameId))) notFound();

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await getStatsByType(Number(gameId));
        setStats(res?.data || res.data?.data || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [gameId]);

  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <>
      <div className="fixed inset-0 z-[-1]">
        <Image
          src="/images/background_hks_2.jpg"
          alt="Background"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* 📦 Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm">
            <Link
              href={ROUTES.HOME as any}
              className="text-gray-400 hover:text-white"
            >
              {t("homepage")}
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-white">{gameName}</span>
          </div>

          {/* 🏷 Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {gameName}
            </h1>
            <p className="text-gray-300 text-lg">{t("subtitle")}</p>
            <div className="h-1 w-24 bg-blue-500 mx-auto mt-4 rounded-full" />
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-20 bg-[#1a1d29]/80 rounded-xl border border-[#2a2d3a]">
              Updating account types...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {ACCOUNT_TYPES.map((type) => {
                const stat = safeStats.find(
                  (s) => s.typeAccount.toLowerCase() === type.slug
                ) || { typeAccount: type.slug, available: 0, sold: 0 };

                return (
                  <TypeAccountCard
                    key={type.slug}
                    slug={slug}
                    type={type.slug}
                    title={`${type.name} ${gameName.toUpperCase()}`}
                    image={type.image}
                    available={stat.available}
                    sold={stat.sold}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
