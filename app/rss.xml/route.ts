import { getAllLettersWithContent } from "@/lib/letters";

export const dynamic = "force-dynamic"; /* origin 必须按请求拼，静态会烤进构建期域名 */

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/* 信上只写 YYYY-MM-DD，约定按北京时间；空期回落 now（未署期不应出现，防御而已） */

function pubDate(date: string): string {
  const d = new Date(`${date}T00:00:00+08:00`);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const items = getAllLettersWithContent()
    .map(
      (l) => `    <item>
      <title>${esc(l.title)}</title>
      <link>${origin}/letters/${l.slug}</link>
      <guid>${origin}/letters/${l.slug}</guid>
      <pubDate>${pubDate(l.date)}</pubDate>
      <author>${l.from}</author>
      <description>${esc(l.excerpt)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>我们的信 — 八页纸</title>
    <link>${origin}/letters</link>
    <description>ee 与 su 的信，一封一封往里装。</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
