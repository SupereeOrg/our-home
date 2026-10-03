/* 署名徽：ee 绿 / su 粉 / ai 米，全站只此一处（短 id，动词由 surrounding 文案承担） */
import { FROM_META } from "@/lib/from";
import type { From } from "@/lib/from";

export default function FromBadge({ from, className = "" }: { from: From; className?: string }) {
  return (
    <span
      className={`text-[10px] tracking-[0.2em] px-2 py-1 border border-ink ${FROM_META[from].wash} ${className}`}
    >
      {from}
    </span>
  );
}
