# redraw.py
# Fully redraw all 8 illustration PNGs at 1080x1920 with no watermarks/labels.
# Designed to be overlaid with animations in Remotion scenes.

import os, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "illustrations")
os.makedirs(OUT, exist_ok=True)

CN_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
CN_REG  = r"C:\Windows\Fonts\msyh.ttc"

def font(size, bold=True):
    p = CN_BOLD if bold else CN_REG
    try:
        return ImageFont.truetype(p, size)
    except Exception:
        return ImageFont.truetype(CN_REG, size)

SKY_LIGHT     = (220, 234, 246)
SKY_MID       = (193, 220, 245)
SKY_DEEP      = (15, 22, 40)
TABLE_BROWN   = (140, 95, 60)
TABLE_DARK    = (80, 50, 30)
BOTTLE_BLUE   = (167, 214, 255)
BOTTLE_OUT    = (32, 50, 74)
RED           = (255, 75, 60)
DARK_RED      = (160, 35, 30)
YELLOW        = (255, 212, 0)
CREAM         = (237, 227, 204)
WHITE         = (255, 255, 255)
BLACK         = (10, 14, 24)
GREY_LIGHT    = (218, 221, 230)
GREY_DARK     = (60, 64, 80)
WATER_BLUE    = (90, 175, 235)
WATER_LIGHT   = (140, 210, 255)

def draw_hook():
    img = Image.new("RGB", (W, H), SKY_DEEP)
    d = ImageDraw.Draw(img)
    cx, cy = W//2, int(H*0.55)
    for i in range(28):
        ang = (i / 28) * 2 * math.pi
        for r in range(280, 760, 28):
            x = int(cx + math.cos(ang) * r)
            y = int(cy + math.sin(ang) * r)
            x2 = int(cx + math.cos(ang) * (r + 18))
            y2 = int(cy + math.sin(ang) * (r + 18))
            col = (255, 212, 0) if i % 2 == 0 else (255, 100, 60)
            d.line([(x, y), (x2, y2)], fill=col, width=4)
    d.polygon([(cx-150, cy-110), (cx+150, cy-110), (cx, cy-340)], fill=RED, outline=BLACK, width=5)
    d.rectangle([cx-130, cy-110, cx+130, cy+260], fill=WHITE, outline=BLACK, width=5)
    d.ellipse([cx-70, cy-50, cx+70, cy+90], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=5)
    d.rectangle([cx-130, cy+90, cx+130, cy+150], fill=YELLOW, outline=BLACK, width=4)
    d.rectangle([cx-130, cy+150, cx+130, cy+260], fill=WHITE, outline=BLACK, width=4)
    d.polygon([(cx-130, cy+150), (cx-260, cy+330), (cx-130, cy+260)], fill=RED, outline=BLACK, width=4)
    d.polygon([(cx+130, cy+150), (cx+260, cy+330), (cx+130, cy+260)], fill=RED, outline=BLACK, width=4)
    d.polygon([(cx-70, cy+260), (cx+70, cy+260), (cx, cy+440)], fill=(255, 130, 50), outline=BLACK, width=4)
    d.polygon([(cx-30, cy+260), (cx+30, cy+260), (cx, cy+400)], fill=(255, 220, 80), outline=None)
    d.rectangle([cx-3, cy-340, cx+3, cy-220], fill=WHITE)
    d.ellipse([cx-12, cy-200, cx+12, cy-176], fill=WHITE)
    img.save(os.path.join(OUT, "01_hook.png"), "PNG", optimize=True)
    print("01_hook.png ok")

def draw_materials():
    img = Image.new("RGB", (W, H), SKY_LIGHT)
    d = ImageDraw.Draw(img)
    d.rectangle([60, 700, W-60, 1700], fill=TABLE_BROWN, outline=TABLE_DARK, width=8)
    d.rectangle([60, 1300, W-60, 1700], fill=(110, 75, 45), outline=TABLE_DARK, width=4)
    for y in range(720, 1700, 80):
        d.line([(100, y), (W-100, y)], fill=(110, 75, 45), width=2)
    bx, by = 200, 770
    d.rectangle([bx-80, by, bx+80, by+360], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=5)
    d.rectangle([bx-50, by-60, bx+50, by], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=5)
    d.rectangle([bx-55, by-100, bx+55, by-60], fill=RED, outline=BOTTLE_OUT, width=3)
    d.ellipse([bx-50, by+60, bx+50, by+160], fill=(140, 210, 255), outline=BOTTLE_OUT, width=3)
    cx, cy = 540, 870
    d.ellipse([cx-130, cy-130, cx+130, cy+130], fill=YELLOW, outline=DARK_RED, width=6)
    d.ellipse([cx-90, cy-90, cx+90, cy+90], fill=(180, 145, 30), outline=DARK_RED, width=4)
    d.rectangle([cx+10, cy-20, cx+260, cy+20], fill=YELLOW, outline=DARK_RED, width=5)
    sx, sy = 860, 830
    d.ellipse([sx-60, sy, sx+60, sy+90], outline=BLACK, width=5, fill=(200, 60, 60))
    d.line([(sx, sy+30), (sx-200, sy+200)], fill=GREY_DARK, width=10)
    d.line([(sx, sy+60), (sx-200, sy+220)], fill=GREY_LIGHT, width=10)
    d.polygon([(sx-200, sy+180), (sx-200, sy+240), (sx+20, sy+50)], fill=GREY_LIGHT, outline=BLACK, width=3)
    d.polygon([(sx-200, sy+200), (sx-200, sy+260), (sx+20, sy+70)], fill=GREY_DARK, outline=BLACK, width=3)
    px, py = 760, 1380
    d.rectangle([px-40, py-260, px+40, py-100], fill=(220, 90, 30), outline=(40, 30, 20), width=4)
    d.rectangle([px-80, py-100, px+80, py+200], fill=WHITE, outline=(40, 30, 20), width=5)
    d.rectangle([px-130, py+200, px+130, py+230], fill=(60, 60, 70), outline=(20, 20, 20), width=4)
    d.rectangle([px-25, py+230, px+25, py+290], fill=(60, 60, 70), outline=(20, 20, 20), width=3)
    img.save(os.path.join(OUT, "02_materials.png"), "PNG", optimize=True)
    print("02_materials.png ok")

def draw_cut():
    img = Image.new("RGB", (W, H), SKY_LIGHT)
    d = ImageDraw.Draw(img)
    d.rectangle([60, 1340, W-60, 1820], fill=TABLE_BROWN, outline=TABLE_DARK, width=6)
    cx = W // 2
    body_top = 580
    body_bot = 1320
    d.rectangle([cx-200, body_top, cx+200, body_bot], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=6)
    d.rectangle([cx-90, body_top-110, cx+90, body_top], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=6)
    d.rectangle([cx-100, body_top-160, cx+100, body_top-110], fill=RED, outline=BOTTLE_OUT, width=4)
    d.rectangle([cx-200, body_bot-260, cx+200, body_bot], fill=WATER_BLUE, outline=None)
    img.save(os.path.join(OUT, "03_cut.png"), "PNG", optimize=True)
    print("03_cut.png ok")

def draw_fins():
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
    d.polygon([(cx-180, body_top+900), (cx-340, body_bot+40), (cx-180, body_bot)], fill=RED, outline=BLACK, width=5)
    d.polygon([(cx+180, body_top+900), (cx+340, body_bot+40), (cx+180, body_bot)], fill=RED, outline=BLACK, width=5)
    d.polygon([(cx-30, body_top+650), (cx+30, body_top+650), (cx+50, body_top+850), (cx-50, body_top+850)], fill=RED, outline=BLACK, width=4)
    img.save(os.path.join(OUT, "04_fins.png"), "PNG", optimize=True)
    print("04_fins.png ok")

def draw_nozzle():
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
    d.polygon([(cx-180, body_top+700), (cx-320, body_bot+40), (cx-180, body_bot)], fill=RED, outline=BLACK, width=5)
    d.polygon([(cx+180, body_top+700), (cx+320, body_bot+40), (cx+180, body_bot)], fill=RED, outline=BLACK, width=5)
    img.save(os.path.join(OUT, "05_nozzle.png"), "PNG", optimize=True)
    print("05_nozzle.png ok")

def draw_water():
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
    d.polygon([(cx-180, body_top+700), (cx-320, body_bot+40), (cx-180, body_bot)], fill=RED, outline=BLACK, width=5)
    d.polygon([(cx+180, body_top+700), (cx+320, body_bot+40), (cx+180, body_bot)], fill=RED, outline=BLACK, width=5)
    water_top = body_bot - 310
    d.rectangle([cx-176, water_top, cx+176, body_bot-4], fill=(190, 225, 250), outline=None)
    img.save(os.path.join(OUT, "06_water.png"), "PNG", optimize=True)
    print("06_water.png ok")

def draw_pump():
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)
    d.rectangle([60, 1480, W-60, 1820], fill=TABLE_BROWN, outline=TABLE_DARK, width=6)
    px, py = 280, 1100
    d.rectangle([px-50, py-340, px+50, py-140], fill=(220, 90, 30), outline=(40, 30, 20), width=4)
    d.rectangle([px-90, py-140, px+90, py+220], fill=WHITE, outline=(40, 30, 20), width=5)
    d.rectangle([px-150, py+220, px+150, py+260], fill=(60, 60, 70), outline=(20, 20, 20), width=4)
    d.rectangle([px-30, py+260, px+30, py+340], fill=(60, 60, 70), outline=(20, 20, 20), width=3)
    d.rectangle([px-160, py-360, px+160, py-340], fill=(180, 60, 20), outline=(40, 30, 20), width=3)
    d.ellipse([px-90, py-30, px+90, py+150], outline=(40, 30, 20), width=4, fill=WHITE)
    cx, body_bot = 760, 1480
    body_top = 540
    d.rectangle([cx-160, body_top, cx+160, body_bot], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=5)
    d.rectangle([cx-80, body_top-110, cx+80, body_top], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=5)
    d.rectangle([cx-90, body_top-160, cx+90, body_top-110], fill=RED, outline=BOTTLE_OUT, width=4)
    d.rectangle([cx-156, body_top+500, cx+156, body_bot-4], fill=WATER_BLUE, outline=None)
    d.line([(px+90, py+220), (cx-160, body_top+760)], fill=GREY_DARK, width=12)
    img.save(os.path.join(OUT, "07_pump.png"), "PNG", optimize=True)
    print("07_pump.png ok")

def draw_countdown():
    img = Image.new("RGB", (W, H), SKY_DEEP)
    d = ImageDraw.Draw(img)
    for i in range(80):
        x = (i * 137) % (W - 40) + 20
        y = (i * 211) % (H - 40) + 20
        d.ellipse([x-2, y-2, x+2, y+2], fill=(255, 255, 255))
    cx = W // 2
    body_top = 700
    body_bot = 1500
    d.polygon([(cx-200, body_top-20), (cx+200, body_top-20), (cx, body_top-340)], fill=RED, outline=BLACK, width=6)
    d.rectangle([cx-200, body_top, cx+200, body_bot], fill=WHITE, outline=BLACK, width=6)
    d.ellipse([cx-90, body_top+90, cx+90, body_top+250], fill=BOTTLE_BLUE, outline=BOTTLE_OUT, width=6)
    d.rectangle([cx-200, body_top+280, cx+200, body_top+360], fill=YELLOW, outline=BLACK, width=5)
    d.polygon([(cx-200, body_top+800), (cx-360, body_bot+60), (cx-200, body_bot)], fill=RED, outline=BLACK, width=6)
    d.polygon([(cx+200, body_top+800), (cx+360, body_bot+60), (cx+200, body_bot)], fill=RED, outline=BLACK, width=6)
    d.rectangle([cx-280, body_bot, cx+280, body_bot+90], fill=TABLE_BROWN, outline=BLACK, width=5)
    img.save(os.path.join(OUT, "08_countdown.png"), "PNG", optimize=True)
    print("08_countdown.png ok")

if __name__ == "__main__":
    draw_hook()
    draw_materials()
    draw_cut()
    draw_fins()
    draw_nozzle()
    draw_water()
    draw_pump()
    draw_countdown()
    print("All 8 PNGs redrawn.")

