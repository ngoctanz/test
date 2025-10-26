"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/layouts/layout.admin";
import { PageHeader } from "@/components/admin/page-header";
import { SearchBox } from "@/components/admin/search-box";
import { Eye, Trash2, CheckCircle2, Circle } from "lucide-react";
import { listAllDepositRequests, deleteDepositRequest } from "@/apis/admin.api";
import type { DepositRequest } from "@/types/deposit-request.type";
import { TransactionDetailModal } from "@/components/modals/transaction-detail.modal";
import { formatDateTime } from "@/utils/admin.util";
import { formatCurrency } from "@/utils/payment.util";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<DepositRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<DepositRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await listAllDepositRequests({ limit: 1000 });

      // Handle both data.requests and data format using any cast
      const responseAny = response as any;
      const transactionsData =
        responseAny.data?.requests || responseAny.data?.data || [];

      if (transactionsData.length === 0) {
        console.warn("⚠️ No transactions data found!");
      }

      setTransactions(transactionsData);
    } catch (error: any) {
      alert(`Lỗi khi tải danh sách giao dịch: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions by search query
  const filteredTransactions = transactions.filter(
    (t) =>
      t.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    total: transactions.length,
    pending: transactions.filter((t) => t.status === "pending").length,
    approved: transactions.filter((t) => t.status === "approved").length,
    rejected: transactions.filter((t) => t.status === "rejected").length,
    totalAmount: 0, // Can calculate if needed
  };

  const handleViewDetail = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn chắc chắn muốn xóa giao dịch này?")) {
      try {
        await deleteDepositRequest(id);
        setTransactions(transactions.filter((t) => t.requestDepositId !== id));
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        alert("Lỗi khi xóa giao dịch");
      }
    }
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
          title="Quản lý giao dịch"
          description="Quản lý các giao dịch nạp tiền từ người dùng"
        />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
            <p className="text-sm text-gray-400 mb-2">Tổng giao dịch</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
            <p className="text-sm text-gray-400 mb-2">Chưa xử lý</p>
            <p className="text-3xl font-bold text-orange-400">
              {stats.pending}
            </p>
          </div>
          <div className="bg-black border border-[#3f9ced]/20 rounded p-6">
            <p className="text-sm text-gray-400 mb-2">Đã phê duyệt</p>
            <p className="text-3xl font-bold text-green-400">
              {stats.approved}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-black border border-[#3f9ced]/20 rounded overflow-hidden">
          <div className="p-6 border-b border-[#3f9ced]/20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Danh sách giao dịch
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {filteredTransactions.length} giao dịch
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
                <tr className="border-b border-[#3f9ced]/20">
                  <th className="t-head">Email</th>
                  <th className="t-head">Mô tả</th>
                  <th className="t-head">Ngày giờ</th>
                  <th className="t-head">Trạng thái</th>
                  <th className="text-right text-xs font-medium text-gray-400 px-6 py-4">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.requestDepositId}
                      className="border-b border-[#3f9ced]/10 hover:bg-[#3f9ced]/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white">
                        {transaction.user?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-300">
                          {transaction.description || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-300">
                          {formatDateTime(transaction.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${
                            transaction.status === "approved"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : transaction.status === "pending"
                              ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {transaction.status === "approved" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Circle className="h-3 w-3" />
                          )}
                          {transaction.status === "approved"
                            ? "Approved"
                            : transaction.status === "pending"
                            ? "Pending"
                            : "Rejected"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewDetail(transaction)}
                            className="p-2 text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/10 rounded transition-all"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(transaction.requestDepositId)
                            }
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8">
                      <p className="text-sm text-gray-400 text-center">
                        Không tìm thấy giao dịch nào
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            onStatusChange={() => {
              // Refresh data sau khi update status
              fetchTransactions();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
