"use client";

import { Link } from "next-view-transitions";
import { useEffect } from "react";
import { ArrowLeft, Feather } from "lucide-react";
import TopBar from "../components/TopBar";

/* 信碎了也别白屏：纸语气 + 重试，和走丢页同一门手艺 */
export default function LettersError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="no-round relative min-h-[100svh] flex items-center justify-center">
      <TopBar />
      <article className="relative w-full max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="kicker opacity-50 flex items-center justify-center gap-2">
          <Feather size={12} aria-hidden /> 信纸卡住了
        </p>
        <h1 className="font-black mt-6 text-balance leading-[1.15]" style={{ fontSize: "clamp(32px,5.5vw,52px)" }}>
          这一封，拆到一半散了。
        </h1>
        <p className="mt-6 text-[15px] leading-8 opacity-70">纸没丢，只是胶水没粘住。再拆一次，多半就开了。</p>
        <div className="mt-10 flex items-center justify-center gap-8 text-[13px]">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 py-3 px-5 border border-ink font-bold hover:bg-ink hover:text-paper transition-colors"
          >
            再拆一次
          </button>
          <Link href="/letters" className="inline-flex items-center gap-2 py-3 font-bold opacity-60 hover:opacity-100 transition-opacity">
            <ArrowLeft size={14} aria-hidden /> 全部信件
          </Link>
        </div>
      </article>
    </main>
  );
}
