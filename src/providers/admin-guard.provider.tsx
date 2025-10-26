"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const redirectPath = useMemo(() => {
    if (!isAuthenticated) return "/login";
    if (user?.role !== "ADMIN") return "/";
    return null;
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isLoading && redirectPath) router.replace(redirectPath);
  }, [isLoading, redirectPath, router]);

  if (isLoading || redirectPath) {
    return (
      <div className="flex items-center justify-center h-screen bg-black/10">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2 rounded-full" />
          <p className="text-gray-500">
            {isLoading ? "Checking permission..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
