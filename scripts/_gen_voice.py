# -*- coding: utf-8 -*-
# Regenerate all 13 voice mp3 files with cute cartoon voice (zh-CN-YunxiaNeural).
# v10 user feedback: switch from default XiaoxiaoNeural to cartoon-style voice.

import os
import asyncio
import edge_tts

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "voice")
VOICE = "zh-CN-YunxiaNeural"  # Male, Cartoon, Cute
RATE = "+10%"   # slight speedup for energetic feel
PITCH = "+5Hz"  # slight pitch up for cuter feel

VOICE_LINES = {
    "01_hook":      "一节课打印，只活恐龙，课间直接炸了。",
    "02_materials": "四件东西，三十块搞定，学生党都能玩。",
    "03_model":     "电脑里建出小恐龙，耳朵眼睛一条尾巴。",
    "04_slice":     "切片软件自动分，两百层路径。",
    "05_print":     "按下打印，喷头来回扫，塑料一秒秒堆出来。",
    "06_layer":     "一层零点二毫米，肉眼可见在堆高。",
    "07_remove":    "抠下成品，掰掉支撑，打磨边角。",
    "08_servo":     "舵机塞进身体，接三根控制线。",
    "09_code":      "十六行代码，尾巴左右摆九十度。",
    "10_power":     "三节电池一插，尾巴立刻晃。",
    "11_demo":      "摆在桌上，冲你摇头摆尾。",
    "12_roar":      "按下遥控，一声吼叫，全班都围过来。",
    "13_endcard":   "点赞收藏，下期教你做四足机甲。",
}

async def synthesize_one(key, text):
    out_path = os.path.join(OUT_DIR, key + ".mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
    await communicate.save(out_path)
    print("  generated:", key, os.path.getsize(out_path), "bytes")

async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for key, text in VOICE_LINES.items():
        try:
            await synthesize_one(key, text)
        except Exception as e:
            print("  FAILED:", key, e)
    # remove test
    test = os.path.join(OUT_DIR, "_test_voice.mp3")
    if os.path.exists(test):
        os.remove(test)
    print("All done with voice:", VOICE)

if __name__ == "__main__":
    asyncio.run(main())