"use client";

import { formatDateTime } from "@/utils/admin.util";

interface UserRechargesTableProps {
  recharges: any[];
}

export function UserRechargesTable({ recharges }: UserRechargesTableProps) {
  const rechargeStatusColors = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const getStatusText = (status: string) => {
    if (status === "pending") return "Chờ xử lý";
    if (status === "approved") return "Đã duyệt";
    return "Từ chối";
  };

  if (recharges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Không tìm thấy lịch sử nạp tiền
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#3f9ced]/20">
              <th className="t-head-order-history">Mã Giao dịch</th>
              <th className="t-head-order-history">Mô tả</th>
              <th className="t-head-order-history">Trạng thái</th>
              <th className="t-head-order-history">Hình ảnh</th>
              <th className="t-head-order-history">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {recharges.map((recharge) => (
              <tr
                key={recharge.requestDepositId}
                className="border-b border-[#3f9ced]/10 hover:bg-[#3f9ced]/5 transition-colors"
              >
                <td className="py-4 text-sm font-medium text-white">
                  {recharge.requestDepositId}
                </td>
                <td className="py-4 text-sm text-gray-300 max-w-xs truncate">
                  {recharge.description || "N/A"}
                </td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded border ${
                      rechargeStatusColors[
                        (recharge.status ||
                          "pending") as keyof typeof rechargeStatusColors
                      ]
                    }`}
                  >
                    {getStatusText(recharge.status)}
                  </span>
                </td>
                <td className="py-4">
                  {recharge.imgUrl ? (
                    <a
                      href={recharge.imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3f9ced] hover:text-[#3f9ced]/80 text-sm underline"
                    >
                      Xem ảnh
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </td>
                <td className="py-4 text-sm text-gray-400">
                  {formatDateTime(recharge.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card Layout */}
      <div className="lg:hidden space-y-4">
        {recharges.map((recharge) => (
          <div
            key={recharge.requestDepositId}
            className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">Mã Giao dịch</p>
                <p className="text-sm font-medium text-white">
                  #{recharge.requestDepositId}
                </p>
              </div>
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-400 mb-1">Trạng thái</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${
                    rechargeStatusColors[
                      (recharge.status ||
                        "pending") as keyof typeof rechargeStatusColors
                    ]
                  }`}
                >
                  {getStatusText(recharge.status)}
                </span>
              </div>
            </div>

            <div className="border-t border-[#3f9ced]/10 pt-3">
              <p className="text-xs text-gray-400 mb-1">Mô tả</p>
              <p className="text-sm text-gray-300 line-clamp-2">
                {recharge.description || "N/A"}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#3f9ced]/10">
              <div>
                <p className="text-xs text-gray-400 mb-1">Ngày tạo</p>
                <p className="text-sm text-gray-300">
                  {formatDateTime(recharge.createdAt)}
                </p>
              </div>
              <div>
                {recharge.imgUrl ? (
                  <a
                    href={recharge.imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#3f9ced] hover:text-[#3f9ced]/80 text-sm font-medium"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Xem ảnh
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">N/A</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
