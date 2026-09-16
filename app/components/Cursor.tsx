"use client";

import { useEffect, useRef } from "react";

const IDLE_LERP = 0.18; // 外圈慢速跟随 — 延迟即高级感
const SNAP_LERP = 1;    // hover 到可点目标时：外圈瞬移吸附，保证“点哪圈在哪”
const RING = 72;        // 外圈直径（固定，scale 只在内层）
const DOT = 12;         // 圆点直径（固定）

/*
 * 设计：dot = 瞬时准星；ring = 恒定追随的描边光环。
 * 两者同一套 rAF、同一套数学（纯像素偏移，无 %-translate、无独立 scale 属性）。
 * 全程零 React 状态（label 也用命令式 DOM 更新）→ 重渲染永远不会碰坐标。
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    let active = mq.matches;
    let raf = 0;
    let running = false;
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let lerp = IDLE_LERP;
    let ringScale = 0.42;
    let last = performance.now();
    const host = document.documentElement;

    function paint(nx: number, ny: number, qx: number, qy: number) {
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${nx - DOT / 2}px, ${ny - DOT / 2}px, 0)`;
      if (ringRef.current)
        ringRef.current.style.transform =
          `translate3d(${qx - RING / 2}px, ${qy - RING / 2}px, 0) scale(${ringScale})`;
    }

    function loop(t: number) {
      if (!running) return;
      const dt = Math.min((t - last) / (1000 / 60), 3);
      last = t;
      const f = 1 - Math.pow(1 - lerp, dt);
      rx += (x - rx) * f;
      ry += (y - ry) * f;
      paint(x, y, rx, ry);
      raf = requestAnimationFrame(loop);
    }

    function enable() {
      host.classList.add("cursor-host");
      if (!running) {
        running = true;
        rx = x;
        ry = y;
        last = performance.now();
        paint(x, y, rx, ry);
        raf = requestAnimationFrame(loop);
      }
    }
    function disable() {
      host.classList.remove("cursor-host");
      running = false;
      cancelAnimationFrame(raf);
    }

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;

      const t = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor], input, textarea, select, [role='button']"
      );
      /* label 独立向上找：行内 button 命中时，仍要爬到 data-cursor 祖先取标签 */
      const labeled = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const label = labeled?.getAttribute("data-cursor") ?? null;
      /* 命令式样式：不走 React，坐标永远由本函数唯一持有 */
      /* 插曲：label 属于带 data-cursor 的祖先（如歌单行），按钮只是触发 hover 的放大 */
      lerp = (t || labeled) ? SNAP_LERP : IDLE_LERP;
      ringScale = (t || labeled) ? (label ? 1.25 : 1) : 0.42;
      if (ringRef.current) {
        ringRef.current.style.opacity = t ? "1" : "0.55";
        ringRef.current.style.borderColor = t ? "#211d1b" : "#211d1b";
        ringRef.current.style.background = label ? "rgba(33,29,27,.92)" : "transparent";
      }
      if (labelRef.current) {
        labelRef.current.textContent = label ?? "";
        labelRef.current.style.visibility = label ? "visible" : "hidden";
      }
    };

    function mqChange() {
      active = mq.matches;
      if (active) enable();
      else disable();
    }
    mq.addEventListener("change", mqChange);
    addEventListener("pointermove", move);
    if (active) enable();
    return () => {
      mq.removeEventListener("change", mqChange);
      disable();
      removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          width: RING,
          height: RING,
          borderRadius: "9999px",
          border: "1.5px solid #211d1b",
          display: "grid",
          placeItems: "center",
        }}
      >
        <span
          ref={labelRef}
          className="text-[10px] font-bold text-cream tracking-widest whitespace-nowrap"
          style={{ visibility: "hidden" }}
        />
      </div>
      <div ref={dotRef} className="cursor-dot" style={{ width: DOT, height: DOT }} />
    </>
  );
}
