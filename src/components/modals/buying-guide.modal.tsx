"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Wallet, Upload, CheckCircle, ShoppingCart, Gift } from "lucide-react";

interface BuyingGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function BuyingGuideModal({ open, onOpenChange }: BuyingGuideModalProps) {
  const t = useTranslations("buyingGuide");

  const steps = [
    {
      icon: Wallet,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      title: t("step1Title"),
      description: t("step1Description"),
    },
    {
      icon: Upload,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      title: t("step2Title"),
      description: t("step2Description"),
    },
    {
      icon: CheckCircle,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
      title: t("step3Title"),
      description: t("step3Description"),
    },
    {
      icon: ShoppingCart,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
      title: t("step4Title"),
      description: t("step4Description"),
    },
    {
      icon: Gift,
      iconColor: "text-pink-500",
      bgColor: "bg-pink-500/10",
      title: t("step5Title"),
      description: t("step5Description"),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1d29] border-[#2a2d3a] p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">⚡</span>
            <span className="leading-tight">{t("title")}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-xs sm:text-sm">
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#16171f] rounded-lg border border-[#2a2d3a] hover:border-[#3a3d4a] transition-colors"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${step.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${step.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1 flex items-center gap-1.5 sm:gap-2">
                    <span className="text-blue-400 text-xs sm:text-sm">
                      {index + 1}️⃣
                    </span>
                    <span className="break-words">{step.title}</span>
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
          <p className="text-center text-xs sm:text-sm text-gray-300 break-words">
            💬 {t("footer")}
          </p>
        </div>

        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#2a2d3a]">
          <p className="text-[10px] sm:text-xs text-gray-500 text-center break-words">
            {t("note")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BuyingGuideModal;
