"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Asterisk, Heart } from "lucide-react";

const LETTER = [
  "你打开了不该打开的门。",
  "恭喜，这是留给最好奇的那个人的。",
  "",
  "Superee = su per ee。",
  "su 有一个 ee，全世界独一个。",
  "",
  "2,295 km 是地理的距离，",
  "不是我们的。",
  "",
  "接下来，把这里变成离你 0 km 的地方。",
];

export default function SecretPage({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const t = setInterval(() => setStep((s) => (s < LETTER.length ? s + 1 : s)), 380);
    return () => clearInterval(t);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9996] bg-ink text-cream overflow-y-auto"
          initial={{ clipPath: "circle(0% at 50% 4%)" }}
          animate={{ clipPath: "circle(150% at 50% 4%)" }}
          exit={{ clipPath: "circle(0% at 50% 4%)" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-3xl mx-auto px-6 py-16 min-h-full flex flex-col">
            <button
              onClick={onClose}
              className="self-start rounded-full border-2 border-cream/40 px-4 py-2 text-[13px] font-bold flex items-center gap-2 hover:bg-cream hover:text-ink transition"
            >
              <ArrowLeft size={14} /> 回到主页
            </button>

            <div className="flex-1 flex flex-col justify-center py-14">
              <motion.span
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="self-start"
              >
                <Heart size={40} className="fill-sulin text-sulin animate-heartbeat" />
              </motion.span>

              <h1
                className="font-bold uppercase leading-[0.95] tracking-[-0.03em] mt-6"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(40px,8vw,92px)" }}
              >
                THE SECRET
                <br />
                <span className="text-outline-white">OF SUPEREE</span>
              </h1>

              <div className="mt-10 space-y-3">
                {LETTER.slice(0, step).map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={line.startsWith("Superee") || line.startsWith("su 有") ? "text-[19px] sm:text-[22px] font-bold text-paperee" : "text-[15px] sm:text-[17px] leading-8 opacity-85"}
                  >
                    {line || "\u00A0"}
                  </motion.p>
                ))}
              </div>
            </div>

            <div className="border-t border-cream/20 pt-6 opacity-60 text-[12px] tracking-widest flex items-center gap-2">
              <Asterisk size={12} className="text-sulin" />
              SUPEREE SECRET STATION · 你是第 1 个发现这里的人
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
