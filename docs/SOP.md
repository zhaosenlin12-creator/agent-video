# 知识类爆款竖屏短视频制作 SOP

> **目标**：从一段 80-160 字的中文文案，到 1080x1920 / 30fps / h264 / crf 17 高质量竖屏短视频，端到端自动化产出。
> **适用范围**：教程类、实验类、步骤说明类的科普/教学视频，单条 40-70 秒，13 段结构（1 Hook + 8 build steps + 1 countdown + 2 real flight + 1 End card）。
> **当前版本**：v2.0，已用航模搭建 + 水火箭（13 个场景）实战验证。

---

## 一、为什么这样做

抖音爆款竖屏短视频的算法偏好 + 用户体验要求：

1. **前 3 秒 Hook** — 决定用户是否停留，必须视觉冲击力强（速度线 + 大字号 + 强烈颜色对比）。
2. **每 5-6 秒一个动作/场景切换** — 防止用户划走。每个步骤都要有「动作 → 结果」的反馈动效。
3. **1080x1920 竖屏 9:16** — 抖音标准，所有素材按这个尺寸生成。
4. **h264 crf 17 / yuv420p / 5Mbps+ 码率** — 超清画质（抖音算法会推荐高质量视频）。
5. **BGM 压到 0.18** — 不抢人声；中文 TTS 用 XiaoxiaoNeural +5% 语速。
6. **真实视频片段 + 静态插画混编** — 真实镜头（CC0 Pexels）拉满代入感。

---

## 二、技术栈选型

| 工具 | 用途 | 为什么选它 |
|---|---|---|
| **Remotion 4 + React 19** | 视频合成 | 每场景独立 React 组件，1 个组件 = 1 个动态场景，避免「静态画面 + 静态画面」拼接 |
| **Pillow (PIL)** | 干净 PNG 插画 | 矢量化的扁平色块，抖音风格清晰可读；无水印 |
| **edge-tts** | 中文 TTS | 微软 XiaoxiaoNeural，免费、自然、+5% 语速适合短视频 |
| **Pexels CC0** | 真实视频 | 免费商用、无版权，飞机起飞/飞机舷窗/城市航拍 8 段 |
| **ffmpeg / ffprobe / ffplay** | 编码 + QA | h264 编码、规格校验、抽帧样张、播放验证 |

---

## 三、13 段结构标准模板

```
01_hook      → Hook 大字标题 + 速度辐射线 + 视觉冲击图（4s）
02_materials → 6 件材料 / 工具的弹簧入场动画（5-7s）
03_draw      → 铅笔 + 划线进度 + 粉尘粒子（5s）
04_cut       → 刻刀飞入 + 红虚线切割线 + 闪白 + 泡沫屑（5s）
05_glue      → 胶水瓶倾倒 + 胶液流 + 闪光（5s）
06_motor     → 电机从上方掉入 + 8 条辐射火花 + 螺丝刀旋转（5s）
07_prop      → 螺旋桨掉入 + 锁紧闪光 + 旋转（5s）
08_wire      → 4 条彩色电线 + 电流流光 + 火花（5s）
09_balance   → 飞机倾斜 + 配重滑动 + CG 红点 + 勾选（5s）
10_countdown → 3-2-1 大字 + 冲击波环 + 飞机尾焰（3s）
11_takeoff   → Pexels 真实视频（机场黄昏）+ Ken Burns（5-6s）
12_soaring   → Pexels 真实视频（城市俯视）+ Ken Burns（5-6s）
13_endcard   → 点赞收藏 + 引导关注卡片（5s）
```

每段 = 1 个 React 组件（`src/scenes/XxxScene.tsx`），通过 `data.ts` 的 `sceneType` 字段路由。

---

## 四、8 步端到端工作流

### Step 1：内容结构化（5 分钟）

把文案拆成 13 段，每段 ≤ 14 字 / ≤ 4.5s 语音时长。**编辑 `src/data.ts` 的 `SCENES` 数组**：

```typescript
{ key: "01_hook", text: "一节课搓架航模，全班直接炸了！", emphasis: ["一节课", "搓架航模"], voiceSec: 3.31, style: "Hook", sceneType: "Hook" }
```

### Step 2：插画生成（5-15 分钟）— 推荐使用 AI 生图

**首选方案：AI 图像 API（minimax image-01 / jojo-code-imagegen）**

每个场景 1 张 1080x1920 9:16 PNG，放到 `public/illustrations/01_hook.png` ~ `13_endcard.png`。

#### API 调用模板（minimax）
```powershell
$apiKey = "sk-cp-..."
$body = '{"model":"image-01","prompt":"a cool cartoon airplane soaring into night sky, pop art flat illustration, vibrant teal and orange, vertical 9:16 composition, no watermark, no text, no logos","aspect_ratio":"9:16","response_format":"url","n":1,"prompt_optimizer":true}'
$resp = Invoke-WebRequest -Uri "https://api.minimaxi.com/v1/image_generation" -Method POST -ContentType "application/json" -Headers @{"Authorization"="Bearer $apiKey"} -Body $body -TimeoutSec 180
$url = ($resp.Content | ConvertFrom-Json).data.image_urls[0]
Invoke-WebRequest -Uri $url -OutFile "public\illustrations\01_hook.png" -TimeoutSec 60
```

#### Prompt 设计原则
- **明确风格**：pop art flat illustration / cartoon / comic style
- **明确比例**：vertical 9:16 composition
- **明确禁用**：no watermark, no text, no logos
- **每个场景独立 prompt**：要描述具体内容（如 "foam board airplane soaring with speed lines" 而不是泛泛的 "airplane"）
- **风格统一**：所有 12 张都强调 pop art flat illustration 保持视觉一致

#### 缩放到 1080x1920
```python
from PIL import Image
img = Image.open("src.jpg").convert("RGB").resize((1080, 1920), Image.LANCZOS)
img.save("public/illustrations/01_hook.png", "PNG", optimize=True)
```

#### 备选方案：PIL 本地脚本（无 API 费用）
如果 AI API 不可用，使用 `python scripts/redraw.py` 生成简洁矢量风格插画。

⚠️ **坑**：
- minimax OSS 链接 30 分钟过期，必须生成后立刻下载
- 单图 30s 返回，避免并发限流
- 提示词必须包含 "no text" 否则 AI 会在画面上生成乱码文字

### Step 3：TTS 录制（2-5 分钟）

13 个 mp3 到 `public/voice/`：
```powershell
edge-tts --voice zh-CN-XiaoxiaoNeural --rate "+5%" --pitch "+0Hz" --text "..." --write-media "public\voice\01_hook.mp3"
```

⚠️ **坑**：`+5%` 必须带引号，否则被 shell 当正则截断。

### Step 4：视频素材（10-30 分钟，浏览器下载 Pexels）

8 段 CC0 真实 mp4 到 `public/pexels/`。优先选与你主题匹配的：
- 飞机起飞 / 机场黄昏
- 飞机舷窗外 / 高空俯瞰
- 居民区航拍 / 城市航拍
- 制作过程特写
- 奖杯 / 奖牌（成功反馈）

### Step 5：动效组件实现（30-90 分钟）

每个场景 1 个 React 组件：`src/scenes/XxxScene.tsx`。关键技巧：
- 用 `interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })` 做过渡
- 用 `spring()` 做弹性入场
- SVG 叠加层做动效（闪光、火花、切割线、旋转）
- 静态插画 + SVG 动效层 = 真实感

### Step 6：路由（5 分钟）

在 `src/Composition.tsx` 的 `SceneRenderer` 里加 case 分发：
```tsx
case "Draw": return <DrawScene {...stepProps} />;
```

### Step 7：渲染（30-60 秒）

```powershell
npx remotion render WaterRocketDouyin out\video-h264.mp4 --codec h264 --crf 17
```

⚠️ **坑**：crf 16 画质更高但文件 > 50MB，会被抖音限流；**crf 17 是画质和体积的甜点**。

### Step 8：QA 验收（30 秒）

```powershell
.\qa\qa_check.ps1
```

必须 9/9 PASS：A1-A6（规格）+ B1（13 帧）+ C1-C2（音频 + 播放）。

---

## 五、常见问题与修复

| 症状 | 根因 | 修复 |
|---|---|---|
| 画面出现 "？？？" | PIL 用 `en=True` 字体（consolab）渲染中文 | 改 `en=False`（msyhbd.ttc） |
| 多层 banner 重叠 | 插画自带 banner + StepLabel 组件重复 | 注释掉 StepLabel 调用 |
| Frame X 中 `interpolate` 长度不匹配 | Remotion 只支持 input.length === output.length | 拆成多个 interpolate 或用 Math.min 包两个 |
| 帧 1945 渲染失败（404） | 旧 webpack 缓存或 dead reference | 改 hardcoded illustration 路径或重启 |
| StepLabel 中文显示豆腐块 | en=True 字体 | 同上 |
| 文件 > 50MB | crf 16 太精细 | 改 crf 17（推荐）或更短视频 |

---

## 六、验收总则

每次产出视频必须达到：

| 项 | 标准 | 备注 |
|---|---|---|
| 1 | ✅ 1080x1920 / 30fps / h264 / yuv420p | 抖音标准规格 |
| 2 | ✅ crf 17，文件 40-80MB（AI 生图版 ≤ 80MB，PIL 版 ≤ 50MB），码率 ≥ 5Mbps | QA 自动校验 |
| 3 | ✅ 时长 40-70 秒，13 段结构 | Hook+10step+2real+Endcard |
| 4 | ✅ **0 个 "？" 乱码**（中文全用 msyhbd.ttc / AI prompt 加 no text） | QA 抽帧 + 视觉抽检 |
| 5 | ✅ **0 个静态画面**（每段都有动效：spring / interpolate / SVG overlay） | 视觉抽检 |
| 6 | ✅ **2-3 段真实视频片段**（Pexels CC0） | 拉代入感 |
| 7 | ✅ 中文 TTS XiaoxiaoNeural +5% | 自然 + 不抢节奏 |
| 8 | ✅ BGM 音量 0.18 | 不抢人声 |
| 9 | ✅ QA 9/9 PASS（自动） | `.\qa\qa_check.ps1` |
| 10 | ✅ 抽帧样张视觉清晰（4x4 contact sheet） | 视频片段预览 |
| 11 | ✅ 插图风格统一（推荐 AI 生图 pop-art / cartoon） | 单条视频视觉一致 |

任意一条不满足 → 修复 → 重渲染 → 重跑 QA。

---

## 七、两条插画路径对比

| 维度 | PIL 本地脚本（`redraw.py`） | AI 图像 API（minimax image-01） |
|---|---|---|
| **视觉风格** | 矢量扁平色块（简洁） | pop-art / 漫画风格（精致） |
| **耗时** | 1-3 分钟 | 5-15 分钟（含下载 + resize） |
| **成本** | 0 | 按 API 收费（约 0.1-0.3 元/张） |
| **风格一致性** | 100%（程序化） | 95%（需 prompt 统一） |
| **适合场景** | 快速原型、离线、无 API | 正式成片、视觉冲击 |
| **质量天花板** | 中等（线稿风） | 高（接近商业插画） |

**推荐组合**：AI 生图做 12 张主图，PIL 做兜底（API 故障时）。


