"use client";

import { useAuth } from "@/contexts/auth.context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  LogOut,
  CreditCard,
  ChartColumnStacked,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { title: "Bảng điều khiển", href: "/admin", icon: LayoutDashboard },
  { title: "Quản lý tài khoản", href: "/admin/accounts", icon: ShoppingBag },
  { title: "Quản lý giao dịch", href: "/admin/transactions", icon: CreditCard },
  { title: "Quản lý người dùng", href: "/admin/users", icon: Users },
  {
    title: "Quản lý thể loại Game",
    href: "/admin/categories",
    icon: ChartColumnStacked,
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-black border-r border-[#3f9ced]/20 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#3f9ced]/20">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#3f9ced] rounded flex items-center justify-center shadow-lg shadow-[#3f9ced]/20">
              <span className="text-black font-bold text-sm">GA</span>
            </div>
            <span className="font-bold text-lg text-white">Admin</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-[#3f9ced] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-all duration-200",
                  isActive
                    ? "bg-[#3f9ced]/10 text-[#3f9ced] border border-[#3f9ced]/30 shadow-[0_0_12px_rgba(63,156,237,0.15)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[#3f9ced]/20">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded w-full text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/5 transition-all duration-200"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
