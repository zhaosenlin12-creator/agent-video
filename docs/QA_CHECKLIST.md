# 验收清单 (QA Checklist)

> **目的**：每次成片必须 100% 通过本清单，确保所有视频都达到与航模搭建/水火箭样片同样的质量水准。
> **用法**：每跑完一次 `npm run build-h264`，按顺序打勾 9 项 + 跑一遍第 6 章的一键验收脚本（覆盖 9 项硬性自动检查）。
> **判定**：任意一项失败 → 必须修复后重新走一遍，不可带问题上桌。

---

## 9 项硬性自动检查（qa\qa_check.ps1 一键跑）

### A 组 — 规格合规（必过）

| ID | 检查项 | 阈值 | 失败原因 |
|---|---|---|---|
| A1 | 分辨率 | 1080×1920 | source 不是 9:16 竖屏 |
| A2 | 帧率 | 30/1 | FPS 设置错 |
| A3 | 编码 + 像素格式 | h264 + yuv420p/yuvj420p | --codec 或 --pix-format 没设 |
| A4 | 时长 | 40-70 秒 | 文案太长或太短 |
| A5 | 大小 | ≤ 50MB | crf 太精细（应 ≤ 17）或视频过长 |
| A6 | 视频码率 | ≥ 5Mbps | 同上 |

### B 组 — 视觉

| ID | 检查项 | 阈值 | 失败原因 |
|---|---|---|---|
| B1 | 抽帧样张 | ≥ 13 帧 PNG | final_frames 缺失 |

### C 组 — 音视频

| ID | 检查项 | 阈值 | 失败原因 |
|---|---|---|---|
| C1 | 旁白 mp3 数 | ≥ 13 个 | voice 目录不全 |
| C2 | ffplay 完整播放 | exit 0 无 stderr | 视频破损或编码错 |

---

## 11 项软性自动检查（人工/工具配合）

### 内容合规

- **D1** 文案-旁白一致：TTS 文本 = SCENES[].text
- **D2** 步骤顺序正确：Hook → Materials → Steps → Countdown → Real → End
- **D3** 倒计时数字正确：3, 2, 1 → 发射
- **D4** 音视频同步：每段 voiceSec 与 sceneFrames(fps=30) 一致
- **D5** 关键词高亮：emphasis 字段中的词在 Caption 中显示黄色

### 视觉质量

- **E1** 0 个 "？"乱码：所有中文必须用 msyhbd.ttc 字体
- **E2** 0 个静态画面：每段都有动效（spring / interpolate / SVG overlay）
- **E3** 真实视频片段：11_takeoff + 12_soaring 用了 Pexels CC0
- **E4** banner 不重叠：插画自带 banner，移除冗余 StepLabel
- **E5** 中文 TTS 用 XiaoxiaoNeural + 语速 +5%
- **E6** BGM 音量 0.18（不抢人声）

---

## 常见 FAIL 修复对照表

| 症状 | 根因 | 修复 |
|---|---|---|
| A1 分辨率错 | width/height 不是 1080×1920 | 改 `src/Root.tsx` 的 `<RemotionComposition width height>` |
| A4 时长 > 70s | voiceSec 总和太长 | 砍文案 / 减少段数 / 调小 minDur |
| A4 时长 < 40s | 同上反向 | 加副标段 / 加长真实视频段 |
| A5 size > 50MB | crf 16 太精细 | 改 crf 17 |
| A6 码率 < 5Mbps | 同上 | 改 crf 17 |
| B1 帧数 < 13 | 抽帧脚本错 | 跑 `ffmpeg -y -i out\video.mp4 -vf "fps=1/5" qa\final_frames\frame_%02d.png` |
| C1 voice < 13 | 漏录 | 检查 `public\voice\*.mp3` |
| C2 ffplay 报错 | 视频不完整 | 重渲染 |
| E1 "？"乱码 | PIL 用了 en=True | `scripts\redraw.py` 改 en=False |
| E2 静态画面 | 组件没用 interpolate/spring | 重写该 scene 组件 |
| E3 没真实视频 | pexels 缺失 | 下载 8 段到 `public\pexels\` |
| E4 banner 重叠 | StepLabel + 插画 banner 双层 | 注释掉 StepLabel 调用 |
| E5 用了非 XiaoxiaoNeural | edge-tts 默认 | 显式指定 `--voice zh-CN-XiaoxiaoNeural` |
| E6 BGM 抢声 | volume > 0.25 | 改 `src\audio.tsx` 的 `volume={() => 0.18}` |

---

## 跑验收脚本

```powershell
.\qa\qa_check.ps1
```

期望输出（9/9 PASS）：

```
[PASS] A1 resolution 1080x1920
[PASS] A2 frame_rate 30/1
[PASS] A3 codec h264 + pix_fmt yuv420p
[PASS] A4 duration 40-70s
[PASS] A5 size <= 50MB
[PASS] A6 video bitrate >= 5Mbps
[PASS] B1 13 frames generated
[PASS] C1 voice mp3 count = scenes
[PASS] C2 ffplay end without error

==== Summary ====
PASS : 9
FAIL : 0
ALL PASS - ready to deliver
```

任意 FAIL → 看上面表格 → 修复 → 重新 `npm run build-h264` → 重跑脚本。

---

## 抽帧样张自检

```powershell
ffmpeg -y -i out\video.mp4 -vf "fps=1/5,scale=270:480,tile=4x4" -frames:v 1 -update 1 qa\remotion_final_sheet.jpg
```

打开 `qa\remotion_final_sheet.jpg`，4×4 网格：
- 每个 STEP 的副标显示中文 ✓
- 没有"？"乱码 ✓
- 每个场景的插图/视频清晰可见 ✓
- 真实视频帧自然不抖 ✓
- Endcard 引导明显 ✓

如果发现某帧异常，记下 frame 编号 + 时间，回到 `src\scenes\` 对应组件修复。

---

## 交付前最终检查

- [ ] QA 9/9 PASS
- [ ] 抽帧样张视觉清晰
- [ ] 文件名加 `_remotion_抖音竖屏超清.mp4` 后缀
- [ ] 视频时长 40-70s
- [ ] 文件 ≤ 50MB
- [ ] 保留源工程，可重新跑 `npm run build-h264` 复现
