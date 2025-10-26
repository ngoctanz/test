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
        await authApi.login({ email, password });

        const userData = await fetchUserProfile();

        if (userData) {
          const targetPath = userData.role === "ADMIN" ? "/admin" : "/";
          router.replace(targetPath);
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
        await authApi.register({ email, password });
        await login(email, password);
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
      // Xóa user state
      setUser(null);
      router.replace("/login");

      // // Xóa tất cả cookies frontend
      // const cookies = document.cookie.split(";");
      // for (let i = 0; i < cookies.length; i++) {
      //   const cookie = cookies[i];
      //   const eqPos = cookie.indexOf("=");
      //   const name =
      //     eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      //   // Xóa cookie với nhiều cấu hình path/domain
      //   document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      //   document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      //   document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      // }

      // // Clear localStorage và sessionStorage nếu có
      // localStorage.clear();
      // sessionStorage.clear();

      // lastRedirectRef.current = "/";

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
