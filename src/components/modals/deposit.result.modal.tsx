import React from "react";

interface DepositResultModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    requestDepositId: number;
    userId: number;
    description: string;
    imgUrl: string;
    status: string;
    createdAt: string;
  } | null;
}

export default function DepositResultModal({
  open,
  onClose,
  data,
}: DepositResultModalProps) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#181a20] rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Yêu cầu nạp tiền đã gửi!
        </h2>
        <div className="space-y-3">
          <div>
            <span className="text-gray-400 text-sm">Mã yêu cầu:</span>
            <span className="text-white font-semibold ml-2">
              #{data.requestDepositId}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Mô tả:</span>
            <span className="text-white ml-2">{data.description}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Trạng thái:</span>
            <span className="text-blue-400 font-semibold ml-2">
              {data.status}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Thời gian:</span>
            <span className="text-white ml-2">
              {new Date(data.createdAt).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Ảnh bill:</span>
            <a
              href={data.imgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-purple-400 underline"
            >
              Xem ảnh
            </a>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
