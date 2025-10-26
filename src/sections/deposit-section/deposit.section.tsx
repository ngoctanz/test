"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Wallet,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import BankQRCode from "@/components/payment/bank-qr-code";
import UploadReceipt from "@/components/payment/upload-receipt";
import DepositResultModal from "@/components/modals/deposit.result.modal";

import { createDepositRequest } from "@/apis/request-deposit.api";

import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/routes";

export interface Bank {
  id: string;
  name: string;
  icon?: string;
  accountNumber: string;
  qrImage?: string;
}

export const banksList: Bank[] = [
  {
    id: "trc20-usdt",
    name: "TRC20-USDT",
    icon: "/images/banks_icon/USDT-TRC20.png",
    accountNumber: "TAtRro3Fvr6TQkRjQDU4v1n7j2XyfaJCAw",
    qrImage: "/images/qr/trc20.jpg",
  },
  {
    id: "skrill",
    name: "Skrill",
    icon: "/images/banks_icon/skrill_payment.png",
    accountNumber: "huuvipky@gmail.com",
  },
];

function DepositSection() {
  const t = useTranslations("deposit");

  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [depositResult, setDepositResult] = useState<any>(null);

  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN as any);
    }
  }, [isAuthenticated, isLoading, router]);

  const selectedBankData = banksList.find((bank) => bank.id === selectedBank);

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async () => {
    if (!selectedBank || !depositAmount || !uploadedFile) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setIsProcessing(true);
    try {
      const description = `Nạp $${Number(depositAmount).toLocaleString(
        "en-US"
      )} qua ${selectedBankData?.name}`;
      const res = await createDepositRequest({
        description,
        billImage: uploadedFile,
      });
      if (res.data) {
        setDepositResult(res.data);
        setModalOpen(true);
      } else {
        alert(res.message || "Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (err: any) {
      alert(err?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [10, 20, 50, 100, 200, 500];

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="fixed inset-0 z-[-1]">
          <Image
            src="/images/background_hks_2.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="text-center">
          <Wallet className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">{t("loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <DepositResultModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={depositResult}
      />
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <Image
          src="/images/background_hks_2.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <span>{t("title")}</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Deposit Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Amount Input */}
            <div className="bg-[#1a1d29] rounded-xl border border-[#2a2d3a] p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                {t("enter_amount")}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs sm:text-sm mb-2 block">
                    {t("amount_label")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[#16171f] text-white text-xl sm:text-2xl font-bold border border-[#2a2d3a] hover:border-[#3a3d4a] focus:border-blue-500 rounded-lg px-4 py-4 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      $
                    </span>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="text-gray-400 text-xs sm:text-sm mb-2 block">
                    {t("quick_amount")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDepositAmount(amount.toString())}
                        className="bg-[#16171f] hover:bg-[#1f2029] border border-[#2a2d3a] hover:border-blue-500 text-white py-2 px-3 rounded-lg transition-all text-xs sm:text-sm font-semibold"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Selection */}
            <div className="bg-[#1a1d29] rounded-xl border border-[#2a2d3a] p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                {t("select_bank")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {banksList.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      selectedBank === bank.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-[#2a2d3a] hover:border-[#3a3d4a] bg-[#16171f]"
                    }`}
                  >
                    <div className="text-center">
                      {/* Ưu tiên icon image, fallback về emoji */}
                      {bank.icon ? (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 relative">
                          <Image
                            src={bank.icon}
                            alt={bank.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-2xl sm:text-3xl mb-2">
                          {bank.id === "momo"
                            ? "💳"
                            : bank.id === "zalopay"
                            ? "💙"
                            : bank.id === "skrill"
                            ? "💰"
                            : "🏦"}
                        </div>
                      )}
                      <p className="text-white font-semibold text-xs sm:text-sm">
                        {bank.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code & Bank Details */}
            {selectedBankData && depositAmount && Number(depositAmount) > 0 && (
              <div className="bg-[#1a1d29] rounded-xl border border-[#2a2d3a] p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                  {t("payment_details")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* QR Code or Info */}
                  <div className="flex flex-col items-center">
                    <BankQRCode
                      bankName={selectedBankData.name}
                      qrImage={selectedBankData.qrImage}
                    />
                    {selectedBankData.qrImage && (
                      <p className="text-gray-400 text-xs sm:text-sm text-center mt-3">
                        {t("scan_qr")}
                      </p>
                    )}
                  </div>

                  {/* Bank Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        {t("bank_name")}
                      </label>
                      <div className="bg-[#16171f] p-3 rounded-lg">
                        <p className="text-white font-semibold text-sm sm:text-base">
                          {selectedBankData.name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        {selectedBankData.id === "skrill"
                          ? "Email"
                          : t("account_number")}
                      </label>
                      <div className="bg-[#16171f] p-3 rounded-lg flex items-center justify-between">
                        <p className="text-white font-mono font-semibold text-sm sm:text-base break-all">
                          {selectedBankData.accountNumber}
                        </p>
                        <button
                          onClick={() =>
                            handleCopy(
                              selectedBankData.accountNumber,
                              "account"
                            )
                          }
                          className="text-blue-400 hover:text-blue-300 ml-2 flex-shrink-0"
                        >
                          {copied === "account" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        {t("transfer_amount")}
                      </label>
                      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-3 rounded-lg flex items-center justify-between">
                        <p className="text-blue-400 font-bold text-lg sm:text-xl">
                          ${Number(depositAmount).toLocaleString("en-US")}
                        </p>
                        <button
                          onClick={() => handleCopy(depositAmount, "amount")}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {copied === "amount" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        {t("transfer_content")}
                      </label>
                      <div className="bg-[#16171f] p-3 rounded-lg flex items-center justify-between">
                        <p className="text-white font-mono text-xs sm:text-sm">
                          DEPOSIT {Date.now()}
                        </p>
                        <button
                          onClick={() =>
                            handleCopy(`DEPOSIT ${Date.now()}`, "content")
                          }
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {copied === "content" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Bill */}
            <UploadReceipt onFileChange={handleFileUpload} />
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1d29] rounded-xl border border-[#2a2d3a] p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                {t("deposit_summary")}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-lg border border-blue-500/20">
                  <p className="text-gray-400 text-xs mb-1">
                    {t("amount_to_deposit")}
                  </p>
                  <p className="text-blue-400 font-bold text-2xl sm:text-3xl">
                    {depositAmount
                      ? `$${Number(depositAmount).toLocaleString("en-US")}`
                      : "$0"}
                  </p>
                </div>

                {depositAmount && Number(depositAmount) > 0 && (
                  <div className="text-xs text-gray-400 bg-[#16171f] p-3 rounded-lg">
                    <p className="mb-2">💡 {t("deposit_note")}</p>
                    <ul className="space-y-1 ml-4">
                      <li>• {t("note_1")}</li>
                      <li>• {t("note_2")}</li>
                      <li>• {t("note_3")}</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Status Checklist */}
              <div className="space-y-3 mb-6">
                <div
                  className={`flex items-center gap-2 text-sm ${
                    depositAmount && Number(depositAmount) > 0
                      ? "text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  {depositAmount && Number(depositAmount) > 0 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>{t("amount_entered")}</span>
                </div>

                <div
                  className={`flex items-center gap-2 text-sm ${
                    selectedBank ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {selectedBank ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>{t("bank_selected")}</span>
                </div>

                <div
                  className={`flex items-center gap-2 text-sm ${
                    uploadedFile ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {uploadedFile ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>{t("bill_uploaded")}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={
                  !selectedBank ||
                  !depositAmount ||
                  Number(depositAmount) <= 0 ||
                  !uploadedFile ||
                  isProcessing
                }
                className={`w-full py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base transition-all ${
                  selectedBank &&
                  depositAmount &&
                  Number(depositAmount) > 0 &&
                  uploadedFile &&
                  !isProcessing
                    ? "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? t("loading") : t("confirm_deposit")}
              </button>

              <p className="text-gray-500 text-xs text-center mt-4">
                {t("admin_review")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepositSection;
