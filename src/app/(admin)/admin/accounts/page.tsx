"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/layouts/layout.admin";
import { PageHeader } from "@/components/admin/page-header";
import { SearchBox } from "@/components/admin/search-box";
import { AccountFilters } from "@/components/filters/admin.account.filters";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  listGameCategories,
  listGameAccounts,
  deleteGameAccount,
} from "@/apis/admin.api";
import { GameAccount, GameAccountCategory } from "@/types/game-account.type";
import { AccountFormDialog } from "@/components/modals/admin-account";
import {
  sortAccountsByStatus,
  filterAccounts,
  getUniqueGameIds,
} from "@/utils/admin.util";
import { formatCurrency } from "@/utils/payment.util";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [games, setGames] = useState<GameAccountCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [gameId, setGameId] = useState("all");
  const [accountType, setAccountType] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState<GameAccount | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, accountsRes] = await Promise.all([
          listGameCategories(),
          listGameAccounts({ limit: 1000 }),
        ]);

        setGames(categoriesRes.data || []);
        // Access data correctly from normalized response
        const accountsData = accountsRes.data?.data || [];
        setAccounts(accountsData);
      } catch (error) {
        console.error("Failed to fetch accounts data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Account types (hardcoded - matching database values)
  const accountTypes = [
    { id: "VIP", name: "VIP" },
    { id: "Normal", name: "Normal" },
  ];

  // Apply all filters
  const filteredAccounts = filterAccounts(
    accounts,
    searchQuery,
    gameId,
    accountType,
    priceRange
  );

  const sortedFilteredAccounts = sortAccountsByStatus(filteredAccounts);

  // Get unique games for filter dropdown
  const uniqueGames = getUniqueGameIds(accounts);

  const stats = {
    total: accounts.length,
    available: accounts.filter((acc) => acc.status === "available").length,
    sold: accounts.filter((acc) => acc.status === "sold").length,
  };

  const handleAdd = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const handleEdit = (account: GameAccount) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa tài khoản này?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await deleteGameAccount(id);
      setAccounts(accounts.filter((acc) => acc.gameAccountId !== id));
      alert(response.message || "Xóa tài khoản thành công");
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      const errorMessage =
        error?.response?.message || error?.message || "Lỗi không xác định";
      alert(`Xóa tài khoản thất bại: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = (account: GameAccount) => {
    if (selectedAccount) {
      // UPDATE - Replace the account in the list
      setAccounts(
        accounts.map((acc) =>
          acc.gameAccountId === account.gameAccountId ? account : acc
        )
      );
    } else {
      // CREATE - Add new account to the list
      setAccounts([...accounts, account]);
    }
    setIsFormOpen(false);
  };

  const handleResetFilters = () => {
    setPriceRange("all");
    setGameId("all");
    setAccountType("all");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Quản lý tài khoản"
          description="Quản lý kho tài khoản game của bạn"
          action={
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#3f9ced] hover:bg-[#3f9ced]/90 text-black font-semibold rounded text-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Thêm tài khoản
            </button>
          }
        />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
            <p className="text-sm text-gray-400 mb-2">Tổng tài khoản</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
            <p className="text-sm text-gray-400 mb-2">Còn hàng</p>
            <p className="text-3xl font-bold text-green-400">
              {stats.available}
            </p>
          </div>
          <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
            <p className="text-sm text-gray-400 mb-2">Đã bán</p>
            <p className="text-3xl font-bold text-gray-500">{stats.sold}</p>
          </div>
        </div>

        {/* Filters */}
        <AccountFilters
          priceRange={priceRange}
          gameId={gameId}
          accountType={accountType}
          uniqueGames={uniqueGames}
          games={games}
          accountTypes={accountTypes}
          onPriceRangeChange={setPriceRange}
          onGameChange={setGameId}
          onAccountTypeChange={setAccountType}
          onReset={handleResetFilters}
        />

        {/* Table */}
        <div className="bg-black border border-[#3f9ced]/20 rounded overflow-hidden">
          <div className="p-6 border-b border-[#3f9ced]/20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Tất cả tài khoản</h2>
              <p className="text-sm text-gray-400 mt-1">
                {sortedFilteredAccounts.length} tài khoản
              </p>
            </div>
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm kiếm..."
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3f9ced]/20">
                  <th className="t-head">Game</th>
                  <th className="t-head">Tiêu đề</th>
                  <th className="t-head">Loại</th>
                  <th className="t-head">Giá bán</th>
                  <th className="t-head">Trạng thái</th>
                  <th className="text-right text-xs font-medium text-gray-400 px-6 py-4">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredAccounts.length > 0 ? (
                  sortedFilteredAccounts.map((account) => (
                    <tr
                      key={account.gameAccountId}
                      className="border-b border-[#3f9ced]/10 hover:bg-[#3f9ced]/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white capitalize">
                        {account.gameCategory?.gameCategoryName ||
                          `Game ${account.gameCategoryId}`}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-white truncate">
                          {account.title || account.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#3f9ced]/20 text-[#3f9ced] capitalize border border-[#3f9ced]/30">
                          {account.typeAccount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-semibold">
                          {formatCurrency(Number(account.currentPrice))}
                        </div>
                        {Number(account.originalPrice) !==
                          Number(account.currentPrice) && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatCurrency(Number(account.originalPrice))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${
                            account.status === "available"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : account.status === "reserved"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}
                        >
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(account)}
                            disabled={deletingId === account.gameAccountId}
                            className="p-2 text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/10 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(account.gameAccountId)}
                            disabled={deletingId === account.gameAccountId}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === account.gameAccountId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      Không tìm thấy tài khoản nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AccountFormDialog
          account={selectedAccount}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSave={handleSave}
          games={games}
          accountTypes={accountTypes}
        />
      </div>
    </AdminLayout>
  );
}
