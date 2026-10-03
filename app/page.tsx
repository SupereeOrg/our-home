"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { PLAYLIST } from "./components/playlist-data";
import { STATS } from "@/lib/stats";
import TopBar from "./components/TopBar";
import LetterRow from "./components/LetterRow";
import type { LetterMeta } from "@/lib/letters";

const TOTAL = 8;
const TITLES = ["封面", "纸片君", "苏淋", "数字", "故事", "歌与天", "信", "日常"];

/* 翻页手感常量（触屏阈值单独更小；锁保护动画重叠，桌面手机同一只） */
const LOCK_MS = 1100;
const WHEEL_TH = 24;
const TOUCH_TH = 48;

/* 彩蛋序列：上上下下左右左右ba，和翻页共用一只 onKey，输码途中不翻页 */
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const NUMBERS = [
  { n: STATS.distanceKm, u: "km", label: "广州 ↔ 拉萨", soft: undefined },
  { n: STATS.messages, u: "条", label: "聊过的消息", soft: "bg-green-soft" },
  { n: STATS.goodNights, u: "次", label: "互道的晚安", soft: "bg-pink-soft" },
  { n: STATS.words, u: "字", label: "写下的字", soft: undefined, dark: true },
];

const STORY: { d: string; t: string; p: string; hlTitle?: boolean; hlTail?: string }[] = [
  { d: "2026 · 07 · 28", t: "两句招呼", p: "“我是 su” / “原来我是 ee 吗”——名字就这么定下了。" },
  { d: "2026 · 08 · 28", t: "重新开始", p: "一个人先开口，故事按下重启键。" },
  { d: "2026 · 09 · 03", t: "谁先说晚安", p: "那晚 su 先说了晚安，ee 接了下半句。从此每晚都有人接——一共 85 个。" },
  { d: "SOON", t: "第一次见面", p: "“等不及了，来找 ee 了怎么办。”——那就把 2,295 km 走成 0 km。", hlTitle: true, hlTail: "0 km" },
];

const LETTER = [
  "你翻到了不该翻的那一页。",
  "Superee = su per ee。su 有一个 ee，全世界独一个。",
  "2,295 km，是地图的事。",
  "seeu：s 和 u 把 ee 抱在中间，念出来是 see you。",
  "接下来，把这里变成离你 0 km 的地方。",
];

function useWeather() {
  const [data, setData] = useState<{ gz: number; lsa: number } | null>(null);
  useEffect(() => {
    /* 10 分钟 session 缓存：翻页/重进不再打扰 open-meteo */
    try {
      const raw = sessionStorage.getItem("paperee-weather");
      if (raw) {
        const cached = JSON.parse(raw) as { at: number; data: { gz: number; lsa: number } };
        if (
          typeof cached?.at === "number" &&
          typeof cached?.data?.gz === "number" &&
          typeof cached?.data?.lsa === "number" &&
          Date.now() - cached.at < 10 * 60 * 1000
        ) {
          setData(cached.data);
          return;
        }
      }
    } catch {
      /* 无痕模式等直接走网络 */
    }
    const ac = new AbortController();
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=23.13,29.65&longitude=113.26,91.14&current=temperature_2m",
      { signal: ac.signal }
    )
      .then((r) => r.json())
      .then((j) => {
        const arr = Array.isArray(j) ? j : [j];
        const next = {
          gz: Math.round(arr[0]?.current?.temperature_2m ?? 27),
          lsa: Math.round(arr[1]?.current?.temperature_2m ?? arr[0]?.current?.temperature_2m ?? 12),
        };
        setData(next);
        try {
          sessionStorage.setItem("paperee-weather", JSON.stringify({ at: Date.now(), data: next }));
        } catch {
          /* 存不下就算了 */
        }
      })
      .catch(() => {
        if (!ac.signal.aborted) setData({ gz: 27, lsa: 12 });
      });
    return () => ac.abort();
  }, []);
  return data;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/* 整页：方向感知的纸张浮动 — 位移 + 缩放 + 模糊三轨并行 */
const pageVariants = {
  enter: (dir: number) => ({ y: dir >= 0 ? 96 : -96, opacity: 0, scale: 0.985, filter: "blur(12px)" }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE, staggerChildren: 0.09, delayChildren: 0.12 },
  },
  exit: (dir: number) => ({
    y: dir >= 0 ? -96 : 96,
    opacity: 0,
    scale: 1.015,
    filter: "blur(12px)",
    transition: { duration: 0.55, ease: EASE },
  }),
};

/* 子元素：父级透下来的 variants，不自带 animate，靠 section 驱动 */
const rise = {
  enter: { y: 30, opacity: 0, filter: "blur(6px)" },
  center: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
  exit: { y: -18, opacity: 0, filter: "blur(6px)", transition: { duration: 0.35, ease: EASE } },
};

const maskInner = {
  enter: { y: "115%" },
  center: { y: "0%", transition: { duration: 0.9, ease: EASE } },
  exit: { y: "-30%", opacity: 0, transition: { duration: 0.35, ease: EASE } },
};

const imgReveal = {
  enter: { opacity: 0, scale: 1.1, filter: "blur(8px)" },
  center: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1.1, ease: EASE } },
  exit: { opacity: 0, scale: 1.04, transition: { duration: 0.35 } },
};

const lineGrow = {
  enter: { scaleX: 0, opacity: 0 },
  center: { scaleX: 1, opacity: 1, transition: { duration: 0.8, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

/* 数字专属：落账 — 框固定，芯原地显影逐格错开 */
const numCell = {
  enter: { opacity: 0, scale: 0.94, filter: "blur(10px)" },
  center: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE, delay: 0.15 + i * 0.1 },
  }),
  exit: { opacity: 0, scale: 0.97, filter: "blur(6px)", transition: { duration: 0.3, ease: EASE } },
};

/* Hero 双色大字：逐字母遮罩升起，第一版 Reveal 的纸面版 */
const heroWord = {
  enter: {},
  center: { transition: { staggerChildren: 0.045, delayChildren: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const heroChar = {
  enter: { y: "115%" },
  center: { y: "0%", transition: { duration: 0.85, ease: EASE } },
  exit: { y: "-25%", opacity: 0, transition: { duration: 0.3, ease: EASE } },
};

function HeroChars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <motion.span key={`${ch}-${i}`} variants={heroChar} className="inline-block will-change-transform">
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </>
  );
}

/* 数字滚动：挂载即从 0 滚到目标，纸上记账感 */
function CountUp({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n.toLocaleString("en-US")}</>;
}

/* 第七页预告：数据由首页预取，这里只管呈现；null 即纸面 skeleton */
function LatestLetters({ letters }: { letters: LetterMeta[] | null }) {
  if (letters === null) {
    return (
      <div className="mt-6 border-t rule" aria-busy="true" aria-label="正在拆信">
        {[68, 82, 55].map((w, i) => (
          <div key={i} className="py-3.5 border-b rule">
            <div className="skeleton-bar w-24" />
            <div className="skeleton-bar mt-2" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    );
  }
  if (letters.length === 0) {
    return <p className="mt-6 text-[13px] opacity-60">还没有信。去 <Link href="/letters" className="underline underline-offset-4">我们的信</Link> 写第一封吧。</p>;
  }
  return (
    <motion.div variants={rise} className="mt-6 border-t rule">
      {letters.map((l, i) => (
        <LetterRow key={l.slug} l={l} index={i} />
      ))}
    </motion.div>
  );
}
function Eq() {
  return (
    <span className="flex items-end gap-[3px] h-3.5 shrink-0" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[2.5px] bg-current origin-bottom"
          animate={{ scaleY: [0.3, 1, 0.45, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.18, ease: "easeInOut" }}
          style={{ height: "100%" }}
        />
      ))}
    </span>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col justify-center px-6 sm:px-10 pt-20">
      <div className="max-w-4xl mx-auto w-full sm:pr-20 xl:pr-0">{children}</div>
    </div>
  );
}

/* 头像：全站同一套 256 源 + 直出原图（已是 webp，不走 _next/image），src 一致即缓存命中。
   显示尺寸走 style，intrinsic 固定，避免 w=52/76 拆成两个优化 URL。
   只有封面首枚 preload，其余 eager 不抢 LCP。 */
function Avatar({ src, alt, size = 76, className = "", eager }: { src: string; alt: string; size?: number; className?: string; eager?: boolean }) {
  return (
    <motion.span variants={imgReveal} className={`block overflow-hidden border border-ink shrink-0 ${className}`} style={{ width: size, height: size }}>
      {eager ? (
        <Image src={src} alt={alt} width={256} height={256} priority unoptimized className="object-cover" style={{ width: size, height: size }} />
      ) : (
        <Image src={src} alt={alt} width={256} height={256} unoptimized loading="eager" className="object-cover" style={{ width: size, height: size }} />
      )}
    </motion.span>
  );
}

/* 大标题：遮罩升起，全站同一句式 */
function PageH2({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <span className={`mask block ${small ? "mt-3" : "mt-4"}`}>
      <motion.h2
        variants={maskInner}
        className={`mask-inner font-black ${small ? "" : "text-balance"}`}
        style={{ fontSize: small ? "clamp(22px,3vw,32px)" : "clamp(30px,4.5vw,52px)" }}
      >
        {children}
      </motion.h2>
    </span>
  );
}

/* 人物页：ee / su 同构，只换文案图片 */
function PersonPage({ kicker, avatar, avatarAlt, word, meta, quote, tags }: {
  kicker: string; avatar: string; avatarAlt: string; word: string; meta: string; quote: string; tags: string;
}) {
  return (
    <PageShell>
      <motion.p variants={rise} className="kicker opacity-60">{kicker}</motion.p>
      <div className="flex items-center gap-4 mt-5">
        <Avatar src={avatar} alt={avatarAlt} />
        <span className="mask">
          <motion.h2 variants={maskInner} className="mask-inner font-black leading-none" style={{ fontSize: "clamp(56px,8vw,112px)" }}>
            {word}
          </motion.h2>
        </span>
      </div>
      <motion.p variants={rise} className="mt-5 text-[14px] font-bold">{meta}</motion.p>
      <motion.p variants={rise} className="mt-3 text-[17px] leading-9 max-w-[480px]">{quote}</motion.p>
      <motion.p variants={rise} className="mt-6 border-t rule pt-4 text-[13px] tracking-wide opacity-70">{tags}</motion.p>
    </PageShell>
  );
}

// 每页底色：透明 = 纸色(body)，有色页全屏通顶，顶栏全透明才不炸
const PAGE_BG: (string | undefined)[] = [undefined, "#dee4d5", "#f1ddd8", undefined, undefined, undefined, undefined, undefined];

export default function Home() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [secret, setSecret] = useState(false);
  const [track, setTrack] = useState<number | null>(null);
  const [audioFail, setAudioFail] = useState(false);
  const lock = useRef(false);
  const konami = useRef(0);
  const touchY = useRef<number | null>(null);
  const touchScroller = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [reduced, setReduced] = useState(false);
  /* 动效总开关：auto 跟随系统，full/flat 是用户手选（localStorage 持久）。
     对方手机若开了“减弱动态效果”，进站即平铺版，但点一下就能翻页。 */
  const [motionOverride, setMotionOverride] = useState<"auto" | "full" | "flat">("auto");
  const weather = useWeather();
  const router = useRouter();
  /* 路由 + 图片双预热：顶栏移动端链接不在视口不触发自动 prefetch，这里手动暖一次；
     人物两张翻页即见，进站即用 Image 对象预下，翻页缓存命中，不再先框后图 */
  useEffect(() => {
    router.prefetch("/letters");
    for (const src of ["/avatars/paperee-256.webp", "/avatars/sulin-256.webp", "/avatars/mix-256.webp"]) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    }
  }, [router]);
  /* 信预告：进站即取，用户翻到第七页时大概率已就绪 */
  const [letters, setLetters] = useState<LetterMeta[] | null>(null);
  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/letters", { signal: ac.signal })
      .then((r) => r.json())
      .then((j) => setLetters(Array.isArray(j) ? j.slice(0, 3) : []))
      .catch(() => {
        if (!ac.signal.aborted) setLetters([]);
      });
    return () => ac.abort();
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem("paperee-motion");
      if (v === "full" || v === "flat") setMotionOverride(v);
    } catch {
      /* 无痕模式：跟随系统 */
    }
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const calm = motionOverride === "flat" ? true : motionOverride === "full" ? false : reduced;
  const setMotion = (m: "full" | "flat") => {
    setMotionOverride(m);
    try {
      localStorage.setItem("paperee-motion", m);
    } catch {
      /* 存不下就算了，本次生效 */
    }
  };

  const go = useCallback(
    (next: number) => {
      const n = Math.max(0, Math.min(TOTAL - 1, next));
      if (n === page) return;
      setDir(n > page ? 1 : -1);
      setPage(n);
      if (typeof window !== "undefined") history.replaceState(null, "", `#p${n + 1}`);
    },
    [page]
  );

  const step = useCallback(
    (d: number) => {
      if (lock.current || secret || calm) return;
      lock.current = true;
      go(page + d);
      setTimeout(() => (lock.current = false), LOCK_MS);
    },
    [go, page, secret, calm]
  );

  /* 初载 hash + 减弱动效时恢复自然滚动 */
  useEffect(() => {
    const m = location.hash.match(/p([1-8])/);
    if (m) {
      const n = Number(m[1]) - 1;
      if (n >= 0 && n < TOTAL) {
        setPage(n);
      }
    }
    if (calm) document.body.classList.add("allow-scroll");
    return () => document.body.classList.remove("allow-scroll");
  }, [calm]);

  /* 桌面滚轮 / 键盘 / 触摸翻页（Konami 并入同一只 onKey：序列进行中吞掉翻页，输完开信；
     原先两只监听各干各的，输码时页面跟着乱翻） */
  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onWheel = (e: WheelEvent) => {
      if (calm || !fine || secret) return;
      /* 落在内部滚动盒里且还能滚：把滚轮让给盒子 */
      const scroller = (e.target as HTMLElement | null)?.closest?.("[data-scroll]") as HTMLElement | null;
      if (scroller) {
        const can = e.deltaY > 0
          ? scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1
          : scroller.scrollTop > 0;
        if (can) return;
      }
      if (Math.abs(e.deltaY) < WHEEL_TH) return;
      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (secret) {
        if (e.key === "Escape") setSecret(false);
        return;
      }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === KONAMI[konami.current]) {
        konami.current++;
        if (konami.current === KONAMI.length) {
          konami.current = 0;
          setSecret(true);
        } else if (k.startsWith("Arrow")) {
          e.preventDefault();
        }
        return;
      }
      konami.current = k === KONAMI[0] ? 1 : 0;
      if (calm) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(TOTAL - 1);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (calm) return;
      touchY.current = e.touches[0].clientY;
      touchScroller.current = (e.target as HTMLElement | null)?.closest?.("[data-scroll]") as HTMLElement | null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (calm || touchY.current === null || secret) return;
      const dy = touchY.current - e.changedTouches[0].clientY;
      const sc = touchScroller.current;
      touchScroller.current = null;
      touchY.current = null;
      /* 起点在滚动盒里且盒子还能吃掉这次滑动：不翻页 */
      if (sc) {
        const can = dy > 0
          ? sc.scrollTop + sc.clientHeight < sc.scrollHeight - 1
          : sc.scrollTop > 0;
        if (can) return;
      }
      if (Math.abs(dy) > TOUCH_TH) step(dy > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [step, go, secret, calm]);

  const toggleTrack = (i: number) => {
    setAudioFail(false);
    if (track === i) {
      audioRef.current?.pause();
      audioRef.current = null;
      setTrack(null);
      return;
    }
    audioRef.current?.pause();
    const a = new Audio(PLAYLIST[i].preview);
    audioRef.current = a;
    a.play()
      .then(() => setTrack(i))
      /* iTunes token 过期/断网：静默失败改明示，去 App 里听 */
      .catch(() => {
        setTrack(null);
        setAudioFail(true);
      });
  };
  useEffect(() => () => audioRef.current?.pause(), []);

  if (calm) {
    return (
      <main className="no-round">
        <TopBar />
        <article className="max-w-2xl mx-auto px-6 pt-24 pb-20">
          <p className="p-4 border border-ink text-[13px] leading-7 opacity-70">
            已为你关闭翻页动效，以下是八页的平铺阅读版。
            <button
              type="button"
              onClick={() => setMotion("full")}
              className="ml-2 font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              还是想翻页 →
            </button>
          </p>

          <section className="mt-12">
            <p className="kicker opacity-60">封面 · 广州 ↔ 拉萨 · {STATS.distanceKm.toLocaleString("en-US")} km</p>
            <h1 className="font-black mt-4" style={{ fontSize: "clamp(44px,8vw,88px)" }}>纸片君<br />与苏淋</h1>
            <p className="kicker mt-4 opacity-60">PAPEREE × SULIN — 八页纸</p>
            <p className="mt-4 text-[15px] leading-8 opacity-80">一个在海边，一个在高原。往下翻就是了。</p>
          </section>

          {[
            { k: "其一 · 纸片君 PAPEREE", w: "ee", meta: "广州 · 海边 — 在广州上学", q: "“表情丰富，撒娇从不缺席。熬夜的时候除外——那时满脑子都是 su。”", t: "喝茶 · 分享歌 · 撒娇冠军 · 熬夜冠军" },
            { k: "其二 · 苏淋 SULIN", w: "su", meta: "河北唐山 — 现居拉萨 · 在读", q: "“话多主动，报备从不缺席。游泳的时候除外——那时满脑子都是 ee。”", t: "游泳 · 王者荣耀 · 收集想法 · 早睡" },
          ].map((p) => (
            <section key={p.k} className="mt-12 border-t rule pt-8">
              <p className="kicker opacity-60">{p.k}</p>
              <h2 className="font-black mt-3" style={{ fontSize: "clamp(40px,7vw,72px)" }}>{p.w}</h2>
              <p className="mt-3 text-[14px] font-bold">{p.meta}</p>
              <p className="mt-2 text-[15px] leading-8 opacity-80">{p.q}</p>
              <p className="mt-3 text-[13px] opacity-60">{p.t}</p>
            </section>
          ))}

          <section className="mt-12 border-t rule pt-8">
            <p className="kicker opacity-60">其三 · 数字 NUMBERS</p>
            <h2 className="font-black mt-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>都数过了。</h2>
            <div className="grid grid-cols-2 border border-ink mt-6">
              {NUMBERS.map((s, i) => (
                <div key={s.label} className={`${i % 2 === 0 ? "border-r rule" : ""} ${i < 2 ? "border-b rule" : ""} p-5`}>
                  <p className="font-black tabular-nums text-[26px]">{s.n.toLocaleString("en-US")}<span className="text-[13px] ml-1">{s.u}</span></p>
                  <p className="text-[13px] mt-1 font-bold opacity-70">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 border-t rule pt-8">
            <p className="kicker opacity-60">其四 · 故事 STORY</p>
            <h2 className="font-black mt-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>四行，就够。</h2>
            <div className="mt-4">
              {STORY.map((t) => (
                <div key={t.d} className="py-3 border-b rule">
                  <p className="kicker opacity-50">{t.d} · {t.t}</p>
                  <p className="text-[14px] leading-7 mt-1 opacity-80">{t.p}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 border-t rule pt-8">
            <p className="kicker opacity-60">其五 · 歌与天 MUSIC & SKIES</p>
            <h2 className="font-black mt-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>耳机分你一只。</h2>
            <ol className="mt-4 space-y-2">
              {PLAYLIST.map((t, i) => (
                <li key={t.q} className="text-[14px]"><span className="tabular-nums opacity-50">{String(i + 1).padStart(2, "0")}</span> · <strong>{t.track}</strong> <span className="opacity-60">{t.artist}</span></li>
              ))}
            </ol>
            <p className="mt-4 text-[13px] opacity-70">广州 {weather ? `${weather.gz}°` : "––"} / 拉萨 {weather ? `${weather.lsa}°` : "––"}。出门前，先看看对方头顶是什么天。</p>
          </section>

          <section className="mt-12 border-t rule pt-8">
            <p className="kicker opacity-60">其六 · 信 LETTERS</p>
            <h2 className="font-black mt-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>信在写，纸会厚。</h2>
            <p className="mt-3 text-[14px] leading-8 opacity-80">想到就写，写完就放这。<Link href="/letters" className="underline underline-offset-4">去我们的信 <ArrowRight size={13} aria-hidden className="inline -mt-0.5" /></Link></p>
          </section>

          <section className="mt-12 border-t rule pt-8">
            <p className="kicker opacity-60">其终 · 日常 FINALE</p>
            <h2 className="font-black mt-3" style={{ fontSize: "clamp(28px,5vw,44px)" }}>“汽水分你一半。”</h2>
            <p className="mt-3 text-[14px] leading-8 opacity-80">Superee = su per ee —— su 有一个 ee，全世界独一个。{STATS.messages.toLocaleString("en-US")} 条消息，{STATS.stickers.toLocaleString("en-US")} 个表情，广州 · 唐山 · 拉萨，都在这一页。</p>
            <p className="mt-6 text-[12px] opacity-50">© 2026 八页纸 · 广州 ↔ 拉萨</p>
          </section>
        </article>
      </main>
    );
  }

  return (
    <motion.main
      className="no-round relative h-[100svh] overflow-hidden"
      initial={false}
      animate={{ backgroundColor: PAGE_BG[page] ?? "#f7f3ec" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {/* 纸纹颗粒 + 四角暗角，氛围不抢字 */}
      <div aria-hidden className="grain" />
      <div aria-hidden className="vignette" />
      {/* 顶栏 — 全站统一骨架，右插槽放页码 */}
      <TopBar
        onLogoClick={() => go(0)}
        right={
          <span className="kicker tabular-nums opacity-40 overflow-hidden inline-flex">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={page}
                initial={{ y: 12, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -12, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {String(page + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")} — {TITLES[page]}
              </motion.span>
            </AnimatePresence>
          </span>
        }
      />

      {/* 右侧章节导航 — layoutId 让活动横线在章节间滑行 */}
      <nav className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-end gap-5" aria-label="章节导航">
        {TITLES.map((t, i) => {
          const active = i === page;
          return (
            <button
              key={t}
              title={`${String(i + 1).padStart(2, "0")} · ${t}`}
              onClick={() => go(i)}
              className="chapter-nav group flex items-center gap-3"
              aria-current={active ? "page" : undefined}
            >
              <span className={`kicker transition-all duration-500 ${active ? "opacity-90 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"}`}>
                {t}
              </span>
              <span className={`text-[10px] tabular-nums tracking-widest transition-opacity duration-300 ${active ? "opacity-90 font-bold" : "opacity-35 group-hover:opacity-70"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {active ? (
                <motion.span layoutId="chap-active" className="block h-px w-10 bg-ink" transition={{ duration: 0.55, ease: EASE }} />
              ) : (
                <span className="block h-px w-4 bg-ink/25 group-hover:w-7 group-hover:bg-ink/60 transition-all duration-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 顶部章节轨 — 八页纸的书口，走到哪黑到哪；同时是手机唯一的可点翻页入口 */}
      <nav className="absolute top-0 left-0 right-0 z-30 flex gap-[2px]" aria-label="章节">
        {TITLES.map((t, i) => (
          <button
            key={t}
            onClick={() => go(i)}
            aria-label={`${String(i + 1).padStart(2, "0")} · ${t}`}
            aria-current={i === page ? "page" : undefined}
            className="flex-1 py-3 -my-3 touch-manipulation"
          >
            <span className="relative block h-[3px] bg-ink/10 overflow-hidden" aria-hidden>
              <motion.span
                className="absolute inset-0 bg-ink origin-left"
                initial={false}
                animate={{ scaleX: i <= page ? 1 : 0 }}
                transition={{ duration: 0.55, ease: EASE }}
              />
            </span>
          </button>
        ))}
      </nav>

      {/* 页面 — 底色由 main 整洗，section 只管浮动 + stagger 透传 */}
      {/* AnimatePresence 的 custom={dir} 禁删：exit  variant 吃的是它，不是 section 身上的；
          删掉后反向翻页的离场会沿用进场旧方向（3→2 播成下滚），2026-10 已踩坑 */}
      <div className="h-full">
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.section
            key={page}
            custom={dir}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="h-full will-change-transform"
          >
            {page === 0 && (
              <PageShell>
                <div className="relative">
                  {/* 环境：一纸两染 + 一线极光 + 幽灵里程 */}
                  <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(222,228,213,0.6) 0%, rgba(247,243,236,0) 48%), linear-gradient(315deg, rgba(241,221,216,0.6) 0%, rgba(247,243,236,0) 48%)",
                      }}
                    />
                    <motion.div
                      className="absolute left-[-20%] right-[-20%] top-[6%] h-[220px]"
                      style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.75) 0%, transparent 70%)", filter: "blur(30px)" }}
                      animate={{ x: [0, 60, 0] }}
                      transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
                    />
                    <span
                      className="absolute bottom-[-3%] right-[1%] font-bold leading-none tabular-nums select-none"
                      style={{ fontFamily: "'Space Grotesk','Noto Serif SC',sans-serif", fontSize: "clamp(120px,22vw,260px)", color: "transparent", WebkitTextStroke: "1px rgba(35,32,28,0.14)" }}
                    >
                      2295
                    </span>
                  </div>

                  <motion.p variants={rise} className="kicker flex items-center gap-2"><MapPin size={13} aria-hidden /> 广州 ↔ 拉萨 · {STATS.distanceKm.toLocaleString("en-US")} km</motion.p>

                  <motion.h1
                    variants={heroWord}
                    className="mt-5 font-bold uppercase leading-[0.9] tracking-[-0.03em]"
                    style={{ fontFamily: "'Space Grotesk','Noto Serif SC',sans-serif", fontSize: "clamp(58px,11vw,152px)" }}
                    aria-label="PAPEREE × SULIN"
                  >
                    <span className="mask pb-1">
                      <span className="mask-inner">
                        <span className="hl-display hl-green">
                          <HeroChars text="PAPEREE" />
                        </span>
                      </span>
                    </span>
                    <span className="mask pb-2">
                      <span className="mask-inner flex items-baseline gap-4">
                        <span className="text-stroke font-medium" style={{ fontSize: "0.72em" }}>
                          <HeroChars text="×" />
                        </span>
                        <span className="hl-display hl-pink text-stroke">
                          <HeroChars text="SULIN" />
                        </span>
                      </span>
                    </span>
                  </motion.h1>

                  <motion.p variants={rise} className="mt-5 text-[15px] leading-8 tracking-[0.18em] sm:tracking-[0.35em] font-black">
                    纸片君 <span className="opacity-30 font-normal">与</span> 苏淋
                    <span className="kicker ml-4 opacity-50 tracking-[0.28em]">八页纸 · EIGHT PAGES</span>
                  </motion.p>

                  <motion.div variants={rise} className="flex items-center gap-5 mt-8 border-t rule pt-6">
                    <span className="flex items-center shrink-0">
                      <Avatar src="/avatars/paperee-256.webp" alt="纸片君" size={52} eager />
                      <Avatar src="/avatars/mix-256.webp" alt="合体徽章" size={52} className="-ml-3" />
                      <Avatar src="/avatars/sulin-256.webp" alt="苏淋" size={52} className="-ml-3" />
                    </span>
                    <p className="text-[14px] leading-7 max-w-[420px] opacity-80">一个在海边，一个在高原。往下翻就是了。</p>
                  </motion.div>
                </div>
              </PageShell>
            )}

            {page === 1 && (
              <PersonPage
                kicker="其一 · 纸片君 PAPEREE"
                avatar="/avatars/paperee-256.webp"
                avatarAlt="纸片君"
                word="ee"
                meta="广州 · 海边 — 在广州上学"
                quote="“表情丰富，撒娇从不缺席。熬夜的时候除外——那时满脑子都是 su。”"
                tags="喝茶 · 分享歌 · 撒娇冠军 · 熬夜冠军"
              />
            )}

            {page === 2 && (
              <PersonPage
                kicker="其二 · 苏淋 SULIN"
                avatar="/avatars/sulin-256.webp"
                avatarAlt="苏淋"
                word="su"
                meta="河北唐山 — 现居拉萨 · 在读"
                quote="“话多主动，报备从不缺席。游泳的时候除外——那时满脑子都是 ee。”"
                tags="游泳 · 王者荣耀 · 收集想法 · 早睡"
              />
            )}

            {page === 3 && (
              <PageShell>
                <motion.p variants={rise} className="kicker opacity-60">其三 · 数字 NUMBERS</motion.p>
                <PageH2>都数过了。</PageH2>
                <motion.p variants={rise} className="mt-2 text-[13px] opacity-60">从 {STATS.messages.toLocaleString("en-US")} 条消息里，一个个数出来的。</motion.p>
                <div className="grid grid-cols-2 border border-ink mt-6">
                  {NUMBERS.map((s, i) => (
                    <div
                      key={s.label}
                      className={`${i % 2 === 0 ? "border-r rule" : ""} ${i < 2 ? "border-b rule" : ""} ${s.dark ? "bg-ink text-paper" : s.soft ?? ""}`}
                    >
                      <motion.div variants={numCell} custom={i} className="p-4 sm:p-7">
                        <span className={`text-[10px] tabular-nums tracking-[0.2em] ${s.dark ? "opacity-50" : "opacity-40"}`}>0{i + 1}</span>
                        <p className="font-black tabular-nums mt-1" style={{ fontSize: "clamp(24px,3.8vw,44px)" }} aria-label={`${s.n} ${s.u}${s.label}`}><span aria-hidden><CountUp value={s.n} /></span><span className="text-[13px] ml-1 font-bold">{s.u}</span></p>
                        <p className="text-[13px] mt-1.5 font-bold opacity-70">{s.label}</p>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </PageShell>
            )}

            {page === 4 && (
              <PageShell>
                <motion.p variants={rise} className="kicker opacity-60">其四 · 故事 STORY</motion.p>
                <PageH2>四行，就够。</PageH2>
                <div className="relative mt-6">
                  {/* 时间线：圆点与日期同处一行盒，flex 居中，圆心恒为 x=5.5 穿在线上 */}
                  <motion.span variants={lineGrow} className="absolute left-[5px] top-2 bottom-2 w-px bg-ink/15 origin-top" />
                  {STORY.map((t, si) => {
                    const last = si === STORY.length - 1;
                    return (
                      <motion.div
                        key={t.d}
                        variants={rise}
                        className="grid sm:grid-cols-[150px_120px_1fr] gap-1 sm:gap-5 py-3.5 items-baseline"
                      >
                        <span className="flex items-center gap-[13px]">
                          <span className={`block h-[11px] w-[11px] shrink-0 rounded-full ${last ? "bg-[#ffdd33] ring-1 ring-ink/60" : "bg-ink/60"}`} />
                          <span className="kicker opacity-50">{t.d}</span>
                        </span>
                        <strong className="text-[16px] pl-6 sm:pl-0">
                          {t.hlTitle ? <span className="hl hl-yellow">{t.t}</span> : t.t}
                          <span className="text-[10px] tabular-nums ml-1 font-normal opacity-35">0{si + 1}</span>
                        </strong>
                        <span className="text-[13px] leading-7 opacity-80 pl-6 sm:pl-0">
                          {t.hlTail ? (
                            <>{t.p.split(t.hlTail)[0]}<span className="hl hl-yellow font-bold">{t.hlTail}</span>{t.p.split(t.hlTail)[1]}</>
                          ) : (
                            t.p
                          )}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.p variants={rise} className="mt-5 pl-6 sm:pl-0 text-[13px] italic opacity-60">“一个把日子过成诗，一个把生活过成歌。”</motion.p>
              </PageShell>
            )}

            {page === 5 && (
              <PageShell>
                <motion.p variants={rise} className="kicker opacity-60">其五 · 歌与天 MUSIC & SKIES</motion.p>
                <PageH2>耳机分你一只。</PageH2>
                <motion.p variants={rise} className="mt-2 text-[13px] opacity-60">点一行，听三十秒。音量你定。</motion.p>
                <div className="grid sm:grid-cols-[1.1fr_0.9fr] gap-3 sm:gap-5 mt-5">
                  <motion.div variants={rise} className="border border-ink overflow-hidden">
                    <div data-scroll className="playlist-scroll overflow-y-auto overscroll-contain max-h-[26vh] sm:max-h-[36vh]" style={{ touchAction: "pan-y" }}>
                      {PLAYLIST.map((t, i) => (
                        <motion.button
                          key={t.q}
                          variants={rise}
                          onClick={() => toggleTrack(i)}
                          aria-pressed={track === i}
                          aria-label={`试听${t.track}，${t.artist}`}
                          className={`group w-full flex items-center gap-3 px-3.5 py-2.5 text-left border-b rule last:border-b-0 transition-colors duration-200 ${track === i ? "bg-ink text-paper" : "hover:bg-black/[0.04]"}`}
                        >
                          <span className="block w-10 h-10 overflow-hidden border border-current shrink-0 opacity-90">
                            <Image src={t.art} alt={t.track} width={40} height={40} unoptimized sizes="40px" loading={i < 3 ? "eager" : "lazy"} className="object-cover w-10 h-10" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13.5px] font-bold truncate">{String(i + 1).padStart(2, "0")} · {t.track}</span>
                            <span className="block text-[11.5px] opacity-55 truncate">{t.artist}</span>
                          </span>
                          {track === i ? <Eq /> : <span className="text-[11px] opacity-45 group-hover:opacity-90 transition-opacity duration-200 shrink-0 tracking-[0.2em]">试听</span>}
                        </motion.button>
                      ))}
                    </div>
                    <p className="px-4 py-2 text-[11px] opacity-55 border-t rule">14 首 · iTunes 30 秒试听 · 盒内可滚</p>
                    {audioFail && (
                      <p role="alert" className="px-4 py-2 text-[11px] font-bold border-t rule">
                        这首试听开不开了，去音乐 App 里搜歌名听吧。
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={rise} className="flex flex-col gap-3">
                    {[
                      { city: "广州", en: "GUANGZHOU", alt: "11M", wash: "bg-green-soft", temp: weather?.gz, who: "ee 头顶的天 · 海边" },
                      { city: "拉萨", en: "LHASA", alt: "3656M", wash: "bg-pink-soft", temp: weather?.lsa, who: "su 头顶的天 · 高原" },
                    ].map((c) => (
                      <div key={c.city} className={`border border-ink p-4 ${c.wash}`}>
                        <p className="kicker opacity-60">{c.city} · {c.en} · {c.alt}</p>
                        <p className="mt-1 font-black tabular-nums leading-none" style={{ fontSize: "clamp(30px,4vw,48px)" }}>{c.temp !== undefined ? `${c.temp}°` : "––"}</p>
                        <p className="mt-1 text-[12px] opacity-65">{c.who}</p>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </PageShell>
            )}

            {page === 6 && (
              <PageShell>
                <motion.p variants={rise} className="kicker opacity-60">其六 · 信 LETTERS</motion.p>
                <PageH2>信在写，纸会厚。</PageH2>
                <motion.p variants={rise} className="mt-2 text-[13px] opacity-60">想到就写，写完就放这。最新的三封先拆：</motion.p>
                <LatestLetters letters={letters} />
                <motion.div variants={rise} className="mt-5">
                  <Link href="/letters" className="inline-flex items-center gap-2 py-2 text-[14px] font-bold underline underline-offset-8 decoration-1 hover:opacity-70 transition-opacity">
                    全部信件 <ArrowRight size={14} aria-hidden />
                  </Link>
                </motion.div>
              </PageShell>
            )}

            {page === 7 && (
              <PageShell>
                <motion.p variants={rise} className="kicker opacity-60">其终 · 日常 FINALE</motion.p>
                <motion.p
                  variants={rise}
                  className="mt-4 font-bold uppercase leading-none tracking-[-0.02em] whitespace-nowrap"
                  style={{ fontFamily: "'Space Grotesk','Noto Serif SC',sans-serif", fontSize: "clamp(30px,6vw,76px)" }}
                >
                  <span className="hl-display hl-green">PAPEREE</span>
                  <span className="text-stroke mx-2 font-medium" style={{ fontSize: "0.7em" }}>×</span>
                  <span className="hl-display hl-pink text-stroke">SULIN</span>
                </motion.p>
                <PageH2 small>“汽水分你<span className="hl hl-yellow">一半</span>。”</PageH2>
                <motion.div variants={rise} className="grid grid-cols-2 border border-ink mt-5 max-w-[520px]">
                  <div className="p-4 border-r rule">
                    <p className="font-black tabular-nums" style={{ fontSize: "clamp(22px,3vw,32px)" }} aria-label={`${STATS.textMessages} 条文字`}><span aria-hidden><CountUp value={STATS.textMessages} /></span></p>
                    <p className="text-[12px] mt-1 opacity-65 font-bold">条文字</p>
                  </div>
                  <div className="p-4">
                    <p className="font-black tabular-nums" style={{ fontSize: "clamp(22px,3vw,32px)" }} aria-label={`${STATS.stickers} 个表情`}><span aria-hidden><CountUp value={STATS.stickers} /></span></p>
                    <p className="text-[12px] mt-1 opacity-65 font-bold">个表情</p>
                  </div>
                </motion.div>
                <motion.p variants={rise} className="mt-3 text-[13px] opacity-70">广州 · 唐山 · 拉萨，都在这一页。</motion.p>
                <motion.div variants={rise} className="flex flex-wrap items-center gap-3 mt-5">
                  <motion.button onClick={() => setSecret(true)} className="bg-ink text-paper px-6 py-3.5 text-[14px] font-bold inline-flex items-center gap-2 transition-colors duration-200 hover:bg-black">
                    <Heart size={14} aria-hidden /> 推开密信
                  </motion.button>
                  <a href="mailto:hello@onnx.click" className="px-4 py-3.5 text-[13px] underline underline-offset-4 opacity-80 hover:opacity-100">写信给我们</a>
                </motion.div>
                <motion.p variants={rise} className="mt-6 text-[11px] opacity-45 tracking-widest">© 2026 八页纸 · 广州 ↔ 拉萨<span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline"> · KONAMI 键亦可开信</span>{" · "}<button type="button" onClick={() => setMotion("flat")} className="underline underline-offset-4 hover:opacity-70 transition-opacity">读着晕？切平铺版</button></motion.p>
              </PageShell>
            )}

          </motion.section>
        </AnimatePresence>
      </div>

      {/* 密信 — 幕布+逐行浮现 */}
      <AnimatePresence>
        {secret && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0 z-50 bg-ink text-paper flex flex-col justify-center px-6 sm:px-12"
            role="dialog"
            aria-modal="true"
            aria-label="密信"
          >
            <div className="max-w-2xl mx-auto w-full">
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="kicker opacity-60">密信 · THE SECRET</motion.p>
              <div className="mt-6 space-y-4">
                {LETTER.map((l, i) => (
                  <span key={i} className="mask">
                    <motion.p
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.4, duration: 0.85, ease: EASE }}
                      className="mask-inner text-[16px] sm:text-[19px] leading-9"
                    >
                      {l}
                    </motion.p>
                  </span>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.6 }}
                onClick={() => setSecret(false)}
                className="mt-10 border border-paper/40 px-5 py-3.5 text-[13px] font-bold hover:bg-paper hover:text-ink transition-colors"
              >
                回到纸面
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
