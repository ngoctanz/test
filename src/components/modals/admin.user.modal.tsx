"use client";
import { X, Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { User, UserRole } from "@/types/user.type";
import { useUserForm } from "@/hooks/userUSerForm";
import { AddMoneyModal } from "@/components/modals/add-money.modal";

interface UserFormDialogProps {
  user?: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
}

export function UserFormDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: UserFormDialogProps) {
  const { formData, setFormData, handleSubmit, isLoading } = useUserForm(
    user || undefined,
    onSave
  );
  const [showAddMoney, setShowAddMoney] = useState(false);

  useEffect(() => {
    if (user && open) {
      setFormData({
        email: user.email,
        role: user.role,
        balance: user.balance,
      });
    }
  }, [user, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-[#1a1d29] border border-white/10 rounded-xl w-full max-w-md">
        <div className="p-6 border-b border-white/10 flex justify-between">
          <h2 className="text-xl text-white font-bold">
            Sửa thông tin người dùng
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await handleSubmit(user!);
              onOpenChange(false);
            } catch (error) {
              alert((error as Error).message);
            }
          }}
          className="p-6 space-y-4"
        >
          {/* Email */}
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full bg-white/5 text-white px-4 py-2 rounded-lg border border-white/10"
          />

          {/* Vai trò */}
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as UserRole })
            }
            className="w-full bg-black text-white px-4 py-2 rounded-lg border border-white/10"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Số dư */}
          <div className="flex items-center justify-between">
            <label className="text-gray-400">Số dư ($)</label>
            <button
              type="button"
              onClick={() => setShowAddMoney(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <input
            type="number"
            value={formData.balance}
            readOnly
            className="w-full bg-white/5 text-white px-4 py-2 rounded-lg border border-white/10"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-gray-400 hover:text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal cộng tiền */}
      {user && (
        <AddMoneyModal
          open={showAddMoney}
          userId={parseInt(user.id)}
          currentBalance={formData.balance || 0}
          onClose={() => setShowAddMoney(false)}
          onAdded={(newBalance) =>
            setFormData({ ...formData, balance: newBalance })
          }
        />
      )}
    </div>
  );
}
