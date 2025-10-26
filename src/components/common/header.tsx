"use client";
import React, { useState } from "react";
import {
  User,
  ChevronDown,
  Calendar,
  Wallet,
  ShieldCheck,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/buttons/language.switcher";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/routes";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/payment.util";
import useClickOutSide from "@/hooks/useClickOutside";
import { useAuth } from "@/contexts/auth.context";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const t = useTranslations("header");

  // Get current user from AuthProvider
  const { user, isAuthenticated, logout, isLoading, refetchUser } = useAuth();
  const userDisplayName = user?.email?.split("@")[0] || "Guest";

  // Close dropdown when clicking outside
  const { nodeRef: dropdownRef } = useClickOutSide(() => {
    setDropdownOpen(false);
  });

  const { nodeRef: mobileDropdownRef } = useClickOutSide(() => {
    setDropdownOpen(false);
  });

  // Handler for refresh balance with loading effect
  const handleRefreshBalance = async () => {
    await refetchUser();
  };

  return (
    <header className="w-full bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      {/* Top Bar with Account Info */}
      <div className="bg-[#141414] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6 text-gray-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3f9ced]" />
              <span className="hidden sm:inline">{t("slogan")}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <span className="text-gray-400 hidden md:inline">
                  {t("balance")}
                </span>
                <span className="font-bold text-[#3f9ced]">
                  {formatCurrency(user?.money || 0)}
                </span>
                <button
                  aria-label="Làm mới số dư"
                  title="Làm mới số dư"
                  onClick={handleRefreshBalance}
                  className="p-1 rounded-full hover:bg-[#232323] transition flex items-center justify-center"
                >
                  <RefreshCw
                    className="w-4 h-4 text-[#3f9ced]"
                    strokeWidth={3}
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
            <img
              src="/images/logo.png"
              alt="Best Game Account Store"
              className="h-18 w-auto object-contain transition-all duration-300 group-hover:scale-110 brightness-0 invert [filter:drop-shadow(0_0_4px_rgba(63,156,237,0.3))_drop-shadow(0_0_1px_rgba(255,255,255,0.4))_brightness(0)_invert(1)] group-hover:[filter:drop-shadow(0_0_8px_rgba(123,237,63,0.4))_drop-shadow(0_0_2px_rgba(255,255,255,0.5))_brightness(0)_invert(1)]"
            />
          </Link>

          {/* Center Content - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8 items-center justify-center">
            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-medium bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] tracking-wide">
                {t("premium_badge")}
              </h2>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href={ROUTES.DEPOSIT as any}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
            >
              <Wallet className="w-4 h-4 text-[#3f9ced]" />
              <span className="text-sm font-medium">{t("deposit")}</span>
            </Link>
            <Link
              href={ROUTES.POLICIES as any}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#3f9ced]" />
              <span className="text-sm font-medium">
                {t("warranty_policy")}
              </span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* User Dropdown - Desktop */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <Button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 hover:border-[#3f9ced] rounded-lg text-gray-300 hover:text-white transition-all"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {isLoading ? "..." : userDisplayName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-gray-800">
                      {t("user_account")}
                    </div>

                    {!isAuthenticated ? (
                      <>
                        <Link
                          href={ROUTES.LOGIN as any}
                          className="flex items-center gap-3 px-3 py-2.5 mt-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-all"
                        >
                          <LogIn className="w-4 h-4 text-[#3f9ced]" />
                          <span className="text-sm font-medium">
                            {t("login")}
                          </span>
                        </Link>
                        <Link
                          href={ROUTES.REGISTER as any}
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-all"
                        >
                          <UserPlus className="w-4 h-4 text-[#3f9ced]" />
                          <span className="text-sm font-medium">
                            {t("register")}
                          </span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2.5 mt-2 border-b border-gray-800">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-white font-medium truncate">
                            {user?.email}
                          </p>
                        </div>
                        <div className="px-3 py-2.5 border-b border-gray-800">
                          <p className="text-xs text-gray-500">
                            {t("balance")}
                          </p>
                          <p className="text-sm text-[#3f9ced] font-bold">
                            {formatCurrency(user?.money || 0)}
                          </p>
                        </div>
                        <Link
                          href={ROUTES.HISTORIES as any}
                          className="flex items-center gap-3 px-3 py-2.5 mt-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-md transition-all"
                        >
                          <Calendar className="w-4 h-4 text-[#3f9ced]" />
                          <span className="text-sm font-medium">
                            {t("history")}
                          </span>
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-red-400 hover:bg-[#2a2a2a] rounded-md transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {t("logout")}
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Tagline */}
        <div className="lg:hidden pb-3 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full"></span>
              100% Authentic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-sky-500/50 rounded-full"></span>
              Instant Delivery
            </span>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800 pt-4">
            <nav className="flex flex-col gap-2">
              <Link
                href={ROUTES.DEPOSIT as any}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
              >
                <Wallet className="w-5 h-5 text-[#3f9ced]" />
                <span className="font-medium">{t("deposit")}</span>
              </Link>
              <Link
                href={ROUTES.POLICIES as any}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-[#3f9ced]" />
                <span className="font-medium">{t("warranty_policy")}</span>
              </Link>
              <Link
                href={ROUTES.HISTORIES as any}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{t("history")}</span>
              </Link>

              {/* Mobile User Actions */}
              <div
                className="mt-4 pt-4 border-t border-gray-800 space-y-2"
                ref={mobileDropdownRef}
              >
                <div className="flex items-center justify-between px-2 mb-3">
                  <span className="text-sm text-gray-500">
                    {t("user_account")}
                  </span>
                  <LanguageSwitcher />
                </div>

                {!isAuthenticated ? (
                  <>
                    <Link
                      href={ROUTES.LOGIN as any}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-all"
                    >
                      <LogIn className="w-5 h-5 text-[#3f9ced]" />
                      <span className="font-medium">{t("login")}</span>
                    </Link>
                    <Link
                      href={ROUTES.REGISTER as any}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-all"
                    >
                      <UserPlus className="w-5 h-5 text-[#3f9ced]" />
                      <span className="font-medium">{t("register")}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 bg-[#1a1a1a] rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm text-white font-medium truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 mb-1">
                        {t("balance")}
                      </p>
                      <p className="text-sm text-[#3f9ced] font-bold">
                        {formatCurrency(user?.money || 0)}
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-red-400 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">{t("logout")}</span>
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
