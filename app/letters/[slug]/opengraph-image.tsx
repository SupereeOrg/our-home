import { ImageResponse } from "next/og";
import { getLetter } from "@/lib/letters";
import { FROM_META } from "@/lib/from";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* 每封信的分享卡：标题 + 署名 + ee绿/su粉/ai米底，构建期静态生成 */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const letter = getLetter(slug);
  const title = letter?.title ?? "我们的信";
  const wash =
    letter?.from === "su" ? "#f1ddd8" : letter?.from === "ai" ? "#f3ecd9" : "#dee4d5";
  const who = letter ? FROM_META[letter.from].who : "ee × su";
  const date = letter?.date || "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#f7f3ec",
          color: "#211d1b",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, opacity: 0.55 }}>
          我们的信 · {who} {date ? `· ${date}` : ""}
        </div>
        <div style={{ fontSize: 96, fontWeight: 900, fontFamily: "serif", marginTop: 24, lineHeight: 1.2 }}>
          {title}
        </div>
        <div
          style={{
            marginTop: 32,
            width: 320,
            height: 24,
            background: wash,
            border: "2px solid #211d1b",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
