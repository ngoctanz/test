"use client";
import { DISCORD_CONTACT_LINK } from "@/utils/contact.info";
import { Users, Clock, Facebook, Phone, Mail, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#0a0b0e] text-gray-300 text-xs md:text-sm border-t border-[#1a1d29]">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* --- Column 1: Logo & Description --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <img
            src="/images/logo.png"
            alt="Best Game Account Store"
            className="h-18 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-200 invert drop-shadow-lg"
          />
          <p
            className="text-gray-400 leading-relaxed text-[13px]"
            dangerouslySetInnerHTML={{
              __html: t("description"),
            }}
          />
        </div>

        {/* --- Column 2: Trust & Policy --- */}
        <div className="flex flex-col items-center mx-auto lg:mx-0 lg:items-start text-center lg:text-left">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            {t("trust_policy_title")}
          </h3>
          <ul className="space-y-2 w-full">
            {[1, 2, 3, 4].map((num) => (
              <li key={num} className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3f9ced]" />
                <span className="font-medium text-[13px]">
                  {t(`trust_policy_${num}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Column 3: Contact --- */}
        <div className="flex flex-col mx-auto lg:mx-0 items-center lg:items-start text-center lg:text-left">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-400" />
            {t("contact_title")}
          </h3>
          <ul className="space-y-2 w-full text-[13px]">
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#3f9ced]" />
              <span>{t("support_hours")}</span>
            </li>
            <li className="flex items-center gap-2 hover:text-[#3f9ced] transition">
              <Facebook className="w-4 h-4 text-[#3f9ced]" />
              <span>{t("support_facebook")}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#3f9ced]" />
              <span>{t("support_email")}</span>
            </li>
          </ul>
        </div>

        {/* --- Column 4: Join Discord --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            {t("discord_title")}
          </h3>
          <a
            href={DISCORD_CONTACT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4"
          >
            <span className="font-semibold text-blue-400 text-sm mb-3">
              {t("discord_desc")}
            </span>
          </a>
          <img
            src="/images/qr/discord.png"
            alt="Discord QR"
            className="w-40 h-40 rounded-xl shadow-lg border border-blue-400 bg-white mx-auto lg:mx-0"
          />
        </div>
      </div>

      {/* --- Copyright --- */}
      <div className="border-t border-[#1a1d29] text-center text-gray-500 text-[12px] py-4">
        © 2025 Best Game Account Store — All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
