// 框选功能的纯计算函数。与 DOM 无关，便于单元测试。
// 文档：notes/为选择作品的功能添加框选功能.md

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

/** 由两个点生成规范化的矩形（保证 left ≤ right、top ≤ bottom） */
export function rectFromPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): Rect {
  return {
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),
    right: Math.max(x1, x2),
    bottom: Math.max(y1, y2),
  }
}

/** 判断两个矩形是否有重叠区域。
 * 宽或高为 0 的线状矩形，只要穿过对方内部（不含边界）也算相交。 */
export function rectsIntersect(a: Rect, b: Rect): boolean {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  )
}

/** 把视口坐标的矩形转换为文档坐标（加上滚动量） */
export function toDocRect(rect: Rect, scrollX: number, scrollY: number): Rect {
  return {
    left: rect.left + scrollX,
    top: rect.top + scrollY,
    right: rect.right + scrollX,
    bottom: rect.bottom + scrollY,
  }
}
