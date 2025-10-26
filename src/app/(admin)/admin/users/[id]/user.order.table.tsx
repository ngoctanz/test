"use client";

import { formatDateTime } from "@/utils/admin.util";

interface UserOrdersTableProps {
  orders: any[];
}

export function UserOrdersTable({ orders }: UserOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Không tìm thấy đơn hàng
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#3f9ced]/20">
              <th className="t-head-order-history">Mã Đơn hàng</th>
              <th className="t-head-order-history">Account ID</th>
              <th className="t-head-order-history">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.orderId}
                className="border-b border-[#3f9ced]/10 hover:bg-[#3f9ced]/5 transition-colors"
              >
                <td className="py-4 text-sm font-medium text-white">
                  {order.orderId}
                </td>
                <td className="py-4 text-sm text-gray-300 max-w-xs truncate">
                  {order.gameAccountId}
                </td>
                <td className="py-4 text-sm text-gray-400">
                  {formatDateTime(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 mb-1">Mã Đơn hàng</p>
                <p className="text-sm font-medium text-white">
                  #{order.orderId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Account ID</p>
                <p className="text-sm text-gray-300">{order.gameAccountId}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#3f9ced]/10">
              <p className="text-xs text-gray-400 mb-1">Ngày tạo</p>
              <p className="text-sm text-gray-300">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
