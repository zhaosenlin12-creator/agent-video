# redraw_more.py
# Re-generate 04_fins.png and 06_water.png without static fin/water so the animation overlays are the visual lead.

import os
from PIL import Image, ImageDraw

W, H = 1080, 1920
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "illustrations")

SKY_MID       = (193, 220, 245)
SKY_LIGHT     = (220, 234, 246)
TABLE_BROWN   = (140, 95, 60)
TABLE_DARK    = (80, 50, 30)
BOTTLE_BLUE   = (167, 214, 255)
BOTTLE_OUT    = (32, 50, 74)
RED           = (255, 75, 60)
YELLOW        = (255, 212, 0)
WHITE         = (255, 255, 255)
BLACK         = (10, 14, 24)

def draw_fins_clean():
    img = Image.new("RGB", (W, H), SKY_MID)
    d = ImageDraw.Draw(img)
    d.rectangle([60, 1480, W-60, 1820], fill=TABLE_BROWN, outline=TABLE_DARK, width=6)
    cx = W // 2
    body_top = 540
    body_bot = 1480
    d.polygon([(cx-180, body_top-20), (cx+180, body_top-20), (cx, body_top-300)], fill=RED, outline=BLACK, width=5)
    d.rectangle([cx-180, body_top, cx+180, body_bot], fill=WHITE, outline=BLACK, width=5)
    d.ellipse([cx-80, body_top+60, cx+80, body_top+220], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=5)
    d.rectangle([cx-180, body_top+240, cx+180, body_top+310], fill=YELLOW, outline=BLACK, width=4)
    img.save(os.path.join(OUT, "04_fins.png"), "PNG", optimize=True)
    print("04_fins.png ok (no static fins)")

def draw_water_clean():
    img = Image.new("RGB", (W, H), SKY_LIGHT)
    d = ImageDraw.Draw(img)
    d.rectangle([60, 1480, W-60, 1820], fill=TABLE_BROWN, outline=TABLE_DARK, width=6)
    cx = W // 2
    body_top = 540
    body_bot = 1480
    d.polygon([(cx-180, body_top-20), (cx+180, body_top-20), (cx, body_top-260)], fill=RED, outline=BLACK, width=5)
    d.rectangle([cx-180, body_top, cx+180, body_bot], fill=WHITE, outline=BLACK, width=5)
    d.ellipse([cx-80, body_top+60, cx+80, body_top+220], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=5)
    d.rectangle([cx-180, body_top+240, cx+180, body_top+310], fill=YELLOW, outline=BLACK, width=4)
    img.save(os.path.join(OUT, "06_water.png"), "PNG", optimize=True)
    print("06_water.png ok (no static water)")

def draw_nozzle_clean():
    img = Image.new("RGB", (W, H), SKY_MID)
    d = ImageDraw.Draw(img)
    d.rectangle([60, 1480, W-60, 1820], fill=TABLE_BROWN, outline=TABLE_DARK, width=6)
    cx = W // 2
    body_top = 600
    body_bot = 1480
    d.rectangle([cx-180, body_top, cx+180, body_bot], fill=WHITE, outline=BLACK, width=5)
    d.ellipse([cx-80, body_top+80, cx+80, body_top+220], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=5)
    d.rectangle([cx-180, body_top+240, cx+180, body_top+310], fill=YELLOW, outline=BLACK, width=4)
    d.polygon([(cx-180, body_top), (cx+180, body_top), (cx, body_top-200)], fill=RED, outline=BLACK, width=5)
    img.save(os.path.join(OUT, "05_nozzle.png"), "PNG", optimize=True)
    print("05_nozzle.png ok (no fins, nozzle top only)")

if __name__ == "__main__":
    draw_fins_clean()
    draw_water_clean()
    draw_nozzle_clean()
    print("Cleaned.")
