import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropdown Menu",
  keywords: [
    "dropdown menu",
    "aria compliant",
    "accessible dropdown",
    "keyboard navigation",
    "focus management",
    "aria attributes",
    "web accessibility",
    "aria roles",
  ],
  authors: [{ name: "Akogwu Emmanuel", url: "https://dropdown-menu-liart.vercel.app/" }],
  creator: "Akogwu Emmanuel",
  description:
    "A fully accessible dropdown menu with ARIA attributes, keyboard navigation, focus management, and smooth animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
