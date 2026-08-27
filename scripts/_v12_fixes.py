# -*- coding: utf-8 -*-
import os
p = os.path.join(os.path.dirname(__file__), '..', 'src', 'data.ts')
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# textSize reductions using actual Chinese characters
fixes = [
    # 02_materials price
    ('text: "全套 30 元搞定", textColor: "#FFD400", textSize: 66',
     'text: "全套 30 元搞定", textColor: "#FFD400", textSize: 56'),
    # 03_model info
    ('text: "三维结构", textColor: "#FFD400", textSize: 68',
     'text: "三维结构", textColor: "#FFD400", textSize: 60'),
    # 04_slice info
    ('text: "200 层路径", textColor: "#FFD400", textSize: 72',
     'text: "200 层路径", textColor: "#FFD400", textSize: 60'),
    # 06_layer 120 层
    ('text: "120 层", textColor: "#FFD400", textSize: 74',
     'text: "120 层", textColor: "#FFD400", textSize: 64'),
    # 07_remove 完成
    ('text: "完成", textColor: "#FFD400", textSize: 84',
     'text: "完成", textColor: "#FFD400", textSize: 76'),
    # 08_servo 3 根线
    ('text: "3 根线", textColor: "#FFD400", textSize: 84',
     'text: "3 根线", textColor: "#FFD400", textSize: 72'),
    # 09_code 16 行代码
    ('text: "16 行代码", textColor: "#FFD400", textSize: 74',
     'text: "16 行代码", textColor: "#FFD400", textSize: 64'),
    # 10_power 3 节电池
    ('text: "3 节电池", textColor: "#FFD400", textSize: 76',
     'text: "3 节电池", textColor: "#FFD400", textSize: 66'),
    # 11_demo burst 好可爱
    ('text: "好可爱", textColor: "#B81F1F", textSize: 76',
     'text: "好可爱", textColor: "#B81F1F", textSize: 66'),
    # 12_roar burst 全班围过来
    ('text: "全班围过来", textColor: "#B81F1F", textSize: 64',
     'text: "全班围过来", textColor: "#B81F1F", textSize: 56'),
    # 13_endcard burst 下期更精彩
    ('text: "下期更精彩", textColor: "#B81F1F", textSize: 60',
     'text: "下期更精彩", textColor: "#B81F1F", textSize: 54'),
    # 13_endcard follow
    ('text: "关注我不错过", textColor: "#FFD400", textSize: 68',
     'text: "关注我不错过", textColor: "#FFD400", textSize: 56'),
    # 01_hook burst 全班看呆
    ('text: "全班看呆", textColor: "#B81F1F", textSize: 72',
     'text: "全班看呆", textColor: "#B81F1F", textSize: 62'),
]
for old, new in fixes:
    if old in c:
        c = c.replace(old, new)
        print('OK:', old[:60], '->', new[:60])
    else:
        print('MISS:', old[:60])

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('Bytes:', len(c))