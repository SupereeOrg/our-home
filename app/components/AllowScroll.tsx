"use client";

import { useEffect, useRef } from "react";
import { useRafScroll } from "./useRafScroll";

/* 子页面都是自然滚动，进来开闸，离开还原（首页靠 body 锁行）。
   顺带挂顶端书口阅读进度；位置暗示交给进度线 + 内容自然截断，不加淡罩。 */
export default function AllowScroll() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("allow-scroll");
    document.documentElement.classList.add("allow-scroll");
    return () => {
      document.body.classList.remove("allow-scroll");
      document.documentElement.classList.remove("allow-scroll");
    };
  }, []);

  useRafScroll(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = Math.min(Math.max(window.scrollY, 0), Math.max(max, 0));
    const p = max > 0 ? y / max : 0;
    if (bar.current) {
      bar.current.style.transform = `scaleX(${p})`;
      bar.current.style.opacity = max > 0 ? "1" : "0";
      bar.current.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    }
  });

  return (
    /* 书口：和首页八段轨同一规格（3px / ink底轨 / ink灌注），只是信是连读所以单段 */
    <div className="fixed top-0 left-0 right-0 z-40 h-[3px] bg-ink/10">
      <div
        ref={bar}
        role="progressbar"
        aria-label="阅读进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="h-full bg-ink origin-left"
        style={{ transform: "scaleX(0)", opacity: 0 }}
      />
    </div>
  );
}
