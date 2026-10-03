import type { MetadataRoute } from "next";

/* 爬虫放行，站点地图指路 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.onnx.click/sitemap.xml",
  };
}
