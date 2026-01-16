
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Diasumsikan tailwind diimpor di sini

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KulinaPOS Enterprise",
  description: "Enterprise POS system for Restaurants and Cafes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
