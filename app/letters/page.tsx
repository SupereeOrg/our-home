import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "next-view-transitions";
import { ArrowLeft, Feather, Rss } from "lucide-react";
import AllowScroll from "../components/AllowScroll";
import LettersExplorer from "../components/LettersExplorer";
import TopBar from "../components/TopBar";
import { getAllLettersWithContent } from "@/lib/letters";

export const metadata: Metadata = {
  title: "我们的信 — 八页纸",
  description: "ee 与 su 的信，一封一封往里装。",
};

/* 纯静态：?tag= 下沉到客户端读，构建期一次 baked，点进来秒切 + 顶栏 Link 自动预取 */
export default async function LettersPage() {
  const letters = getAllLettersWithContent();

  return (
    <main className="no-round relative min-h-[100svh]">
      <AllowScroll />
      <TopBar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <p className="kicker opacity-50 flex items-center gap-2">
          <Feather size={12} aria-hidden /> 我们的信 · LETTERS · {String(letters.length).padStart(2, "0")} 封
        </p>
        <h1 className="font-black mt-4 text-balance" style={{ fontSize: "clamp(40px,7vw,72px)" }}>
          我们的<span className="hl hl-yellow">信</span>。
        </h1>
        <p className="mt-4 text-[16px] leading-9 opacity-70 max-w-[520px]">
          八页纸翻完，信接着写。想到什么就写，写完就放在这里。
        </p>

        {letters.length > 0 ? (
          <Suspense
            fallback={
              <div className="mt-10" aria-busy="true" aria-label="正在拆信">
                <div className="skeleton-bar w-24" />
                <div className="skeleton-bar mt-2" style={{ width: "68%" }} />
                <div className="skeleton-bar mt-2" style={{ width: "45%" }} />
              </div>
            }
          >
            <LettersExplorer letters={letters} />
          </Suspense>
        ) : (
          <div className="mt-10 border border-ink p-8 text-center">
            <Feather size={20} aria-hidden className="mx-auto opacity-40" />
            <p className="mt-3 text-[14px] opacity-60">还没有信。去写第一封吧。</p>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 py-3 text-[13px] font-bold opacity-60 hover:opacity-100 transition-opacity">
            <ArrowLeft size={14} aria-hidden /> 回八页纸
          </Link>
          <Link href="/rss.xml" className="inline-flex items-center gap-2 py-3 text-[13px] font-bold opacity-60 hover:opacity-100 transition-opacity">
            <Rss size={14} aria-hidden /> RSS 订阅
          </Link>
        </div>
      </div>
    </main>
  );
}
