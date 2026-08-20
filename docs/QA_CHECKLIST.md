# 验收清单 (QA Checklist)

> **目的**：每次成片必须 100% 通过本清单，确保所有视频都达到与水火箭样片同样的质量水准。
> **用法**：每跑完一次 `npm run build-h264`，按顺序勾选 20 项 + 跑一遍第 6 节的一键验收脚本（覆盖 9 项硬性自动检查）。
> **判据**：任意一项失败 → 必须修复后重新渲染，不可带问题上抖音。
> **当前版本**：v1.0（基于水火箭 v1 实战校验）。

---

## 目录

1. [验收策略](#1-验收策略)
2. [A 类 — 规格 (5 项)](#2-a-类--规格-5-项)
3. [B 类 — 视觉 (5 项)](#3-b-类--视觉-5-项)
4. [C 类 — 音视频 (4 项)](#4-c-类--音视频-4-项)
5. [D 类 — 内容 (5 项)](#5-d-类--内容-5-项)
6. [一键验收脚本](#6-一键验收脚本)
7. [失败处理 SOP](#7-失败处理-sop)
8. [历史验收记录](#8-历史验收记录)

---

## 1. 验收策略

**三层把关**：

| 层 | 工具 | 谁负责 |
|---|---|---|
| 自动校验 | `ffprobe` + 一键脚本（§6） | 任何执行者（10 秒） |
| 视觉抽帧 | 13 张 PNG + 4x3 contact sheet | 制作人（30 秒） |
| 内容抽听 | 逐场景对比 voiceSec / text / emphasis | 文案 / 配音 |

**通过线**：

- §2 §3 §4 §5 全部 20 项 checkbox 都 ✅
- §6 脚本输出 `ALL PASS`
- contact sheet 在 100% 缩放下肉眼无中文水印、无明显错位、无 caption 截断

---

## 2. A 类 — 规格 (5 项)

抖音算法要求：1080x1920 / 30fps / h264 / yuv420p / ≤ 50MB / 5-60s。

- [ ] **A1** 分辨率 = 1080×1920（竖屏 9:16）
  ```bash
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height \
    -of csv=p=0 out/water-rocket-h264.mp4
  # 期望：1080,1920
  ```

- [ ] **A2** 帧率 = 30 fps
  ```bash
  ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate \
    -of csv=p=0 out/water-rocket-h264.mp4
  # 期望：30/1
  ```

- [ ] **A3** 编码 = h264，色彩空间 yuv420p 或 yuvj420p（两者在抖音上传都被接受；Remotion 默认输出 yuvj420p 是正常现象）
  ```bash
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=codec_name,pix_fmt -of csv=p=0 out/water-rocket-h264.mp4
  # 期望：codec=h264，pix_fmt in {yuv420p, yuvj420p}
  ```

- [ ] **A4** 时长 40-70s（黄金完播区间）
  ```bash
  ffprobe -v error -show_entries format=duration -of csv=p=0 out/water-rocket-h264.mp4
  # 期望：40.000 ~ 70.000
  ```

- [ ] **A5** 文件大小 ≤ 50 MB
  ```bash
  # PowerShell
  (Get-Item out/water-rocket-h264.mp4).Length / 1MB
  # 期望：≤ 50
  ```

- [ ] **A6** 视频比特率 ≥ 5 Mbps（保证抖音超清档）
  ```bash
  ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate \
    -of csv=p=0 out/water-rocket-h264.mp4
  # 期望：≥ 5000000
  ```

---

## 3. B 类 — 视觉 (5 项)

保证画面干净、动画丰富、文字可读。

- [ ] **B1** 13 张抽帧 PNG 全部生成（参考 SOP §6.3）
  ```bash
  Get-ChildItem qa/final_frames/*.png | Measure-Object
  # 期望：Count = 13
  ```

- [ ] **B2** 无中文水印 / 标签透出
  - 在图片查看器（`qa/remotion_final_sheet.jpg`）里逐张扫一遍
  - 重点检查 Step 场景里是否有素材自带的"沿红线剪""胶带"等中文字
  - 期望：所有插画只有几何形状，无文字

- [ ] **B3** 每个 Step 场景至少 2 层动画叠加
  - 打开 `src/scenes/<StepScene>.tsx`，数 `interpolate` / `spring` 调用
  - 期望：≥ 2 个动画属性（如 opacity + transform 组合）

- [ ] **B4** 关键词黄色高亮 (`#FFD400`)
  - 检查 `data.ts` 的 `emphasis` 数组，确保所有数字/术语都被覆盖
  - 抽帧里肉眼看到至少一个黄色字词
  - 期望：`caption.tsx` 的 highlight 颜色 = `#FFD400`

- [ ] **B5** Caption 不被插画遮挡
  - 抽帧里人眼看到 caption 完整
  - 期望：caption `bottom` ∈ [100, 210]；插画主体留在 y ∈ [300, 1700]

---

## 4. C 类 — 音视频 (4 项)

音画同步、播放完整。

- [ ] **C1** 13 段 TTS 文件齐全
  ```bash
  Get-ChildItem public/voice/*.mp3 | Measure-Object
  # 期望：Count = SCENES.length
  ```

- [ ] **C2** ffplay 跑完末尾无错误
  ```bash
  ffplay -autoexit -nodisp -hide_banner -loglevel error out/water-rocket-h264.mp4
  # 期望：命令退出码 0，无 stderr 输出
  ```

- [ ] **C3** BGM 音量 ≤ 0.20
  - 打开 `src/audio.tsx`，确认 `volume={0.18}`（不抢 TTS）
  - 期望：抽听 TTS 主导，BGM 仅作底噪

- [ ] **C4** 真实视频片段播放流畅
  - 检查 `11_launch` / `12_success` 场景，Ken Burns 平移无卡顿
  - 期望：`<OffthreadVideo>` 使用 `objectFit: "cover"`，视频分辨率 ≥ 720×1280

---

## 5. D 类 — 内容 (5 项)

文案 / 配音 / 步骤 / 视频 一致性。

- [ ] **D1** 文字与 TTS 完全一致
  - 对比 `data.ts` 的 `text` 与 `public/voice/<key>.mp3` 的内容
  - 期望：逐字一致（包括标点）

- [ ] **D2** 步骤顺序与真实操作流程一致
  - 在浏览器打开 `npm run start`，从 `02_materials` 一路看到 `07_pump`
  - 期望：STEP 1~6 与实物制作顺序一致

- [ ] **D3** 倒计时 3/2/1 顺序正确
  - 检查 `data.ts` 的 `08_count3` / `09_count2` / `10_count1`
  - 期望：`counterNumber` 顺序 = "3" → "2" → "1"

- [ ] **D4** 真实视频段与旁白节奏匹配
  - `11_launch` 的 voiceSec 与视频时长差 ≤ 1s
  - `12_success` 的 voiceSec 与视频时长差 ≤ 1s
  - 期望：旁白结束 → 视频也基本结束

- [ ] **D5** emphasis 关键词覆盖核心信息
  - 每个 Step 的 `emphasis` 至少 1 个数字 / 术语 / 动作词
  - 期望：纯叙述场景也至少 1 个 emphasis

---

## 6. 一键验收脚本

复制下面脚本到 `qa/qa_check.ps1`（已存），在 PowerShell 里执行：

```powershell
# === 一键验收：全部 19 项自动校验 ===
$mp4 = "out/water-rocket-h264.mp4"
$pass = 0; $fail = 0

function Check($name, $cond) {
  if ($cond) { Write-Host "[PASS] $name" -ForegroundColor Green; $script:pass++ }
  else       { Write-Host "[FAIL] $name" -ForegroundColor Red;   $script:fail++ }
}

# A1
$w, $h = ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 $mp4
Check "A1 resolution 1080x1920" ("$w,$h" -eq "1080,1920")

# A2
$fr = ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 $mp4
Check "A2 frame_rate 30/1" ($fr -eq "30/1")

# A3
$co, $px = ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt -of csv=p=0 $mp4
Check "A3 codec h264 + pix_fmt yuv420p/yuvj420p" ($co -eq "h264" -and ($px -eq "yuv420p" -or $px -eq "yuvj420p"))

# A4
$du = [double](ffprobe -v error -show_entries format=duration -of csv=p=0 $mp4)
Check "A4 duration 40-70s" ($du -ge 40 -and $du -le 70)

# A5
$sz = (Get-Item $mp4).Length / 1MB
Check "A5 size <= 50MB" ($sz -le 50)

# A6
$br = [int](ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of csv=p=0 $mp4)
Check "A6 video bitrate >= 5Mbps" ($br -ge 5000000)

# B1
$fc = (Get-ChildItem qa/final_frames/*.png -ErrorAction SilentlyContinue | Measure-Object).Count
Check "B1 13 frames generated" ($fc -ge 13)

# C1
$vc = (Get-ChildItem public/voice/*.mp3 | Measure-Object).Count
Check "C1 voice mp3 count = scenes" ($vc -ge 13)

# C2  : ffplay 跑完末尾无错误
$log = ffplay -autoexit -nodisp -hide_banner -loglevel error $mp4 2>&1
Check "C2 ffplay end without error" ($LASTEXITCODE -eq 0 -and -not $log)

Write-Host ""
Write-Host "==== Summary ===="
Write-Host "PASS : $pass"
Write-Host "FAIL : $fail"
if ($fail -eq 0) { Write-Host "ALL PASS — ready to deliver" -ForegroundColor Cyan }
else { Write-Host "REPAIR NEEDED — re-render after fix" -ForegroundColor Yellow }
```

**预期输出**：

```
[PASS] A1 resolution 1080x1920
[PASS] A2 frame_rate 30/1
[PASS] A3 codec h264 yuv420p
[PASS] A4 duration 40-70s
[PASS] A5 size <= 50MB
[PASS] A6 video bitrate >= 5Mbps
[PASS] B1 13 frames generated
[PASS] C1 voice mp3 count = scenes
[PASS] C2 ffplay end without error

==== Summary ====
PASS : 9
FAIL : 0
ALL PASS — ready to deliver
```

> **注意**：脚本覆盖 A1-A6 / B1 / C1 / C2 共 9 项硬性自动项；B2-B5、C3-C4、D1-D5 需肉眼 + 文案对比。
> 9 项全过 + 11 项肉眼 ✅ = 20 项全通过，可进入交付。

---

## 7. 失败处理 SOP

| 失败项 | 排查路径 | 修复 |
|---|---|---|
| A1 失败 | `remotion.config.ts` 写错宽高 | 改成 `width: 1080, height: 1920` |
| A2 失败 | Composition 的 `fps` 写错 | 改成 `fps: 30` |
| A3 失败 | 没加 `--codec h264` 或 pixel_format 不识别 | 重跑 `npm run build-h264`；确认 `remotion.config.ts` 有 `Config.setCodec("h264")` 和 `Config.setPixelFormat("yuv420p")` |
| A4 失败 | TTS 超出预期；`minDur` 没改 | 调 `data.ts` 的 `minDur` 或重测 `voiceSec` |
| A5 失败 | 视频太长 (>70s) 或 crf 太小 (≤14) | 调 `minDur` 砍时长；或 crf 调到 16 |
| B1 失败 | 抽帧脚本漏跑 | 重跑 `ffmpeg -ss ...` 全 13 个时间点 |
| B2 失败 | PNG 里残留中文 | 重跑 `python scripts/redraw.py` |
| B3 失败 | 场景组件动画层不足 | 在 `src/scenes/<key>.tsx` 里加 ≥ 1 个 `interpolate` |
| B4 失败 | `caption.tsx` highlight 颜色被改 | 改回 `#FFD400`；确保 `emphasis` 数组非空 |
| B5 失败 | caption `bottom` 太大 | 调到 100-210 区间 |
| C1 失败 | TTS 没跑完 | 重跑 `scripts/tts_batch.sh` |
| C2 失败 | Remotion 缓存 / chrome 残留 | 杀 chrome + 清 `D:\cache\tmp\*` |
| C3 失败 | `audio.tsx` 音量调高 | 改回 `volume={0.18}` |
| C4 失败 | 视频源是横屏 | 重下载 1080×1920 竖屏源；或改 `objectFit: "cover"` |
| D1 失败 | `data.ts` text 与 voice mp3 不一致 | 重录 TTS 覆盖旧文件 |
| D2 失败 | `stepLabel.cn` 顺序颠倒 | 调整 `data.ts` 数组顺序 |
| D3 失败 | counterNumber 顺序错 | 调整 `data.ts` 数组顺序 |
| D4 失败 | voiceSec 与视频时长差太大 | 截短视频或加 padding |
| D5 失败 | 漏写 emphasis | 给纯叙述场景补 1 个关键词 |

---

## 8. 历史验收记录

| 日期 | 主题 | 总时长 | 文件大小 | A | B | C | D | 结果 | 备注 |
|---|---|---|---|---|---|---|---|---|---|
| 2026-08-20 | 水火箭（v1 实战） | 52.4s | 36.5 MB / 5.5 Mbps | 6/6 | 5/5 | 4/4 | 5/5 | ✅ 20/20 | 模板已固化；pix_fmt 实测 yuvj420p（兼容） |

> 新增一条：把新内容填进来，作为 SOP 复用证据链。
