import type { Metadata } from "next";
import { QueryProvider } from "@/lib/query-client";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP kho nhôm kính",
  description: "Quản lý kho chuyên ngành nhôm kính"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
