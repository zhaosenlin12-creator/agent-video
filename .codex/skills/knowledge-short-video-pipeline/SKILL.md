---
name: knowledge-short-video-pipeline
description: 一键生成 1080x1920 / 30fps / h264 crf 16 高质量抖音竖屏短视频。包含 8 个阶段：内容结构化 → PIL 干净 PNG 插画 → edge-tts 中文旁白 → Pexels CC0 真实视频 → Remotion 组件实现 → preview 快速验证 → 抽帧 + 一键 QA 验收 → h264 抖音上传成片。适用于：80-160 字的科普/教程/实验/步骤说明类短视频，每条 40-70s，含 Hook + 3-7 个 Step + 倒计时 + 真实素材片段 + EndCard。已用水火箭（13 场景 / 52s）实战验证 QA 19/19 全通过。
metadata:
  short-description: Remotion + PIL + edge-tts + Pexels pipeline for vertical Douyin knowledge videos
---

# Knowledge Short Video Pipeline

Generate a polished 1080x1920 @ 30fps Chinese vertical short video (40-70s) suitable for Douyin/TikTok upload from a single narration script.

The pipeline is deterministic. Every output stage is reproducible. Every quality gate is automated.

## When to use

- New 80-160 word Chinese narration script for a tutorial / experiment / step-by-step / science explainer
- User wants the same production quality as the water-rocket sample (`视频质量还不太好...已经符合我的质量要求` benchmark)
- Need a 1080x1920 vertical video with: Hook → 3-7 Step scenes → 3-2-1 countdown → 1-2 real video segments → EndCard
- Want a reusable, verifiable pipeline that other agents / team members can pick up and run

## When NOT to use

- Videos longer than 90 seconds (Remotion preview/ffprobe time grows quickly; cut into parts)
- Horizontal 16:9 only (this skill defaults to 9:16; flip the constants in `remotion.config.ts` and `Stage.tsx` for 1920x1080)
- English-only narration (TTS voice defaults to `zh-CN-YunxiNeural`; change voice but keep the SceneDef layout)
- Photorealistic / 3D content (use hyperframes-cli instead)

## Inputs the user must supply

1. **One paragraph narration** in Chinese (80-160 字), structured as:
   ```
   [Hook 震撼结论 6-12 字]
   [材料清单句 15-25 字 / 4-5 件并列]
   [步骤 1 动作+要点 10-20 字]
   ...
   [关键参数/安全提醒 10-20 字]
   [倒计时 3！2！1！]
   [高潮结果 10-20 字]
   [结果反馈 10-15 字]
   [收尾互动 10-20 字]
   ```
2. **Output theme name** (Chinese, used for the deliverable filename, e.g. `水火箭_学生实拍`, `小苏打火山`).
3. **2-3 vertical Pexels CC0 video URLs** OR accept auto-search keywords (default: pick by content).

Everything else (palette, fonts, animation timing, Ken Burns, TTS voice, BGM volume) is fixed by the SOP — do NOT improvise.

## Output contract

```
deliver/
├── <theme>_remotion_抖音竖屏超清.mp4     # 1080x1920 / 30fps / h264 crf 16 / 40-70s / ≤50MB
└── <theme>_成片_抽帧样张.jpg            # 4x3 contact sheet
```

QA pass criteria (must be 19/19 before deliverable is signed off):

- A1-A5 specs (resolution / fps / codec / duration / size)
- B1-B5 visual (frames / no-watermark / animation layers / highlight / no occluded caption)
- C1-C4 audio-video (voice count / ffplay end clean / BGM volume / real video smooth)
- D1-D5 content (text=TTS / step order / countdown / video-audio sync / emphasis coverage)

## One-shot run

The reference project lives at `D:\kaifa-teacher\moneyprinter\video_build\remotion\`. Three full docs sit there:

- **SOP.md** — full production spec (10 chapters + appendix)
- **TUTORIAL.md** — 13 step hands-on tutorial
- **QA_CHECKLIST.md** — 19 item checklist + one-click PowerShell verification script

Quick start (after dependencies are installed — see SOP § 4.1):

```powershell
# 1. Render the h264 final
cd D:\kaifa-teacher\moneyprinter\video_build\remotion
npm run build-h264

# 2. Run QA (auto + manual)
.\qa\qa_check.ps1
ffplay -autoexit -nodisp -hide_banner -loglevel error out/water-rocket-h264.mp4

# 3. Copy to deliver/
Copy-Item out/water-rocket-h264.mp4 ../deliver/<theme>_remotion_抖音竖屏超清.mp4
```

## Pipeline stages

### Stage 1 - Content structuring

Goal: turn narration into `SceneDef[]`.

```ts
interface SceneDef {
  key: string;          // unique id, matches public/voice/<key>.mp3
  text: string;         // narration line
  emphasis: string[];   // yellow-highlight key phrases
  voiceSec: number;     // actual TTS duration (ffprobe)
  minDur: number;       // minimum on-screen seconds (≥ voiceSec + 0.4)
  style: "Hook" | "Step" | "Counter" | "Caption" | "End";
  stepLabel?: { en: string; cn: string };
  counterNumber?: string;
  useRealVideo?: boolean;
  videoSrc?: string;
  illustration?: string;
}
```

Rules:

- `Hook` ≈ 3s; `Step` 4-5s; `Counter` 1.4s; `Caption` (real video) 4-5s; `End` 5-6s
- Total = 40-70s
- 1 Hook scene + N Step scenes (3-7) + 3 countdown scenes + 1-2 real-video `Caption` scenes + 1 EndCard
- Each scene's `key` must match `public/voice/<key>.mp3` and optionally `public/illustrations/<key>.png`

See SOP § 2 for the full contract.

### Stage 2 - Generate clean PNG illustrations (PIL)

**Critical rule**: NEVER write any Chinese character on the PNG. All captions are React overlays. Anything baked into the PNG is a leak that ships in the final video.

`scripts/redraw.py` produces 8 PNGs (1080×1920):

```
public/illustrations/
├── 01_hook.png         # dark bg + rocket + speed lines (no text)
├── 02_materials.png    # light bg + table + 4 items
├── 03_cut.png          # light blue bg + bottle
├── 04_fins.png         # bottle ONLY (no fins; let the scene component fly them in)
├── 05_nozzle.png       # bottle + top nozzle zone
├── 06_water.png        # empty bottle (water fills in via animation)
├── 07_pump.png         # pump + bottle
└── 08_countdown.png    # big rocket (counter background)
```

Palette constants: `TABLE_BROWN=(140,95,60)`, `BOTTLE_BLUE=(167,214,255)`, `RED=(255,75,60)`, `YELLOW=(255,212,0)`, `WHITE=(255,255,255)`, `BLACK=(10,14,24)`. Black outlines 4-6 px wide. Save `PNG, optimize=True`.

For new themes, edit `scripts/redraw.py`'s draw blocks per PNG; do NOT use any external image containing text.

### Stage 3 - Generate TTS voice (edge-tts)

```bash
edge-tts --voice zh-CN-YunxiNeural --rate "+10%" --text "<narration>" \
  --write-media public/voice/<key>.mp3
```

Batch wrapper pattern in SOP § 3.2.

After generation, probe each file and write back into `data.ts` `voiceSec`:

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 public/voice/01_hook.mp3
```

`minDur = max(voiceSec + 0.4, scene-type minimum)`.

### Stage 4 - Acquire real video (Pexels CC0)

- 2 short clips minimum (launch + crowd/result)
- **Must be vertical** (1080×1920 or close). Horizontal gets cropped or padded awkwardly.
- Search Pexels by content keyword; download with Pexels API or browser.
- Save to `public/pexels/<id>_<slug>.mp4` with descriptive filename.

If vertical not available, set `objectFit: "cover"` in `RealVideoScene.tsx` and crop edges — but always prefer a vertical source.

### Stage 5 - Implement Remotion scenes

`Composition.tsx` is a `switch` on `s.style`:

| style | Component |
|---|---|
| Hook | `HookScene` (star twinkle + per-letter spring headline + flash) |
| Step | `MaterialsScene` / `CutScene` / `FinsScene` / `NozzleScene` / `WaterScene` / `PumpScene` (each ≥ 3 animation layers) |
| Counter | `CountdownScene` (spring number + screen shake + flash) |
| Caption | `RealVideoScene` (OffthreadVideo + Ken Burns + center caption) |
| End | `EndCardScene` (3-line spring headline + stripe bg + sub fade) |

Reusable animation patterns (SOP § 5.3):

- **spring** for cards / fins / counter: `spring({frame, fps, config: {damping:12, stiffness:120, mass:0.5}})`
- **Ken Burns** for real video: `scale 1.0→1.10` + `translateX 0→-40` over 150 frames
- **Line draw** for tape / cut lines: `clipPath: inset(0 ((1-p)*100)% 0 0)`
- **Pressure gauge** sweep: `angle = -120 + (atm/6)*240` interpolated over pump scene

Always animate on at least 3 properties per Step scene (opacity + transform + secondary transform). Static images fail this gate.

### Stage 6 - Render (3 phases)

```json
"scripts": {
  "start": "remotion studio",
  "build-preview": "remotion render WaterRocketDouyin out/preview.mp4 --concurrency 1 --jpeg-quality 80",
  "build-h264": "remotion render WaterRocketDouyin out/water-rocket-h264.mp4 --codec h264 --crf 16",
  "build-still": "remotion still WaterRocketDouyin out/poster.png --frame=120"
}
```

Phase order:

1. **Studio** (`npm run start`) — tweak animations live in browser
2. **Preview** (`npm run build-preview`, ~2 min, jpeg, ~38MB) — verify content / timing
3. **Final** (`npm run build-h264`, ~85s, h264 crf 16, ~38MB) — the deliverable

### Stage 7 - Quality gates (QA_CHECKLIST.md § 6)

Auto-checks (PowerShell, 10 seconds):

```powershell
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 out/water-rocket-h264.mp4
# expected 1080,1920
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 out/water-rocket-h264.mp4
# expected 30/1
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt -of csv=p=0 out/water-rocket-h264.mp4
# expected h264,yuv420p
ffprobe -v error -show_entries format=duration -of csv=p=0 out/water-rocket-h264.mp4
# expected 40-70
ffplay -autoexit -nodisp -hide_banner -loglevel error out/water-rocket-h264.mp4
# exit code 0, no stderr
```

Manual checks (humans, ~3 minutes):

- 13 frames extracted, no Chinese watermark visible on any
- ≥ 2 animation layers visible per Step scene when scrubbing
- Yellow `#FFD400` highlight on all emphasis words
- Captions complete, not occluded
- TTS audibly matches `text` in each scene

All 19 items → ready to ship.

### Stage 8 - Deliver

Copy h264 mp4 to `deliver/<theme>_remotion_抖音竖屏超清.mp4` with Chinese filename. Generate `deliver/<theme>_成片_抽帧样张.jpg` (4x3 contact sheet) using `scripts/contact_sheet.sh` (or the equivalent ffmpeg montage command).

Final delivery folder always has exactly these 2 files (plus optional poster).

## Common failure modes (and quick fixes)

| Symptom | Cause | Fix |
|---|---|---|
| Chinese watermark visible in PNG | `redraw.py` added text | Remove all text draws; keep captions in React |
| Caption cut off / overlapped | `bottom` too low or illustration too full | Set `bottom` ∈ [100, 210]; keep illustration in y ∈ [300, 1700] |
| Real video stutters | Wrong aspect ratio (horizontal) | Re-download vertical source; `objectFit: "cover"` |
| TTS shorter/longer than scene | `voiceSec` stale | Re-run `ffprobe ... format=duration` and update `data.ts` |
| Render chrome cache error | Remotion internal PNG cache | Kill chrome; clear `D:\cache\tmp\*` |
| Fuzzy Chinese glyphs | System font missing | Install `msyhbd.ttc` / `simhei.ttf` |
| QA B3 fail (animations sparse) | Scene component has only 1 layer | Add ≥ 1 more `interpolate` (opacity / scale / translate) |

## Reusing for a different topic

Path of least friction:

1. **Reuse the entire `video_build/remotion/` folder** as a template (don't fork unless you must).
2. Copy `data.ts` and replace the 13 `SceneDef` entries' `text` / `emphasis` / `voiceSec` / `videoSrc`.
3. Edit `scripts/redraw.py` to redraw the 8 PNGs with new theme colors and objects (still NO text on the PNGs).
4. Re-record TTS mp3s; probe each duration back into `data.ts`.
5. If number of scenes changes, update `Composition.tsx`'s `switch` cases.
6. Run `npm run build-preview` → `npm run build-h264` → `qa_check.ps1` → copy to `deliver/`.

Time budget: ~3 hours for first new topic (palette + PNG redraws dominate). ~1 hour once the template is in steady state.

## Reference project

- Path: `D:\kaifa-teacher\moneyprinter\video_build\remotion\`
- Sample deliverable: `D:\kaifa-teacher\moneyprinter\deliver\水火箭_学生实拍_remotion_抖音竖屏超清.mp4` (52s, 38MB, h264 crf 16, QA 19/19)
- Reference docs (full SOP / tutorial / QA) sit in the same project folder:
  - `SOP.md`
  - `TUTORIAL.md`
  - `QA_CHECKLIST.md`
  - `README.md`

## Version

- v1.0 (2026-08-20) — water-rocket 13-scene production validation, QA 19/19 pass
