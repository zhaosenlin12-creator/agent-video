p = r'D:\kaifa-teacher\moneyprinter\agent-video\src\components\ElementRenderer.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace containerStyle: combine translate(-50%, -50%) with s.transform
old = '''  // 容器层：用 absolute 定位 + flex center，保证元素在 (x, y) 处居中
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: typeof el.x === "number" ? el.x : el.x ? el.x : "50%",
    top: typeof el.y === "number" ? el.y : el.y ? el.y : "50%",
    transform: s.transform,
    opacity: s.opacity,
    transformOrigin: "center",
    willChange: "transform, opacity",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };'''

new = '''  // 容器层：在 (x, y) 处绝对定位居中 (combine centering with motion transform)
  const xNum = typeof el.x === "number" ? el.x : null;
  const yNum = typeof el.y === "number" ? el.y : null;
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: xNum !== null ? xNum : (el.x ? el.x : "50%"),
    top: yNum !== null ? yNum : (el.y ? el.y : "50%"),
    // combine: translate(-50%, -50%) + motion transform
    transform: (xNum !== null || yNum !== null)
      ? "translate(-50%, -50%) " + s.transform
      : s.transform,
    opacity: s.opacity,
    transformOrigin: "center",
    willChange: "transform, opacity",
  };'''

c = c.replace(old, new)
with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('patched:', 'translate(-50%, -50%) ' in c)