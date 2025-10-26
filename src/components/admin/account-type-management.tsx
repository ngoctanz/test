"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountTypeItem } from "@/types/account-type.admin";

interface AccountTypeManagementProps {
  accountTypes: AccountTypeItem[];
  onAddType: (type: AccountTypeItem) => void;
  onEditType: (type: AccountTypeItem) => void;
  onDeleteType: (id: string) => void;
  onToggleActive: (id: string) => void;
}

interface AccountTypeFormData {
  id: string;
  name: string;
  description: string;
  color: string;
}

export function AccountTypeManagement({
  accountTypes,
  onAddType,
  onEditType,
  onDeleteType,
  onToggleActive,
}: AccountTypeManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<AccountTypeItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AccountTypeFormData>({
    id: "",
    name: "",
    description: "",
    color: "#60a5fa",
  });

  const handleAdd = () => {
    setEditingType(null);
    setFormData({
      id: "",
      name: "",
      description: "",
      color: "#60a5fa",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (type: AccountTypeItem) => {
    setEditingType(type);
    setFormData({
      id: type.id,
      name: type.name,
      description: type.description || "",
      color: type.color || "#60a5fa",
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.id.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsLoading(true);

    try {
      if (editingType) {
        onEditType({
          ...editingType,
          name: formData.name,
          description: formData.description,
          color: formData.color,
          updatedAt: new Date().toISOString(),
        });
      } else {
        onAddType({
          id: formData.id,
          name: formData.name,
          description: formData.description,
          color: formData.color,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setIsFormOpen(false);
      setFormData({ id: "", name: "", description: "", color: "#60a5fa" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn chắc chắn muốn xóa loại tài khoản này?")) {
      onDeleteType(id);
    }
  };

  // Predefined colors
  const colorOptions = [
    { value: "#fbbf24", label: "Vàng (Gold)" },
    { value: "#34d399", label: "Xanh lá (Emerald)" },
    { value: "#60a5fa", label: "Xanh dương (Blue)" },
    { value: "#f472b6", label: "Hồng (Pink)" },
    { value: "#a78bfa", label: "Tím (Purple)" },
    { value: "#fb7185", label: "Đỏ (Red)" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">
            Quản lý Loại Tài Khoản
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {accountTypes.length} loại tài khoản có sẵn
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#3f9ced] hover:bg-[#3f9ced]/90 text-black font-semibold rounded text-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Thêm loại
        </button>
      </div>

      <div className="grid gap-3">
        {accountTypes.map((type) => (
          <div
            key={type.id}
            className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded p-4 flex items-start justify-between hover:border-[#3f9ced]/40 transition-colors"
          >
            <div className="flex-1 flex items-start gap-3">
              <input
                type="checkbox"
                checked={type.isActive}
                onChange={() => onToggleActive(type.id)}
                className="w-4 h-4 rounded border-[#3f9ced]/20 bg-[#0a0a0a] cursor-pointer mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded border-2"
                    style={{
                      backgroundColor: type.color,
                      borderColor: type.color,
                    }}
                    title={`Color: ${type.color}`}
                  />
                  <div>
                    <h4 className="font-semibold text-white">{type.name}</h4>
                    <p className="text-xs text-gray-500">ID: {type.id}</p>
                  </div>
                </div>
                {type.description && (
                  <p className="text-sm text-gray-400 mt-2 ml-9">
                    {type.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-0.5 rounded border ${
                  type.isActive
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}
              >
                {type.isActive ? "Hoạt động" : "Vô hiệu"}
              </span>
              <button
                onClick={() => handleEdit(type)}
                className="p-2 text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/10 rounded transition-all"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(type.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
              >
                <Trash2 className="h-4 w-4" />
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
              {editingType
                ? "Chỉnh sửa loại tài khoản"
                : "Thêm loại tài khoản mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="typeId" className="text-white">
                ID Loại (tên duy nhất)
              </Label>
              <Input
                id="typeId"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                placeholder="vd: vip"
                disabled={!!editingType}
                className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white focus:border-[#3f9ced]/50 focus:ring-[#3f9ced]/20"
                required
              />
              <p className="text-xs text-gray-500">
                Không thể thay đổi sau khi tạo
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeName" className="text-white">
                Tên hiển thị
              </Label>
              <Input
                id="typeName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="vd: VIP"
                className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white focus:border-[#3f9ced]/50 focus:ring-[#3f9ced]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeDescription" className="text-white">
                Mô tả
              </Label>
              <Textarea
                id="typeDescription"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết về loại tài khoản"
                rows={3}
                className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white focus:border-[#3f9ced]/50 focus:ring-[#3f9ced]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeColor" className="text-white">
                Màu sắc
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="typeColor"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-12 h-10 rounded border border-[#3f9ced]/20 cursor-pointer"
                />
                <span className="text-sm text-gray-400">{formData.color}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFormData({ ...formData, color: option.value })
                    }
                    className={`p-2 rounded border-2 flex items-center gap-2 text-xs transition-all ${
                      formData.color === option.value
                        ? "border-white"
                        : "border-[#3f9ced]/20"
                    }`}
                    title={option.label}
                  >
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: option.value }}
                    />
                  </button>
                ))}
              </div>
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
                    {editingType ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : editingType ? (
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
