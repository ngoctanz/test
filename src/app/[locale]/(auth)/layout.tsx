"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth.context";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/background_genshin_1.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/10 via-[#0a0a0a]/25 to-[#1a1a1a]/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
