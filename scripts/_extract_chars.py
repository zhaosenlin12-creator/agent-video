# -*- coding: utf-8 -*-
# Use rembg (isnet-general-use) to extract characters from 13_* illustrations.
# Input: 13 illustrations with subjects on backgrounds.
# Output: 13_*_t.png transparent versions with alpha channel.
import os
from PIL import Image
from rembg import remove, new_session
_session = new_session('u2netp')


OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "illustrations")

KEYS = [
    "01_hook", "02_materials", "03_model", "04_slice", "05_print",
    "06_layer", "07_remove", "08_servo", "09_code", "10_power",
    "11_demo", "12_roar", "13_endcard",
]

def extract(src_path, out_path):
    img = Image.open(src_path).convert("RGBA")
    out = remove(img, session=_session)
    # rembg may keep background slightly; ensure pure transparent
    out.save(out_path, "PNG", optimize=True)
    print("  transparent:", os.path.basename(out_path), out.size)

def main():
    for key in KEYS:
        src = os.path.join(OUT_DIR, key + ".png")
        dst = os.path.join(OUT_DIR, key + "_t.png")
        if not os.path.exists(src):
            print("missing:", src)
            continue
        if os.path.exists(dst):
            print("skip exists:", dst)
            continue
        print("=== extracting:", key)
        extract(src, dst)

if __name__ == "__main__":
    main()
