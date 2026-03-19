import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider } from "@/context/NotificationContext";
import AppShell from "@/components/AppShell";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: '--font-outfit' });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "AuraSync SaaS — Система онлайн-записи",
  description: "Автоматизированная платформа для вашего бизнеса",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">
        <LanguageProvider>
          <NotificationProvider>
            <AuthProvider>
              <AppShell>{children}</AppShell>
            </AuthProvider>
          </NotificationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
