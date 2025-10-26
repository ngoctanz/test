"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/auth.context";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tv = useTranslations("auth.validation");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const loginSchema = z.object({
    email: z.string().min(1, tv("required")).email(tv("email_invalid")),
    password: z.string().min(6, tv("password_min")),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8 shadow-xl opacity-80">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{t("title")}</h2>
          <p className="text-gray-400">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              {t("username_email_label")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder={t("username_email_placeholder")}
                className="pl-10 bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3f9ced] focus:ring-[#3f9ced]"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              {t("password_label")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("password_placeholder")}
                className="pl-10 pr-10 bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3f9ced] focus:ring-[#3f9ced]"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3f9ced] hover:bg-[#1e7ed1] text-black font-bold py-6 text-base"
          >
            {isSubmitting ? "..." : t("login_button")}
          </Button>

          {/* Links */}
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t("forgot_password")}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {t("no_account")}{" "}
          <Link
            href="/register"
            className="text-[#3f9ced] hover:text-[#1362a8] font-medium"
          >
            {t("create_account")}
          </Link>
        </div>
      </div>
    </div>
  );
}
