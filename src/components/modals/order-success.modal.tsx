"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

interface OrderSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: {
    orderId: string;
    accountId: number;
    gameName: string;
    price: number;
    email: string;
    createdAt: string;
  } | null;
}

export default function OrderSuccessModal({
  open,
  onOpenChange,
  orderData,
}: OrderSuccessModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onOpenChange(false);
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  if (!orderData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12141a] border border-[#2a2d3a] text-white sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="w-14 h-14 text-green-400 mb-3" />
            <DialogTitle className="text-2xl font-bold">
              Thanh toán thành công
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm mt-2">
              Cảm ơn bạn đã mua tài khoản! Dưới đây là thông tin đơn hàng của
              bạn.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-6 bg-[#1a1d29] border border-[#2a2d3a] rounded-xl text-sm p-4 space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Mã đơn hàng:</span>
            <span className="text-blue-400 font-medium">
              #{orderData.orderId}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Tài khoản ID:</span>
            <span>#{orderData.accountId}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Tên game:</span>
            <span>{orderData.gameName}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Giá:</span>
            <span className="text-blue-400 font-semibold">
              ${orderData.price.toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Email nhận:</span>
            <span>{orderData.email}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Ngày mua:</span>
            <span>{new Date(orderData.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-center gap-3">
          <DialogClose asChild>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
              onClick={handleClose}
            >
              Đóng
            </Button>
          </DialogClose>
          <a
            href="/"
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-md px-6 py-2 text-sm transition-all"
          >
            Trang chủ
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
