"use client";

import { useEffect, useState } from "react";
import { getRecentOrdersForBanner } from "@/apis/purchase.api";
import type { ApiResponse } from "@/types/api.type";
import { formatTimeAgo } from "@/utils/format-date.util";

interface BannerOrder {
  createdAt: string;
  description: string;
  email: string;
}

export default function NoticeTicker() {
  const [notices, setNotices] = useState<string[]>([]);

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        const res: ApiResponse<BannerOrder[]> =
          await getRecentOrdersForBanner();

        if (res?.data?.length) {
          const formatted = res.data.map((order) => {
            const timeAgo = formatTimeAgo(order.createdAt);
            return `💎 ${order.email} just purchased ${order.description} — ${timeAgo}`;
          });
          setNotices(formatted);
        } else {
          setNotices(["No recent orders available."]);
        }
      } catch (err) {
        console.error("Failed to load recent orders:", err);
        setNotices(["Unable to load recent order data."]);
      }
    }

    fetchRecentOrders();
  }, []);

  const repeatedNotices = [...notices, ...notices];

  return (
    <div className="mt-4 relative">
      <div className="bg-zinc-900 text-gray-200 flex items-center px-4 py-3 rounded-lg shadow-md overflow-hidden h-12 sm:h-14">
        <div className="flex items-center whitespace-nowrap animate-marquee gap-12">
          <span className="text-lg flex-shrink-0">🔔</span>
          {repeatedNotices.map((notice, index) => (
            <p
              key={index}
              className="text-sm sm:text-base flex-shrink-0 text-gray-300"
            >
              {notice}
            </p>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
      `}</style>
    </div>
  );
}
