// components/admin/dialogs/AddMoneyModal.tsx
import { useState } from "react";
import { formatCurrency } from "@/utils/payment.util";
import { addMoneyToUser } from "@/apis/admin.api";

interface AddMoneyModalProps {
  open: boolean;
  userId: number;
  currentBalance: number;
  onClose: () => void;
  onAdded: (newBalance: number) => void;
}

export function AddMoneyModal({
  open,
  userId,
  currentBalance,
  onClose,
  onAdded,
}: AddMoneyModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleAdd = async () => {
    const value = Number(amount);
    if (value <= 0) return;
    setLoading(true);
    try {
      const res = await addMoneyToUser({ userId, amount: value });
      const newBalance = res.data?.money ?? currentBalance + value;
      onAdded(newBalance);
      onClose();
    } catch (e) {
      alert("Lỗi khi cộng tiền");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#1a1d29] border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold text-white mb-2">Cộng số dư</h3>
        <p className="text-sm text-gray-400 mb-3">
          Số dư hiện tại:{" "}
          <span className="font-semibold text-green-400">
            {formatCurrency(currentBalance)}
          </span>
        </p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white"
          placeholder="Nhập số tiền"
        />
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Hủy
          </button>
          <button
            onClick={handleAdd}
            disabled={!amount || Number(amount) <= 0 || loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Đang xử lý..." : "Cộng"}
          </button>
        </div>
      </div>
    </div>
  );
}
