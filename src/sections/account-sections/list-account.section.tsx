"use client";

import { useState, useMemo } from "react";
import AccountCard from "@/components/cards/account.card";
import FilterDropdown from "@/components/dropdown/filter-dropdown";
import type { GameAccount } from "@/types/game-account.type";
import { getFilterOptions, applyFilters } from "@/utils/accounts.util";
import { useTranslations } from "next-intl";

interface ListAccountSectionProps {
  accounts: GameAccount[];
  slug: string;
  type: string;
}

export default function ListAccountSection({
  accounts,
  slug,
  type,
}: ListAccountSectionProps) {
  const t = useTranslations("game.filters");

  const { sortOptions, priceFilterOptions, statusFilterOptions } =
    getFilterOptions(t);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAccounts = useMemo(() => {
    const availableAccounts = accounts.filter(
      (acc) => acc.status === "available"
    );
    return applyFilters(
      availableAccounts,
      priceFilter,
      statusFilter,
      sortBy,
      searchQuery
    );
  }, [accounts, priceFilter, statusFilter, sortBy, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    sortBy !== "default" ||
    priceFilter !== "all" ||
    statusFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    setPriceFilter("all");
    setStatusFilter("all");
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-8 bg-[#1a1d29] border border-[#2a2d3a] rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-xs mb-2 font-medium">
              {t("search_label")}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full bg-[#0f1115] text-white text-sm border border-[#2a2d3a] hover:border-[#3a3d4a] focus:border-blue-500 rounded-lg px-4 h-[42px] focus:outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-xs mb-2 font-medium">
              {t("sort_label")}
            </label>
            <FilterDropdown
              label={t("sort_placeholder")}
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-xs mb-2 font-medium">
              {t("price_label")}
            </label>
            <FilterDropdown
              label={t("price_placeholder")}
              options={priceFilterOptions}
              value={priceFilter}
              onChange={setPriceFilter}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-gray-400 text-xs mb-2 font-medium">
              {t("status_label")}
            </label>
            <FilterDropdown
              label={t("status_placeholder")}
              options={statusFilterOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2d3a]">
          <div className="text-gray-400 text-sm">
            {t("showing")}{" "}
            <span className="text-blue-400 font-semibold">
              {filteredAccounts.length}
            </span>{" "}
            {t("accounts_in_stock")}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="bg-[#2a2d3a] hover:bg-[#3a3d4a] text-gray-300 font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm"
            >
              ✖ {t("clear_filters")}
            </button>
          )}
        </div>
      </div>

      {/* Accounts Grid */}
      {filteredAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAccounts.map((account) => (
            <AccountCard
              key={account.gameAccountId}
              id={account.gameAccountId.toString()}
              slug={slug}
              type={type}
              title={`#${account.gameAccountId}`}
              description={account.description}
              originalPrice={Number(account.originalPrice)}
              actualPrice={Number(account.currentPrice)}
              status={account.status}
              coverImage={account.mainImageUrl || "/images/placeholder.jpg"}
              images={account.images?.map((img) => img.imageUrl) || []}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1a1d29] border border-[#2a2d3a] rounded-xl">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-400 text-lg mb-2">{t("no_results_title")}</p>
          <p className="text-gray-500 text-sm mb-4">{t("no_results_desc")}</p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              {t("clear_all_filters")}
            </button>
          )}
        </div>
      )}
    </>
  );
}
