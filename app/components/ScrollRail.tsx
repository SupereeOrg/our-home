"use client";

import { useEffect, useRef } from "react";

const INSET = 12; // 轨道上下留白
const MIN_H = 44; // 拇指最小高度
const IDLE_MS = 1400; // 停止滚动后多久隐藏

/*
 * 真·悬浮滚动条：Windows Chrome 没有可用的 overlay 原生方案
 *（overflow: overlay 已废弃且 114+ 失效，scrollbar-style 还是提案），
 * 所以隐藏根原生条，用这根 fixed 拇指接管指示 + 拖拽，零布局占用。
 * 原生滚动本身保留（键盘/触摸/锚点照常工作），只换皮肤。
 */
export default function ScrollRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;
    const doc = document.documentElement;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let dragging = false;

    const metrics = () => {
      const max = doc.scrollHeight - innerHeight;
      const trackH = innerHeight - INSET * 2;
      const thumbH =
        max > 0 ? Math.max(MIN_H, (trackH * innerHeight) / doc.scrollHeight) : trackH;
      return { max, trackH, thumbH };
    };

    const paint = (scroll: number) => {
      const { max, trackH, thumbH } = metrics();
      thumb.style.height = `${thumbH}px`;
      const range = Math.max(trackH - thumbH, 0);
      const y = max > 0 ? (Math.min(Math.max(scroll, 0), max) / max) * range : 0;
      // 只写 transform（CSS 里刻意不对 transform 做 transition，避免跟随迟滞）
      thumb.style.transform = `translate3d(0, ${y}px, 0)`;
      rail.setAttribute(
        "aria-valuenow",
        max > 0 ? String(Math.round((y / Math.max(range, 1)) * 100)) : "0"
      );
    };

    const show = () => {
      if (metrics().max <= 0) {
        rail.style.opacity = "0";
        return;
      }
      rail.style.opacity = "1";
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!dragging) rail.style.opacity = "0";
      }, IDLE_MS);
    };

    const onScroll = () => {
      paint(scrollY);
      show();
    };
    const onResize = () => {
      paint(scrollY);
      show();
    };

    /* 拖拇指 = 按轨道比例换算成滚动距离，直接调原生 scroll（Lenis 会自行同步） */
    const onThumbDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      try {
        thumb.setPointerCapture(e.pointerId);
      } catch {
        /* 合成事件或无指针时忽略，拖拽照常走 window 监听 */
      }
      const startY = e.clientY;
      const startScroll = scrollY;
      if (hideTimer) clearTimeout(hideTimer);
      rail.style.opacity = "1";
      const move = (ev: PointerEvent) => {
        const { max, trackH, thumbH } = metrics();
        const range = Math.max(trackH - thumbH, 1);
        // instant：无视 html 的 scroll-behavior: smooth，否则每次 move 都会重启动画、拖拽迟滞
        scrollTo({ top: startScroll + ((ev.clientY - startY) / range) * max, behavior: "instant" });
      };
      const up = () => {
        dragging = false;
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", up);
        removeEventListener("pointercancel", up);
        show();
      };
      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
      addEventListener("pointercancel", up);
    };

    /* 点轨道空白 = 跳到对应位置 */
    const onRailDown = (e: PointerEvent) => {
      if (e.target !== rail) return;
      const { max, trackH } = metrics();
      if (max <= 0) return;
      const r = rail.getBoundingClientRect();
      const ratio = (e.clientY - r.top - INSET) / trackH;
      scrollTo({ top: Math.min(Math.max(ratio, 0), 1) * max, behavior: "instant" });
    };

    const onEnter = () => {
      if (metrics().max <= 0) return;
      if (hideTimer) clearTimeout(hideTimer);
      rail.style.opacity = "1";
    };
    const onLeave = () => {
      if (!dragging) show();
    };

    paint(scrollY);
    // 首屏不打扰：有滚动才现身（show 内部会判断；初次 paint 后保持隐藏直到第一次 scroll）
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    thumb.addEventListener("pointerdown", onThumbDown);
    rail.addEventListener("pointerdown", onRailDown);
    rail.addEventListener("pointerenter", onEnter);
    rail.addEventListener("pointerleave", onLeave);
    if (document.fonts) document.fonts.ready.then(() => paint(scrollY)).catch(() => {});
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      thumb.removeEventListener("pointerdown", onThumbDown);
      rail.removeEventListener("pointerdown", onRailDown);
      rail.removeEventListener("pointerenter", onEnter);
      rail.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={railRef}
      className="scroll-rail"
      data-noburst
      role="scrollbar"
      aria-orientation="vertical"
      aria-label="页面滚动条"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={thumbRef} className="scroll-thumb" data-cursor="DRAG" role="presentation" />
    </div>
  );
}
