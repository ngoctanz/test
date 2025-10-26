"use client";

import React, { useState } from "react";
import { X, Download, Copy } from "lucide-react";
import type { DepositRequest } from "@/types/deposit-request.type";
import { formatDateTime } from "@/utils/admin.util";
import { updateDepositRequestStatus } from "@/apis/admin.api";

interface TransactionDetailModalProps {
  transaction: DepositRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (
    transactionId: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  open,
  onOpenChange,
  onStatusChange,
}) => {
  // Lấy status trực tiếp từ transaction, không dùng state riêng nữa
  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  const handleCopyEmail = () => {
    const email = transaction.user?.email || "";
    navigator.clipboard.writeText(email);
    alert("Đã copy email");
  };

  const handleDownloadBill = () => {
    const imgUrl = transaction.imgUrl;
    if (imgUrl) {
      const link = document.createElement("a");
      link.href = imgUrl;
      link.download = `bill-${transaction.requestDepositId}`;
      link.click();
    }
  };

  const handleStatusUpdate = async (newStatus: "approved" | "rejected") => {
    setIsSaving(true);
    try {
      const id = Number(transaction.requestDepositId);
      if (!id) throw new Error("Invalid request id");

      const resp = await updateDepositRequestStatus(id, { status: newStatus });
      if (resp && resp.data) {
        // Gọi callback để parent component refresh lại data
        onStatusChange?.(String(transaction.requestDepositId), newStatus);
        alert(
          `Đã ${
            newStatus === "approved" ? "duyệt" : "từ chối"
          } yêu cầu thành công`
        );
        onOpenChange(false);
      }
    } catch (err) {
      console.error("Failed to update deposit status:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi cập nhật trạng thái");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: {
        label: "Chờ duyệt",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      },
      approved: {
        label: "Đã duyệt",
        color: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      rejected: {
        label: "Đã từ chối",
        color: "bg-red-500/20 text-red-400 border-red-500/30",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  // Lấy status trực tiếp từ transaction prop
  const statusDisplay = getStatusDisplay(transaction.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-12"
        onClick={() => onOpenChange(false)}
      >
        {/* Modal */}
        <div
          className="bg-black border border-[#3f9ced]/20 shadow-2xl overflow-hidden w-full max-w-2xl max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#3f9ced]/20 flex items-center justify-between bg-gradient-to-r from-black/40 to-transparent">
            <div>
              <h2 className="text-lg font-bold text-white">
                Chi tiết giao dịch nạp tiền
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {formatDateTime(transaction.createdAt)}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/10 rounded transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(85vh-200px)] overflow-y-auto space-y-6">
            {/* Email người nạp */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Email người nạp
              </p>
              <div className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded p-3 flex items-center justify-between">
                <p className="text-sm font-medium text-white">
                  {transaction.user?.email || "N/A"}
                </p>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/10 rounded transition-all"
                  title="Copy email"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Mô tả
              </p>
              <div className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded p-3">
                <p className="text-sm text-gray-200">
                  {transaction.description || "Không có mô tả"}
                </p>
              </div>
            </div>

            {/* Ảnh chuyển khoản */}
            {transaction.imgUrl && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Ảnh minh chứng nạp tiền
                </p>
                <div className="relative bg-black rounded overflow-hidden border border-[#3f9ced]/20 aspect-video">
                  <img
                    src={transaction.imgUrl}
                    alt="Bill"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleDownloadBill}
                    className="absolute top-2 right-2 p-2 bg-black/60 text-gray-300 hover:text-white hover:bg-black/80 rounded transition-all"
                    title="Tải xuống"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Ngày tạo */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Ngày tạo
              </p>
              <div className="bg-[#1a1a1a] border border-[#3f9ced]/20 rounded p-3">
                <p className="text-sm font-medium text-white">
                  {formatDateTime(transaction.createdAt)}
                </p>
              </div>
            </div>

            {/* Trạng thái */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Trạng thái
              </p>
              <div className="space-y-3">
                {/* Current status display */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded border ${statusDisplay.color}`}
                >
                  <span className="font-medium">{statusDisplay.label}</span>
                </div>

                {/* Action buttons - only show if pending */}
                {transaction.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={isSaving}
                      onClick={() => handleStatusUpdate("approved")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Duyệt yêu cầu"
                    >
                      {isSaving ? "Đang xử lý..." : "Duyệt"}
                    </button>
                    <button
                      disabled={isSaving}
                      onClick={() => handleStatusUpdate("rejected")}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Từ chối yêu cầu"
                    >
                      {isSaving ? "Đang xử lý..." : "Từ chối"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#3f9ced]/20 bg-black/40 flex gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 bg-[#3f9ced]/10 hover:bg-[#3f9ced]/20 text-[#3f9ced] font-medium rounded transition-all border border-[#3f9ced]/20"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
