p = r'D:\kaifa-teacher\moneyprinter\agent-video\src\components\ElementRenderer.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('WebkitTextStroke: el.highlight ? "2px #B81F1F" : "0"',
              'WebkitTextStroke: el.highlight ? "1px #B81F1F" : "0"')
with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('patched:', '1px #B81F1F' in c)