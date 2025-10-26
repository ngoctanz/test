"use client";

import { useState, useEffect, useMemo } from "react";
import { Wallet, ShoppingBag, Receipt, Package } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import DepositCard from "@/components/cards/deposit-card";
import PurchaseCard from "@/components/cards/purchase-card";
import { getMyDepositRequests } from "@/apis/request-deposit.api";
import { myOrders } from "@/apis/purchase.api";

type TabType = "deposit" | "purchase";

export default function HistoriesSection() {
  const t = useTranslations("histories");
  const [activeTab, setActiveTab] = useState<TabType>("deposit");

  // ====== DEPOSIT STATE ======
  const [depositHistories, setDepositHistories] = useState<any[]>([]);
  const [isDepositLoading, setIsDepositLoading] = useState(false);

  // ====== PURCHASE STATE ======
  const [purchaseHistories, setPurchaseHistories] = useState<any[]>([]);
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false);

  // ====== FETCH PURCHASE HISTORY ======
  useEffect(() => {
    (async () => {
      setIsPurchaseLoading(true);
      try {
        const res = await myOrders({ page: 1, limit: 100 });
        setPurchaseHistories(res.data?.data || []);
      } catch {
        setPurchaseHistories([]);
      } finally {
        setIsPurchaseLoading(false);
      }
    })();
  }, []);

  // ====== FETCH DEPOSIT HISTORY ======
  useEffect(() => {
    (async () => {
      setIsDepositLoading(true);
      try {
        const res = await getMyDepositRequests({ page: 1, limit: 100 });
        setDepositHistories(res.data?.data || []);
      } catch {
        setDepositHistories([]);
      } finally {
        setIsDepositLoading(false);
      }
    })();
  }, []);

  // ====== STATISTICS ======
  const depositStats = useMemo(
    () => ({
      total: depositHistories.length,
      pending: depositHistories.filter((d) => d.status === "pending").length,
      approved: depositHistories.filter((d) => d.status === "approved").length,
      rejected: depositHistories.filter((d) => d.status === "rejected").length,
    }),
    [depositHistories]
  );

  const purchaseStats = useMemo(
    () => ({
      total: purchaseHistories.length,
    }),
    [purchaseHistories]
  );

  // ====== RENDER ======
  const renderDepositList = () => {
    if (isDepositLoading) {
      return (
        <div className="text-center py-20 bg-[#1a1d29]/80 border border-[#2a2d3a] rounded-xl">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Đang tải lịch sử nạp...</p>
        </div>
      );
    }

    if (depositHistories.length === 0) {
      return (
        <div className="text-center py-20 bg-[#1a1d29]/80 border border-[#2a2d3a] rounded-xl">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{t("no_deposit_found")}</p>
          <p className="text-gray-500 text-sm">{t("no_deposit_description")}</p>
        </div>
      );
    }

    return depositHistories.map((deposit) => (
      <DepositCard key={deposit.requestDepositId} deposit={deposit} />
    ));
  };

  const renderPurchaseList = () => {
    if (isPurchaseLoading) {
      return (
        <div className="text-center py-20 bg-[#1a1d29]/80 border border-[#2a2d3a] rounded-xl">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Đang tải lịch sử mua...</p>
        </div>
      );
    }

    if (purchaseHistories.length === 0) {
      return (
        <div className="text-center py-20 bg-[#1a1d29]/80 border border-[#2a2d3a] rounded-xl">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{t("no_purchase_found")}</p>
          <p className="text-gray-500 text-sm">
            {t("no_purchase_description")}
          </p>
        </div>
      );
    }

    return purchaseHistories.map((purchase) => (
      <PurchaseCard key={purchase.orderId} purchase={purchase} />
    ));
  };

  // ====== UI ======
  return (
    <>
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/background_hks_2.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <section className="relative z-10 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* HEADER */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <Receipt className="w-8 h-8 text-blue-400" />
              {t("page_title")}
            </h1>
            <p className="text-gray-400">{t("page_description")}</p>
          </header>

          {/* TABS */}
          <div className="flex items-center gap-2 mb-6 bg-[#1a1d29]/80 border border-[#2a2d3a] rounded-xl p-2">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "deposit"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2d3a]"
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>{t("deposit_tab")}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "deposit"
                    ? "bg-white/20"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {depositStats.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("purchase")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "purchase"
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2d3a]"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t("purchase_tab")}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "purchase"
                    ? "bg-white/20"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                {purchaseStats.total}
              </span>
            </button>
          </div>

          {/* CONTENT */}
          <div className="space-y-4">
            {activeTab === "deposit"
              ? renderDepositList()
              : renderPurchaseList()}
          </div>
        </div>
      </section>
    </>
  );
}
