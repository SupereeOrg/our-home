import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* 分享卡：纸底墨字，无图，微信/聊天框里转发不光秃 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f3ec",
          color: "#211d1b",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 12, opacity: 0.55 }}>广州 ↔ 拉萨 · 2,295 KM</div>
        <div style={{ fontSize: 150, fontWeight: 900, fontFamily: "serif", marginTop: 16 }}>八页纸</div>
        <div style={{ fontSize: 30, letterSpacing: 8, opacity: 0.7, marginTop: 20 }}>ee × su · 我们的信</div>
      </div>
    ),
    { ...size }
  );
}
