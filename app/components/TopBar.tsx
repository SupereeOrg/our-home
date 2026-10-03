"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useRafScroll } from "./useRafScroll";

const EASE = [0.22, 1, 0.36, 1] as const;

/* 移动端目录：和首页同一门 rise + 逐行错开 */
const menuParent = {
  enter: {},
  center: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const menuRise = {
  enter: { y: 24, opacity: 0, filter: "blur(6px)" },
  center: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

const NAV_LINKS = [
  { href: "/", label: "八页纸", external: false },
  { href: "https://superee.paperee.guru/", label: "我们的小屋", external: true },
  { href: "https://paperee.guru", label: "ee 的主页", external: true },
  { href: "https://supage.eu.org", label: "su 的主页", external: true },
  { href: "/letters", label: "我们的信", external: false },
];

/* 全站统一顶栏骨架：左 logo / 中导航 / 右插槽（首页放页码，子页面留空）
   fixed 钉住视口（首页无滚动恒透明；信页滚过 24px 后纸底托出，保证字不透） */
export default function TopBar({ right, onLogoClick }: { right?: ReactNode; onLogoClick?: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  useRafScroll(() => setScrolled(window.scrollY > 24));
  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  /* 切页即关：站内 Link 跳转必换 pathname */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  /* 开着时锁底滚动 + Esc 关 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open ]);
  const isActive = (href: string, external: boolean) =>
    !external && (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)));
  const items = NAV_LINKS.map((l, i) => {
    const active = isActive(l.href, l.external);
    const inner = (
      <>
        <span className="kicker opacity-40 w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
        <span className={active ? "hl hl-yellow" : undefined}>{l.label}</span>
        {l.external && <ArrowUpRight size={18} aria-hidden className="opacity-40 shrink-0" />}
      </>
    );
    const cls =
      "flex items-center gap-3 py-3 font-black text-balance leading-snug min-h-12 hover:opacity-70 transition-opacity";
    return (
      <motion.div key={l.href} variants={menuRise}>
        {l.external ? (
          <a href={l.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className={cls} style={{ fontSize: "clamp(26px,7vw,38px)" }}>
            {inner}
          </a>
        ) : active ? (
          /* 已在该页：点一下只关目录（首页顺带回封面，走桌面端同 URL 回顶的规矩） */
          <button
            type="button"
            onClick={() => {
              if (l.href === "/" && onLogoClick) onLogoClick();
              setOpen(false);
            }}
            aria-current="page"
            className={`${cls} text-left`}
            style={{ fontSize: "clamp(26px,7vw,38px)" }}
          >
            {inner}
          </button>
        ) : (
          <Link href={l.href} className={cls} style={{ fontSize: "clamp(26px,7vw,38px)" }}>
            {inner}
          </Link>
        )}
      </motion.div>
    );
  });
  const overlayCls = "fixed inset-0 z-[60] bg-paper flex flex-col md:hidden";
  const header = (
    <div className="flex items-center justify-between pl-6 pr-3 py-2">
      <span className="kicker opacity-50">目录 · CONTENTS</span>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="关闭目录"
        autoFocus={!reduced}
        className="inline-flex items-center justify-center min-w-12 min-h-12 px-3 font-bold text-[15px] hover:opacity-60 transition-opacity"
      >
        <X size={20} aria-hidden />
      </button>
    </div>
  );
  const footer = <p className="px-6 pb-10 kicker opacity-40">© 2026 八页纸 · 广州 ↔ 拉萨</p>;
  const logo = (
    <>
      <Image src="/avatars/mix-256.webp" alt="八页纸" width={96} height={96} unoptimized loading="eager" className="object-cover opacity-90" style={{ width: 24, height: 24 }} />
      <span className="font-black text-[18px] tracking-[0.1em] opacity-90 group-hover:opacity-100 transition">八页纸</span>
      <span className="kicker opacity-45 hidden sm:inline">ee × su</span>
    </>
  );
  return (
    <>
    <div
      className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 py-5 border-b transition-colors duration-300 ${
        scrolled ? "bg-paper/85 backdrop-blur-md rule" : "bg-transparent border-transparent"
      }`}
    >
      {onLogoClick ? (
        <button onClick={onLogoClick} className="flex items-center gap-2.5 p-2 -m-2 text-left group">
          {logo}
        </button>
      ) : (
        <Link href="/" className="flex items-center gap-2.5 p-2 -m-2 group" aria-label="回首页">
          {logo}
        </Link>
      )}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6" aria-label="站内">
        {NAV_LINKS.map((l) => {
          const active = isActive(l.href, l.external);
          const cls = "kicker navlink";
          if (active) {
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current="page"
                className={cls}
                onClick={(e) => {
                  /* 已在该页首页：同 URL 导航不会滚顶，自己回顶（减弱动效直接跳）；
                     首页是个例外：“/” 下面还有八页，回封面走 onLogoClick（即 go(0)） */
                  if (pathname === l.href) {
                    e.preventDefault();
                    if (l.href === "/" && onLogoClick) {
                      onLogoClick();
                      return;
                    }
                    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
                    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
                  }
                }}
              >
                {l.label}
              </Link>
            );
          }
          return l.external ? (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={cls}>
              {l.label}
            </a>
          ) : (
            <Link key={l.href} href={l.href} className={cls}>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center">
        {right}
        {/* 移动端目录钮：桌面端中栏导航在 md 以下没有位置，收进这里 */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="打开目录"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center min-w-12 min-h-12 px-3 ml-1 kicker hover:opacity-60 transition-opacity"
        >
          目录
        </button>
      </div>
    </div>
    {/* 移动端目录：整张纸盖下来，01–05 大字，当前页描黄 */}
    <AnimatePresence>
      {open &&
        (reduced ? (
          <div role="dialog" aria-modal="true" aria-label="目录" className={overlayCls}>
            {header}
            <nav aria-label="站内" className="flex-1 overflow-y-auto px-6 pb-8 flex flex-col justify-center">
              {items}
            </nav>
            {footer}
          </div>
        ) : (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="目录"
            className={overlayCls}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {header}
            <motion.nav
              aria-label="站内"
              variants={menuParent}
              initial="enter"
              animate="center"
              className="flex-1 overflow-y-auto px-6 pb-8 flex flex-col justify-center"
            >
              {items}
            </motion.nav>
            {footer}
          </motion.div>
        ))}
    </AnimatePresence>
    </>
  );
}
