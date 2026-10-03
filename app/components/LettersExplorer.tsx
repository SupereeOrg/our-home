"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "next-view-transitions";
import { ArrowUpRight, Search, SearchX, X } from "lucide-react";
import { FROM_META } from "@/lib/from";
import { readingMinutes } from "@/lib/reading";
import LetterRow from "./LetterRow";
import type { Letter } from "@/lib/letters";

/* 信的检索台：搜标题/正文/标签 + 按标签筛，和刊物排印同一套语言。
   ?tag= 自己从 URL 取（Suspense 下游），列表页得以保持纯静态、秒进。 */
export default function LettersExplorer({ letters }: { letters: Letter[] }) {
  const sp = useSearchParams();
  const allTags = useMemo(() => {
    const count = new Map<string, number>();
    for (const l of letters) for (const t of l.tags) count.set(t, (count.get(t) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]);
  }, [letters]);
  const pick = (t: string | null) => (t && allTags.some(([x]) => x === t) ? t : "");
  const [tag, setTag] = useState(() => pick(sp.get("tag")));
  /* 信页标签链进来（/letters?tag=x），URL 变就跟 */
  useEffect(() => {
    setTag(pick(sp.get("tag")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);
  const [q, setQ] = useState("");
  const filtering = q.trim() !== "" || tag !== "";

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return letters.filter((l) => {
      if (tag && !l.tags.includes(tag)) return false;
      if (!needle) return true;
      const hay = `${l.title}\n${l.excerpt}\n${l.content}\n${l.tags.join(" ")}\n${l.date}`.toLowerCase();
      return needle.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [letters, q, tag]);

  const [featured, ...rest] = letters;

  return (
    <div>
      {/* 检索卡：纸卡语言，聚焦只靠标签变实，不加任何扫光 */}
      <div className="group mt-10 border border-ink p-4 sm:p-5">
        <p className="kicker opacity-40 group-focus-within:opacity-90 transition-opacity flex items-center gap-2">
          <Search size={12} aria-hidden /> 检索 · SEARCH
        </p>
        <label className="block mt-2">
          <span className="sr-only">搜索信件</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜标题、信里的话、标签…"
            className="w-full bg-transparent font-black placeholder:font-normal placeholder:opacity-35 focus:outline-none py-1"
            style={{ fontSize: "clamp(19px,2.6vw,26px)" }}
          />
        </label>
        {q && (
          <button onClick={() => setQ("")} className="kicker mt-2 inline-flex items-center gap-1.5 py-2 opacity-50 hover:opacity-100 transition-opacity" aria-label="清空搜索">
            清空 <X size={12} aria-hidden />
          </button>
        )}
      </div>
      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="按标签筛选">
          <button
            onClick={() => setTag("")}
            aria-pressed={tag === ""}
            className={`kicker px-3 py-1.5 min-h-[44px] inline-flex items-center border transition-colors ${tag === "" ? "border-ink" : "border-ink/30 opacity-60 hover:opacity-100"}`}
          >
            <span className={tag === "" ? "hl hl-yellow" : ""}>全部</span>
          </button>
          {allTags.map(([t, n]) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? "" : t)}
              aria-pressed={tag === t}
              className={`kicker px-3 py-1.5 min-h-[44px] border transition-colors inline-flex items-center gap-1.5 ${tag === t ? "border-ink" : "border-ink/30 opacity-60 hover:opacity-100"}`}
            >
              <span className={tag === t ? "hl hl-yellow" : ""}>#{t}</span>
              <span className="tabular-nums opacity-50">{String(n).padStart(2, "0")}</span>
              {tag === t && <X size={12} aria-hidden />}
            </button>
          ))}
        </div>
      )}

      {filtering ? (
        <div className="mt-8">
          <p className="kicker opacity-50" role="status">
            找到 {String(results.length).padStart(2, "0")} 封 · RESULTS{q.trim() && <> · {q.trim()}</>}{tag && <> · #{tag}</>}
          </p>
          {results.length > 0 ? (
            <div className="mt-2 border-t rule">
              {results.map((l) => (
                <LetterRow key={l.slug} l={l} index={letters.indexOf(l)} showTags />
              ))}
            </div>
          ) : (
            <div className="mt-2 border border-ink p-10 text-center">
              <SearchX size={20} aria-hidden className="mx-auto opacity-40" />
              <p className="mt-3 text-[14px] opacity-60">没找到。换个词，或者<button onClick={() => { setQ(""); setTag(""); }} className="underline underline-offset-4 font-bold">看看全部</button>。</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {featured && <FeaturedCard l={featured} />}
          {rest.length > 0 && (
            <div className="mt-12">
              <p className="kicker opacity-50">往期存档 · ARCHIVE</p>
              <div className="mt-2 border-t rule">
                {rest.map((l, i) => (
                  <LetterRow key={l.slug} l={l} index={i + 1} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FeaturedCard({ l }: { l: Letter }) {
  return (
    <Link
      href={`/letters/${l.slug}`}
      className={`group block mt-10 border border-ink p-6 sm:p-9 ${FROM_META[l.from].wash}`}
    >
      <p className="kicker opacity-60 flex items-center gap-3">
        最新一封 · {l.date || "未署期"} · 约读 {readingMinutes(l.content)} 分钟
      </p>
      <p className="font-black mt-3 text-balance leading-tight" style={{ fontSize: "clamp(26px,4.5vw,44px)" }}>
        {l.title}
      </p>
      <p className="mt-3 text-[14px] leading-8 opacity-75 max-w-[560px]">{l.excerpt}</p>
      <p className="mt-6 flex items-center gap-2 text-[13px] font-bold">
        <span className="px-2 py-0.5 border border-ink bg-paper text-[10px] tracking-[0.2em]">
          {FROM_META[l.from].sign} 写
        </span>
        <span className="inline-flex items-center gap-1 opacity-60 group-hover:opacity-100 group-hover:gap-2.5 transition-all">
          拆信 <ArrowUpRight size={14} aria-hidden />
        </span>
      </p>
    </Link>
  );
}
