import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";
import FromBadge from "./FromBadge";
import type { LetterMeta } from "@/lib/letters";

/* 信行：首页预告 / 列表存档 / 搜索结果共用同一只。
   index 缺席即无序号列；showTags 只在筛选中展示命中标签（纯文本，行内不嵌链接）。 */
export default function LetterRow({ l, index, showTags }: { l: LetterMeta; index?: number; showTags?: boolean }) {
  return (
    <Link
      href={`/letters/${l.slug}`}
      className={`group grid gap-1 py-5 border-b rule items-baseline ${
        index !== undefined ? "sm:grid-cols-[44px_130px_1fr_auto] sm:gap-5" : "sm:grid-cols-[130px_1fr_auto] sm:gap-4"
      }`}
    >
      {index !== undefined && (
        <span className="font-bold tabular-nums opacity-30" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <span className="kicker opacity-50">{l.date || "未署期"}</span>
      <span className="min-w-0">
        <span className="block text-[17px] font-black truncate group-hover:opacity-70 transition-opacity">{l.title}</span>
        <span className="block text-[13px] leading-7 opacity-60 truncate mt-0.5">{l.excerpt}</span>
        {showTags && l.tags.length > 0 && (
          <span className="block kicker opacity-40 mt-1">#{l.tags.join(" #")}</span>
        )}
      </span>
      <span className="flex items-center gap-2 shrink-0">
        <FromBadge from={l.from} />
        <ArrowUpRight size={14} aria-hidden className="opacity-30 group-hover:opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
      </span>
    </Link>
  );
}
