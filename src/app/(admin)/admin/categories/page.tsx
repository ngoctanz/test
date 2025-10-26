"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/layouts/layout.admin";
import { PageHeader } from "@/components/admin/page-header";
import { GameManagement } from "@/components/admin/game-management";
import { listGameCategories, deleteGameCategory } from "@/apis/admin.api";
import { GameCategory } from "@/types/game-category.type";

export default function CategoriesPage() {
  const [games, setGames] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await listGameCategories();
      const gamesList: GameCategory[] = (response.data || []).map(
        (cat: any) => ({
          gameCategoryId: cat.gameCategoryId,
          gameCategoryName: cat.gameCategoryName,
          imageGameCategory: cat.imageGameCategory,
          availableAccounts: cat.availableAccounts,
          soldAccounts: cat.soldAccounts,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        })
      );
      setGames(gamesList);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleAddGame = (game: GameCategory) => {
    fetchGames();
  };

  const handleEditGame = (game: GameCategory) => {
    fetchGames();
  };

  const handleDeleteGame = async (id: number) => {
    try {
      const response = await deleteGameCategory(id);
      setGames(games.filter((g) => g.gameCategoryId !== id));
      alert(response.message || "Xóa game thành công");
    } catch (error: any) {
      console.error("Failed to delete game:", error);
      const errorMessage =
        error?.response?.message || error?.message || "Lỗi không xác định";
      alert(`Xóa game thất bại: ${errorMessage}`);
      throw error;
    }
  };

  const handleToggleGameActive = (id: number) => {
    // This function is not currently used but can be implemented if needed
    console.log("Toggle active for game:", id);
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
          title="Quản lý danh mục"
          description="Quản lý danh mục game"
        />

        {/* Games Management */}
        <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
          <GameManagement
            games={games}
            onAddGame={handleAddGame}
            onEditGame={handleEditGame}
            onDeleteGame={handleDeleteGame}
            onToggleActive={handleToggleGameActive}
          />
        </div>

        {/* Games Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
            <p className="text-sm text-gray-400 mb-2">Tổng game</p>
            <p className="text-3xl font-bold text-white">{games.length}</p>
          </div>
          <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
            <p className="text-sm text-gray-400 mb-2">Tổng tài khoản</p>
            <p className="text-3xl font-bold text-green-400">
              {games.reduce((acc, g) => acc + (g.availableAccounts || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
