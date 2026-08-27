# -*- coding: utf-8 -*-
# Generate 13 EMPTY scene backgrounds (no characters, just atmosphere/environment).
# These will be layered behind transparent character PNGs.
import os, sys, json, time
import urllib.request
from PIL import Image

API_KEY = "sk-cp-9QM1exl8xh3EhT7z1UWColMlUidlVwm8oJPXrojs8w-AhKgo0hsQkQ6e1oEcXiGycRznHXNGKtgjw1nzVg3lVu-XkXkRw_ejJ0fsuTovV8EZtIoBhMjArjQ"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "illustrations")

# 关键：prompt 强调 "no character, no person, empty stage, no subject"
BG_PROMPTS = {
    "01_hook": "an empty modern maker space workshop, soft warm lamp glow on workbench, no people, no characters, no toys, no subjects, clean empty stage with desk lamp, dark mood with amber accent lighting, vertical 9:16 composition, no text, no watermark, no logo",
    "02_materials": "an empty hardware store shelf with colorful PLA filament spools neatly arranged, no person, no character, no subject, clean product display shelf, soft daylight, vertical 9:16 composition, no text, no watermark, no logo",
    "03_model": "a dark professional computer monitor displaying 3D modeling software, wireframe of dinosaur shape on screen but no character outside the screen, no person, empty desk with only the monitor, vertical 9:16 composition, no text overlay, no watermark, no logo",
    "04_slice": "an empty clean white minimalist workspace with a tablet on the desk showing 3D printing slicing interface, no person, no character, no subject, only the tablet and desk, soft natural daylight, vertical 9:16 composition, no text, no watermark, no logo",
    "05_print": "an empty close-up of a 3D printer working in a maker space, nozzle glowing, PLA filament visible, no person, no character, no subject, only the printer machine itself, soft ambient workshop lighting, vertical 9:16 composition, no text, no watermark, no logo",
    "06_layer": "a microscopic 3D printing layers stacking visualization, empty abstract educational diagram aesthetic, dark blue background, no character, no person, no subject, only abstract layer patterns, vertical 9:16 composition, no text, no watermark, no logo",
    "07_remove": "an empty workbench with a craftsman tool set laid out neatly, pliers and sandpaper, no person, no character, no hand, no subject, only tools on clean desk, warm workshop lighting, vertical 9:16 composition, no text, no watermark, no logo",
    "08_servo": "an empty electronics workbench with small electronic components neatly arranged, a servo motor and Arduino board on a clean mat, no person, no character, no subject, only the components, soft warm lighting, shallow depth of field, vertical 9:16 composition, no text, no watermark, no logo",
    "09_code": "an empty programmer's dark room with monitor showing colorful syntax-highlighted code, no person, no character, no subject, only the monitor with code on screen, soft screen glow, vertical 9:16 composition, no text overlay, no watermark, no logo",
    "10_power": "an empty dramatic electrical power setup with glowing switch, dramatic amber lighting flash, sparks and electrical energy in the air, no person, no character, no subject, dark background, vertical 9:16 composition, no text, no watermark, no logo",
    "11_demo": "an empty clean minimal desk by a window with soft natural light, empty stage ready for a small toy display, shallow depth of field, no person, no character, no subject, only the empty desk, vertical 9:16 composition, no text, no watermark, no logo",
    "12_roar": "an empty classroom with desks and chairs, no people, no students, no characters, no subject, warm classroom lighting, empty stage, vertical 9:16 composition, no text, no watermark, no logo",
    "13_endcard": "an empty futuristic cosmic backdrop with deep purple and gold nebula clouds, no person, no character, no subject, empty stage, dramatic studio lighting, vertical 9:16 composition, no text, no watermark, no logo",
}

def call_api(prompt):
    body = json.dumps({
        "model": "image-01",
        "prompt": prompt,
        "aspect_ratio": "9:16",
        "response_format": "url",
        "n": 1,
        "prompt_optimizer": True,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.minimaxi.com/v1/image_generation",
        data=body,
        headers={"Authorization": "Bearer " + API_KEY, "Content-Type": "application/json"},
        method="POST",
    )
    return urllib.request.urlopen(req, timeout=180)

def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=180) as r, open(path, "wb") as f:
        f.write(r.read())

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for key, prompt in BG_PROMPTS.items():
        out_path = os.path.join(OUT_DIR, "bg_" + key + ".png")
        for attempt in range(3):
            try:
                print("=== generating empty bg:", key)
                with call_api(prompt) as r:
                    data = json.loads(r.read().decode("utf-8"))
                    url = data["data"]["image_urls"][0]
                download(url, out_path)
                img = Image.open(out_path).convert("RGB")
                if img.size != (1080, 1920):
                    img = img.resize((1080, 1920), Image.LANCZOS)
                    img.save(out_path, "PNG", optimize=True)
                print("  saved:", out_path)
                time.sleep(3)
                break
            except Exception as e:
                print("attempt", attempt + 1, "failed:", e)
                time.sleep(5)
        else:
            print("FAILED:", key)

if __name__ == "__main__":
    main()