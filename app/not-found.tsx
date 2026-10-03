"use client";

import { useEffect, useState } from "react";
import { Link } from "next-view-transitions";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TopBar from "./components/TopBar";

const EASE = [0.22, 1, 0.36, 1] as const;

/* 入场和首页同一门手艺：rise（y30 虚化升起）+ 逐行错开。
   跨路由那层 View Transitions 早就自动吃了，这里只补直达时的入场。
   不自动跳（抢方向盘是 UX 共识里的坏味道），留两个去处让用户选。 */
const parent = {
  enter: {},
  center: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const rise = {
  enter: { y: 30, opacity: 0, filter: "blur(6px)" },
  center: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

/* 走丢的一页：写成纸房子的语气，不抛默认 404 */
export default function NotFound() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const body = (
    <>
      <motion.p variants={rise} className="kicker opacity-50">走丢的一页</motion.p>
      <motion.h1 variants={rise} className="font-black mt-6 text-balance leading-[1.15]" style={{ fontSize: "clamp(32px,5.5vw,52px)" }}>
        这页纸，被风吹走了。
      </motion.h1>
      <motion.p variants={rise} className="mt-6 text-[15px] leading-8 opacity-70">
        八页纸只有八页，这一页不在里面。
        <br />
        要么回去接着翻，要么——写一封新的，把它补上。
      </motion.p>
      <motion.div variants={rise} className="mt-10 flex items-center justify-center gap-8 text-[13px]">
        <Link href="/" className="inline-flex items-center gap-2 py-3 font-bold opacity-80 hover:opacity-100 transition-opacity">
          <ArrowLeft size={14} aria-hidden /> 回八页纸
        </Link>
        <Link href="/letters" className="inline-flex items-center gap-2 py-3 font-bold opacity-60 hover:opacity-100 transition-opacity">
          全部信件 <ArrowRight size={14} aria-hidden />
        </Link>
      </motion.div>
    </>
  );

  return (
    <main className="no-round relative min-h-[100svh] flex items-center justify-center">
      <TopBar />
      {reduced ? (
        <article className="relative w-full max-w-2xl mx-auto px-6 py-24 text-center">{body}</article>
      ) : (
        <motion.article variants={parent} initial="enter" animate="center" className="relative w-full max-w-2xl mx-auto px-6 py-24 text-center">
          {body}
        </motion.article>
      )}
    </main>
  );
}
