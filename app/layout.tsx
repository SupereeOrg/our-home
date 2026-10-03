import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ViewTransitions } from "next-view-transitions";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/700.css";
import "@fontsource/noto-serif-sc/900.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "./globals.css";
import ConsoleEgg from "./components/ConsoleEgg";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.onnx.click"),
  title: "八页纸 · 纸片君 × 苏淋",
  description: "广州 ↔ 拉萨，相隔 2,295 km 的两个人。纸上八页。",
  openGraph: {
    title: "八页纸 · 纸片君 × 苏淋",
    description: "广州 ↔ 拉萨，相隔 2,295 km 的两个人。纸上八页。",
    url: "https://www.onnx.click",
    siteName: "八页纸",
    locale: "zh_CN",
    type: "website",
  },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  icons: {
    icon: [
      { url: "/avatars/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/avatars/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/avatars/apple-touch-icon.png",
  },
};

export const viewport: Viewport = { themeColor: "#f7f3ec" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="zh-CN" suppressHydrationWarning>
        <body>
          <ConsoleEgg />
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}
