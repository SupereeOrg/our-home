# 八页纸 · 纸片君 × 苏淋

广州 ↔ 拉萨，相隔 2,295 km 的两个人。纸上八页，信接着写。

线上：<https://www.onnx.click> · RSS：<https://www.onnx.click/rss.xml>

## 这是什么

给 ee（纸片君，广州）× su（苏淋，拉萨）做的情侣纪念站。首页是八页全屏翻页纸（封面 / 纸片君 / 苏淋 / 数字 / 故事 / 歌与天 / 信 / 日常），`/letters` 是持续生长的信箱——想到就写，写完就放这。

* 八页纸：滚轮 / 键盘 / 触摸翻页，方向感知的纸张浮动 + 逐字遮罩标题
* 信箱：Markdown 写信（GFM + 公式 + 四只纸指令），搜索 + 标签筛选，RSS 订阅
* 歌与天：iTunes 30 秒试听 + 两地实时气温
* 彩蛋：Konami 密信、控制台爱心、`humans.txt`、走丢页
* 无障碍：系统开“减弱动态效果”自动进平铺阅读版，且可手动来回切换

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 16 App Router（全静态输出）+ React 19 |
| 样式 | Tailwind CSS v4，纸色 `#f7f3ec` / 墨色 `#23201c` |
| 动效 | framer-motion + `next-view-transitions` |
| 内容 | `content/letters/*.md`（`gray-matter` frontmatter），无数据库 |
| 渲染 | `react-markdown` + `remark-gfm/math/directive` + `rehype-katex` |
| 字体 | Noto Serif SC（400/700/900）+ Space Grotesk，自托管 |

## 目录结构

```
app/
  page.tsx              # 首页八页纸（client pager）
  layout.tsx            # 字体/转场/控制台彩蛋
  letters/
    page.tsx            # 信列表（静态 + 客户端检索）
    loading.tsx         # 导航骨架
    error.tsx           # 信碎了的兜底
    [slug]/
      page.tsx          # 信详情
      loading.tsx
      opengraph-image.tsx  # 每封信的分享卡
  api/letters/route.ts  # 首页预取最新三封
  components/           # TopBar / LettersExplorer / LetterRow / …
  manifest.ts robots.ts sitemap.ts opengraph-image.tsx
lib/
  letters.ts            # 读盘 + meta（sitemap 用轻读，别用 withContent 版）
  stats.ts              # 全站数字单一数据源 ★改数只改这里
  from.ts               # ee/su/ai 署名三态
  paper-directives.ts   # :::center/right/small + :hl[]，h1 自动降 h2
  reading.ts            # 阅读时长估算
content/
  letters/*.md          # 信，文件名即网址
  WRITING.md            # 写作指南（必读）
public/avatars/         # 头像统一 256 系列；原图备份放 assets-originals/（不进仓）
```

## 快速开始

```bash
npm install
npm run dev      # 本地 http://localhost:3000
npm run check    # tsc 类型检查
npm run build    # 全静态构建（14 路由）
```

线上是纯静态托管，`npm run build` 过即能发。

## 写信

完整规范见 [`content/WRITING.md`](content/WRITING.md)，三句话版：

1. 新建 `content/letters/<slug>.md`，frontmatter 照抄（`from` 只能是 `ee/su/ai`）。
2. 段落间空一行；纸指令只有 `:::center / :::right / :::small` + `:hl[荧光]` 四只。
3. 正文别用 `#` 一级标题（会自动降为 `h2`，题面已经是 `h1`）。

## 约定（踩过坑的）

* 数字只改 `lib/stats.ts`，别在页面里手写（平铺版/分享卡都引用它）。
* 头像只用 `*-256.webp`，`next/image` 一律 `unoptimized` + 固定 intrinsic，展示尺寸走 CSS——否则同一张图会下两次。
* KaTeX CSS 只在信详情页引入，别回全局 `layout`。
* 改首页文案记得同步平铺版那一段（同一文件内，搜“平铺阅读版”）。
* `AnimatePresence custom={dir}` 别删，反向翻页离场方向靠它。

## 许可

拥抱许可 Hug 1.0：署名即可转发，不作商用；禁止冷战，转载请先说晚安。见 [`public/humans.txt`](public/humans.txt)。
