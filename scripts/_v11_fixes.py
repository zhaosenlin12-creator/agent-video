import os
p = os.path.join(os.path.dirname(__file__), '..', 'src', 'data.ts')
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# === v11 fixes: prevent text overflow, more cartoon elements, better SFX ===

# 1. Reduce WebkitTextStroke from 4px to 2px to prevent right-edge overflow
# This affects highlight=true titles

# 2. Specific textSize reductions for overflowing highlights:
# 02_materials: '全套 30 元搞定' 74 -> 66
c = c.replace('id: "price", kind: "label", entrance: "spring-rise", delay: 46, text: "\u5168\u5957 30 \u5143\u641e\u5b9a", textColor: "#FFD400", textSize: 74',
              'id: "price", kind: "label", entrance: "spring-rise", delay: 46, text: "\u5168\u5957 30 \u5143\u641e\u5b9a", textColor: "#FFD400", textSize: 66')

# 03_model: 'info' '三维结构' 76 -> 68
c = c.replace('id: "info", kind: "label", entrance: "spring-pop", delay: 50, text: "\u4e09\u7ef4\u7ed3\u6784", textColor: "#FFD400", textSize: 76',
              'id: "info", kind: "label", entrance: "spring-pop", delay: 50, text: "\u4e09\u7ef4\u7ed3\u6784", textColor: "#FFD400", textSize: 68')

# 04_slice: '200 层路径' 84 -> 72
c = c.replace('id: "info", kind: "label", entrance: "spring-rise", delay: 44, text: "200 \u5c42\u8def\u5f84", textColor: "#FFD400", textSize: 84',
              'id: "info", kind: "label", entrance: "spring-rise", delay: 44, text: "200 \u5c42\u8def\u5f84", textColor: "#FFD400", textSize: 72')

# 05_print: '78%' 82 -> 72 + move up further
c = c.replace('id: "progress", kind: "label", entrance: "spring-pop", delay: 48, text: "78%", textColor: "#FFD400", textSize: 82',
              'id: "progress", kind: "label", entrance: "spring-pop", delay: 48, text: "78%", textColor: "#FFD400", textSize: 72')

# 05_print: caption '塑料一秒秒堆出来' 50 -> 46 + bg width tighter
c = c.replace('{ id: "cap", kind: "label", entrance: "fade", delay: 66, text: "\u5851\u6599\u4e00\u79d2\u79d2\u5806\u51fa\u6765", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 }',
              '{ id: "cap", kind: "label", entrance: "fade", delay: 66, text: "\u5851\u6599\u4e00\u79d2\u79d2\u5806\u51fa\u6765", textColor: "#FFFFFF", textSize: 46, x: 540, y: 1720 }')

# 06_layer: '120 层' 86 -> 74
c = c.replace('id: "layer-count", kind: "label", entrance: "spring-pop", delay: 44, text: "120 \u5c42", textColor: "#FFD400", textSize: 86',
              'id: "layer-count", kind: "label", entrance: "spring-pop", delay: 44, text: "120 \u5c42", textColor: "#FFD400", textSize: 74')

# 07_remove: '完成' 92 -> 84
c = c.replace('id: "check", kind: "label", entrance: "spring-pop", delay: 52, text: "\u5b8c\u6210", textColor: "#FFD400", textSize: 92',
              'id: "check", kind: "label", entrance: "spring-pop", delay: 52, text: "\u5b8c\u6210", textColor: "#FFD400", textSize: 84')

# 08_servo: '3 根线' 92 -> 84
c = c.replace('id: "wires-tag", kind: "label", entrance: "spring-pop", delay: 40, text: "3 \u6839\u7ebf", textColor: "#FFD400", textSize: 92',
              'id: "wires-tag", kind: "label", entrance: "spring-pop", delay: 40, text: "3 \u6839\u7ebf", textColor: "#FFD400", textSize: 84')

# 09_code: '16 行代码' 88 -> 74
c = c.replace('id: "info", kind: "label", entrance: "spring-pop", delay: 44, text: "16 \u884c\u4ee3\u7801", textColor: "#FFD400", textSize: 88',
              'id: "info", kind: "label", entrance: "spring-pop", delay: 44, text: "16 \u884c\u4ee3\u7801", textColor: "#FFD400", textSize: 74')

# 10_power: '3 节电池' 86 -> 76
c = c.replace('id: "info", kind: "label", entrance: "spring-pop", delay: 36, text: "3 \u8282\u7535\u6c60", textColor: "#FFD400", textSize: 86',
              'id: "info", kind: "label", entrance: "spring-pop", delay: 36, text: "3 \u8282\u7535\u6c60", textColor: "#FFD400", textSize: 76')

# 12_roar: '全班围过来' 92 -> 78
c = c.replace('id: "burst", kind: "label", entrance: "spring-pop", delay: 70, text: "\u5168\u73ed\u56f4\u8fc7\u6765", textColor: "#FFD400", textSize: 92',
              'id: "burst", kind: "label", entrance: "spring-pop", delay: 70, text: "\u5168\u73ed\u56f4\u8fc7\u6765", textColor: "#FFD400", textSize: 78')

# 11_demo: '好可爱' 104 -> 90
c = c.replace('id: "tag", kind: "label", entrance: "spring-pop", delay: 30, text: "\u597d\u53ef\u7231", textColor: "#FFD400", textSize: 104',
              'id: "tag", kind: "label", entrance: "spring-pop", delay: 30, text: "\u597d\u53ef\u7231", textColor: "#FFD400", textSize: 90')

# 01_hook: '全班看呆' 76 -> 70
c = c.replace('id: "tag", kind: "label", entrance: "spring-pop", delay: 32, text: "\u5168\u73ed\u770b\u5446", textColor: "#FFD400", textSize: 76',
              'id: "tag", kind: "label", entrance: "spring-pop", delay: 32, text: "\u5168\u73ed\u770b\u5446", textColor: "#FFD400", textSize: 70')

# 13_endcard: '关注我不错过' 78 -> 68
c = c.replace('id: "follow", kind: "label", entrance: "spring-pop", delay: 60, text: "\u5173\u6ce8\u6211\u4e0d\u9519\u8fc7", textColor: "#FFD400", textSize: 78',
              'id: "follow", kind: "label", entrance: "spring-pop", delay: 60, text: "\u5173\u6ce8\u6211\u4e0d\u9519\u8fc7", textColor: "#FFD400", textSize: 68')

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('Bytes:', len(c))