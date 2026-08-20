# 复用教程：从一段新文案到抖音竖屏成片

> 本教程基于 `SOP.md`，目标是让你（或团队其他人）拿到新文案后，**2-4 小时内**产出同质量竖屏视频。
> 已验证：水火箭文案 → 成片（52s），按本教程操作能完整复刻。

---

## 前置条件（一次准备）

| 工具 | 版本 | 用途 |
|---|---|---|
| Node.js | 20+ | 跑 Remotion |
| ffmpeg | 6.x | 抽帧、ffprobe、ffplay（已含在大多数发行版） |
| Python | 3.10+ | 跑 PIL + edge-tts |
| Pillow | 10+ | `pip install pillow` |
| edge-tts | 6.x | `pip install edge-tts` |
| 中文字体 | Win 自带 `msyhbd.ttc` | Stage.tsx 里已声明字体栈 |

一次性命令：

```powershell
pip install pillow edge-tts
cd D:\kaifa-teacher\moneyprinter\video_build\remotion
npm install   # 安装 Remotion 依赖
```

确认 ffmpeg 能用：

```powershell
ffmpeg -version | Select-Object -First 3
ffprobe -version | Select-Object -First 3
```

---

## 步骤 1：写文案

**输入**：自然语言描述（80-160 字）。

**示例**（水火箭）：

> "塑料瓶也能飞上天！一个可乐瓶、一卷胶带、一把剪刀、一个打气筒就够了。
> 沿瓶身中间剪开做成可以翻折的底座，硬卡纸剪三角翼十字缠绕胶带固定在瓶身两侧，
> 瓶口装上喷嘴转接头胶带死死缠紧千万别漏气，往瓶子里倒三分之一的水太少没动力，
> 瓶子倒扣在发射架上充气大约六个大气压。三！二！一！水火箭腾空而起，作用力与反作用力！
> 全班同学瞬间炸锅鼓掌！全程没花一分钱，点赞收藏，跟着我下期做更酷的实验。"

**模板**（填空）：

```
[一句话震撼结论（6-12 字）]
[材料清单句（15-25  4-5 件材料并列）]
[步骤 1 动作+要点（10-20 字）]
[步骤 2 动作+要点（10-20 字）]
[步骤 3 动作+要点（10-20 字）]
[关键参数/安全提醒（10-20 字）]
[倒计时 3！2！1！]
[高潮结果（10-20 字）]
[结果反馈（10-15 字）]
[收尾互动（10-20 字）]
```

---

## 步骤 2：拆 `SceneDef[]`

按 `SOP.md §2` 把文案拆成场景数组（参考 `src/data.ts` 的现有 13 场景）。

**水火箭模板**（可直接复用）：

```ts
{ key: "01_hook",      style: "Hook",     text: "...", emphasis: [...] },
{ key: "02_materials", style: "Step",     stepLabel: { en: "STEP 1", cn: "..." }, illustration: "..." },
{ key: "03_cut",       style: "Step",     stepLabel: { en: "STEP 2", cn: "..." }, illustration: "..." },
{ key: "04_fins",      style: "Step",     stepLabel: { en: "STEP 3", cn: "..." }, illustration: "..." },
{ key: "05_nozzle",    style: "Step",     stepLabel: { en: "STEP 4", cn: "..." }, illustration: "..." },
{ key: "06_water",     style: "Step",     stepLabel: { en: "STEP 5", cn: "..." }, illustration: "..." },
{ key: "07_pump",      style: "Step",     stepLabel: { en: "STEP 6", cn: "..." }, illustration: "..." },
{ key: "08_count3",    style: "Counter", counterNumber: "3", illustration: "..." },
{ key: "09_count2",    style: "Counter", counterNumber: "2", illustration: "..." },
{ key: "10_count1",    style: "Counter", counterNumber: "1", illustration: "..." },
{ key: "11_launch",    style: "Caption", useRealVideo: true, videoSrc: "pexels/...launch.mp4" },
{ key: "12_success",   style: "Caption", useRealVideo: true, videoSrc: "pexels/...success.mp4" },
{ key: "13_endcard",   style: "End",     text: "...", emphasis: [...] },
```

`voiceSec` 先写 `0` 占位，下一步填实测值。
`minDur` 暂定 `voiceSec + 0.4`（待步骤 3 后定）。

---

## 步骤 3：edge-tts 生成旁白 + 测时长

```powershell
cd D:\kaifa-teacher\moneyprinter\video_build\remotion

# 1. 生成单条 TTS（替换 text）
edge-tts --voice zh-CN-YunxiNeural --rate "+10%" `
  --text "塑料瓶也能飞上天！" `
  --write-media public/voice/01_hook.mp3

# 2. 批量：把要生成的句子放进 array，循环执行
$sentences = @(
  @{k="01_hook";      t="塑料瓶也能飞上天！"},
  @{k="02_materials"; t="一个可乐瓶、一卷胶带、一把剪刀、一个打气筒就够了。"},
  # ... 共 13 条
)
foreach ($s in $sentences) {
  edge-tts --voice zh-CN-YunxiNeural --rate "+10%" --text $s.t `
    --write-media "public/voice/$($s.k).mp3"
}

# 3. 测每个 mp3 时长
foreach ($s in $sentences) {
  $d = ffprobe -v error -show_entries format=duration -of csv=p=0 `
        "public/voice/$($s.k).mp3"
  Write-Output "$($s.k) $d s"
}
```

把测得的秒数写回 `src/data.ts` 的 `voiceSec`。

---

## 步骤 4：生成 8 张干净插画 PNG

**改 `scripts/redraw.py`**：

- 调整 `draw_*` 函数里的形状/颜色（保持调色板一致）
- 哪些 PNG 元素必须画：主体（瓶子/火箭/家具/食物...） + 背景色
- 哪些元素**禁止画在 PNG**（留给 React 动画叠加）：
  - 飞入的碎片（fin/leaf/装饰）
  - 流动的水/烟雾
  - 数字/警示语/标签
  - 高亮文字

**跑脚本**：

```powershell
python scripts/redraw.py
```

**验证无水印**（关键！曾踩坑）：

```powershell
node -e "const fs=require('fs'); const {PNG}=require('pngjs'); const files=['02_materials.png','03_cut.png','04_fins.png','05_nozzle.png','06_water.png','07_pump.png']; for (const f of files) { const png=PNG.sync.read(fs.readFileSync('public/illustrations/'+f)); let dark=0; for (let y=180;y<400;y++) for (let x=740;x<820;x++) { const i=(png.width*y+x)<<2; if (png.data[i]<80 && png.data[i+1]<80 && png.data[i+2]<80) dark++; } console.log(f, 'darkPixels=', dark); }"
```

`darkPixels` 必须为 `0`（深色文字像素）。如果有 >0，说明 PNG 内部还有水印，重新生成。

---

## 步骤 5：准备真实视频（Pexels）

搜索关键词示例：

- `water rocket launch`（水火箭发射）
- `kids science experiment`（学生实验）
- `chemistry reaction`（化学反应）
- `success kids cheering`（欢呼）

下载竖屏 mp4，**至少 5s**，分辨率 ≥ 720×1280。

放路径：

```
public/pexels/7106862_actual_launch_vertical.mp4
public/pexels/7106839_success_run.mp4
```

在 `data.ts` 里 `videoSrc` 字段对应改文件名。

---

## 步骤 6：改 `src/data.ts`

按 `SOP.md §2` 接口替换：

```ts
// 改这些字段：
SCENES.map(s => ({
  ...s,
  text: "新文案",
  emphasis: ["新关键词"],
  voiceSec: 3.5,    // ← 步骤 3 实测值
  videoSrc: "pexels/新视频.mp4",
  illustration: "illustrations/新图.png"
}))
```

---

## 步骤 7：改场景组件（动画模板）

**保留**这 5 类场景组件的现成实现（已含动画模式库）：

- `HookScene.tsx` — 替换 `text` / `illustration`
- `RealVideoScene.tsx` — 替换 `videoSrc`
- `CountdownScene.tsx` — 数字 3/2/1 自动从 `counterNumber` 取
- `EndCardScene.tsx` — 替换 `text` 数组
- `StepScene.tsx` — 通用步骤图（兜底用）

**重写**这 5 类组件（不同动画逻辑）：

- `CutScene.tsx`（切割类动作）
- `FinsScene.tsx`（飞入零件类）
- `NozzleScene.tsx`（部件安装类）
- `WaterScene.tsx`（液体填充类）
- `PumpScene.tsx`（仪表/数值类）

每类套 `SOP.md §5.3` 的关键动画模式。

---

## 步骤 8：preview 渲染验证

```powershell
cd D:\kaifa-teacher\moneyprinter\video_build\remotion

# 先杀 chrome 残留
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force 'D:\cache\tmp\*' -ErrorAction SilentlyContinue

# 跑 preview（~2 分钟）
npm run build-preview
```

---

## 步骤 9：抽帧验收

按时间点抽 13 帧（用 `SOP.md §6.3` 模板）：

```powershell
$frames = @(
  @{t=1.8; n="01_hook.png"},       # Hook 段
  @{t=6;   n="02_materials.png"},  # Step 1 末尾
  @{t=11;  n="03_cut.png"},        # Step 2 中段
  @{t=15;  n="04_fins.png"},       # Step 3 末尾
  @{t=20;  n="05_nozzle.png"},     # Step 4 中段
  @{t=26;  n="06_water.png"},      # Step 5 中段
  @{t=31;  n="07_pump.png"},       # Step 6 末尾
  @{t=33;  n="08_count3.png"},     # 倒计时 3
  @{t=40;  n="11_launch.png"},     # 真实视频
  @{t=44;  n="12_success.png"},    # 真实视频
  @{t=49;  n="13_endcard.png"}     # 结束卡
)
foreach ($f in $frames) {
  ffmpeg -y -ss $f.t -i out/preview.mp4 -frames:v 1 qa/final_frames/$f.n
}
```

人工肉眼检查（关键）：

- [ ] 13 张图全部干净（无中文水印透出）
- [ ] 至少 3 张能看到动态元素在动画状态中
- [ ] 真实视频帧在播放 Pexels 视频而非插画
- [ ] 数字倒计时显示 3/2/1

---

## 步骤 10：高质量 h264 成片

```powershell
cd D:\kaifa-teacher\moneyprinter\video_build\remotion
npm run build-h264   # ~85 秒
```

ffprobe 校验：

```powershell
ffprobe -v error -select_streams v:0 `
  -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames,bit_rate `
  -show_entries format=duration,size `
  -of default out/water-rocket-h264.mp4
```

期望：

```
codec_name=h264
width=1080
height=1920
r_frame_rate=30/1
bit_rate=5500000~6000000
nb_frames=1200~2100
duration=40~70
```

---

## 步骤 11：ffplay 真实播放验证

```powershell
$log = "ffplay_log.txt"
$proc = Start-Process ffplay -ArgumentList `
  "-autoexit","-nodisp","-hide_banner","-loglevel","quiet","-stats",
  "out/water-rocket-h264.mp4" `
  -RedirectStandardError $log -PassThru -NoNewWindow
Start-Sleep 60
if (-not $proc.HasExited) { $proc | Stop-Process }
Get-Content $log -Tail 5
```

期望：

- 进程跑完 60 秒后退出
- 最后一行的 `aq=` 衰减到 `0KB`
- 无 stderr 错误

---

## 步骤 12：抽最终 13 帧 + contact sheet

按 `SOP.md §6.3` 重抽最终帧：

```powershell
foreach ($f in $frames) {
  ffmpeg -y -ss $f.t -i out/water-rocket-h264.mp4 -frames:v 1 -q:v 2 qa/final_frames/$f.n
}
```

生成 4x3 contact sheet（用 `scripts/contact_sheet.ps1`）：

```powershell
$sheetDir = "qa\sheet"
New-Item -ItemType Directory -Force -Path $sheetDir
foreach ($f in $frames) {
  ffmpeg -y -ss $f.t -i out/water-rocket-h264.mp4 -frames:v 1 `
    -vf "scale=540:-2" -q:v 4 "$sheetDir\$($f.n -replace '.png','.jpg')"
}
$names = Get-ChildItem "$sheetDir\*.jpg" | Sort-Object Name |
  ForEach-Object { "file '$sheetDir/$($_.Name)'" }
$list = "$sheetDir\_list.txt"
[System.IO.File]::WriteAllLines($list, $names, [System.Text.UTF8Encoding]::new($false))
ffmpeg -y -f concat -safe 0 -i $list `
  -filter_complex "scale=540:-2,tile=4x3:padding=10:color=black" `
  qa/remotion_final_sheet.jpg
```

---

## 步骤 13：交付

```powershell
# 复制成片到 deliver/
Copy-Item out/water-rocket-h264.mp4 `
  D:\kaifa-teacher\moneyprinter\deliver\<主题>_remotion_抖音竖屏超清.mp4

# 复制 contact sheet
Copy-Item qa/remotion_final_sheet.jpg `
  D:\kaifa-teacher\moneyprinter\deliver\<主题>_成片_抽帧样张.jpg

# 跑 QA_CHECKLIST.md 验收
Get-Content QA_CHECKLIST.md   # 19 项 checkbox
```

文件名格式：

- `<主题>_remotion_抖音竖屏超清.mp4`
- `<主题>_成片_抽帧样张.jpg`

---

## 微调速查表

| 想改什么 | 动哪里 |
|---|---|
| 单条文案 | `src/data.ts` 的 `text` 和 `emphasis` |
| 时长变长/短 | `src/data.ts` 的 `voiceSec` 和 `minDur` |
| 插画颜色/形状 | `scripts/redraw.py` 的 `draw_*` 函数 |
| 真实视频片段 | 替换 `public/pexels/*.mp4`（保持文件名） |
| 动画速度 | `src/scenes/<key>.tsx` 的 `interpolate(f, [from, to])` 范围 |
| 字号 | `src/components/Caption.tsx` 的 `size` 默认值，或场景组件里 `<Caption size={...}>` |
| 标题色 | `src/components/HookHeadline.tsx` 的 `color` / `WebkitTextStroke` |
| 倒计时字色 | `src/components/CounterNumber.tsx` 的 `color` |
| BGM 音量 | `src/audio.tsx` 的 `volume={() => 0.18}` |
| BGM 切换 | 替换 `public/music/output014.mp3` |
| 渲染并发 | `remotion.config.ts` 的 `Config.setConcurrency(2)` |

---

## 时间预算（参考）

| 阶段 | 耗时 |
|---|---|
| 写文案 + 拆 SceneDef | 30 分钟 |
| edge-tts 13 段 | 5 分钟 |
| 改 redraw.py 生成 8 张 PNG | 30 分钟（含 debug） |
| 改 data.ts + 5 类场景组件 | 60 分钟 |
| preview 渲染 | 2 分钟 |
| 抽帧验收 + 调动画 | 30 分钟 |
| h264 渲染 | 85 秒 |
| ffplay 验证 + contact sheet | 10 分钟 |
| **合计** | **约 3 小时** |

---

## 下一步建议

- 把本教程打印成 PDF 给团队成员
- 在新内容上跑通 2-3 次后，把常用 SceneDef 模板沉淀成 YAML / JSON
- 接入 TTS 自动化（一键生成 mp3）
- 接入 Pexels API 自动搜索下载
