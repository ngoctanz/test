"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname as any, { locale: newLocale as "en" | "vn" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-yellow-400 hover:text-white hover:border-yellow-400 transition-all duration-300">
          <Languages className="w-5 h-5" />
          <span className="uppercase">{locale}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("vn")}
          className={`cursor-pointer ${
            locale === "vn" ? "bg-yellow-100 dark:bg-yellow-900" : ""
          }`}
        >
          <span className="mr-2">VN</span> Tiếng Việt
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`cursor-pointer ${
            locale === "en" ? "bg-yellow-100 dark:bg-yellow-900" : ""
          }`}
        >
          <span className="mr-2">EN</span> English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
