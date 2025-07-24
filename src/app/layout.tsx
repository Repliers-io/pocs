import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApiKeysProvider } from "@/lib/api-keys-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RealEstate Pro - Find Your Dream Home",
  description: "Browse thousands of properties for sale and rent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ApiKeysProvider>{children}</ApiKeysProvider>
      </body>
    </html>
  );
}
