"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import FilterDropdown from "@/components/dropdown/filter-dropdown";
import { FilterOption } from "@/utils/accounts.util";
import { useTranslations } from "next-intl";

interface HistoryFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  statusOptions: FilterOption[];
  showDateFilter?: boolean;
  dateFilter?: string;
  onDateChange?: (value: string) => void;
  resultCount: number;
}

function HistoryFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  showDateFilter = false,
  dateFilter = "all",
  onDateChange,
  resultCount,
}: HistoryFilterProps) {
  const t = useTranslations("histories");
  const [isExpanded, setIsExpanded] = useState(false);

  const dateOptions: FilterOption[] = [
    { label: t("date_filter.all"), value: "all" },
    { label: t("date_filter.today"), value: "today" },
    { label: t("date_filter.this_week"), value: "this_week" },
    { label: t("date_filter.this_month"), value: "this_month" },
    { label: t("date_filter.last_3_months"), value: "last_3_months" },
  ];

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    (showDateFilter && dateFilter !== "all");

  const handleResetFilters = () => {
    onSearchChange("");
    onStatusChange("all");
    if (showDateFilter && onDateChange) {
      onDateChange("all");
    }
  };

  return (
    <div className="bg-[#1a1d29] border border-[#2a2d3a] rounded-xl p-5 mb-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between bg-[#0f1115] text-white border border-[#2a2d3a] hover:border-[#3a3d4a] rounded-lg px-4 py-3 transition-all"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            {t("filters")}
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                •
              </span>
            )}
          </span>
          <X
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-0" : "rotate-45"
            }`}
          />
        </button>
      </div>

      {/* Filters Content */}
      <div
        className={`${
          isExpanded ? "block" : "hidden"
        } lg:block space-y-4 lg:space-y-0`}
      >
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="col-span-5">
            <label className="text-gray-400 text-xs mb-2 block font-medium">
              {t("search_label")}
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full bg-[#0f1115] text-white text-sm border border-[#2a2d3a] hover:border-[#3a3d4a] focus:border-blue-500 rounded-lg pl-11 pr-4 py-2.5 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-span-3">
            <label className="text-gray-400 text-xs mb-2 block font-medium">
              {t("status_label")}
            </label>
            <FilterDropdown
              label={t("status_placeholder")}
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusChange}
            />
          </div>

          {/* Date Filter */}
          {showDateFilter && onDateChange && (
            <div className="col-span-3">
              <label className="text-gray-400 text-xs mb-2 block font-medium">
                {t("date_label")}
              </label>
              <FilterDropdown
                label={t("date_placeholder")}
                options={dateOptions}
                value={dateFilter}
                onChange={onDateChange}
              />
            </div>
          )}

          {/* Result Count & Reset */}
          <div
            className={`${
              showDateFilter ? "col-span-1" : "col-span-4"
            } flex items-end justify-end`}
          >
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="h-[42px] px-4 bg-[#2a2d3a] hover:bg-[#3a3d4a] text-gray-300 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                {t("clear_filters")}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-3">
          {/* Search Input */}
          <div>
            <label className="text-gray-400 text-xs mb-2 block font-medium">
              {t("search_label")}
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full bg-[#0f1115] text-white text-sm border border-[#2a2d3a] hover:border-[#3a3d4a] focus:border-blue-500 rounded-lg pl-11 pr-4 py-2.5 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-gray-400 text-xs mb-2 block font-medium">
              {t("status_label")}
            </label>
            <FilterDropdown
              label={t("status_placeholder")}
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusChange}
            />
          </div>

          {/* Date Filter */}
          {showDateFilter && onDateChange && (
            <div>
              <label className="text-gray-400 text-xs mb-2 block font-medium">
                {t("date_label")}
              </label>
              <FilterDropdown
                label={t("date_placeholder")}
                options={dateOptions}
                value={dateFilter}
                onChange={onDateChange}
              />
            </div>
          )}
        </div>

        {/* Result Info & Clear Button (Bottom Bar) */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2d3a]">
          <div className="text-gray-400 text-sm">
            {t("showing")}{" "}
            <span className="text-blue-400 font-semibold">{resultCount}</span>{" "}
            {t("results")}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="lg:hidden bg-[#2a2d3a] hover:bg-[#3a3d4a] text-gray-300 font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <X className="w-4 h-4" />
              {t("clear_filters")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryFilter;
