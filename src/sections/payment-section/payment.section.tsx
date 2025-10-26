"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  CreditCard,
  Mail,
  Wallet,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/routes";
import { useAuth } from "@/contexts/auth.context";
import { GameAccount } from "@/types/game-account.type";
import {
  type PaymentMethod,
  type PaymentSectionProps,
} from "@/types/payment-type";
import {
  validateBalance,
  validateEmail,
  processPayment,
} from "@/utils/payment.util";
import { purchaseGameAccount } from "@/apis/purchase.api";
import { Button } from "@/components/ui/button";
import OrderSuccessModal from "@/components/modals/order-success.modal";
import { DISCORD_CONTACT_LINK } from "@/utils/contact.info";

export default function PaymentSection({
  account,
  gameName,
}: PaymentSectionProps) {
  const t = useTranslations("payment");
  const router = useRouter();
  const { isAuthenticated, user, isLoading, refetchUser } = useAuth();

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userSelectedPayment, setUserSelectedPayment] = useState(false);
  const [userBalance, setUserBalance] = useState(user?.money || 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("balance");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const accountPrice = Number(account.currentPrice);
  const hasEnoughBalance = validateBalance(userBalance, accountPrice);

  //  Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push(ROUTES.LOGIN as any);
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.money !== undefined) setUserBalance(user.money);
  }, [user?.money]);

  // Auto chọn phương thức nếu chưa chọn
  useEffect(() => {
    if (!userSelectedPayment)
      setPaymentMethod(hasEnoughBalance ? "balance" : "admin");
    else if (!hasEnoughBalance && paymentMethod === "balance")
      setPaymentMethod("admin");
  }, [userSelectedPayment, hasEnoughBalance, paymentMethod]);

  const isEmailValid = validateEmail(email);
  const emailsMatch = email === confirmEmail && confirmEmail !== "";
  const canPurchase =
    acceptTerms &&
    !isProcessing &&
    (paymentMethod === "admin" ||
      (isEmailValid && emailsMatch && hasEnoughBalance));

  // Xử lý mua hàng
  const handlePurchase = async () => {
    if (!canPurchase) return;
    setIsProcessing(true);

    try {
      const paymentRes = await processPayment({
        accountId: account.gameAccountId.toString(),
        accountPrice,
        email,
        paymentMethod,
        userBalance,
      });

      if (paymentRes.status === "error") {
        throw new Error(paymentRes.message || t("payment_failed"));
      }

      const orderRes = await purchaseGameAccount({
        gameAccountId: account.gameAccountId,
        email,
      });

      if (orderRes.status !== 200) {
        throw new Error(orderRes.message || "Không thể tạo đơn hàng");
      }

      setOrderData({
        orderId: orderRes.data?.orderId || "N/A",
        accountId: account.gameAccountId,
        gameName,
        price: accountPrice,
        email,
        createdAt: new Date().toISOString(),
      });
      setIsModalOpen(true);

      await refetchUser();
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi không mong muốn");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen relative">
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">{t("back_button")}</span>
        </button>

        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-8">
          <CreditCard className="w-7 h-7 text-blue-400" />
          {t("title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance */}
            <div className="bg-[#1a1d29] border border-[#2a2d3a] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-semibold">
                  {t("balance_title")}
                </h2>
                {hasEnoughBalance ? (
                  <CheckCircle className="text-green-400 w-5 h-5" />
                ) : (
                  <AlertCircle className="text-red-400 w-5 h-5" />
                )}
              </div>
              <p className="text-blue-400 font-bold text-2xl">
                ${userBalance.toLocaleString("en-US")}
              </p>
              {!hasEnoughBalance && (
                <p className="text-red-400 text-sm mt-2">
                  {t("insufficient_balance")}
                </p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-[#1a1d29] border border-[#2a2d3a] p-6 rounded-xl space-y-3">
              <h2 className="text-white font-semibold mb-3">
                {t("payment_method_title")}
              </h2>

              <button
                onClick={() => {
                  setPaymentMethod("balance");
                  setUserSelectedPayment(true);
                }}
                disabled={!hasEnoughBalance}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  paymentMethod === "balance"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-[#2a2d3a] hover:border-[#3a3d4a]"
                } ${!hasEnoughBalance ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="text-blue-400 w-5 h-5" />
                  <div>
                    <p className="text-white font-semibold">
                      {t("payment_balance")}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {t("payment_balance_desc")}
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setPaymentMethod("admin");
                  setUserSelectedPayment(true);
                }}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  paymentMethod === "admin"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-[#2a2d3a] hover:border-[#3a3d4a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-purple-400 w-5 h-5" />
                  <div>
                    <p className="text-white font-semibold">
                      {t("payment_admin")}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {t("payment_admin_desc")}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Email fields */}
            {paymentMethod === "balance" && (
              <div className="bg-[#1a1d29] border border-[#2a2d3a] p-6 rounded-xl space-y-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />{" "}
                  {t("email_info_title")}
                </h2>
                <input
                  type="email"
                  placeholder={t("email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#16171f] border border-[#2a2d3a] text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
                <input
                  type="email"
                  placeholder={t("confirm_email_placeholder")}
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className="w-full bg-[#16171f] border border-[#2a2d3a] text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
                {confirmEmail && email !== confirmEmail && (
                  <p className="text-red-400 text-xs">{t("email_mismatch")}</p>
                )}
              </div>
            )}

            {/* Terms */}
            <div className="bg-[#1a1d29] border border-[#2a2d3a] p-4 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-blue-500"
                />
                <span className="text-gray-300 text-sm">
                  {t("terms_text")}{" "}
                  <a href="#" className="text-blue-400 hover:underline">
                    {t("terms_link")}
                  </a>{" "}
                  {t("and")}{" "}
                  <a href="#" className="text-blue-400 hover:underline">
                    {t("warranty_link")}
                  </a>
                </span>
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1 bg-[#1a1d29] border border-[#2a2d3a] rounded-xl p-6 sticky top-4">
            <h2 className="text-white font-bold mb-4">{t("order_summary")}</h2>
            <img
              src={account.mainImageUrl || "/images/placeholder.png"}
              alt={account.title || "Account"}
              className="rounded-lg w-full aspect-video object-cover mb-4"
            />
            <div className="text-sm text-gray-300 space-y-2">
              <p>
                <span className="text-gray-400">{t("game_label")}: </span>
                <span className="text-white">{gameName}</span>
              </p>
              <p>
                <span className="text-gray-400">{t("type_label")}: </span>
                <span className="text-purple-400">
                  {account.typeAccount?.toUpperCase() || "NORMAL"}
                </span>
              </p>
              <div className="border-t border-[#2a2d3a] my-3" />
              <div className="flex justify-between">
                <span className="text-gray-400">{t("total_payment")}</span>
                <span className="text-blue-400 font-bold">
                  ${accountPrice.toLocaleString("en-US")}
                </span>
              </div>
            </div>

            {paymentMethod === "admin" ? (
              <Button
                onClick={() =>
                  window.open("https://discord.com/invite/v2DfZ5tm9", "_blank")
                }
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {t("contact_admin")}
              </Button>
            ) : (
              <Button
                onClick={handlePurchase}
                disabled={!canPurchase || isProcessing}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  t("confirm_payment")
                )}
              </Button>
            )}

            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-gray-300 flex gap-2">
              <ShieldCheck className="text-green-400 w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-green-400 font-semibold">
                  {t("security_title")}
                </p>
                <p>{t("security_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Success Modal */}
      <OrderSuccessModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        orderData={orderData}
      />
    </div>
  );
}
