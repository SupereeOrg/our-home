/* 中文按每分钟 400 字估阅读时长（客户端可用，不碰 fs） */
export function readingMinutes(content: string): number {
  const chars = content.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 400));
}
