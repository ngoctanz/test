"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/layouts/layout.admin";
import { ArrowLeft, Mail, Wallet, ShoppingBag, CreditCard } from "lucide-react";
import {
  getUserById,
  getOrdersByUserId,
  getUserDepositRequests,
} from "@/apis/admin.api";
import { formatDateTime } from "@/utils/admin.util";
import { formatCurrency } from "@/utils/payment.util";
import { UserOrdersTable } from "@/app/(admin)/admin/users/[id]/user.order.table";
import { UserRechargesTable } from "@/app/(admin)/admin/users/[id]/user.recharge.table";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<"orders" | "recharges">("orders");
  const [user, setUser] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [userRecharges, setUserRecharges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = parseInt(id);
        const [userRes, ordersRes, rechargesRes] = await Promise.all([
          getUserById(userId),
          getOrdersByUserId(userId),
          getUserDepositRequests(userId),
        ]);

        setUser(userRes.data);
        const ordersResAny = ordersRes as any;
        const ordersData =
          ordersResAny?.data?.orders ??
          (Array.isArray(ordersResAny?.data)
            ? ordersResAny.data
            : ordersResAny?.data ?? []);

        setUserOrders(ordersData);
        const recharges = Array.isArray(rechargesRes.data)
          ? rechargesRes.data
          : [];
        setUserRecharges(recharges);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white">
            Không tìm thấy người dùng
          </h2>
          <button
            onClick={() => router.push("/admin/users")}
            className="mt-4 px-4 py-2 bg-[#3f9ced] hover:bg-[#3f9ced]/90 text-black font-semibold rounded"
          >
            Quay lại danh sách người dùng
          </button>
        </div>
      </AdminLayout>
    );
  }

  const rechargeStatusColors = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const statusColors = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    banned: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const roleColors = {
    ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    USER: "bg-[#3f9ced]/10 text-[#3f9ced] border-[#3f9ced]/20",
  };

  const orderStatusColors = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const totalSpent = userOrders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + (order.price || 0), 0);

  const completedOrders = userOrders.filter(
    (order) => order.status === "completed"
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/users")}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#3f9ced]/10 rounded transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Thông tin người dùng
            </h1>
            <p className="text-gray-400 mt-1">
              Xem và quản lý thông tin người dùng
            </p>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded p-6">
            <h2 className="text-lg font-bold text-white mb-2">
              Thông tin cá nhân
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Chi tiết người dùng cơ bản
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {user.email}
                </h3>
                <p className="text-gray-400 text-sm">ID: {user.userId}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#3f9ced]/20">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-[#3f9ced]" />
                  <span className="text-gray-300">{user.email}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded border ${
                    roleColors[(user.role as keyof typeof roleColors) || "USER"]
                  }`}
                >
                  {user.role || "USER"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded p-6">
            <h2 className="text-lg font-bold text-white mb-2">
              Thống kê tài khoản
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Tổng quan hoạt động người dùng
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-[#3f9ced]" />
                  <span className="text-sm text-gray-400">Số dư hiện tại</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(user.money || 0)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-4 w-4 text-[#3f9ced]" />
                  <span className="text-sm text-gray-400">Tổng đơn hàng</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userOrders.length}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-[#3f9ced]" />
                  <span className="text-sm text-gray-400">Lịch sử nạp</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userRecharges.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders and Recharges History with Tabs */}
        <div className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded overflow-hidden">
          <div className="p-6 border-b border-[#3f9ced]/20">
            <h2 className="text-lg font-bold text-white">Lịch sử giao dịch</h2>
            <p className="text-sm text-gray-400 mt-1">
              Tất cả các đơn hàng và giao dịch đã thực hiện bởi người dùng này
            </p>
          </div>

          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-[#3f9ced]/20">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "orders"
                    ? "text-white border-b-2 border-[#3f9ced]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Đơn hàng đã thực hiện ({userOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("recharges")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "recharges"
                    ? "text-white border-b-2 border-[#3f9ced]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Lịch sử nạp ({userRecharges.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "orders" && <UserOrdersTable orders={userOrders} />}
            {activeTab === "recharges" && (
              <UserRechargesTable recharges={userRecharges} />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
