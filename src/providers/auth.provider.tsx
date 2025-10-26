"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/apis/auth.api";
import { AuthContext, type AuthContextType } from "@/contexts/auth.context";
import type { Profile } from "@/apis/auth.api";
import { clearLocalTokens, saveTokensToLocal } from "@/lib/auth.client";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /** ====================== FETCH PROFILE ====================== */
  const fetchUserProfile = useCallback(async (): Promise<Profile | null> => {
    try {
      const res = await authApi.profile();
      const profile = res?.data || null;
      setUser(profile);
      return profile;
    } catch (err: any) {
      console.warn("❌ Fetch profile failed:", err);

      // nếu cookie fail (401) mà vẫn có token local => thử lại
      const localToken = localStorage.getItem("accessToken");
      if (err?.status === 401 && localToken) {
        try {
          const res2 = await authApi.profile();
          const profile2 = res2?.data || null;
          setUser(profile2);
          return profile2;
        } catch {
          setUser(null);
        }
      }

      setUser(null);
      return null;
    }
  }, []);

  /** ====================== INITIAL LOAD ====================== */
  useEffect(() => {
    (async () => {
      await fetchUserProfile();
      setIsLoading(false);
    })();
  }, [fetchUserProfile]);

  /** ====================== LOGIN ====================== */
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await authApi.login({ email, password });

        if (res.data?.tokens) {
          saveTokensToLocal(res.data.tokens);
        }

        // Sau khi lưu xong → refetch profile
        const userData = await fetchUserProfile();

        if (userData) {
          const targetPath = userData.role === "ADMIN" ? "/admin" : "/";
          router.replace(targetPath);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserProfile, router]
  );

  /** ====================== REGISTER ====================== */
  const register = useCallback(
    async (email: string, password: string): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await authApi.register({ email, password });

        if (res.data?.tokens) {
          saveTokensToLocal(res.data.tokens);
        }

        await login(email, password);
      } catch (error) {
        console.error("Register error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  /** ====================== LOGOUT ====================== */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Gọi API logout để xóa cookies backend
      await authApi.logout();
    } catch {
      /* ignore */
    } finally {
      // Xóa token local fallback
      clearLocalTokens();

      setUser(null);
      router.replace("/login");
      setIsLoading(false);
    }
  }, [router]);

  /** ====================== CONTEXT VALUE ====================== */
  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refetchUser: fetchUserProfile,
    }),
    [user, isLoading, login, register, logout, fetchUserProfile]
  );

  /** ====================== LOADING UI ====================== */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
          <p className="text-gray-500">Waiting...</p>
        </div>
      </div>
    );
  }

  /** ====================== RENDER ====================== */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
