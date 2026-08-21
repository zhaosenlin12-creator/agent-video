# redraw.py
# Generate 12 illustration PNGs at 1080x1920 for the "一节课搓架航模" video.
# Style: clean flat-color workshop blueprint / cutaway view, 2026 popular douyin style.

import os, math
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "illustrations")
os.makedirs(OUT, exist_ok=True)

CN_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
CN_REG  = r"C:\Windows\Fonts\msyh.ttc"
EN_BOLD = r"C:\Windows\Fonts\consolab.ttf"
EN_REG  = r"C:\Windows\Fonts\consola.ttf"

def font(size, bold=True, en=False):
    if en:
        p = EN_BOLD if bold else EN_REG
    else:
        p = CN_BOLD if bold else CN_REG
    try:
        return ImageFont.truetype(p, size)
    except Exception:
        return ImageFont.truetype(CN_REG, size)

BG_CREAM    = (247, 244, 234)
BG_DEEP     = (16, 22, 38)
BG_SKY      = (200, 230, 250)
WHITE       = (255, 255, 255)
BLACK       = (12, 16, 28)
INK_DARK    = (30, 36, 50)
INK_GREY    = (110, 118, 138)
YELLOW      = (255, 212, 0)
YELLOW_DARK = (200, 160, 0)
RED         = (235, 75, 60)
DARK_RED    = (160, 35, 30)
ORANGE      = (255, 140, 50)
GREEN       = (60, 175, 100)
DARK_GREEN  = (35, 110, 70)
BLUE        = (70, 130, 220)
DARK_BLUE   = (30, 70, 150)
TEAL        = (40, 160, 175)
GREY_LIGHT  = (220, 224, 232)
GREY_MID    = (180, 188, 200)
GREY_DARK   = (110, 118, 130)

def draw_01_hook():
    img = Image.new("RGB", (W, H), BG_DEEP)
    d = ImageDraw.Draw(img)
    cx, cy = W//2, int(H*0.50)
    # Radial speed lines
    for i in range(40):
        ang = (i / 40) * 2 * math.pi
        for r in range(220, 800, 22):
            x = int(cx + math.cos(ang) * r)
            y = int(cy + math.sin(ang) * r)
            x2 = int(cx + math.cos(ang) * (r + 12))
            y2 = int(cy + math.sin(ang) * (r + 12))
            col = YELLOW if i % 2 == 0 else ORANGE
            d.line([(x, y), (x2, y2)], fill=col, width=3)
    # Big paper plane in center
    cx0, cy0 = cx - 280, cy - 180
    # Plane silhouette (white/blue)
    d.polygon([(cx0, cy0 + 120), (cx0 + 560, cy0 + 60), (cx0 + 560, cy0 + 180)], fill=WHITE, outline=INK_DARK, width=5)
    d.polygon([(cx0 + 560, cy0 + 60), (cx0 + 560, cy0 + 180), (cx0 + 380, cy0 + 120)], fill=GREY_LIGHT, outline=INK_DARK, width=5)
    # Speed trails behind plane
    for i in range(5):
        d.line([(cx0 - 60 - i*40, cy0 + 60 + i*15), (cx0 - 20 - i*40, cy0 + 180 + i*15)], fill=(255, 255, 255, 100 + i*30), width=4)
    # Below: tools (knife, foam board, propeller)
    by = cy + 220
    # Foam board rectangle
    d.rounded_rectangle([cx - 280, by, cx + 80, by + 100], radius=12, fill=GREY_LIGHT, outline=INK_DARK, width=4)
    d.rectangle([cx - 240, by + 30, cx + 60, by + 70], fill=WHITE, outline=INK_DARK, width=2)
    d.text((cx - 140, by + 40), "Foam", font=font(40, bold=True, en=True), fill=INK_DARK)
    # Propeller
    d.ellipse([cx + 130, by - 20, cx + 320, by + 120], outline=INK_DARK, width=6)
    d.ellipse([cx + 200, by + 30, cx + 250, by + 80], fill=RED, outline=INK_DARK, width=4)
    d.line([(cx + 130, by + 50), (cx + 320, by + 50)], fill=INK_DARK, width=4)
    img.save(os.path.join(OUT, "01_hook.png"), "PNG", optimize=True)
    print("01_hook.png")

def draw_step(num, cn_title, en_subtitle, drawer):
    """Generic step illustration: top yellow band with step number, central illustration."""
    img = Image.new("RGB", (W, H), BG_CREAM)
    d = ImageDraw.Draw(img)
    band_h = 200
    d.rectangle([0, 0, W, band_h], fill=YELLOW)
    d.text((90, 30), str(num), font=font(170, bold=True), fill=BLACK)
    d.text((280, 70), "STEP " + str(num), font=font(48, bold=True, en=True), fill=BLACK)
    d.text((280, 130), cn_title, font=font(56, bold=False), fill=INK_DARK)
    skill_w = 920
    sx = (W - skill_w) // 2
    sy = band_h + 60
    d.rectangle([sx, sy, sx+skill_w, sy+150], fill=WHITE, outline=INK_DARK, width=4)
    d.text((sx + 30, sy + 30), en_subtitle, font=font(54, bold=True, en=False), fill=INK_DARK)
    drawer(d, sx, sy, skill_w)
    img.save(os.path.join(OUT, f"{num+1:02d}_step{num}.png"), "PNG", optimize=True)
    # Also save with named keys for matching data.ts
    name_map = {
        1: "02_materials", 2: "03_draw", 3: "04_cut", 4: "05_glue", 5: "06_motor",
        6: "07_prop", 7: "08_wire", 8: "09_balance", 9: "10_launch", 10: "11_soaring", 11: "13_endcard"
    }
    if num in name_map:
        import shutil
        shutil.copy(os.path.join(OUT, f"{num+1:02d}_step{num}.png"), os.path.join(OUT, name_map[num] + ".png"))
    print(f"step{num}.png")

def draw_02_materials(d, sx, sy, sw):
    cy0 = sy + 350  # subtitle banner rendered by draw_step frame; drawer content starts below
    # 6 materials 2x3 grid
    items = [
        ("泡沫板", GREY_LIGHT, "📦"),
        ("电机", YELLOW, "⚙"),
        ("螺旋桨", RED, "✈"),
        ("电池", GREEN, "🔋"),
        ("胶水", (255, 248, 220), "🧴"),
        ("刻刀", GREY_MID, "🔪"),
    ]
    grid_y = cy0 + 130
    for i, (label, col, _) in enumerate(items):
        x = sx + 30 + (i % 3) * 295
        y = grid_y + (i // 3) * 220
        d.rounded_rectangle([x, y, x+260, y+190], radius=16, fill=col, outline=INK_DARK, width=4)
        d.text((x+20, y+30), label, font=font(48, bold=True), fill=BLACK)
        # Simple icon
        if label == "泡沫板":
            d.rectangle([x+20, y+95, x+220, y+170], fill=WHITE, outline=INK_DARK, width=3)
        elif label == "电机":
            d.rectangle([x+90, y+95, x+170, y+170], fill=INK_DARK)
            d.rectangle([x+90, y+95, x+170, y+115], fill=YELLOW)
            d.line([(x+170, y+125), (x+200, y+125)], fill=INK_DARK, width=4)
        elif label == "螺旋桨":
            d.line([(x+30, y+130), (x+230, y+130)], fill=INK_DARK, width=12)
            d.ellipse([x+115, y+115, x+155, y+155], fill=YELLOW, outline=INK_DARK, width=3)
        elif label == "电池":
            d.rectangle([x+50, y+95, x+200, y+170], fill=GREEN, outline=INK_DARK, width=3)
            d.text((x+90, y+115), "+/-", font=font(46, bold=True), fill=WHITE)
        elif label == "胶水":
            d.polygon([(x+30, y+170), (x+230, y+170), (x+200, y+95), (x+60, y+95)], fill=WHITE, outline=INK_DARK, width=3)
            d.rectangle([x+30, y+95, x+230, y+115], fill=RED)
        elif label == "刻刀":
            d.polygon([(x+30, y+170), (x+250, y+95), (x+250, y+115), (x+30, y+170)], fill=GREY_MID, outline=INK_DARK, width=3)
            d.rectangle([x+30, y+165, x+120, y+185], fill=(80, 50, 30))

def draw_03_draw(d, sx, sy, sw):
    cy0 = sy + 350  # subtitle banner rendered by draw_step frame; drawer content starts below
    # Foam board with plane outlines drawn on it
    by = cy0 + 130
    d.rounded_rectangle([sx+60, by, sx+sw-60, by+720], radius=18, fill=GREY_LIGHT, outline=INK_DARK, width=5)
    # Center line (axis)
    d.line([(sx + sw//2, by + 30), (sx + sw//2, by + 690)], fill=BLUE, width=3)
    # Wing outline (top view)
    d.polygon([
        (sx + sw//2 - 280, by + 100),
        (sx + sw//2 + 280, by + 100),
        (sx + sw//2 + 200, by + 200),
        (sx + sw//2 - 200, by + 200)
    ], outline=INK_DARK, width=5)
    d.text((sx + sw//2 - 60, by + 230), "机翼 top view", font=font(36, bold=True), fill=INK_DARK)
    # Fuselage outline
    d.ellipse([sx + sw//2 - 80, by + 350, sx + sw//2 + 80, by + 410], outline=INK_DARK, width=4)
    d.text((sx + sw//2 - 50, by + 380), "机身", font=font(32, bold=True), fill=INK_DARK)
    # Tail
    d.polygon([
        (sx + sw//2 - 60, by + 510),
        (sx + sw//2 + 60, by + 510),
        (sx + sw//2 + 40, by + 600),
        (sx + sw//2 - 40, by + 600)
    ], outline=INK_DARK, width=4)
    d.text((sx + sw//2 - 30, by + 615), "尾翼", font=font(32, bold=True), fill=INK_DARK)
    # Pencil icon top right
    d.polygon([(sx + sw - 200, by + 20), (sx + sw - 130, by + 50), (sx + sw - 200, by + 80)], fill=YELLOW, outline=INK_DARK, width=4)
    d.line([(sx + sw - 130, by + 50), (sx + sw - 80, by + 80)], fill=INK_DARK, width=6)

def draw_04_cut(d, sx, sy, sw):
    cy0 = sy + 350  # subtitle banner rendered by draw_step frame; drawer content starts below
    by = cy0 + 130
    # Foam board centered
    d.rounded_rectangle([sx+150, by, sx+sw-150, by+520], radius=14, fill=GREY_LIGHT, outline=INK_DARK, width=5)
    # Center cut line (dashed red)
    d.line([(sx + sw//2, by + 10), (sx + sw//2, by + 510)], fill=RED, width=6)
    for y in range(by + 20, by + 500, 30):
        d.rectangle([sx + sw//2 - 4, y, sx + sw//2 + 4, y + 18], fill=RED)
    # Wing outline already cut
    d.polygon([
        (sx + 200, by + 200),
        (sx + sw - 200, by + 200),
        (sx + sw - 250, by + 380),
        (sx + 250, by + 380)
    ], outline=INK_DARK, width=4)
    # Cut blade (stylized) at top
    d.polygon([(sx + sw//2 - 90, by - 50), (sx + sw//2 + 90, by - 70), (sx + sw//2 + 90, by + 10), (sx + sw//2 - 90, by + 10)], fill=GREY_MID, outline=INK_DARK, width=4)
    d.rectangle([sx + sw//2 - 100, by - 50, sx + sw//2 + 100, by - 30], fill=(80, 50, 30), outline=INK_DARK, width=3)
    # Foam chips
    for i, (x, y) in enumerate([(sx + 100, by + 280), (sx + sw - 130, by + 320), (sx + 120, by + 400), (sx + sw - 100, by + 440)]):
        d.polygon([(x-12, y), (x+12, y), (x+8, y+18), (x-8, y+18)], fill=GREY_LIGHT, outline=INK_DARK, width=2)

def draw_05_glue(d, sx, sy, sw):
    cy0 = sy + 350  # subtitle banner rendered by draw_step frame; drawer content starts below
    by = cy0 + 130
    # Two foam pieces (wing + body) with glue seam
    # Wing (top)
    d.polygon([
        (sx + 100, by + 60),
        (sx + sw - 100, by + 60),
        (sx + sw - 150, by + 250),
        (sx + 150, by + 250)
    ], fill=GREY_LIGHT, outline=INK_DARK, width=5)
    # Fuselage (bottom)
    d.rounded_rectangle([sx + 380, by + 280, sx + 700, by + 620], radius=20, fill=GREY_LIGHT, outline=INK_DARK, width=5)
    # Glue line at seam
    d.line([(sx + 380, by + 280), (sx + 700, by + 280)], fill=YELLOW, width=10)
    # Glue drips
    for x in [sx + 420, sx + 500, sx + 580, sx + 660]:
        d.ellipse([x-15, by + 290, x+15, by + 320], fill=YELLOW, outline=INK_DARK, width=3)
    # Glue bottle
    d.polygon([(sx + sw - 200, by + 350), (sx + sw - 100, by + 380), (sx + sw - 100, by + 480), (sx + sw - 200, by + 480)], fill=WHITE, outline=INK_DARK, width=4)
    d.rectangle([sx + sw - 200, by + 350, sx + sw - 100, by + 380], fill=RED, outline=INK_DARK, width=3)
    d.text((sx + sw - 175, by + 410), "胶", font=font(56, bold=True), fill=RED)
    # Sparkle stars showing bond
    for x, y in [(sx + 450, by + 200), (sx + 600, by + 220), (sx + 540, by + 320)]:
        d.polygon([
            (x, y - 18), (x + 6, y - 6), (x + 18, y),
            (x + 6, y + 6), (x, y + 18), (x - 6, y + 6),
            (x - 18, y), (x - 6, y - 6)
        ], fill=YELLOW, outline=INK_DARK, width=2)

def draw_06_motor(d, sx, sy, sw):
    cy0 = sy + 350  # subtitle banner rendered by draw_step frame; drawer content starts below
    by = cy0 + 130
    # Plane nose section
    d.polygon([
        (sx + 200, by + 100),
        (sx + sw - 200, by + 100),
        (sx + sw - 100, by + 500),
        (sx + 100, by + 500)
    ], fill=GREY_LIGHT, outline=INK_DARK, width=5)
    # Motor (cylindrical) mounted
    d.rounded_rectangle([sx + sw//2 - 70, by + 280, sx + sw//2 + 70, by + 420], radius=18, fill=INK_DARK, outline=BLACK, width=4)
    # Motor cap (yellow)
    d.rectangle([sx + sw//2 - 70, by + 280, sx + sw//2 + 70, by + 320], fill=YELLOW, outline=BLACK, width=3)
    # Motor shaft
    d.rectangle([sx + sw//2 - 12, by + 420, sx + sw//2 + 12, by + 480], fill=GREY_MID, outline=BLACK, width=3)
    # Motor label
    d.text((sx + sw//2 - 30, by + 350), "M", font=font(72, bold=True, en=True), fill=WHITE)
    # Screwdriver
    d.polygon([(sx + sw//2 + 90, by + 320), (sx + sw//2 + 200, by + 350), (sx + sw//2 + 200, by + 380), (sx + sw//2 + 90, by + 380)], fill=GREY_MID, outline=INK_DARK, width=4)
    d.rectangle([sx + sw//2 + 200, by + 345, sx + sw//2 + 300, by + 380], fill=RED, outline=INK_DARK, width=3)
    # Screws around motor (small x marks)
    for px, py in [(sx + sw//2 - 70, by + 360), (sx + sw//2 + 70, by + 360)]:
        d.line([(px-12, py-12), (px+12, py+12)], fill=WHITE, width=3)
        d.line([(px-12, py+12), (px+12, py-12)], fill=WHITE, width=3)
    # Sparks around mount
    for i, ang in enumerate([0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]):
        x1 = sx + sw//2 + 70 * math.cos(ang)
        y1 = by + 380 + 30 * math.sin(ang)
        d.line([(x1, y1), (x1 + 25 * math.cos(ang), y1 + 25 * math.sin(ang))], fill=YELLOW, width=3)

def draw_07_prop(d, sx, sy, sw):
    cy0 = sy + 350  # subtitle banner rendered by draw_step frame; drawer content starts below
    by = cy0 + 130
    # Motor + propeller
    d.rounded_rectangle([sx + sw//2 - 70, by + 200, sx + sw//2 + 70, by + 380], radius=18, fill=INK_DARK, outline=BLACK, width=4)
    d.rectangle([sx + sw//2 - 70, by + 200, sx + sw//2 + 70, by + 240], fill=YELLOW, outline=BLACK, width=3)
    d.text((sx + sw//2 - 30, by + 280), "M", font=font(72, bold=True, en=True), fill=WHITE)
    # Propeller on shaft
    d.rectangle([sx + sw//2 - 14, by + 380, sx + sw//2 + 14, by + 440], fill=GREY_MID, outline=BLACK, width=3)
    # Big propeller blade horizontal
    d.polygon([
        (sx + sw//2 - 360, by + 410),
        (sx + sw//2 + 360, by + 410),
        (sx + sw//2 + 380, by + 425),
        (sx + sw//2 + 360, by + 440),
        (sx + sw//2 - 360, by + 440),
        (sx + sw//2 - 380, by + 425)
    ], fill=INK_DARK, outline=BLACK, width=4)
    d.ellipse([sx + sw//2 - 26, by + 405, sx + sw//2 + 26, by + 445], fill=YELLOW, outline=BLACK, width=4)
    # Rotation arrow
    d.arc([sx + sw//2 - 280, by + 130, sx + sw//2 + 280, by + 700], start=0, end=270, fill=GREEN, width=14)
    # Lock indicator
    d.polygon([
        (sx + sw - 250, by + 200),
        (sx + sw - 220, by + 230),
        (sx + sw - 290, by + 290)
    ], fill=GREEN, outline=INK_DARK, width=4)
    d.text((sx + sw - 250, by + 230), "✓", font=font(72, bold=True), fill=WHITE)

def draw_08_wire(d, sx, sy, sw):
    cy0 = sy + 350  # subtitle banner rendered by draw_step frame; drawer content starts below
    by = cy0 + 130
    # ESC box (electronic speed controller)
    d.rounded_rectangle([sx + 200, by + 280, sx + sw - 200, by + 460], radius=14, fill=INK_DARK, outline=BLACK, width=5)
    d.text((sx + sw//2 - 80, by + 340), "ESC", font=font(96, bold=True, en=True), fill=YELLOW)
    # Battery
    d.rounded_rectangle([sx + 350, by + 50, sx + sw - 350, by + 240], radius=12, fill=GREEN, outline=INK_DARK, width=4)
    d.text((sx + sw//2 - 90, by + 130), "BATTERY", font=font(64, bold=True, en=True), fill=WHITE)
    # + and - labels
    d.ellipse([sx + 380, by + 60, sx + 430, by + 110], fill=RED, outline=WHITE, width=4)
    d.text((sx + 392, by + 75), "+", font=font(56, bold=True), fill=WHITE)
    d.ellipse([sx + sw - 430, by + 60, sx + sw - 380, by + 110], fill=BLACK, outline=WHITE, width=4)
    d.text((sx + sw - 410, by + 75), "-", font=font(60, bold=True), fill=WHITE)
    # Wires from battery to ESC
    d.line([(sx + 405, by + 110), (sx + 350, by + 280)], fill=RED, width=18)
    d.line([(sx + sw - 405, by + 110), (sx + sw - 350, by + 280)], fill=BLACK, width=18)
    # Output wires from ESC
    d.line([(sx + 250, by + 460), (sx + 100, by + 580)], fill=BLUE, width=12)
    d.line([(sx + sw - 250, by + 460), (sx + sw - 100, by + 580)], fill=ORANGE, width=12)
    # Motor symbol at end
    d.rounded_rectangle([sx + 60, by + 580, sx + 160, by + 680], radius=12, fill=INK_DARK, outline=BLACK, width=3)
    d.text((sx + 90, by + 605), "M", font=font(64, bold=True, en=True), fill=YELLOW)
    d.rounded_rectangle([sx + sw - 160, by + 580, sx + sw - 60, by + 680], radius=12, fill=INK_DARK, outline=BLACK, width=3)
    d.text((sx + sw - 130, by + 605), "S", font=font(64, bold=True, en=True), fill=YELLOW)
    # Warning sign for polarity
    d.polygon([
        (sx + sw//2, by + 510),
        (sx + sw//2 - 60, by + 600),
        (sx + sw//2 + 60, by + 600)
    ], fill=YELLOW, outline=INK_DARK, width=4)
    d.text((sx + sw//2 - 18, by + 560), "!", font=font(72, bold=True), fill=RED)

def draw_09_balance(d, sx, sy, sw):
    cy0 = sy + 350  # subtitle banner rendered by draw_step frame; drawer content starts below
    by = cy0 + 130
    # Plane top view (tilted)
    cx0, cy0 = sx + sw//2, by + 350
    # Wings
    d.polygon([
        (cx0 - 360, cy0 - 30),
        (cx0 + 360, cy0 - 30),
        (cx0 + 360, cy0 + 30),
        (cx0 - 360, cy0 + 30)
    ], fill=RED, outline=INK_DARK, width=4)
    # Fuselage
    d.ellipse([cx0 - 280, cy0 - 50, cx0 + 280, cy0 + 50], fill=YELLOW, outline=INK_DARK, width=4)
    d.ellipse([cx0 - 350, cy0 - 35, cx0 - 280, cy0 + 35], fill=YELLOW, outline=INK_DARK, width=4)
    # CG mark (red dot, dashed circle)
    d.ellipse([cx0 - 30, cy0 - 30, cx0 + 30, cy0 + 30], outline=RED, width=6)
    d.ellipse([cx0 - 30, cy0 - 30, cx0 + 30, cy0 + 30], fill=(255, 100, 100), outline=RED, width=4)
    d.line([(cx0 - 22, cy0), (cx0 + 22, cy0)], fill=WHITE, width=3)
    d.line([(cx0, cy0 - 22), (cx0, cy0 + 22)], fill=WHITE, width=3)
    # Weight block (sliding)
    d.rounded_rectangle([cx0 + 80, cy0 - 35, cx0 + 200, cy0 + 35], radius=8, fill=INK_DARK, outline=BLACK, width=3)
    d.text((cx0 + 110, cy0 - 15), "配重", font=font(36, bold=True), fill=YELLOW)
    # Arrow showing weight slides toward CG
    d.polygon([
        (cx0 + 80, cy0 - 35),
        (cx0 - 30, cy0 - 35),
        (cx0 - 30, cy0 - 60),
        (cx0 + 30, cy0),
        (cx0 - 30, cy0 + 60),
        (cx0 - 30, cy0 + 35),
        (cx0 + 80, cy0 + 35)
    ], fill=GREEN, outline=INK_DARK, width=3)
    # Check mark
    d.ellipse([cx0 - 320, cy0 + 200, cx0 - 200, cy0 + 320], fill=GREEN, outline=INK_DARK, width=5)
    d.line([(cx0 - 295, cy0 + 260), (cx0 - 270, cy0 + 285)], fill=WHITE, width=8)
    d.line([(cx0 - 270, cy0 + 285), (cx0 - 220, cy0 + 220)], fill=WHITE, width=8)

def draw_10_launch():
    """Launch illustration for the countdown scene - dramatic dark sky with rocket-shaped plane."""
    img = Image.new("RGB", (W, H), BG_DEEP)
    d = ImageDraw.Draw(img)
    # Sky gradient
    for i in range(0, H, 20):
        shade = int(16 + (i / H) * 30)
        d.rectangle([0, i, W, i + 20], fill=(shade, shade - 5, shade + 10))
    # Diagonal speed lines
    for i in range(20):
        x = 100 + i * 60
        d.line([(x, 0), (x + 200, 800)], fill=(60, 60, 90), width=4)
    # Big rocket-shaped plane in middle
    cx0, cy0 = W // 2 - 200, 800
    d.polygon([
        (cx0, cy0 + 80),
        (cx0 + 400, cy0 + 30),
        (cx0 + 400, cy0 + 130)
    ], fill=RED, outline=WHITE, width=6)
    d.polygon([
        (cx0 + 400, cy0 + 30),
        (cx0 + 400, cy0 + 130),
        (cx0 + 250, cy0 + 80)
    ], fill=(180, 60, 50), outline=WHITE, width=6)
    # Cockpit
    d.ellipse([cx0 + 60, cy0 + 50, cx0 + 160, cy0 + 110], fill=WHITE, outline=WHITE, width=3)
    # Exhaust flames
    d.polygon([(cx0 - 80, cy0 + 60), (cx0 - 280, cy0 + 30), (cx0 - 280, cy0 + 80), (cx0 - 80, cy0 + 130)], fill=YELLOW)
    d.polygon([(cx0 - 80, cy0 + 70), (cx0 - 250, cy0 + 50), (cx0 - 250, cy0 + 90), (cx0 - 80, cy0 + 120)], fill=ORANGE)
    d.polygon([(cx0 - 80, cy0 + 80), (cx0 - 220, cy0 + 70), (cx0 - 220, cy0 + 100), (cx0 - 80, cy0 + 110)], fill=RED)
    img.save(os.path.join(OUT, "10_launch.png"), "PNG", optimize=True)
    print("10_launch.png")

def draw_11_soaring():
    """Sky illustration for the soaring scene - airplane in clouds from below."""
    img = Image.new("RGB", (W, H), BG_SKY)
    d = ImageDraw.Draw(img)
    # Clouds at top and bottom
    for cy, scale in [(200, 1.0), (350, 1.3), (1600, 1.5), (1750, 1.2)]:
        for x in range(-50, W + 100, 80):
            d.ellipse([x, cy, x + 240 * scale, cy + 100 * scale], fill=WHITE, outline=(220, 230, 245), width=2)
    # Plane silhouette bottom-up
    cx0, cy0 = W // 2 - 280, 900
    d.polygon([
        (cx0, cy0 + 100),
        (cx0 + 560, cy0 + 70),
        (cx0 + 560, cy0 + 170),
    ], fill=GREY_MID, outline=INK_DARK, width=5)
    d.polygon([
        (cx0 + 560, cy0 + 70),
        (cx0 + 560, cy0 + 170),
        (cx0 + 380, cy0 + 130)
    ], fill=GREY_DARK, outline=INK_DARK, width=5)
    # Cockpit shadow
    d.ellipse([cx0 + 80, cy0 + 100, cx0 + 200, cy0 + 145], fill=INK_DARK)
    # Wings tail
    d.polygon([(cx0 + 480, cy0 + 110), (cx0 + 560, cy0 + 60), (cx0 + 560, cy0 + 110)], fill=GREY_DARK, outline=INK_DARK, width=4)
    img.save(os.path.join(OUT, "11_soaring.png"), "PNG", optimize=True)
    print("11_soaring.png")

def draw_13_endcard():
    img = Image.new("RGB", (W, H), BG_DEEP)
    d = ImageDraw.Draw(img)
    # Big airplane with checklist
    cx, cy = W//2, int(H*0.50)
    # Speed lines
    for i in range(36):
        ang = (i / 36) * 2 * math.pi
        for r in range(260, 800, 26):
            x = int(cx + math.cos(ang) * r)
            y = int(cy + math.sin(ang) * r)
            x2 = int(cx + math.cos(ang) * (r + 14))
            y2 = int(cy + math.sin(ang) * (r + 14))
            col = YELLOW if i % 2 == 0 else ORANGE
            d.line([(x, y), (x2, y2)], fill=col, width=3)
    # Big plane in center
    d.polygon([
        (cx - 300, cy + 60),
        (cx + 300, cy + 30),
        (cx + 300, cy + 130)
    ], fill=RED, outline=WHITE, width=6)
    d.polygon([
        (cx + 300, cy + 30),
        (cx + 300, cy + 130),
        (cx + 80, cy + 80)
    ], fill=(180, 60, 50), outline=WHITE, width=6)
    # Stripes on wing
    d.rectangle([cx - 200, cy + 90, cx + 250, cy + 110], fill=WHITE)
    d.rectangle([cx - 150, cy + 90, cx - 100, cy + 110], fill=RED)
    d.rectangle([cx + 50, cy + 90, cx + 100, cy + 110], fill=RED)
    # Below: thumbs up
    by = cy + 240
    d.rounded_rectangle([cx - 80, by, cx + 80, by + 200], radius=24, fill=YELLOW, outline=INK_DARK, width=5)
    d.polygon([
        (cx - 60, by + 40),
        (cx - 20, by + 30),
        (cx + 20, by + 50),
        (cx + 60, by + 40),
        (cx + 60, by + 130),
        (cx - 60, by + 130)
    ], fill=RED, outline=INK_DARK, width=4)
    img.save(os.path.join(OUT, "13_endcard.png"), "PNG", optimize=True)
    print("13_endcard.png")

if __name__ == "__main__":
    draw_01_hook()
    draw_step(1, "准备材料", "6 件工具 · 30 元起", draw_02_materials)
    draw_step(2, "画设计图", "三视图 · 1:1 比例", draw_03_draw)
    draw_step(3, "切割机翼", "刻刀沿轮廓走刀", draw_04_cut)
    draw_step(4, "粘合机身", "接缝处涂胶水", draw_05_glue)
    draw_step(5, "安装电机", "卡进机头 · 拧紧", draw_06_motor)
    draw_step(6, "装螺旋桨", "顺时针锁紧", draw_07_prop)
    draw_step(7, "接电调电池", "正负极检查", draw_08_wire)
    draw_step(8, "重心调试", "配重对准 CG", draw_09_balance)
    draw_10_launch()
    draw_11_soaring()
    draw_13_endcard()
    print("All done")
