"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Mail, MessageCircle } from "lucide-react";

interface PolicyDetail {
  key: string;
}

interface Policy {
  id: number;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  detailKeys: PolicyDetail[];
  gradient: string;
}

const policiesData: Policy[] = [
  {
    id: 1,
    titleKey: "privacy.title",
    descriptionKey: "privacy.description",
    icon: "🔒",
    detailKeys: [
      { key: "privacy.detail_1" },
      { key: "privacy.detail_2" },
      { key: "privacy.detail_3" },
      { key: "privacy.detail_4" },
    ],
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    id: 2,
    titleKey: "warranty.title",
    descriptionKey: "warranty.description",
    icon: "🛡️",
    detailKeys: [
      { key: "warranty.detail_1" },
      { key: "warranty.detail_2" },
      { key: "warranty.detail_3" },
      { key: "warranty.detail_4" },
    ],
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    id: 3,
    titleKey: "payment.title",
    descriptionKey: "payment.description",
    icon: "💳",
    detailKeys: [
      { key: "payment.detail_1" },
      { key: "payment.detail_2" },
      { key: "payment.detail_3" },
      { key: "payment.detail_4" },
    ],
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    id: 4,
    titleKey: "refund.title",
    descriptionKey: "refund.description",
    icon: "🔄",
    detailKeys: [
      { key: "refund.detail_1" },
      { key: "refund.detail_2" },
      { key: "refund.detail_3" },
      { key: "refund.detail_4" },
    ],
    gradient: "from-orange-500/10 to-red-500/10",
  },
  {
    id: 5,
    titleKey: "delivery.title",
    descriptionKey: "delivery.description",
    icon: "📦",
    detailKeys: [
      { key: "delivery.detail_1" },
      { key: "delivery.detail_2" },
      { key: "delivery.detail_3" },
      { key: "delivery.detail_4" },
    ],
    gradient: "from-indigo-500/10 to-blue-500/10",
  },
  {
    id: 6,
    titleKey: "terms.title",
    descriptionKey: "terms.description",
    icon: "📜",
    detailKeys: [
      { key: "terms.detail_1" },
      { key: "terms.detail_2" },
      { key: "terms.detail_3" },
      { key: "terms.detail_4" },
    ],
    gradient: "from-slate-500/10 to-gray-500/10",
  },
];

function PolicesSection() {
  const t = useTranslations("policies");

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
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {t("page_title")}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            {t("page_subtitle")}
          </p>
        </div>

        {/* Policies Grid */}
        <div className="grid gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
          {policiesData.map((policy) => (
            <div
              key={policy.id}
              className={`group bg-gradient-to-br ${policy.gradient} backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10`}
            >
              <div className="flex flex-col md:flex-row items-start gap-5 md:gap-6">
                {/* Icon */}
                <div className="text-5xl md:text-6xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                  {policy.icon}
                </div>

                {/* Content */}
                <div className="flex-1 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {t(policy.titleKey)}
                  </h3>
                  <p className="text-gray-300 mb-5 leading-relaxed text-sm md:text-base">
                    {t(policy.descriptionKey)}
                  </p>

                  {/* Details List */}
                  <ul className="space-y-3">
                    {policy.detailKeys.map((detail, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-300 text-sm md:text-base"
                      >
                        <span className="text-blue-400 mt-1 flex-shrink-0 font-bold">
                          ✓
                        </span>
                        <span className="leading-relaxed">{t(detail.key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-6">
              {t("contact_title")}
            </h3>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Email */}
              <a
                href="mailto:proofbga@gmail.com"
                className="group flex items-center gap-4 bg-black/30 hover:bg-black/50 border border-white/10 hover:border-blue-400/50 rounded-xl p-4 md:p-5 transition-all duration-300"
              >
                <div className="bg-blue-500/20 p-3 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs md:text-sm mb-1">
                    {t("contact_email")}
                  </p>
                  <p className="text-white font-semibold text-sm md:text-base truncate">
                    proofbga@gmail.com
                  </p>
                </div>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/v2DfZ5tm9"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-black/30 hover:bg-black/50 border border-white/10 hover:border-purple-400/50 rounded-xl p-4 md:p-5 transition-all duration-300"
              >
                <div className="bg-purple-500/20 p-3 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <MessageCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs md:text-sm mb-1">
                    {t("contact_discord")}
                  </p>
                  <p className="text-white font-semibold text-sm md:text-base truncate">
                    discord.gg/v2DfZ5tm9
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolicesSection;
