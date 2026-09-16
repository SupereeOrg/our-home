import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "纸片君 × 苏淋 — Superee",
  description: "广州 ↔ 拉萨，相隔 2,295 km 的两个人。PAPEREE × SULIN",
  icons: {
    icon: [
      { url: "/avatars/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/avatars/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/avatars/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffbf6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${spaceGrotesk.variable} ${notoSansSC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
