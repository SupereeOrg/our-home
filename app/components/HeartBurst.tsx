"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

type Burst = { id: number; x: number; y: number };
type Particle = { dx: number; dy: number; r: number; s: number; d: number; pink: boolean };

const pre: Particle[] = Array.from({ length: 12 }, (_, i) => {
  const ang = (i / 12) * Math.PI * 2 + Math.random() * 0.6;
  const dist = 60 + Math.random() * 70;
  return {
    dx: Math.cos(ang) * dist,
    dy: Math.sin(ang) * dist - 40,
    r: Math.random() * 360 - 180,
    s: 0.5 + Math.random() * 0.9,
    d: 0.7 + Math.random() * 0.5,
    pink: i % 2 === 0,
  };
});

export default function HeartBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const idRef = useRef(0);

  const spawn = useCallback((x: number, y: number) => {
    const id = ++idRef.current;
    setBursts((b) => [...b.slice(-5), { id, x, y }]);
    setTimeout(() => setBursts((b) => b.filter((i) => i.id !== id)), 1300);
  }, []);

  useEffect(() => {
    const on = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("button, a, input, [data-noburst]")) return;
      spawn(e.clientX, e.clientY);
    };
    addEventListener("pointerdown", on);
    return () => removeEventListener("pointerdown", on);
  }, [spawn]);

  return (
    <div className="fixed inset-0 z-[9995] pointer-events-none" aria-hidden>
      <AnimatePresence>
        {bursts.map((b) => (
          <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
            {pre.map((p, i) => (
              <motion.span
                key={i}
                className="absolute"
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: 0,
                  x: p.dx * p.s,
                  y: p.dy * p.s + 60,
                  scale: p.s,
                  rotate: p.r,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: p.d, ease: [0.16, 1, 0.3, 1] }}
              >
                <Heart
                  size={16 * p.s}
                  className={p.pink ? "fill-sulin-deep text-sulin-deep" : "fill-paperee-deep text-paperee-deep"}
                />
              </motion.span>
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
