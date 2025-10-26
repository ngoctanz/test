import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

export const i18nMiddleware = createMiddleware({
  ...routing,
  localePrefix: "always", // Luôn có tiền tố /vi hoặc /en
  localeDetection: true, // Tự động phát hiện ngôn ngữ trình duyệt
});

export async function middleware(req: NextRequest) {
  // 👉 Bỏ qua middleware cho admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return;
  }

  // 👉 Chỉ xử lý i18n, không check token hay login
  return i18nMiddleware(req);
}

export const config = {
  // Áp dụng middleware cho tất cả route, trừ các thư mục hệ thống và admin
  matcher: [
    "/((?!api|trpc|_next|_vercel|admin|.*\\..*).*)",
    "/",
    "/(vi|en)/:path*",
  ],
};
