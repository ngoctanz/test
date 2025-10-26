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

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tv = useTranslations("auth.validation");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { register: registerUser } = useAuth();

  const registerSchema = z
    .object({
      email: z.string().min(1, tv("required")).email(tv("email_invalid")),
      password: z
        .string()
        .min(6, tv("password_min"))
        .max(32, tv("password_max")),
      confirmPassword: z.string().min(1, tv("required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tv("password_mismatch"),
      path: ["confirmPassword"],
    });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError("");
      await registerUser(data.email, data.password);
      // Auto redirect to "/" after successful registration (handled by AuthProvider)
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8 shadow-xl opacity-80">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{t("title")}</h2>
          <p className="text-gray-username">{t("subtitle")}</p>
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
              {t("email_label")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-username" />
              <Input
                id="email"
                type="email"
                placeholder={t("email_placeholder")}
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-username" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-username hover:text-white"
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              {t("confirm_password_label")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-username" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirm_password_placeholder")}
                className="pl-10 pr-10 bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3f9ced] focus:ring-[#3f9ced]"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-username hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3f9ced] hover:bg-[#0f5ca0] text-black font-bold py-6 text-base"
          >
            {isSubmitting ? "..." : t("register_button")}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-username">
          {t("have_account")}{" "}
          <Link
            href="/login"
            className="text-[#3f9ced] hover:text-[#0f5ca0] font-medium"
          >
            {t("login_link")}
          </Link>
        </div>
      </div>
    </div>
  );
}
