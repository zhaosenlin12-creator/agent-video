import os
p = os.path.join(os.path.dirname(__file__), '..', 'src', 'data.ts')
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()
# Replace remaining voiceSec: 2.80 (demo) and voiceSec: 4.00 (remove)
c = c.replace('voiceSec: 2.80,', 'voiceSec: 2.86,')
c = c.replace('voiceSec: 4.00,', 'voiceSec: 3.86,', 1)  # only first occurrence (remove scene)
with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('Bytes:', len(c))