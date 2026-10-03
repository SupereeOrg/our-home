"use client";

import { useEffect } from "react";

/* 控制台彩蛋：打开 devtools 的人，值得一颗心（♥ 单宽，控制台摆不歪） */
const HEART = [
  "  ♥♥   ♥♥  ",
  " ♥♥♥♥ ♥♥♥♥ ",
  "♥♥♥♥♥♥♥♥♥♥♥",
  "♥♥♥♥♥♥♥♥♥♥♥",
  " ♥♥♥♥♥♥♥♥♥ ",
  "  ♥♥♥♥♥♥♥  ",
  "   ♥♥♥♥♥   ",
  "    ♥♥♥    ",
  "     ♥     ",
].join("\n");

export default function ConsoleEgg() {
  useEffect(() => {
    console.log(
      "%c八页纸 · 被你发现啦\n33,126 条，85 个晚安，纸上八页，欢迎翻。",
      "background:#ffdd33;color:#000;padding:4px 8px;line-height:2;"
    );
    console.log(`%c${HEART}\nseeu —— s 和 u 把 ee 抱在中间`, "color:#e5486f;line-height:1.6;");
    console.log("拥抱许可 Hug 1.0：署名即可转发，不作商用；禁止冷战，转载请先说晚安。");
  }, []);
  return null;
}
