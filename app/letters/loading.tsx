import TopBar from "../components/TopBar";

/* 信列表骨架：与 LettersExplorer 同一纸语言，点击即出，不白等 RSC payload */
export default function Loading() {
  return (
    <main className="no-round relative min-h-[100svh]">
      <TopBar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20" aria-busy="true" aria-label="正在拆信">
        <div className="skeleton-bar w-24" />
        <div className="skeleton-bar mt-4" style={{ width: "52%" }} />
        <div className="mt-10 border border-ink p-4 sm:p-5">
          <div className="skeleton-bar w-24" />
          <div className="skeleton-bar mt-2" style={{ width: "68%" }} />
        </div>
        <div className="mt-8 border-t rule">
          {[68, 82, 55].map((w, i) => (
            <div key={i} className="py-3.5 border-b rule">
              <div className="skeleton-bar w-24" />
              <div className="skeleton-bar mt-2" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
