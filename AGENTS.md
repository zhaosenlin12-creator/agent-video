# Agent Video 工作流规则 (v18 lessons learned)

本仓库:`agent-video` —— "一节课打印只活恐龙" 抖音竖屏短视频 Remotion 工程。
**严格遵守以下规则,避免重复犯错。**

---

## 1. 绝对禁止(NEVER DO)

### 1.1 不要调用 `view_image` 工具
- **之前触发过 OpenAI 敏感内容过滤器(错误码 1026)**,导致整个任务中断。
- 改为:用 ffmpeg 抽帧生成 JPG/PNG,**用户在播放器里自己看**。
- 或者用 ffmpeg 生成 contact sheet(`-vf "tile=NxM"`)给用户浏览。

### 1.2 不要在 PowerShell 命令里嵌入 CJK 路径
- PowerShell 处理包含中文的路径时会被 **策略拦截(`blocked by policy`)**。
- 改为:用 Python `os.listdir` / `shutil.copy` / `os.remove` 操作中文文件名。
- 或者用短英文路径(如 `out\water-rocket-h264.mp4`)再 copy 到 deliver。

### 1.3 不要用 `&&` 连接 PowerShell 命令
- PowerShell 不支持 `&&`,改用 `;` 或换行。

### 1.4 不要用 `Replace` 插入包含 `\r\n` 的多行字符串
- `[char]10` 或字面量 `\r\n` 会被插入为文本而非换行,导致 esbuild 编译失败。
- 改为:直接用 `[System.IO.File]::WriteAllText($p, $c)` 重写整个文件。
- 或者用 Python `open(path, "w", encoding="utf-8").write(content)`。

### 1.5 不要用 u2net (176MB) 默认模型
- GitHub release 下载速度 30-80 KB/s,需 ~40 分钟。
- 改用 **u2netp (4.7MB)**,下载 1-2 分钟,卡通插图质量够用。

### 1.6 不要在没有检查 voice 时长的情况下生成新声音
- 每次换 TTS 音色后,必须**重新测 voiceSec**(`edge-tts --voice X --text "..." --write-media test.mp3`)。
- 然后更新 `data.ts` 的 `voiceSec` 字段,否则 scene duration 会错。

---

## 2. 排版/布局硬规则(HARD RULES)

### 2.1 抖音 1080x1920 安全区
- **顶部 step label**: y=140
- **主体区**: y=200-1380(scale 0.70-0.78)
- **次要标签**: y=1430-1500(与字幕至少 240px 间距)
- **字幕 (caption)**: y=1720(bottom:200,StepScene 渲染)
- **底部禁区**: y > 1850(评论/点赞 UI 覆盖)

### 2.2 文字宽度限制
- 1080 宽度,文字居中后两侧必须留 ≥40px 安全边距。
- **任何 textSize > 100 的标题,先估算宽度**:`textSize * 字数 * 0.85` 不能超过 1020。
- 例:`"下期更精彩"` 5字 × 116 × 0.85 = 493px,看似 OK,但实际会溢出,因为汉字不等宽。
- **实战规则**:长标题 textSize ≤ 100,或者拆成 2 行 + 缩小字号。

### 2.3 Tag / Caption 间距
- Tag 最大字号 88,y ≤ 1440
- Caption 字号 ≤ 56,y = 1720
- 两者间距 ≥ 280px,否则视觉重叠。

### 2.4 标签必须指向正确的元素
- `"头"` 应该指向**头部**(y 较小),不是底部。
- `"尾"` 应该指向**尾部**(y 较大或最右)。
- 03_model 案例:头=540,躯干=900,尾=1280 → 错误!实际应是头=540,躯干=900,**尾=950-1000**(右尾端)。
- **检查方法**:在 data.ts 里给每个 label 手动算元素 bounding box 的中心点。

---

## 3. 场景设计规则

### 3.1 透明角色 + 全屏背景(已定架构)
- **不要**让 AI 生成的角色里包含其他物体(如打印机)。rembg 抠图后会保留这些。
- 解法:重新生成 image-01 图片,主体必须**干净**。
- 或者:换一张更纯净的角色图。

### 3.2 每个场景至少 2-3 个动画元素
- 1 个主体(transparent PNG)
- 1 个高亮 tag(数字/卖点)
- 1 个 caption(叙述)
- **推荐额外加**:1-2 个 sparkle / 标注箭头 / 装饰 SVG

### 3.3 转场效果(本次未实现,v11+ 加入)
- 场景切换时建议加 0.2-0.4s 的:
  - `fade-through-black`(黑场淡入淡出)
  - `zoom-blur`(前一帧放大模糊)
  - `slide-up`(从下往上滑入)

---

## 4. 工作流(必须执行)

### 4.1 每次交付前
1. `npm run build-h264` 渲染 v8/v9/v10/...
2. `ffmpeg -vf "fps=1/5"` 抽帧到 `qa\final_frames\`
3. `qa\qa_check.ps1` 必须 9/9 PASS
4. `deliver/` 清掉旧版本(`os.listdir` + `'v8' in n` 过滤 + `os.remove`)
5. 复制新版本到 `deliver\3D打印恐龙_vN_*.mp4` + `*_抽帧样张.jpg`
6. `git add -A && git commit -m "vN: ..."`
7. `git push origin main`

### 4.2 错误记录(每次新 bug 都加到这里)
- `view_image` 触发 1026 → 禁止
- 中文路径 PowerShell 拦截 → 用 Python
- u2net 下载慢 → 用 u2netp
- Replace `\r\n` 失败 → 重写文件
- ffplay C2 卡死 → `Start-Sleep (duration+5)` 然后 kill
- 标题 textSize 过大溢出右边界 → textSize ≤ 100,长标题拆行
- Tag/Caption 重叠 → 间距 ≥ 280px
- 标签指向错位 → 算 bounding box 中心
- 默认 XiaoxiaoNeural 音色不符合"卡通" → 改用 YunxiaNeural (Cartoon, Cute)

### 4.3 TTS 切换音色流程
1. 选定 edge-tts voice(`edge-tts --list-voices | findstr zh-CN`)
2. **测试**单句:`edge-tts --voice X --text "..." --write-media test.mp3`
3. 写 `_gen_voice.py` 批量生成 13 段
4. **实测 voiceSec**:播放测试版,听时长,更新 `data.ts` 的 voiceSec 字段
5. 重新跑 build + QA

---

## 5. 工具速查

### 5.1 PowerShell → Python 替换
| 操作 | PowerShell (失败) | Python (OK) |
|---|---|---|
| 删中文文件 | `Remove-Item X:\中文\a.mp4` | `os.remove(r"X:\中文\a.mp4")` |
| 复制 | `Copy-Item ...` | `shutil.copy(src, dst)` |
| 列目录 | `Get-ChildItem` | `os.listdir` |
| 条件过滤 | `Where-Object` + `$_` | `[x for x in lst if ...]` |

### 5.2 ffmpeg 常用
- 抽帧:`ffmpeg -i in.mp4 -vf "fps=1/5" frame_%02d.png`
- 接触片:`ffmpeg -i in.mp4 -vf "fps=1/5,scale=270:480,tile=4x4" -frames:v 1 sheet.jpg`
- 关键帧:`ffmpeg -ss 7.5 -i in.mp4 -frames:v 1 key.png`
- QA 探针:`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name,pix_fmt,bit_rate -of csv=p=0 in.mp4`

### 5.3 edge-tts voices(中文)
| Voice | Gender | Style | 用途 |
|---|---|---|---|
| zh-CN-XiaoxiaoNeural | F | Warm, News | 默认 |
| **zh-CN-YunxiaNeural** | **M** | **Cartoon, Cute** | **本项目用** |
| zh-CN-XiaoyiNeural | F | Lively, Cartoon | 备选可爱女声 |
| zh-CN-YunxiNeural | M | Lively, Sunshine | 备选阳光男声 |

---

## 6. 文件路径

### 工程
- 源码:`D:\kaifa-teacher\moneyprinter\agent-video\src\`
- 资产:`D:\kaifa-teacher\moneyprinter\agent-video\public\`
- 渲染输出:`D:\kaifa-teacher\moneyprinter\agent-video\out\water-rocket-h264.mp4`
- QA 帧:`D:\kaifa-teacher\moneyprinter\agent-video\qa\`
- 脚本:`D:\kaifa-teacher\moneyprinter\agent-video\scripts\`

### 交付
- 主目录:`D:\kaifa-teacher\moneyprinter\deliver\`
- 文件命名:`3D打印恐龙_v{N}_remotion_抖音竖屏超清.mp4` + `3D打印恐龙_v{N}_抽帧样张.jpg`

### 镜像
- GitHub:`https://github.com/zhaosenlin12-creator/agent-video`

---

## 7. 用户偏好(必读)
- **中文优先** —— 对话/字幕/文件名/注释全用中文
- **Default 模式 + approval never** —— 直接执行,不询问
- **每次交付前必跑 QA 9/9 PASS**
- **每次清理旧版本**(deliver 中 v5/v6/v7/v8/v9...)
- **每次 git commit + push**
- **绝不调 view_image**

---

## 8. 版本历史(commit 简表)
| 版本 | commit | 关键改动 |
|---|---|---|
| v5 | f318cc7 | 修复 caption 双渲染 + 转场音静音 |
| v6 | 0ca71c3 | 13 场景背景 + 5 层 z-index + tick 入场音 |
| v7 | b17375f | 主体高度 cap 1180 |
| v8 | b2ed2c0 | rembg 抠图 + 删角落 AI 点缀 |
| v9 | 6b855e6 | 修复文字溢出/重叠 + sparkle |
| v10 | (TBD) | 换卡通音色 + 修标签位置 + 转场 |
| v15-v18 | d4a79fc | cropped subjects centered + HookScene rebuild + text glow shrink + burst pos fix + cartoon vibe |

---


---

## 9. v15-v18 new lessons (fix from root)

### 9.1 transparent PNG subject offset
- AI-generated 1080x1920 transparent PNGs often have subject off-center
- e.g. 07_remove subject bbox center=(593,942) but canvas center=(540,960)
- Direct render leads to subject on right side
- **Fix**: crop to subject bbox, then use subject bbox center as new canvas center
- Pad with transparent pixels to fill edges
- Verification: subject_center must equal canvas_center (offset=0)

### 9.2 explicit w/h not scale
- ElementRenderer used w = el.scale * 1080, h = min(w*1.4, 1180)
- This distorts aspect ratio (assumes 1.4 but actual is 0.7-1.9)
- **Fix**: each image element in data.ts has explicit w/h matching _tc.png aspect
- objectFit:contain handles the rest

### 9.3 textShadow glow too wide
- 30px blur textShadow spreads far beyond 30px in actual render
- Triggers false CLIP detection
- **Fix**: shrink glow to 2-12px, keep visual effect without overflow

### 9.4 HookScene element overlap
- 4 elements stacked vertically with wrong y values
- Title/subtitle/bottom all clustered at y=1620/1820
- **Fix**: explicit y layering: title y=300/480, dino y=960 h=750, subtitle y=1480, bottom y=1720

### 9.5 PrintOverlay fluid path too long
- Fluid path from nozzleY=600 to nozzleY+700=1300 spans whole canvas
- **Fix**: shorten to nozzleY+310=910, keeps fluid in upper area

### 9.6 EndCardScene text overflow
- top=1750 + fontSize=80 + default whiteSpace=normal
- Text wraps to 2 lines, second line cut off by canvas bottom
- **Fix**: add whiteSpace: nowrap, fontSize 80->60

### 9.7 verifier false positive on bg colors
- yellow-at-x>=1060 detection flags 5+ scenes incorrectly
- Root cause: bg_XX.png backgrounds have warm light (windows/lamps)
- **Fix**: visual contact sheet + thumb check, not just edge pixel detection

### 9.8 burst text overflow
- 200-layer-path burst at y=1450 overlaps image element below
- **Fix**: burst default y=1400, textSize 56->52

**违反以上规则导致的问题,一律视为代码 bug,记一次 v(N+1) 修复。**