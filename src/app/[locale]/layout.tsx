import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import NextIntlProvider from "@/providers/nextIntl.provider";
import { ClientProviders } from "@/providers/client-providers";
import { AuthProvider } from "@/providers/auth.provider";
import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BestGameAccount - Buy & Sell Game Accounts",
  description: "Best platform for buying and selling game accounts securely.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return redirect(`/${routing.defaultLocale}`);
  }

  setRequestLocale(locale);

  const messages = (
    await import(`@/i18n/messages/${locale}.json`).catch(
      () => import(`@/i18n/messages/${routing.defaultLocale}.json`)
    )
  ).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          <NextIntlProvider locale={locale} messages={messages}>
            <AuthProvider>{children}</AuthProvider>
          </NextIntlProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
