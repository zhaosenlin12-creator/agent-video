# -*- coding: utf-8 -*-
import os
p = os.path.join(os.path.dirname(__file__), '..', 'src', 'data.ts')
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix 1: endcard title overflow
c = c.replace('textSize: 116, highlight: true, x: "50%", y: 880',
              'textSize: 100, highlight: true, x: "50%", y: 880')

# Fix 2: 03_model label positions
c = c.replace('text: "\u5934", textColor: "#FFD400", textSize: 56, x: 200, y: 540',
              'text: "\u5934", textColor: "#FFD400", textSize: 56, x: 200, y: 720')
c = c.replace('text: "\u8eaf\u5e72", textColor: "#FFD400", textSize: 56, x: 880, y: 900',
              'text: "\u8eaf\u5e72", textColor: "#FFD400", textSize: 56, x: 880, y: 950')
c = c.replace('text: "\u5c3e", textColor: "#FFD400", textSize: 56, x: 200, y: 1280',
              'text: "\u5c3e", textColor: "#FFD400", textSize: 56, x: 880, y: 1100')

# Fix 3: voiceSec updates (YunxiaNeural)
voice_map = [
    ('voiceSec: 3.89,', 'voiceSec: 4.30,'),  # hook
    ('voiceSec: 4.50,', 'voiceSec: 4.15,'),  # materials
    ('voiceSec: 4.30,', 'voiceSec: 4.03,'),  # model
    ('voiceSec: 4.00,', 'voiceSec: 3.60,'),  # slice
    ('voiceSec: 5.20,', 'voiceSec: 4.44,'),  # print
    ('voiceSec: 4.50,', 'voiceSec: 3.70,'),  # layer
    ('voiceSec: 4.20,', 'voiceSec: 3.43,'),  # servo
    ('voiceSec: 4.00,', 'voiceSec: 3.53,'),  # code
    ('voiceSec: 4.00,', 'voiceSec: 3.26,'),  # power
    ('voiceSec: 3.50,', 'voiceSec: 4.06,'),  # roar
    ('voiceSec: 4.00,', 'voiceSec: 3.79,'),  # endcard
]
for old, new in voice_map:
    c = c.replace(old, new, 1)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('Bytes:', len(c))