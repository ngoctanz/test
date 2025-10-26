"use client";

import { Menu, User } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#3f9ced]/20 bg-black/95 backdrop-blur-md px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/10 rounded transition-all"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Right side actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* User menu */}
        <button className="flex items-center gap-2 p-2 text-gray-400 hover:text-[#3f9ced] hover:bg-[#3f9ced]/10 rounded transition-all">
          <div className="w-8 h-8 bg-[#3f9ced] rounded flex items-center justify-center shadow-lg shadow-[#3f9ced]/20">
            <User className="h-4 w-4 text-black" />
          </div>
          <span className="hidden md:block text-sm font-medium text-white">
            Admin
          </span>
        </button>
      </div>
    </header>
  );
}
