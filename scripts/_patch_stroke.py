p = r'D:\kaifa-teacher\moneyprinter\agent-video\src\components\ElementRenderer.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()
old = 'WebkitTextStroke: el.highlight ? "4px #B81F1F" : "0"'
new = 'WebkitTextStroke: el.highlight ? "2px #B81F1F" : "0"'
c = c.replace(old, new)
with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('Bytes:', len(c))
print('patched:', '2px #B81F1F' in c)