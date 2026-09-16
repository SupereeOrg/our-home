"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export default function CountUp({
  value,
  suffix = "",
  duration = 1.6,
  className = "",
  style,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [txt, setTxt] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const node = ref.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTxt(value.toLocaleString("en-US"));
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setTxt(Math.round(v).toLocaleString("en-US")),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`whitespace-nowrap ${className}`} style={style}>
      {txt}
      {suffix && <span className="text-[14px] ml-1">{suffix}</span>}
    </span>
  );
}
