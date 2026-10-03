import TopBar from "../../components/TopBar";

/* 信详情骨架：署名栏 + 题面 + 正文扫墨，与 letter-body 同宽 */
export default function Loading() {
  return (
    <main className="no-round relative min-h-[100svh]">
      <TopBar />
      <article className="relative max-w-2xl mx-auto px-6 pt-28 pb-16" aria-busy="true" aria-label="正在拆信">
        <div className="flex items-center gap-3 mt-6">
          <div className="skeleton-bar w-10" style={{ height: 40 }} />
          <div className="flex-1">
            <div className="skeleton-bar w-24" />
            <div className="skeleton-bar mt-2" style={{ width: "40%" }} />
          </div>
        </div>
        <div className="skeleton-bar mt-6" style={{ width: "72%" }} />
        <div className="skeleton-bar mt-2" style={{ width: "92%" }} />
        <div className="skeleton-bar mt-2" style={{ width: "85%" }} />
        <div className="skeleton-bar mt-2" style={{ width: "60%" }} />
      </article>
    </main>
  );
}
