"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { createGameCategory, updateGameCategory } from "@/apis/admin.api";
import { GameCategory } from "@/types/game-category.type";

interface GameManagementProps {
  games: GameCategory[];
  onAddGame: (game: GameCategory) => void;
  onEditGame: (game: GameCategory) => void;
  onDeleteGame: (id: number) => void;
  onToggleActive: (id: number) => void;
}

interface GameFormData {
  id: number;
  name: string;
  image: string;
  imageFile?: File;
  newImageFile?: File;
}

export function GameManagement({
  games,
  onAddGame,
  onEditGame,
  onDeleteGame,
  onToggleActive,
}: GameManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<GameFormData>({
    id: 0,
    name: "",
    image: "",
  });

  const handleAdd = () => {
    setEditingGame(null);
    setFormData({ id: 0, name: "", image: "" });
    setIsFormOpen(true);
  };

  const handleEdit = (game: GameCategory) => {
    setEditingGame(game);
    setFormData({
      id: game.gameCategoryId,
      name: game.gameCategoryName,
      image: game.imageGameCategory || "",
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng điền tên game");
      return;
    }

    // Validate: phải có ảnh khi tạo mới
    if (!editingGame && !formData.imageFile) {
      alert("Vui lòng chọn ảnh cho game");
      return;
    }

    setIsLoading(true);
    try {
      if (editingGame) {
        // UPDATE existing category
        const formDataToSend = new FormData();
        formDataToSend.append("gameCategoryName", formData.name);

        // Chỉ thêm ảnh mới nếu có thay đổi
        if (formData.newImageFile) {
          formDataToSend.append("newImage", formData.newImageFile);
        }

        const response = await updateGameCategory(
          editingGame.gameCategoryId,
          formDataToSend
        );

        if (response.data) {
          const updatedGame: GameCategory = {
            gameCategoryId: response.data.gameCategoryId,
            gameCategoryName: response.data.gameCategoryName,
            imageGameCategory: response.data.imageGameCategory,
            availableAccounts: response.data.availableAccounts,
            soldAccounts: response.data.soldAccounts,
            createdAt: editingGame.createdAt,
            updatedAt: response.data.updatedAt || new Date().toISOString(),
          };

          onEditGame(updatedGame);
          alert(response.message || "Cập nhật game thành công!");
        }
      } else {
        // CREATE new category
        const formDataToSend = new FormData();
        formDataToSend.append("gameCategoryName", formData.name);

        if (formData.imageFile) {
          formDataToSend.append("image", formData.imageFile);
        }

        const response = await createGameCategory(formDataToSend);

        if (response.data) {
          const newGame: GameCategory = {
            gameCategoryId: response.data.gameCategoryId,
            gameCategoryName: response.data.gameCategoryName,
            imageGameCategory: response.data.imageGameCategory,
            availableAccounts: response.data.availableAccounts || 0,
            soldAccounts: response.data.soldAccounts || 0,
            createdAt: response.data.createdAt || new Date().toISOString(),
            updatedAt: response.data.createdAt || new Date().toISOString(),
          };

          onAddGame(newGame);
          alert(response.message || "Thêm game thành công!");
        }
      }

      setIsFormOpen(false);
      setFormData({ id: 0, name: "", image: "" });
    } catch (error: any) {
      console.error("Failed to save game:", error);
      const errorMessage =
        error?.response?.message || error?.message || "Lỗi không xác định";
      alert(
        `${editingGame ? "Cập nhật" : "Tạo"} game thất bại: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa game này?")) {
      return;
    }

    setDeletingId(id);
    try {
      await onDeleteGame(id);
    } catch (error) {
      console.error("Failed to delete game:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Quản lý Game</h3>
          <p className="text-sm text-gray-400 mt-1">
            {games.length} game có sẵn
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#3f9ced] hover:bg-[#3f9ced]/90 text-black font-semibold rounded text-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Thêm game
        </button>
      </div>

      <div className="grid gap-3">
        {games.map((game) => (
          <div
            key={game.gameCategoryId}
            className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded p-4 flex items-start justify-between hover:border-[#3f9ced]/40 transition-colors"
          >
            <div className="flex-1 flex items-start gap-4">
              {game.imageGameCategory && (
                <img
                  src={game.imageGameCategory}
                  alt={game.gameCategoryName}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-white">
                  {game.gameCategoryName}
                </h4>
                <p className="text-xs text-gray-500">
                  ID: {game.gameCategoryId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(game)}
                disabled={deletingId === game.gameCategoryId}
                className="p-2 text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/10 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(game.gameCategoryId)}
                disabled={deletingId === game.gameCategoryId}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === game.gameCategoryId ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md bg-black border border-[#3f9ced]/20">
          <DialogHeader className="border-b border-[#3f9ced]/20 pb-4">
            <DialogTitle className="text-white">
              {editingGame ? "Chỉnh sửa game" : "Thêm game mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameName" className="text-white">
                Tên game <span className="text-red-400">*</span>
              </Label>
              <Input
                id="gameName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="vd: Liên Quân Mobile"
                className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white focus:border-[#3f9ced]/50 focus:ring-[#3f9ced]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gameImage" className="text-white">
                Ảnh game{" "}
                {!editingGame && <span className="text-red-400">*</span>}
              </Label>

              {/* Image Preview */}
              {formData.image && (
                <div className="relative group">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 rounded object-cover border border-[#3f9ced]/20"
                  />
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded">
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-white mx-auto mb-2" />
                      <p className="text-sm text-white font-medium">
                        {editingGame ? "Thay đổi ảnh" : "Chọn ảnh khác"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (editingGame) {
                              setFormData({
                                ...formData,
                                image: event.target?.result as string,
                                newImageFile: file,
                              });
                            } else {
                              setFormData({
                                ...formData,
                                image: event.target?.result as string,
                                imageFile: file,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Upload button when no image */}
              {!formData.image && (
                <div className="border-2 border-dashed border-[#3f9ced]/30 rounded p-6 bg-[#1a1a1a] hover:bg-[#252525] transition-colors">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-[#3f9ced]" />
                      <p className="text-sm font-medium text-white">
                        Chọn ảnh game
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG (tối đa 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData({
                              ...formData,
                              image: event.target?.result as string,
                              imageFile: file,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#3f9ced]/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isLoading}
                className="border border-[#3f9ced]/20 text-gray-300 hover:text-white hover:bg-[#3f9ced]/10"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={handleSave}
                disabled={isLoading}
                className="bg-[#3f9ced] hover:bg-[#3f9ced]/90 text-black font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {editingGame ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : editingGame ? (
                  "Cập nhật"
                ) : (
                  "Thêm"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
