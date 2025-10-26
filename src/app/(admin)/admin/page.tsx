"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/layouts/layout.admin";
import { StatsCard } from "@/components/admin/stats-card";
import { SearchBox } from "@/components/admin/search-box";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import {
  listAllOrders,
  listAllUsers,
  listGameAccounts,
} from "@/apis/admin.api";
import { searchOrders } from "@/utils/admin.util";
import { formatDateTime } from "@/utils/admin.util";
import { formatCurrency } from "@/utils/payment.util";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ordersRes, usersRes, accountsRes] = await Promise.all([
          listAllOrders({ limit: 100 }),
          listAllUsers({ limit: 100 }),
          listGameAccounts({ limit: 100 }),
        ]);

        // Access data with proper fallbacks using any cast to handle different API shapes
        const ordersResAny = ordersRes as any;
        const usersResAny = usersRes as any;
        const accountsResAny = accountsRes as any;

        const ordersData =
          ordersResAny.data?.data || ordersResAny.data?.orders || [];
        const usersData =
          usersResAny.data?.data || usersResAny.data?.users || [];
        const accountsData =
          accountsResAny.data?.data || accountsResAny.data?.gameAccounts || [];

        setOrders(ordersData);
        setUsers(usersData);
        setAccounts(accountsData);
      } catch (error: any) {
        console.error("❌ Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from recent orders
  const recentOrders = orders.slice(0, 10);
  const totalRecentRevenue = recentOrders.reduce(
    (sum, o) => sum + (Number(o.gameAccount?.currentPrice) || 0),
    0
  );

  const orderStats = {
    totalOrders: recentOrders.length,
    totalRevenue: totalRecentRevenue,
  };

  const filteredOrders: any = searchOrders(recentOrders as any, searchQuery);
  const totalUsers = users.length;
  const totalAccounts = accounts.length;
  const availableAccounts = accounts.filter(
    (acc) => acc.status === "available"
  ).length;

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bảng điều khiển
          </h1>
          <p className="text-gray-400">
            Chào mừng bạn trở lại! Đây là tổng quan cửa hàng của bạn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng doanh thu"
            value={formatCurrency(orderStats.totalRevenue)}
            icon={DollarSign}
            description={`từ ${orderStats.totalOrders} đơn hàng`}
          />
          <StatsCard
            title="Tổng số đơn hàng"
            value={orderStats.totalOrders}
            icon={ShoppingBag}
            description="đơn hàng gần đây"
          />
          <StatsCard
            title="Tổng số người dùng"
            value={totalUsers}
            icon={Users}
            description="người dùng đã đăng ký"
          />
          <StatsCard
            title="Tài khoản khả dụng"
            value={`${availableAccounts}/${totalAccounts}`}
            icon={Package}
            description="sẵn sàng để bán"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-[#1a1d29] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Đơn hàng gần đây</h2>
              <p className="text-sm text-gray-400 mt-1">
                {filteredOrders.length} đơn hàng được tìm thấy
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
                  <th className="t-head">Mã đơn hàng</th>
                  <th className="t-head">Khách hàng</th>
                  <th className="t-head">Mã tài khoản</th>
                  <th className="t-head">Số tiền</th>
                  <th className="t-head">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        ID: {order.userId}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      <span className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-lg border border-blue-500/20">
                        {order.gameAccountId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {formatCurrency(order.gameAccount?.currentPrice || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDateTime(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
