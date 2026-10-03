import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import paperDirectives from "@/lib/paper-directives";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AllowScroll from "../../components/AllowScroll";
import TopBar from "../../components/TopBar";
import { getAllLettersWithContent, getLetter, getLetterSlugs, readingMinutes } from "@/lib/letters";
import { FROM_META } from "@/lib/from";

export function generateStaticParams() {
  return getLetterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const letter = getLetter(slug);
  return { title: letter ? `${letter.title} — 我们的信` : "我们的信" };
}

export default async function LetterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  /* 全量只读一次：正文 + 上下封都从这里派生 */
  const all = getAllLettersWithContent();
  const idx = all.findIndex((l) => l.slug === slug);
  if (idx < 0) notFound();
  const letter = all[idx];
  const wash = FROM_META[letter.from].wash;
  const avatar = FROM_META[letter.from].avatar;
  const who = FROM_META[letter.from].who;
  const minutes = readingMinutes(letter.content);

  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <main className="no-round relative min-h-[100svh]">
      <AllowScroll />
      <TopBar />
      {/* 信纸氛围：ee 绿 / su 粉，一眼认出谁写的 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute left-1/2 top-[-160px] h-[380px] w-[680px] -translate-x-1/2 rounded-full ${wash}`} style={{ opacity: 0.55, filter: "blur(10px)", maskImage: "radial-gradient(closest-side, black 0%, transparent 70%)", WebkitMaskImage: "radial-gradient(closest-side, black 0%, transparent 70%)" }} />
      </div>

      <article className="relative max-w-2xl mx-auto px-6 pt-28 pb-16">
        {/* 署名栏 */}
        <div className="flex items-center gap-3 mt-6">
          <Image src={avatar} alt={who} width={40} height={40} priority className="border border-ink object-cover w-10 h-10" />
          <div>
            <p className="text-[13px] font-bold">{who}</p>
            <p className="kicker opacity-50 mt-0.5">
              {letter.date || "未署期"} · 约读 {minutes} 分钟
            </p>
          </div>
        </div>

        <h1 className="font-black mt-6 text-balance leading-[1.15]" style={{ fontSize: "clamp(32px,5.5vw,52px)" }}>
          {letter.title}
        </h1>
        {letter.excerpt && (
          <p className="mt-4 text-[16px] leading-9 opacity-65 border-l-2 border-ink pl-4">{letter.excerpt}</p>
        )}
        {letter.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2" aria-label="标签">
            {letter.tags.map((t) => (
              <Link key={t} href={`/letters?tag=${encodeURIComponent(t)}`} className="kicker navlink inline-block py-2">
                #{t}
              </Link>
            ))}
          </div>
        )}

        <div className="letter-body mt-8">
          <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkDirective, paperDirectives]} rehypePlugins={[rehypeKatex]}>{letter.content}</Markdown>
        </div>

        {/* 落款印 */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Image src={avatar} alt={who} width={52} height={52} className="border border-ink object-cover w-[52px] h-[52px] opacity-90" />
          <p className="text-[13px] font-bold tracking-[0.2em]">{FROM_META[letter.from].sign} 寄 · {letter.date || "未署期"}</p>
          <p className="kicker opacity-40">· 全文完 ·</p>
          {/* 纸房子自家许可：官方皮，温柔馅 */}
          <p className="mt-6 text-center kicker opacity-40">
            本信采用「拥抱许可 Hug 1.0」：署名即可转发，不作商用；禁止冷战，转载请先说晚安
          </p>
        </div>

        {/* 上下封 */}
        {(newer || older) && (
          <nav className="mt-12 grid sm:grid-cols-2 border border-ink" aria-label="上下封">
            <div className="border-b sm:border-b-0 sm:border-r rule">
              {newer ? (
                <Link href={`/letters/${newer.slug}`} className="group block p-5">
                  <span className="kicker opacity-50">上一封 · 新</span>
                  <span className="mt-2 flex items-center gap-2 text-[15px] font-black group-hover:opacity-70 transition-opacity">
                    <ArrowLeft size={14} aria-hidden className="shrink-0" /> <span className="min-w-0">{newer.title}</span>
                  </span>
                </Link>
              ) : (
                <span className="block p-5 kicker opacity-30">没有更新的了</span>
              )}
            </div>
            <div className="sm:text-right">
              {older ? (
                <Link href={`/letters/${older.slug}`} className="group block p-5">
                  <span className="kicker opacity-50">下一封 · 旧</span>
                  <span className="mt-2 flex items-center gap-2 sm:justify-end text-[15px] font-black group-hover:opacity-70 transition-opacity">
                    <span className="min-w-0">{older.title}</span> <ArrowRight size={14} aria-hidden className="shrink-0" />
                  </span>
                </Link>
              ) : (
                <span className="block p-5 kicker opacity-30">到底了，去写新的吧</span>
              )}
            </div>
          </nav>
        )}

        <div className="mt-10 flex items-center justify-between text-[13px]">
          <Link href="/letters" className="inline-flex items-center gap-2 py-3 font-bold opacity-80 hover:opacity-100 transition-opacity">
            <ArrowLeft size={14} aria-hidden /> 全部信件
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 py-3 text-[13px] font-bold opacity-60 hover:opacity-100 transition-opacity">回八页纸 <ArrowRight size={14} aria-hidden /></Link>
        </div>
      </article>
    </main>
  );
}
