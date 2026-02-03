import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth-guard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aplikasi Pengolahan Kayu LOG",
  description: "Sistem manajemen pengolahan kayu log yang komprehensif",
  keywords: ["kayu", "log", "inventory", "manajemen", "pengolahan kayu"],
  authors: [{ name: "Wood Processing System" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AuthGuard>
            <div className="flex h-screen overflow-hidden">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto bg-slate-50">
                {children}
              </main>
            </div>
          </AuthGuard>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
