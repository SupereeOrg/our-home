import type { MetadataRoute } from "next";

/* PWA 名片：只给名字/颜色/图标，不配 service worker——
   纪念站不需要离线安装，不断网逻辑就零风险 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "八页纸 · 纸片君 × 苏淋",
    short_name: "八页纸",
    description: "广州 ↔ 拉萨，相隔 2,295 km 的两个人。纸上八页。",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "zh-CN",
    background_color: "#f7f3ec",
    theme_color: "#f7f3ec",
    icons: [
      { src: "/avatars/favicon-32.png", sizes: "32x32", type: "image/png" },
      { src: "/avatars/favicon-64.png", sizes: "64x64", type: "image/png" },
      { src: "/avatars/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
