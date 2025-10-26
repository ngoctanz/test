"use client";

import { Clock, CheckCircle, XCircle, CreditCard, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface DepositCardProps {
  deposit: {
    requestDepositId: number;
    description: string;
    imgUrl?: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
  };
}

export default function DepositCard({ deposit }: DepositCardProps) {
  const t = useTranslations("histories");
  const [imageExpanded, setImageExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400 border-green-500/40 bg-green-500/10";
      case "rejected":
        return "text-red-400 border-red-500/40 bg-red-500/10";
      case "pending":
        return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  const getStatusIcon = () => {
    switch (deposit.status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="bg-[#1a1d29]/90 backdrop-blur-sm border border-[#2a2d3a] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-200">
        <div className="flex flex-col md:flex-row gap-4 p-5">
          {/* Left side - Image preview */}
          {deposit.imgUrl && (
            <div className="md:w-48 flex-shrink-0">
              <div
                className="relative w-full h-48 rounded-lg overflow-hidden bg-[#0f1115] border border-[#2a2d3a] cursor-pointer group"
                onClick={() => setImageExpanded(true)}
              >
                <Image
                  src={deposit.imgUrl}
                  alt="Deposit proof"
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          )}

          {/* Right side - Information */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-sm md:text-base truncate">
                      {deposit.description}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">
                      {formatDate(deposit.createdAt)}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap ${getStatusColor(
                    deposit.status
                  )}`}
                >
                  {getStatusIcon()}
                  <span className="capitalize hidden sm:inline">
                    {t(`deposit_status.${deposit.status}`)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-[#0f1115] border border-[#2a2d3a] text-gray-300">
                  <span className="text-gray-500">ID:</span>{" "}
                  <span className="font-mono">#{deposit.requestDepositId}</span>
                </div>
                {deposit.imgUrl && (
                  <div className="px-3 py-1.5 rounded-lg bg-[#0f1115] border border-[#2a2d3a] text-blue-400">
                    Có ảnh chứng từ
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image modal */}
      {imageExpanded && deposit.imgUrl && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageExpanded(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={() => setImageExpanded(false)}
            >
              <XCircle className="w-8 h-8" />
            </button>
            <div className="bg-[#1a1d29] rounded-xl overflow-hidden border border-[#2a2d3a]">
              <div className="overflow-auto max-h-[85vh]">
                <Image
                  src={deposit.imgUrl}
                  alt="Deposit proof"
                  width={1200}
                  height={1200}
                  className="w-full h-auto"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
