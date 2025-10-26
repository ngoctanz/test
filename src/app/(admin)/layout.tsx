import { ReactNode } from "react";
import "@/app/globals.css";
import { ClientProviders } from "@/providers/client-providers";
import AdminGuard from "@/providers/admin-guard.provider";

export const metadata = {
  title: "Admin Panel",
  description: "Game Account Shop Admin Dashboard",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <AdminGuard>{children}</AdminGuard>
        </ClientProviders>
      </body>
    </html>
  );
}
