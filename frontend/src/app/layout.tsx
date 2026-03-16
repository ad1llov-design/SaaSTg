import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import AppShell from "@/components/AppShell";

const font = Plus_Jakarta_Sans({ subsets: ["latin", "cyrillic-ext"] });

export const metadata: Metadata = {
  title: "AuraSync SaaS — Система онлайн-записи",
  description: "Управляйте записями клиентов через Telegram-бота. Автоматизация бронирования, аналитика и уведомления.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={font.className}>
        <AuthProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
