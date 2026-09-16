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
  BookOpen,
  CloudSun,
  Coffee,
  Flower2,
  Gamepad2,
  Headphones,
  Heart,
  Images,
  Leaf,
  Lightbulb,
  Hash,
  Mail,
  MapPin,
  MessagesSquare,
  MoonStar,
  MousePointerClick,
  Music,
  Plane,
  RotateCcw,
  Smile,
  Sparkles,
  Sunrise,
  Users,
  Waves,
  X,
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
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const stats = [
  { n: 2295, u: "km", label: "广州 ↔ 拉萨的距离", icon: MapPin },
  { n: 18665, u: "条", label: "建站前已聊的消息", icon: MessagesSquare },
  { n: 39, u: "次", label: "互道的晚安", icon: MoonStar },
  { n: 79, u: "首", label: "分享给对方的歌", icon: Music },
];

const timeline = [
  { d: "2026 · 07 · 28", t: "两句招呼", p: "“我是su” / “原来我是ee吗”——名字就这么定下了。", icon: Sparkles },
  { d: "2026 · 08 · 28", t: "重新开始", p: "一个人先开口，故事按下重启键。", icon: RotateCcw },
  { d: "2026 · 09 · 10", t: "不再叫朋友", p: "有些话不用说出口，这个主页就是答案。", icon: Heart },
  { d: "soon", t: "第一次见面", p: "把 2,295 km 走成 0 km，敬请期待。", icon: Plane },
];

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
    const lenis = new Lenis({ lerp: 0.12 });
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

      {/* Hero */}
      <header
        ref={heroRef}
        className="min-h-[100svh] flex flex-col justify-end px-6 pt-28"
        style={{
          background:
            "radial-gradient(700px 500px at 15% 20%, #F6C9D9 0%, transparent 60%), radial-gradient(700px 500px at 85% 25%, #C9E7C4 0%, transparent 60%), #FFFBF6",
        }}
      >
        <div className="max-w-6xl mx-auto w-full flex flex-wrap justify-between items-end gap-5">
          <motion.div style={{ x: heroTitleX, opacity: heroTitleOpacity }} className="flex-1 min-w-[280px]">
            <motion.h1
              className="font-bold uppercase leading-[0.9] tracking-[-0.04em] mt-4"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(56px,10vw,140px)" }}
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

          {/* 合体徽章：含蓄表达的核心 */}
          <motion.div {...fadeUp} className="flex items-center gap-4 group">
            <div className="relative">
              <Image
                src="/avatars/mix-512.webp"
                alt="纸片君与苏淋的合体形象"
                width={132}
                height={132}
                priority
                className="rounded-full border-[3px] border-black object-cover w-[132px] h-[132px] shadow-[6px_6px_0_#211d1b] group-hover:rotate-6 group-active:rotate-12 transition-transform duration-500"
              />
              <span className="absolute -bottom-2 -right-2 bg-white border-2 border-black rounded-full w-9 h-9 grid place-items-center group-hover:opacity-100 opacity-0 transition-opacity animate-heartbeat" title="一起">
                <Heart size={15} />
              </span>
            </div>
            <p className="max-w-[240px] text-[14px] leading-7 text-[#4a4442]">
              一个在海边，一个在高原。
              <br />
              中间这枚合体徽章，
              <br />
              是我们相遇的证明。
            </p>
          </motion.div>
        </div>

        {/* 双人三联 */}
        <motion.div
          {...fadeUp}
          id="duo"
          className="max-w-6xl mx-auto w-full grid md:grid-cols-[1fr_auto_1fr] border-2 border-black rounded-[32px] overflow-hidden bg-white hard-shadow mt-9"
        >
          {/* 纸片君：广州，绿 —— 第一位 */}
          <div id="paperee" className="p-8 min-h-[440px] flex flex-col bg-gradient-to-b from-[#EAF8E6] to-[#C9E7C4] scroll-mt-24">
            <span className="text-[12px] font-bold tracking-[0.18em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">01 · 纸片君 PAPEREE</span>
            <h2 className="font-bold leading-none mt-5" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(40px,4.5vw,64px)" }}>
              PAPEREE
            </h2>
            <dl className="w-full max-w-[320px] mt-5 text-[13.5px]">
              <div className="flex justify-between gap-4 border-b border-dashed border-black/20 py-2">
                <dt className="opacity-60">坐标</dt><dd className="font-bold">广州 · 海边</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-dashed border-black/20 py-2">
                <dt className="opacity-60">现状</dt><dd className="font-bold">在广州上学</dd>
              </div>
            </dl>
            <p className="text-[15px] font-medium leading-8 max-w-[320px] mt-5 mb-8 text-[#3d3836]">
              “表情丰富，撒娇从不缺席。熬夜的时候除外——那时满脑子都是 su。”
            </p>
            <Image
              src="/avatars/paperee-512.webp"
              alt="纸片君头像"
              width={148}
              height={148}
              className="rounded-full border-[3px] border-black object-cover w-[148px] h-[148px] shadow-[6px_6px_0_#211d1b] mt-auto group-hover:rotate-3 transition-transform duration-500 hover:rotate-6"
            />
            <div className="flex gap-2 flex-wrap mt-4">
              {[
                { icon: Coffee, text: "喝茶" },
                { icon: Headphones, text: "分享歌" },
                { icon: Smile, text: "撒娇冠军" },
                { icon: MoonStar, text: "熬夜冠军" },
              ].map((t) => (
                <span key={t.text} className="bg-white border-[1.5px] border-black rounded-full px-3 py-1.5 text-[12px] font-bold flex items-center gap-1.5 hover:-rotate-2 hover:-translate-y-0.5 transition-transform cursor-default"><t.icon size={13} />{t.text}</span>
              ))}
            </div>
          </div>

          <div className="bg-[#211d1b] text-white flex md:flex-col flex-row items-center justify-center gap-3 px-5 py-4 min-w-[92px]">
            <div className="w-14 h-14 rounded-full bg-white text-black grid place-items-center"><X size={26} strokeWidth={3} /></div>
            <small className="md:[writing-mode:vertical-rl] tracking-[0.4em] text-[11px] opacity-70">2,295 KM APART</small>
            <div className="grid place-items-center"><Heart size={20} className="animate-heartbeat fill-current" /></div>
          </div>

          {/* 苏淋：唐山人，在拉萨上学 —— 第二位 */}
          <div id="sulin" className="p-8 min-h-[440px] flex flex-col items-end text-right bg-gradient-to-b from-[#FDE9F1] to-[#F6C9D9] scroll-mt-24">
            <span className="text-[12px] font-bold tracking-[0.18em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">02 · 苏淋 SULIN</span>
            <h2 className="font-bold leading-none mt-5" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(40px,4.5vw,64px)" }}>
              SULIN
            </h2>
            <dl className="w-full max-w-[320px] mt-5 text-[13.5px]">
              <div className="flex justify-between gap-4 border-b border-dashed border-black/20 py-2">
                <dt className="opacity-60">籍贯</dt><dd className="font-bold">河北唐山</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-dashed border-black/20 py-2">
                <dt className="opacity-60">现居</dt><dd className="font-bold">拉萨 · 在读</dd>
              </div>
            </dl>
            <p className="text-[15px] font-medium leading-8 max-w-[320px] mt-5 mb-8 text-[#3d3836]">
              “话多主动，报备从不缺席。游泳的时候除外——那时满脑子都是 ee。”
            </p>
            <Image
              src="/avatars/sulin-512.webp"
              alt="苏淋头像"
              width={148}
              height={148}
              className="rounded-full border-[3px] border-black object-cover w-[148px] h-[148px] shadow-[6px_6px_0_#211d1b] mt-auto hover:rotate-6 transition-transform duration-500"
            />
            <div className="flex gap-2 flex-wrap mt-4 justify-end">
              {[
                { icon: Waves, text: "游泳" },
                { icon: Gamepad2, text: "王者荣耀" },
                { icon: Lightbulb, text: "收集想法" },
                { icon: Sunrise, text: "早睡" },
              ].map((t) => (
                <span key={t.text} className="bg-white border-[1.5px] border-black rounded-full px-3 py-1.5 text-[12px] font-bold flex items-center gap-1.5 hover:rotate-2 hover:-translate-y-0.5 transition-transform cursor-default"><t.icon size={13} />{t.text}</span>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="h-7" />
      </header>

      {/* 跑马灯 */}
      <div className="marquee border-y-2 border-black bg-[#211d1b] text-[#FFFBF6] overflow-hidden whitespace-nowrap py-3.5">
        <div className="inline-flex animate-marquee font-bold text-[15px] tracking-wider" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
              <span className="px-5">PAPEREE × SULIN</span>
              <Asterisk size={14} className="text-[#F6C9D9]" />
              <span className="px-5">GUANGZHOU ↔ LHASA</span>
              <Asterisk size={14} className="text-[#C9E7C4]" />
              <span className="px-5">2,295 KM</span>
              <Asterisk size={14} className="opacity-50" />
            </span>
          ))}
        </div>
      </div>

      {/* 数字：不说爱，数字替我们说 */}
      <section id="numbers" className="max-w-6xl mx-auto px-6 pt-20">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] font-bold tracking-[0.22em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">01 · NUMBERS</div>
            <h3 className="mt-3 font-black leading-none tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
              不说太多，<span style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>数字替我们说。</span>
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
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(32px,3.5vw,48px)" }}
              />
              <p className="text-[13px] font-bold mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 时间线 */}
      <section id="story" className="max-w-6xl mx-auto px-6 pt-20">
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
                ["我们的主页", "Superee.xyz"],
                ["状态", "相隔两地 · 各自努力"],
                ["下期更新", <>旅行地图 / 歌单 / 问答 100 问 <ArrowUpRight size={14} className="inline" /></>],
                ["联系我们", "hello@superee.xyz"],
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
      <section id="playlist" className="max-w-6xl mx-auto px-6 pt-20">
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
      <section id="weatherpro" className="max-w-6xl mx-auto px-6 pt-20">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[12px] font-bold tracking-[0.22em] bg-[#211d1b] text-[#FFFBF6] px-4 py-2 rounded-full w-max">04 · TWO SKIES</div>
            <h3 className="mt-3 font-black leading-none tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
              同一片天，<span style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>两座城。</span>
            </h3>
            <p className="mt-3 text-[14px] text-[#5b5553]">实时天气 · 广州海拔 ~11m，拉萨海拔 ~3,656m。看到彼此的天气，就当打个照面。</p>
          </div>
        </motion.div>
        <Weather />
      </section>

      {/* 反向跑马灯 */}
      <div className="marquee mt-20 border-y-2 border-black bg-cream overflow-hidden whitespace-nowrap py-3">
        <div className="inline-flex animate-marquee-rev font-bold text-[13px] tracking-[0.2em] opacity-80">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
              <span className="px-6">SLEEP WELL TONIGHT</span>
              <Asterisk size={12} />
              <span className="px-6">SEE YOU IN SPRING</span>
              <Asterisk size={12} />
              <span className="px-6">SU ♥ EE</span>
              <Asterisk size={12} />
            </span>
          ))}
        </div>
      </div>

      {/* 日常拼贴 */}
      <section id="moments" className="max-w-6xl mx-auto px-6 pt-20">
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
            <h5 className="text-[20px] font-bold leading-snug mt-4">一半青提气泡水，<br />一半草莓牛奶。</h5>
            <p className="text-[13px] opacity-70 mt-2">Superee = su per ee —— su 有一个 ee，全世界独一个。</p>
          </div>
          <div className="lift bg-[#C9E7C4] border-2 border-black rounded-3xl p-6 flex flex-col justify-end relative">
            <div className="font-bold text-[52px] leading-none" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>01</div>
            <h5 className="text-[18px] font-bold mt-2">海边的角落</h5>
          </div>
          <div className="lift bg-[#F6C9D9] border-2 border-black rounded-3xl p-6 flex flex-col justify-end relative">
            <div className="font-bold text-[52px] leading-none" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>02</div>
            <h5 className="text-[18px] font-bold mt-2">高原上的角落</h5>
          </div>
          <div className="lift border-2 border-black rounded-3xl p-6 flex gap-4 items-center bg-white">
            <Image src="/avatars/paperee-256.webp" alt="纸片君" width={72} height={72} className="rounded-full border-2 border-black object-cover w-[72px] h-[72px]" />
            <span className="grid place-items-center w-8 h-8 shrink-0"><X size={18} strokeWidth={3} /></span>
            <Image src="/avatars/sulin-256.webp" alt="苏淋" width={72} height={72} className="rounded-full border-2 border-black object-cover w-[72px] h-[72px]" />
            <p className="text-[13px] text-[#5b5553] leading-6">13,453 条文字<br />3,352 个表情</p>
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
          <a href="mailto:hello@superee.xyz" className="u-line font-bold text-[#FFFBF6] inline-flex items-center gap-1">
            hello@superee.xyz <ArrowUpRight size={13} />
          </a>
        </p>
        <small className="mt-6 opacity-50 text-[12px] tracking-widest flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          © 2026 SUPEREE · EE <Heart size={11} className="fill-current" /> SU ·
          <MousePointerClick size={12} /> 试试 5 连点它 <ArrowUp size={12} />
        </small>
      </footer>
    </main>
  );
}
