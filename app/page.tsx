"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Lenis from "lenis";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Atom,
  BookOpen,
  Braces,
  CloudSun,
  Coffee,
  Feather,
  Flower2,
  Gamepad2,
  Headphones,
  Heart,
  Images,
  Layers,
  Leaf,
  Lightbulb,
  Hash,
  Mail,
  MapPin,
  MessagesSquare,
  MoonStar,
  MousePointerClick,
  Music,
  PenLine,
  Plane,
  RotateCcw,
  Smile,
  Sparkles,
  Sunrise,
  Triangle,
  Users,
  Waves,
  Wind,
  X,
  Zap,
} from "lucide-react";
import HeartBurst from "./components/HeartBurst";
import ScrollRail from "./components/ScrollRail";
import CountUp from "./components/CountUp";
import Magnetic from "./components/Magnetic";
import Playlist from "./components/Playlist";
import Weather from "./components/Weather";
import SecretPage from "./components/SecretPage";

function GithubMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 36, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

const stats = [
  { n: 2295, u: "km", label: "广州 ↔ 拉萨的距离", icon: MapPin },
  { n: 21100, u: "条", label: "聊过的消息", icon: MessagesSquare },
  { n: 43, u: "次", label: "互道的晚安", icon: MoonStar },
  { n: 117253, u: "字", label: "写下的字", icon: PenLine },
];

/* 数字位数越多字号越小，保证单位后缀不被挤到下一行 */
const numSize = (n: number) => {
  const d = String(n).replace(/\D/g, "").length;
  if (d >= 6) return "clamp(22px,2.6vw,36px)";
  if (d >= 3) return "clamp(28px,3vw,44px)";
  return "clamp(32px,3.5vw,48px)";
};

const timeline = [
  { d: "2026 · 07 · 28", t: "两句招呼", p: "“我是su” / “原来我是ee吗”——名字就这么定下了。", icon: Sparkles },
  { d: "2026 · 08 · 28", t: "重新开始", p: "一个人先开口，故事按下重启键。", icon: RotateCcw },
  { d: "2026 · 09 · 10", t: "不再叫朋友", p: "有些话不用说出口，这个主页就是答案。", icon: Heart },
  { d: "soon", t: "第一次见面", p: "“等不及了，来找 ee 了怎么办。”——那就把 2,295 km 走成 0 km。", icon: Plane },
];

/* 跑马灯内容：黑条只讲技术栈（全站唯一不放感情的地方），白条走晚安 */
const TOP_STRIP = [
  { icon: Layers, text: "NEXT.JS" },
  { icon: Atom, text: "REACT" },
  { icon: Wind, text: "TAILWIND" },
  { icon: Zap, text: "FRAMER MOTION" },
  { icon: Waves, text: "LENIS" },
  { icon: Braces, text: "TYPESCRIPT" },
  { icon: Feather, text: "LUCIDE" },
  { icon: Triangle, text: "VERCEL" },
];
const NIGHT_STRIP = ["SLEEP WELL TONIGHT", "晚安", "SEE YOU IN SPRING", "明天见", "SU ♥ EE", "早点睡"];
const STRIP_TINTS = ["text-[#F6C9D9]", "text-[#C9E7C4]", "opacity-50"];

/* 导航模块 */
const NAV = [
  { id: "duo", label: "双人", icon: Users },
  { id: "numbers", label: "数字", icon: Hash },
  { id: "story", label: "故事", icon: BookOpen },
  { id: "playlist", label: "歌单", icon: Music },
  { id: "weatherpro", label: "双城", icon: CloudSun },
  { id: "moments", label: "日常", icon: Images },
] as const;

/* Hero 大字逐字入场 */
function Reveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={`inline-block overflow-hidden align-bottom ${className ?? ""}`}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ delay: delay + i * 0.04, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Home() {
  const [active, setActive] = useState("duo");
  const [secret, setSecret] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const logoClicks = useRef(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const heroTitleX = useTransform(scrollYProgress, [0, 0.12], [0, -120]);
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const navProgress = useTransform(scrollYProgress, [0, 1], ["0%", "108%"]);
  const late = typeof window !== "undefined" && (new Date().getHours() >= 23 || new Date().getHours() < 5);

  /* 滚动压缩：下滚后顶部栏贴顶收紧（常驻不隐藏） */
  const [navCompact, setNavCompact] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setNavCompact(y > 260));

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    const raf = (t: number) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* 彩蛋开着时锁住背景：Lenis 停（拦滚轮/触摸）+ body 锁（拦键盘）+ 藏悬浮滚动条。
     信纸自己能滚：它的容器带了 data-lenis-prevent，Lenis 会放行原生滚动。 */
  useEffect(() => {
    document.body.classList.toggle("secret-open", secret);
    if (secret) lenisRef.current?.stop();
    else lenisRef.current?.start();
    return () => {
      document.body.classList.remove("secret-open");
      lenisRef.current?.start();
    };
  }, [secret]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    ["duo", "numbers", "story", "playlist", "weatherpro", "moments"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* 彩蛋：Konami 键（↑↑↓↓←→←→BA）+ 快速点 logo 5 次 */
  useEffect(() => {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;
    const key = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          setSecret(true);
          pos = 0;
        }
      } else {
        pos = k === seq[0] ? 1 : 0;
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);

  const onLogoClick = () => {
    if (logoTimer.current) clearTimeout(logoTimer.current);
    logoClicks.current++;
    logoTimer.current = setTimeout(() => (logoClicks.current = 0), 3000);
    if (logoClicks.current >= 5) {
      logoClicks.current = 0;
      setSecret(true);
    }
  };

  return (
    <main className="min-h-screen grain">
      <HeartBurst />
      <ScrollRail />
      <SecretPage open={secret} onClose={() => setSecret(false)} />

      {/* 导航 */}
      <motion.nav
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        animate={navCompact ? "compact" : "expanded"}
        variants={{
          expanded: { y: 0, scale: 1 },
          compact: { y: 4, scale: 0.94 },
        }}
        initial={false}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex w-max items-center gap-1 sm:gap-1.5 backdrop-blur-xl border border-black/10 rounded-full pl-2 pr-1 sm:pl-2.5 sm:pr-1.5 py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-w-[94vw] overflow-hidden origin-top ${
          navCompact ? "bg-[#fffbf6]/95 shadow-[0_6px_24px_rgba(0,0,0,0.14)]" : "bg-[#fffbf6]/85"
        }`}
      >
        {/* 滚动进度：整条胶囊自左向右被极淡的粉绿晕染（墨水填充，无边框无端帽） */}
        <motion.div
          aria-hidden
          style={{
            width: navProgress,
            WebkitMaskImage: "linear-gradient(to right, black calc(100% - 20px), transparent)",
            maskImage: "linear-gradient(to right, black calc(100% - 20px), transparent)",
          }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c9e7c4]/40 to-[#f6c9d9]/40 pointer-events-none"
        />
        <div className="flex items-center gap-1.5 shrink-0 min-w-0 pl-1">
          <button onClick={onLogoClick} aria-label="Superee" className="shrink-0">
            <Image
              src="/avatars/mix-256.webp"
              alt="Superee 合体徽章"
              width={32}
              height={32}
              className="rounded-full border border-black object-cover w-8 h-8 hover:rotate-12 transition-transform duration-300"
            />
          </button>
          <span className="hidden lg:inline font-bold text-[15px] tracking-tight whitespace-nowrap">
            Superee
            <i className="not-italic bg-[#211d1b] text-white rounded-full px-2 py-0.5 ml-1.5 text-[11px]">
              ee × su
            </i>
          </span>
        </div>

        <span className="hidden lg:block w-px self-stretch my-2 bg-black/10 shrink-0" aria-hidden />

        {/* 桌面：文字链接 + 滑动指示器（仅 ≥1280px，1024~1280用图标以防挤爆胶囊） */}
        <div className="hidden xl:flex items-center gap-0.5" aria-label="页面导航">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`relative text-[13px] font-medium px-3.5 py-2 rounded-full transition-colors ${
                active === n.id ? "text-cream" : "text-ink hover:text-ink/70"
              }`}
            >
              {active === n.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 bg-ink rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{n.label}</span>
            </a>
          ))}
        </div>

        {/* 小屏/中屏：图标导航（<1280px，整体 shrink-0，胶囊随内容变宽，绝不挤 CTA） */}
        <div className="flex xl:hidden items-center gap-0 sm:gap-0.5 shrink-0">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              aria-label={n.label}
              title={n.label}
              className={`relative grid place-items-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors shrink-0 ${
                active === n.id ? "text-cream" : "text-ink"
              }`}
            >
              {active === n.id && (
                <motion.span
                  layoutId="nav-active-m"
                  className="absolute inset-0 bg-ink rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <n.icon size={15} className="relative z-10" />
            </a>
          ))}
        </div>

        <span className="hidden sm:block w-px self-stretch my-2 bg-black/10 shrink-0" aria-hidden />

        <Magnetic>
          <a href="https://github.com/SupereeOrg" target="_blank" rel="noreferrer" aria-label="GitHub" className="hidden xl:grid place-items-center w-9 h-9 rounded-full hover:bg-black hover:text-cream transition"><GithubMark size={16} /></a>
        </Magnetic>
        <Magnetic className="shrink-0 relative z-10">
          <a href="#story" className="bg-[#211d1b] text-cream rounded-full px-2.5 sm:px-3.5 py-2 text-[13px] font-bold whitespace-nowrap flex items-center gap-1.5 shrink-0"><span className="hidden sm:inline">认识我们</span><ArrowRight size={14} /></a>
        </Magnetic>
      </motion.nav>

      {/* Hero：首屏独占 100svh，标题居中，卡片滚下去再看 */}
      <header
        ref={heroRef}
        className="relative h-[100svh] min-h-[620px] flex flex-col px-6 pt-24 pb-7"
        style={{
          background:
            "radial-gradient(700px 500px at 15% 20%, #F6C9D9 0%, transparent 60%), radial-gradient(700px 500px at 85% 25%, #C9E7C4 0%, transparent 60%), #FFFBF6",
        }}
      >
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center">
          <motion.p {...fadeUp} className="w-max text-[12px] font-bold tracking-[0.2em] bg-white border-2 border-black rounded-full px-4 py-2 hard-shadow-sm flex items-center gap-2">
            <MapPin size={13} /> 广州 ↔ 拉萨 · 2,295 KM
          </motion.p>
          <motion.div style={{ x: heroTitleX, opacity: heroTitleOpacity }} className="w-full">
            <motion.h1
              className="font-bold uppercase leading-[0.88] tracking-[-0.04em] mt-5"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(64px,11vw,168px)" }}
            >
              <Reveal text="PAPEREE" />
              <br />
              <Reveal text="× SULIN" delay={0.4} className="text-outline" />
            </motion.h1>
            {late && (
              <motion.p {...fadeUp} className="mt-5 text-[14px] font-bold inline-flex items-center gap-2 bg-ink text-cream rounded-full px-4 py-2">
                <MoonStar size={14} className="animate-heartbeat" /> 夜深了——两个熬夜冠军，早点睡。
              </motion.p>
            )}
          </motion.div>

          {/* 合体徽章：标题之下横排，不抢高度 */}
          <motion.div {...fadeUp} className="flex items-center gap-4 group mt-7">
            <div className="relative shrink-0">
              <Image
                src="/avatars/mix-512.webp"
                alt="纸片君与苏淋的合体形象"
                width={88}
                height={88}
                priority
                className="rounded-full border-[3px] border-black object-cover w-[88px] h-[88px] shadow-[5px_5px_0_#211d1b] group-hover:rotate-6 group-active:rotate-12 transition-transform duration-500"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-white border-2 border-black rounded-full w-8 h-8 grid place-items-center group-hover:opacity-100 opacity-0 transition-opacity animate-heartbeat" title="一起">
                <Heart size={13} />
              </span>
            </div>
            <p className="max-w-[420px] text-[14px] leading-7 text-[#4a4442]">
              一个在海边，一个在高原。中间这枚合体徽章，是我们相遇的证明。
            </p>
          </motion.div>
        </div>

        {/* 首屏底栏：滚动提示 */}
        <div className="max-w-6xl mx-auto w-full flex items-end justify-between gap-4 text-[12px] font-bold tracking-[0.18em]">
          <a href="#duo" className="flex items-center gap-2 bg-ink text-cream rounded-full px-4 py-2.5">
            往下滑 <ArrowUp size={13} className="rotate-180 animate-bounce" />
          </a>
          <span className="hidden sm:block opacity-50" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>2 PEOPLE / 2 CITIES / 1 PAGE</span>
        </div>
      </header>

      {/* 双人：全屏对开，不再是卡片。左绿右粉，中间一枚距离章 */}
      <section className="relative min-h-[100svh] flex flex-col border-t-2 border-black">
        <div id="duo" className="grid md:grid-cols-2 flex-1 scroll-mt-24">
          {/* 纸片君 */}
          <motion.div {...fadeUp} id="paperee" className="relative flex flex-col justify-center gap-4 p-8 md:p-14 bg-[#EAF8E6] min-h-[44vh] overflow-hidden scroll-mt-24">
            <span className="font-black leading-[0.8] select-none pointer-events-none absolute -bottom-6 -left-2 text-[26vw] md:text-[11vw] opacity-[0.08]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>ee</span>
            <div className="flex items-center gap-3">
              <Image src="/avatars/paperee-512.webp" alt="纸片君头像" width={64} height={64} className="rounded-full border-2 border-black object-cover w-16 h-16" />
              <span className="text-[11px] font-bold tracking-[0.18em] bg-ink text-cream px-3 py-1.5 rounded-full">01 · 纸片君 PAPEREE</span>
            </div>
            <h2 className="serif-cn font-black leading-[0.85] tracking-tight italic" style={{ fontSize: "clamp(56px,7vw,110px)" }}>ee</h2>
            <p className="text-[13px] font-bold tracking-wide opacity-60">广州 · 海边 — 在广州上学</p>
            <p className="serif-cn text-[16px] leading-8 max-w-[340px]">“表情丰富，撒娇从不缺席。熬夜的时候除外——那时满脑子都是 su。”</p>
            <p className="text-[12px] font-bold opacity-60 flex flex-wrap gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1"><Coffee size={12} />喝茶</span>·
              <span className="inline-flex items-center gap-1"><Headphones size={12} />分享歌</span>·
              <span className="inline-flex items-center gap-1"><Smile size={12} />撒娇冠军</span>·
              <span className="inline-flex items-center gap-1"><MoonStar size={12} />熬夜冠军</span>
            </p>
          </motion.div>

          {/* 苏淋 */}
          <motion.div {...fadeUp} id="sulin" className="relative flex flex-col justify-center md:items-end md:text-right gap-4 p-8 md:p-14 bg-[#FDE9F1] min-h-[44vh] overflow-hidden border-t-2 md:border-t-0 md:border-l-2 border-black scroll-mt-24">
            <span className="font-black leading-[0.8] select-none pointer-events-none absolute -bottom-6 -right-2 text-[26vw] md:text-[11vw] opacity-[0.08]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>su</span>
            <div className="flex items-center gap-3 md:flex-row-reverse">
              <Image src="/avatars/sulin-512.webp" alt="苏淋头像" width={64} height={64} className="rounded-full border-2 border-black object-cover w-16 h-16" />
              <span className="text-[11px] font-bold tracking-[0.18em] bg-ink text-cream px-3 py-1.5 rounded-full">02 · 苏淋 SULIN</span>
            </div>
            <h2 className="serif-cn font-black leading-[0.85] tracking-tight italic" style={{ fontSize: "clamp(56px,7vw,110px)" }}>su</h2>
            <p className="text-[13px] font-bold tracking-wide opacity-60">河北唐山 — 现居拉萨 · 在读</p>
            <p className="serif-cn text-[16px] leading-8 max-w-[340px]">“话多主动，报备从不缺席。游泳的时候除外——那时满脑子都是 ee。”</p>
            <p className="text-[12px] font-bold opacity-60 flex flex-wrap gap-x-2 gap-y-1 md:justify-end">
              <span className="inline-flex items-center gap-1"><Waves size={12} />游泳</span>·
              <span className="inline-flex items-center gap-1"><Gamepad2 size={12} />王者荣耀</span>·
              <span className="inline-flex items-center gap-1"><Lightbulb size={12} />收集想法</span>·
              <span className="inline-flex items-center gap-1"><Sunrise size={12} />早睡</span>
            </p>
          </motion.div>
        </div>

        {/* 中缝距离章：桌面居中，移动端贴顶 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-1/2 z-10">
          <div className="bg-ink text-cream border-2 border-black rounded-full px-5 py-3 flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,0.25)] whitespace-nowrap">
            <X size={15} strokeWidth={3} />
            <span className="text-[11px] font-black tracking-[0.25em]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>2,295 KM</span>
            <Heart size={13} className="fill-current animate-heartbeat" />
          </div>
        </div>
      </section>

      {/* 跑马灯：两段完全相同的半程做 -50% 循环；每半程 12 节，超宽屏也不露空 */}
      <div aria-hidden="true" className="marquee border-y-2 border-black bg-[#211d1b] text-[#FFFBF6] overflow-hidden whitespace-nowrap py-3.5">
        <div className="flex w-max animate-marquee font-bold text-[15px] tracking-wider" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {TOP_STRIP.concat(TOP_STRIP).map((s, i) => (
                <span key={i} className="flex shrink-0 items-center gap-2 px-5">
                  <s.icon size={14} className={STRIP_TINTS[i % 3]} />
                  {s.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 数字：不说爱，数字替我们说 */}
      <section id="numbers" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] font-bold tracking-[0.22em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">01 · NUMBERS</div>
            <h3 className="mt-3 font-black leading-none tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
              攒下来的，<span style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>都在这了。</span>
            </h3>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              className={`lift border-2 border-black rounded-3xl p-6 hard-shadow-sm ${i % 2 === 0 ? "bg-[#F6C9D9]" : "bg-[#C9E7C4]"}`}
            >
              <s.icon size={20} strokeWidth={2.2} />
              <CountUp
                value={s.n}
                suffix={s.u}
                className="block font-bold leading-none mt-3 tabular-nums"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: numSize(s.n) }}
              />
              <p className="text-[13px] font-bold mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 时间线 */}
      <section id="story" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] font-bold tracking-[0.22em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">02 · STORY</div>
            <h3 className="mt-3 font-black leading-none tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
              我们的故事，<span style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>四行就够。</span>
            </h3>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-4">
          {timeline.map((t, i) => (
            <motion.div
              key={t.d}
              {...fadeUp}
              className={`lift border-2 border-black rounded-3xl p-6 flex flex-col min-h-[220px] ${i === 3 ? "bg-[#211d1b] text-white" : "bg-white"}`}
            >
              <span className={`text-[12px] font-bold tracking-widest flex items-center gap-1.5 ${i === 3 ? "text-[#C9E7C4]" : "text-[#8A8280]"}`} style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}><t.icon size={13} />{t.d}</span>
              <h4 className="text-[20px] font-black mt-2">{t.t}</h4>
              <p className={`text-[13.5px] leading-7 mt-2 ${i === 3 ? "opacity-70" : "text-[#5b5553]"}`}>{t.p}</p>
              <span className={`mt-auto pt-4 font-bold text-[13px] ${i === 3 ? "text-[#F6C9D9] opacity-60" : "opacity-40"}`} style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>0{i + 1}</span>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="lift border-2 border-black rounded-[32px] bg-white hard-shadow p-8 grid md:grid-cols-2 gap-7 mt-5">
          <blockquote className="font-bold leading-relaxed" style={{ fontSize: "clamp(20px,2.6vw,28px)" }}>
            “一个把日子过成诗，
            <br />
            一个把生活过成歌。
            <br />
            相隔 2295 km，也要一起春天。”
          </blockquote>
          <div className="flex flex-col gap-3 text-[14px]">
            {(
              [
                ["ee", "广州 · 在读"],
                ["su", "拉萨 · 在读"],
                ["接下来", "先见一面，其他的再说"],
              ] as [string, React.ReactNode][]
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-dashed border-black/15 py-2.5 group">
                <span className="text-[#8A8280] group-hover:text-ink transition-colors">{k}</span><strong>{v}</strong>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 歌单 */}
      <section id="playlist" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] font-bold tracking-[0.22em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">03 · PLAYLIST</div>
            <h3 className="mt-3 font-black leading-none tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
              从我们的歌单里，<span style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>挑了几首单曲循环。</span>
            </h3>
              <p className="mt-3 text-[14px] text-[#5b5553]">一首歌 = 一次“我想把耳机分你一只”。点任意一处试听 30 秒。</p>
          </div>
          <Music size={34} strokeWidth={1.5} className="opacity-50 animate-floaty hidden sm:block" />
        </motion.div>
        <Playlist />
      </section>

      {/* 双城天气 */}
      <section id="weatherpro" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] font-bold tracking-[0.22em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">04 · TWO SKIES</div>
            <h3 className="mt-3 font-black leading-none tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
              同一片天，<span style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>两座城。</span>
            </h3>
            <p className="mt-3 text-[14px] text-[#5b5553]">实时天气 · 广州海拔 ~11m，拉萨海拔 ~3,656m。出门前，先看看对方头顶是什么天。</p>
          </div>
        </motion.div>
        <Weather />
      </section>

      {/* 反向跑马灯：同上，两段相同半程 + 12 节/半程 */}
      <div aria-hidden="true" className="marquee mt-20 border-y-2 border-black bg-cream overflow-hidden whitespace-nowrap py-3">
        <div className="flex w-max animate-marquee-rev font-bold text-[13px] tracking-[0.2em] opacity-80">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {NIGHT_STRIP.concat(NIGHT_STRIP).map((s, i) => (
                <span key={i} className="flex shrink-0 items-center">
                  <span className="px-6">{s}</span>
                  <Asterisk size={12} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 日常拼贴 */}
      <section id="moments" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] font-bold tracking-[0.22em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">05 · MOMENTS</div>
            <h3 className="mt-3 font-black leading-none tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
              Bento 格，<span style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>拼出我们。</span>
            </h3>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="grid md:grid-cols-3 grid-rows-2 gap-4 auto-rows-[220px]">
          <div className="md:row-span-2 bg-[#211d1b] text-white border-2 border-black rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden">
            <span className="absolute top-4 left-4 bg-white text-black border-[1.5px] border-black rounded-full text-[11px] font-extrabold px-2.5 py-1 flex items-center gap-1"><Heart size={11} />OUR STORY</span>
            <Image src="/avatars/mix-256.webp" alt="合体" width={96} height={96} className="rounded-2xl border-2 border-white/20 object-cover w-24 h-24 mb-auto mt-10" />
            <h5 className="text-[20px] font-bold leading-snug mt-4">“我正在等你，<br />汽水分你一半。”</h5>
            <p className="text-[13px] opacity-70 mt-2">Superee = su per ee —— su 有一个 ee，全世界独一个。</p>
          </div>
          <div className="lift bg-[#C9E7C4] border-2 border-black rounded-3xl p-6 flex flex-col justify-end relative">
            <div className="font-bold text-[52px] leading-none" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>01</div>
            <h5 className="text-[18px] font-bold mt-2">ee 的深夜档</h5>
            <p className="text-[13px] font-medium mt-1 opacity-70">熬夜冠军 · 分享歌不打烊</p>
          </div>
          <div className="lift bg-[#F6C9D9] border-2 border-black rounded-3xl p-6 flex flex-col justify-end relative">
            <div className="font-bold text-[52px] leading-none" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>02</div>
            <h5 className="text-[18px] font-bold mt-2">su 的白天档</h5>
            <p className="text-[13px] font-medium mt-1 opacity-70">游泳 · 上课 · 早睡</p>
          </div>
          <div className="lift border-2 border-black rounded-3xl p-6 flex gap-4 items-center bg-white">
            <Image src="/avatars/paperee-256.webp" alt="纸片君" width={72} height={72} className="rounded-full border-2 border-black object-cover w-[72px] h-[72px]" />
            <span className="grid place-items-center w-8 h-8 shrink-0"><X size={18} strokeWidth={3} /></span>
            <Image src="/avatars/sulin-256.webp" alt="苏淋" width={72} height={72} className="rounded-full border-2 border-black object-cover w-[72px] h-[72px]" />
            <p className="text-[13px] text-[#5b5553] leading-6">16,590 条文字<br />3,897 个表情</p>
          </div>
          <div className="lift border-2 border-black rounded-3xl p-6 bg-white flex flex-col justify-end">
            <div className="font-bold text-[40px] leading-none" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>2<span className="text-[16px]">人 / 2城 / 1站</span></div>
            <p className="text-[13px] text-[#5b5553] mt-1">广州 · 唐山 · 拉萨，都在这一页</p>
          </div>
        </motion.div>
      </section>

      <footer className="mt-20 bg-[#211d1b] text-[#FFFBF6] rounded-t-[36px] px-6 pt-14 pb-7 text-center overflow-hidden">
        <div className="font-bold leading-none tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(48px,8vw,110px)" }}>
          <span className="text-[#C9E7C4]">PAPEREE</span> × <span className="text-[#F6C9D9]">SULIN</span>
        </div>
        <p className="opacity-70 mt-3 text-[14px] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <MapPin size={14} /> 广州 ↔ 拉萨
        </p>
        {late && <p className="mt-2 text-[13px] text-[#F6C9D9] font-bold">都过了 23 点了，两位冠军请立刻睡觉 ♪</p>}

        {/* 落款三格：谁在哪 + 用啥构建，替代原来一串散装字符 */}
        <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6 text-left">
          {[
            ["EE · 纸片君", "广州 · 海边"],
            ["SU · 苏淋", "拉萨 · 高原"],
            ["本站构建", "Next.js on Vercel"],
          ].map(([k, v]) => (
            <div key={k} className="border border-white/15 rounded-2xl px-5 py-4">
              <div className="text-[11px] font-bold tracking-[0.2em] opacity-50">{k}</div>
              <div className="font-bold text-[15px] mt-1">{v}</div>
            </div>
          ))}
        </div>

        {/* 站内索引：长页标配，导航在底部不可见时接力 */}
        <nav aria-label="页脚导航" className="flex gap-x-5 gap-y-2 justify-center mt-6 flex-wrap text-[13px] font-bold">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="u-pill">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-3 justify-center mt-6 flex-wrap">
          <Magnetic className="inline-block">
            <a href="#paperee" className="rounded-full px-6 py-3 font-extrabold text-[14px] bg-[#C9E7C4] text-black flex items-center gap-2"><Leaf size={16} />纸片君</a>
          </Magnetic>
          <Magnetic className="inline-block">
            <a href="#sulin" className="rounded-full px-6 py-3 font-extrabold text-[14px] bg-[#F6C9D9] text-black flex items-center gap-2"><Flower2 size={16} />苏淋</a>
          </Magnetic>
          <Magnetic className="inline-block">
            <a href="#" className="rounded-full px-6 py-3 font-extrabold text-[14px] border-2 border-white flex items-center gap-2">回到顶部 <ArrowUp size={16} /></a>
          </Magnetic>
          <Magnetic className="inline-block">
            <a href="https://github.com/SupereeOrg" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full px-4 py-3 font-extrabold text-[14px] border-2 border-white/40 opacity-60 hover:opacity-100 hover:border-white transition-all flex items-center gap-2"><GithubMark size={16} /></a>
          </Magnetic>
          <Magnetic className="inline-block">
            <button onClick={() => setSecret(true)} aria-label="Secret" className="rounded-full px-4 py-3 font-extrabold text-[14px] border-2 border-dashed border-white/40 opacity-40 hover:opacity-100 hover:border-white transition-all flex items-center gap-2" title="这里藏了什么">
              <Heart size={14} />
            </button>
          </Magnetic>
        </div>
        <p className="mt-6 text-[13px] opacity-60 flex flex-wrap items-center justify-center gap-2">
          <Mail size={14} /> 写信给我们
          <a href="mailto:hello@onnx.click" className="u-line font-bold text-[#FFFBF6] inline-flex items-center gap-1">
            hello@onnx.click <ArrowUpRight size={13} />
          </a>
        </p>
        <small className="mt-6 opacity-50 text-[12px] tracking-widest flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          © 2026 SUPEREE · EE <Heart size={11} className="fill-current" /> SU ·
          <MousePointerClick size={12} /> 顶部徽章连点 5 下 <ArrowUp size={12} />
        </small>
      </footer>
    </main>
  );
}
