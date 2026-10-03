import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { From } from "./from";

export type { From };
export { FROM_META } from "./from";

export type LetterMeta = {
  slug: string;
  title: string;
  date: string;
  from: From;
  excerpt: string;
  tags: string[];
};

export type Letter = LetterMeta & { content: string };

/* frontmatter tags 接受数组或逗号字符串，统一成去重数组 */
function parseTags(data: Record<string, unknown>): string[] {
  const raw = data.tags;
  const list = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];
  return [...new Set(list.map((t) => String(t).trim()).filter(Boolean))];
}

/* 单次读盘 + 组装 meta，getLetterMeta/getLetter 共用，不再各读一遍 */
function readLetter(slug: string): Letter | null {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const front: Record<string, unknown> = data as Record<string, unknown>;
  const meta: LetterMeta = {
    slug,
    title: String(front.title ?? slug),
    date: String(front.date ?? ""),
    from: front.from === "su" ? "su" : front.from === "ai" ? "ai" : "ee",
    excerpt: String(front.excerpt ?? ""),
    tags: parseTags(front),
  };
  return { ...meta, content };
}

const DIR = path.join(process.cwd(), "content", "letters");

export function getLetterSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getLetterMeta(slug: string): LetterMeta | null {
  const l = readLetter(slug);
  if (!l) return null;
  const { content: _content, ...meta } = l;
  return meta;
}

export function getAllLetters(): LetterMeta[] {
  return getAllLettersWithContent()
    .map(({ content: _content, ...meta }) => meta)
    .sort(compareDateDesc);
}

/* 列表页检索台 + RSS：一次读全，避免 N+1 双读盘 */
export function getAllLettersWithContent(): Letter[] {
  return getLetterSlugs()
    .map(readLetter)
    .filter((l): l is Letter => l !== null)
    .sort(compareDateDesc);
}

function compareDateDesc(a: LetterMeta, b: LetterMeta): number {
  return b.date.localeCompare(a.date);
}

export { readingMinutes } from "./reading";

export function getLetter(slug: string): Letter | null {
  return readLetter(slug);
}
