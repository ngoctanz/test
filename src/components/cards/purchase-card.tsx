"use client";

import React from "react";
import {
  Gamepad2,
  CheckCircle,
  Hash,
  FileText,
  Tag,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/payment.util";

interface PurchaseCardProps {
  purchase: any;
}

export default function PurchaseCard({ purchase }: PurchaseCardProps) {
  const t = useTranslations("histories");

  const { gameAccount } = purchase;
  const game = gameAccount?.gameCategory;

  // Format thời gian
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-[#1a1d29]/90 backdrop-blur-sm border border-[#2a2d3a] rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-200">
      {/* HEADER */}
      <div className="flex items-center gap-4 p-5 border-b border-[#2a2d3a]">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {gameAccount?.mainImageUrl ? (
            <Image
              src={gameAccount.mainImageUrl}
              alt={game?.gameCategoryName || "Game"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-white font-bold text-lg leading-tight">
            {game?.gameCategoryName || "Không rõ tên game"}
          </h3>
          <p className="text-gray-400 text-sm">
            {gameAccount?.typeAccount
              ? `Loại tài khoản: ${gameAccount.typeAccount}`
              : ""}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {formatDate(purchase.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 text-xs font-medium px-3 py-1.5 rounded-lg border border-green-500/30">
          <CheckCircle className="w-4 h-4" />
          <span>Hoàn tất</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        {/* GIÁ */}
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">{t("purchase_price")}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-400">
              ${formatCurrency(gameAccount?.currentPrice || "0")}
            </p>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Giá gốc: ${formatCurrency(gameAccount?.originalPrice || "0")}
          </p>
        </div>

        {/* THÔNG TIN TÀI KHOẢN */}
        <div className="space-y-3">
          {/* Mã đơn hàng */}
          <div className="bg-[#0f1115] rounded-lg p-3 border border-[#2a2d3a]">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Hash className="w-3.5 h-3.5" />
              <span>Mã đơn hàng</span>
            </div>
            <p className="text-white text-sm font-mono">
              #{purchase.orderId.toString().padStart(5, "0")}
            </p>
          </div>

          {/* Mô tả */}
          <div className="bg-[#0f1115] rounded-lg p-3 border border-[#2a2d3a]">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Mô tả tài khoản</span>
            </div>
            <p className="text-white text-sm leading-relaxed">
              {gameAccount?.description}
            </p>
          </div>

          {/* Loại tài khoản */}
          <div className="bg-[#0f1115] rounded-lg p-3 border border-[#2a2d3a]">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Loại tài khoản</span>
            </div>
            <p className="text-white text-sm">{gameAccount?.typeAccount}</p>
          </div>

          {/* Ngày mua */}
          <div className="bg-[#0f1115] rounded-lg p-3 border border-[#2a2d3a]">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ngày mua</span>
            </div>
            <p className="text-white text-sm">
              {formatDate(purchase.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
