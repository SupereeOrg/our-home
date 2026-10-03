import type { MetadataRoute } from "next";
import { getAllLetters } from "@/lib/letters";

const BASE = "https://www.onnx.click";

/* 站点地图：八页纸 + 信列表 + 每一封，lastModified 跟信的落款日期 */
export default function sitemap(): MetadataRoute.Sitemap {
  const letters = getAllLetters();
  return [
    {
      url: BASE,
      lastModified: letters[0]?.date ? new Date(letters[0].date) : new Date(),
    },
    { url: `${BASE}/letters` },
    ...letters.map((l) => ({
      url: `${BASE}/letters/${l.slug}`,
      lastModified: l.date ? new Date(l.date) : undefined,
    })),
  ];
}
