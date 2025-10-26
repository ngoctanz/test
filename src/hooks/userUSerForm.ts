// hooks/useUserForm.ts
import { useState } from "react";
import { updateUser } from "@/apis/admin.api";
import { User, UserRole } from "@/types/user.type";

export function useUserForm(initialUser?: User, onSave?: (user: User) => void) {
  const [formData, setFormData] = useState<Partial<User>>({
    email: initialUser?.email || "",
    role: (initialUser?.role as UserRole) || "USER",
    balance: initialUser?.balance || 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (user?: User) => {
    if (!user) return;
    if (!formData.email?.trim()) throw new Error("Vui lòng nhập email");

    setIsLoading(true);
    try {
      const res = await updateUser(Number(user.id), {
        email: formData.email.trim(),
        role: formData.role as UserRole,
        money: formData.balance ?? 0,
      });
      if (res.status === 200 && res.data) {
        const updatedUser: User = {
          ...user,
          email: res.data.email,
          role: res.data.role as UserRole,
          balance: res.data.money ?? 0,
        };
        onSave?.(updatedUser);

        // Hiển thị thông báo từ response
        if (res.message) {
          alert(res.message);
        }

        return updatedUser;
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.message || error?.message || "Lỗi không xác định";
      throw new Error(`Cập nhật thất bại: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleSubmit,
  };
}
