import type { Root } from "mdast";
import { SKIP, visit } from "unist-util-visit";

/* 纸房子指令集（remark-directive 标准语法，不发明野语法）：
   :::center / :::right / :::small 块容器（以 ::: 收尾），:hl[] 行内荧光。
   未收录的名字还原成原文——否则 :47 这类时间写法会被吃成空 div，
   空 div 落进 p 里即非法嵌套，直接炸 hydration。 */
const MAP: Record<string, { tag: string; cls: string }> = {
  center: { tag: "div", cls: "paper-center" },
  right: { tag: "div", cls: "paper-right" },
  small: { tag: "div", cls: "paper-small" },
  hl: { tag: "span", cls: "hl hl-yellow" },
};

export default function paperDirectives() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: Root, file: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      /* 信正文 h1 降 h2：页面的题面已经是 h1，md 里再写 # 会一页双 h1 */
      if (node.type === "heading" && node.depth === 1) {
        node.depth = 2;
        return;
      }
      if (
        node.type !== "containerDirective" &&
        node.type !== "leafDirective" &&
        node.type !== "textDirective"
      ) {
        return;
      }
      const m = MAP[node.name];
      if (m) {
        const data = node.data || (node.data = {});
        data.hName = m.tag;
        data.hProperties = { ...(data.hProperties || {}), className: m.cls.split(" ") };
        return;
      }
      if (index === undefined || !parent) return;
      if (node.type === "containerDirective") {
        parent.children.splice(index, 1, ...(node.children || []));
      } else {
        const raw = String(file?.value ?? "").slice(
          node.position?.start?.offset ?? 0,
          node.position?.end?.offset ?? 0
        );
        parent.children.splice(index, 1, { type: "text", value: raw || `:${node.name}` });
      }
      return [SKIP, index];
    });
  };
}
