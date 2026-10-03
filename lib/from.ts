/* 署名三态（客户端可用，不碰 fs）：ee 绿 / su 粉 / ai 米（纸与荧光笔之间） */
export type From = "ee" | "su" | "ai";

export const FROM_META = {
  ee: { wash: "bg-green-soft", who: "ee · 纸片君", sign: "ee", avatar: "/avatars/paperee-256.webp" },
  su: { wash: "bg-pink-soft", who: "su · 苏淋", sign: "su", avatar: "/avatars/sulin-256.webp" },
  ai: { wash: "bg-[#f3ecd9]", who: "muse · 执笔", sign: "muse", avatar: "/avatars/mix-256.webp" },
} as const;
