"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/layouts/layout.admin";
import { PageHeader } from "@/components/admin/page-header";
import { SearchBox } from "@/components/admin/search-box";
import { Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { listAllUsers, deleteUser } from "@/apis/admin.api";
import { User } from "@/types/user.type";
import { UserFormDialog } from "@/components/modals/admin.user.modal";
import {
  sortUsersByBalance,
  searchUsers,
  fetchAllUsers,
} from "@/utils/admin.util";
import { formatCurrency } from "@/utils/payment.util";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await fetchAllUsers(1000);
        setUsers(allUsers);
      } catch (error: any) {
        alert(`Lỗi khi tải danh sách người dùng: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = searchUsers(users, searchQuery);

  const sortedFilteredUsers = sortUsersByBalance(filteredUsers);

  const handleEdit = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await deleteUser(parseInt(id));
      setUsers(users.filter((user) => user.id !== id));
      alert(response.message || "Xóa người dùng thành công");
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      const errorMessage =
        error?.response?.message || error?.message || "Lỗi không xác định";
      alert(`Xóa người dùng thất bại: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = (user: User) => {
    if (selectedUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, user]);
    }
  };

  const handleViewDetail = (userId: string) => {
    router.push(`/admin/users/${userId}`);
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
          title="Quản lý người dùng"
          description="Quản lý người dùng đã đăng ký"
        />

        {/* Table */}
        <div className="bg-[#1a1d29] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Tất cả người dùng
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {sortedFilteredUsers.length} người dùng được tìm thấy
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
                <tr className="border-b border-white/10">
                  <th className="t-head">Người dùng</th>
                  <th className="t-head">Email</th>
                  <th className="t-head">Vai trò</th>
                  <th className="t-head">Số dư</th>
                  <th className="text-center text-xs font-medium text-gray-400 px-6 py-4">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleViewDetail(user.id)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-white font-medium">
                          {(user as any).userId || user.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {formatCurrency(user.balance)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(user.id)}
                          disabled={deletingId === user.id}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleEdit(user, e)}
                          disabled={deletingId === user.id}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(user.id, e)}
                          disabled={deletingId === user.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <UserFormDialog
          user={selectedUser}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
}
