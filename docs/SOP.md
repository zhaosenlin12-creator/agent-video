# 知识类抖音竖屏短视频制作 SOP

> **目标**：从一段文案出发，用 Remotion + PIL + edge-tts + Pexels 素材，产出符合抖音算法的 1080x1920 / 30fps / h264 / crf 16 高质量竖屏短视频。
> **适用范围**：教程类、实验类、步骤说明类的科普/教学短视频，单条 40-70 秒，3-7 个步骤 + Hook + 真实素材 + EndCard。
> **当前版本**：v1.0，基于水火箭（13 个场景）实战验证。

---

## 目录

1. 流程总览
2. 输入：内容结构化
3. 准备素材（插画 / TTS / BGM / 真实视频）
4. 搭建 Remotion 工程
5. 设计与实现场景组件
6. 渲染与验证
7. 验收清单
8. 交付规范
9. 复用教程
10. 常见问题与回退方案

---

## 1. 流程总览

```
文案 → 结构化 → 插画PNG → TTS+BGM → Pexels视频 → 组件 → preview → 抽帧验收 → h264 → 交付
```

**关键技术栈**：

- **Remotion 4.0.290** — React 风格的视频合成（场景即组件，动画即 hooks）
- **PIL (Pillow)** — 离线生成干净 PNG 插画（1080x1920，无水印/标签）
- **edge-tts** — 中文旁白 TTS（zh-CN-YunxiNeural / YunxiNeural）
- **ffmpeg** — 抽帧、ffprobe 校验、ffplay 验证播放
- **Pexels** — 竖屏真实视频素材（CC0）

**渲染参数**（写死在 `remotion.config.ts`）：

- 分辨率 `1080x1920`（抖音 9:16）
- 帧率 `30 fps`
- 编码 `h264` / `crf 16` / `yuv420p`
- 并发 `2`

---

## 2. 输入：内容结构化

文案要先拆成场景数组（`SceneDef[]`）。每个场景最少包含：

```ts
interface SceneDef {
  key: string;          // 唯一标识，对应 voice/<key>.mp3 文件名
  text: string;         // 旁白文本
  emphasis: string[];   // 需要高亮（黄色）的关键词片段
  voiceSec: number;     // TTS 朗读秒数（ffprobe 实际测得）
  minDur: number;       // 场景最少停留秒数（通常 voiceSec + 0.4）
  style: "Hook" | "Step" | "Counter" | "Caption" | "End";
  stepLabel?: { en: string; cn: string };
  counterNumber?: string;
  illustration?: string; // public 下的插画路径
  videoSrc?: string;     // public 下的真实视频路径
}
```

**节奏公式**：

- `sceneFrames = max(minDur, voiceSec + 0.4) * FPS`
- `Hook` ~3s；`Step` 4-5s；`Counter` 1.4s；`Caption`（真实视频）4-5s；`End` 5-6s
- 单条总时长 **40-70s** 最适合抖音完播率

**文案要求**：

- 单条 80-160 字（讲清 3-7 个步骤）
- 关键词（数字/术语/动作）放进 `emphasis`
- 数字单独成场景（如"3、2、1"）做倒计时
- 至少 1 个场景用 `Caption` 嵌入真实视频

---

## 3. 准备素材

### 3.1 干净插画 PNG（`public/illustrations/*.png`）

**为什么必须干净**：原始素材里的中文水印（如"胶带"、"沿红线剪..."）会在最终成片里透出文字，看起来像产品 bug。

**生成方式**：用 `scripts/redraw.py`（可参考本仓库的 PIL 实现），关键点：

- 尺寸 `1080x1920`，RGB
- 调色板统一：`TABLE_BROWN=(140,95,60)` / `BOTTLE_BLUE=(167,214,255)` / `RED=(255,75,60)` / `YELLOW=(255,212,0)` / `WHITE=(255,255,255)` / `BLACK=(10,14,24)`
- **禁止** 在 PNG 里写任何中文字（caption 由 React 组件动态加）
- **禁止** 在 PNG 里画 fin/water 等会被动画叠加的元素（动画叠加是主角）
- 用 `d.rectangle/polygon/ellipse/line` 拼几何形状，外边黑线 `width=4-6`
- 保存 `PNG, optimize=True`

**输出文件清单**（按场景顺序）：

```
public/illustrations/
├── 01_hook.png         # 深色背景 + 大火箭 + 速度线（Hook 主角）
├── 02_materials.png    # 浅色背景 + 桌面 + 4 件材料（Step 1）
├── 03_cut.png          # 浅蓝背景 + 瓶子 + 水（Step 2）
├── 04_fins.png         # 浅蓝背景 + 瓶子（无 fin，让动画飞入）
├── 05_nozzle.png       # 浅蓝背景 + 瓶子+顶部喷嘴区（无 fin）
├── 06_water.png        # 浅蓝背景 + 瓶子（无水，让动画填充）
├── 07_pump.png         # 米黄背景 + 打气筒+瓶子（Step 6）
└── 08_countdown.png    # 深色背景 + 大火箭（倒计时背景）
```

### 3.2 旁白 TTS（`public/voice/<scene_key>.mp3`）

```bash
# 单句生成
edge-tts --voice zh-CN-YunxiNeural --rate "+10%" \
  --text "塑料瓶也能飞上天！" \
  --write-media public/voice/01_hook.mp3

# 批量（用 scripts/tts_batch.sh）
for kv in "01_hook:塑料瓶也能飞上天！" "02_materials:一个可乐瓶..."; do
  k="${kv%%:*}"; t="${kv#*:}"
  edge-tts --voice zh-CN-YunxiNeural --rate "+10%" --text "$t" \
    --write-media "public/voice/${k}.mp3"
done

# 测时长
ffprobe -v error -show_entries format=duration -of csv=p=0 \
  public/voice/01_hook.mp3
```

把测得的秒数填进 `data.ts` 的 `voiceSec` 字段。

### 3.3 背景音乐（`public/music/output014.mp3`）

- 时长 ≥ 60s（保证循环覆盖整片）
- 风格轻快 / 不抢戏
- 音量压到 `0.18`（`audio.tsx` 里），盖住 TTS 空白

### 3.4 真实视频（`public/pexels/*.mp4`）

- 时长 ≥ 5s（保证有 Ken Burns 平移空间）
- **必须竖屏**（1080×1920 或相近比例），横屏会被裁剪
- 在 Pexels 搜索关键词（如 "rocket launch"、"students running"），下载 CC0

---

## 4. 搭建 Remotion 工程

### 4.1 工程目录（已搭好，可直接复用）

```
video_build/remotion/
├── package.json              # remotion 4.0.290 + react 19
├── remotion.config.ts        # h264 crf 16 / jpeg / yuv420p
├── tsconfig.json
├── public/
│   ├── illustrations/        # 8 张干净 PNG
│   ├── voice/                # 13 段 TTS mp3
│   ├── music/output014.mp3   # BGM
│   └── pexels/               # 2 段真实视频
├── src/
│   ├── index.ts              # registerRoot
│   ├── Root.tsx              # Composition 注册
│   ├── Composition.tsx       # SceneRenderer 分发
│   ├── data.ts               # 13 个 SceneDef
│   ├── audio.tsx             # AudioLayer
│   ├── components/
│   │   ├── Stage.tsx         # 1080x1920 容器
│   │   ├── StepLabel.tsx     # STEP 标签
│   │   ├── Caption.tsx       # 底部字幕
│   │   ├── HookHeadline.tsx  # Hook 大标题
│   │   └── CounterNumber.tsx # 倒计时数字
│   └── scenes/               # 10 个场景组件
└── scripts/
    └── redraw.py             # 干净插画生成脚本
```

### 4.2 核心组件写法（可直接复用）

**Stage.tsx** — 固定背景：

```tsx
export const Stage: React.FC<React.PropsWithChildren<{ bg?: string }>> = (
  { children, bg = "#0f1018" }
) => (
  <div style={{
    position: "absolute", inset: 0, width: "100%", height: "100%",
    background: bg, overflow: "hidden",
    fontFamily: "Microsoft YaHei, PingFang SC, sans-serif"
  }}>
    {children}
  </div>
);
```

**Caption.tsx** — 底部字幕（按 emphasis 数组切词着色）：

```tsx
export const Caption: React.FC<{
  text: string; emphasis?: string[]; bottom?: number;
  fadeIn?: number; size?: number;
  color?: string; highlight?: string;
}> = ({ text, emphasis = [], bottom = 200, fadeIn = 18,
       size = 78, color = "#fff", highlight = "#FFD400" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fadeIn], [0, 1],
    { extrapolateRight: "clamp" });
  const tokens: React.ReactNode[] = [];
  let rest = text;
  emphasis.forEach((kw) => {
    const i = rest.indexOf(kw); if (i < 0) return;
    if (i > 0) tokens.push(rest.slice(0, i));
    tokens.push(<span key={kw} style={{
      color: highlight,
      textShadow: "0 0 12px rgba(255,212,0,0.5)"
    }}>{kw}</span>);
    rest = rest.slice(i + kw.length);
  });
  if (rest) tokens.push(rest);
  return (
    <div style={{
      position: "absolute", left: 60, right: 60, bottom,
      textAlign: "center", opacity, fontSize: size,
      fontWeight: 900, color, lineHeight: 1.25,
      textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.45)",
      whiteSpace: "pre-wrap"
    }}>
      {tokens}
    </div>
  );
};
```

**StepLabel.tsx** — 步骤标签从左滑入：

```tsx
export const StepLabel: React.FC<{ en: string; cn: string; delay?: number }> = (
  { en, cn, delay = 0 }
) => {
  const f = useCurrentFrame();
  const slide = interpolate(Math.max(0, f - delay), [0, 18], [60, 0],
    { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const op = interpolate(Math.max(0, f - delay), [0, 12], [0, 1],
    { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 100, left: 70 + slide, opacity: op,
      color: "#FFD400", fontWeight: 900,
      textShadow: "0 0 10px rgba(0,0,0,0.45), 0 3px 0 rgba(0,0,0,0.55)"
    }}>
      <div style={{ fontSize: 70, letterSpacing: 2 }}>{en}</div>
      <div style={{ fontSize: 84, color: "#fff", marginTop: 6 }}>{cn}</div>
    </div>
  );
};
```

**HookHeadline.tsx** — 大标题逐字弹跳：

```tsx
export const HookHeadline: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const chars = Array.from(text);
  return (
    <div style={{
      position: "absolute", top: 180, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      alignItems: "center", gap: 6, flexWrap: "wrap"
    }}>
      {chars.map((c, i) => {
        const s = spring({
          frame: f - i * 3, fps,
          config: { damping: 14, stiffness: 180, mass: 0.4 }
        });
        const y = interpolate(s, [0, 1], [120, 0]);
        const op = interpolate(s, [0, 1], [0, 1]);
        return (
          <span key={i} style={{
            fontSize: 120, fontWeight: 900, color: "#fff",
            WebkitTextStroke: "3px #B81F1F",
            textShadow: "0 8px 0 rgba(0,0,0,0.45)",
            transform: "translateY(" + y + "px)",
            opacity: op, display: "inline-block"
          }}>{c}</span>
        );
      })}
    </div>
  );
};
```

**CounterNumber.tsx** — 倒计时大数字：

```tsx
export const CounterNumber: React.FC<{ number: string }> = ({ number }) => (
  <div style={{
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#FF3030", fontWeight: 900, fontSize: 700,
    textShadow: "0 0 40px rgba(255,80,80,0.8), 0 12px 0 rgba(0,0,0,0.5)",
    WebkitTextStroke: "10px #fff"
  }}>{number}</div>
);
```

---

## 5. 设计与实现场景组件

### 5.1 SceneRenderer 分发

`Composition.tsx` 用 `switch` 把 5 种 `style` 路由到对应组件：

```tsx
const SceneRenderer: React.FC<{ idx: number }> = ({ idx }) => {
  const s = SCENES[idx];
  switch (s.style) {
    case "Hook":     return <HookScene text={s.text} emphasis={s.emphasis} />;
    case "Step":    // 03_cut/04_fins/05_nozzle/06_water/07_pump 走专用组件
    case "Counter": return <CountdownScene number={s.counterNumber!} />;
    case "Caption": return <RealVideoScene text={s.text} emphasis={s.emphasis} videoSrc={s.videoSrc!} />;
    case "End":     return <EndCardScene text={s.text} emphasis={s.emphasis} />;
  }
};
```

### 5.2 场景动画模式库

每个 Step 场景至少包含 **3 层动画**叠加，让画面"活"起来：

| 场景类型 | 静态层 | 动画层 1 | 动画层 2 | 动画层 3 |
|---|---|---|---|---|
| Hook | PNG 火箭 + 速度线 | 星点闪烁 | 标题字逐字弹跳 | 起始闪光 |
| 准备材料 | PNG 桌面 + 4 件材料 | 标题滑入 | 副标题淡入 | — |
| 切割 | PNG 瓶子 | 红虚线从左向右绘制 | 剪刀飞入 | 闪光 + "咔嚓!" 印章 + 上下分离 |
| 加装机翼 | PNG 瓶子（无 fin） | fin 飞入 | 胶带缠绕 | "OK!" 戳印 |
| 安装喷嘴 | PNG 瓶子+顶部 | 喷嘴下落 | 胶带缠绕 | "千万别漏气!" 脉冲警告 |
| 加入水 | PNG 瓶子（无水） | 水柱填充 0→1/3 | 气泡从底上升 | "1/3" 标记出现 |
| 充气 | PNG 打气筒+瓶子 | 压力表指针扫描 | 把手上下运动 | 数字滚动 "X.X 大气压" |
| 倒计时 3-2-1 | PNG 大火箭 | 数字弹跳（spring） | 屏幕微震 | 闪光 + "准备发射" |
| 真实发射 | Pexels 视频 | Ken Burns 放大 + 平移 | 顶/底渐变 | Caption 居中 |
| EndCard | PNG 火箭 + 星空 | 3 行大字逐行 spring 进入 | 背景条纹 | 副标题淡入 |

### 5.3 关键动画模式（可直接抄）

**spring 弹跳**（用于卡片/fin/数字）：

```tsx
const s = spring({
  frame: f - delay, fps,
  config: { damping: 12, stiffness: 120, mass: 0.5 }
});
const y = interpolate(s, [0, 1], [from, to]);
const op = interpolate(s, [0, 1], [0, 1]);
```

**Ken Burns**（真实视频背景）：

```tsx
const scale = interpolate(f, [0, 150], [1.0, 1.10]);
const tx = interpolate(f, [0, 150], [0, -40]);
<OffthreadVideo ... style={{ transform: "scale(" + scale + ") translateX(" + tx + "px)" }} muted />
```

**线段绘制**（红线/胶带）：

```tsx
const p = interpolate(f, [start, end], [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
<div style={{
  clipPath: "inset(0 " + ((1 - p) * 100) + "% 0 0)",
  background: "repeating-linear-gradient(...)"
}} />
```

**压力表指针**（扫描）：

```tsx
const atm = interpolate(f, [10, 110], [0, 6],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const angle = -120 + (atm / 6) * 240;
```

---

## 6. 渲染与验证

### 6.1 渲染脚本（`package.json`）

```json
"scripts": {
  "start": "remotion studio",
  "build-preview": "remotion render WaterRocketDouyin out/preview.mp4 --concurrency 1 --jpeg-quality 80",
  "build-h264": "remotion render WaterRocketDouyin out/water-rocket-h264.mp4 --codec h264 --crf 16",
  "build-still": "remotion still WaterRocketDouyin out/poster.png --frame=120"
}
```

### 6.2 三阶段渲染

| 阶段 | 命令 | 输出 | 用途 |
|---|---|---|---|
| Studio | `npm run start` | 浏览器 Dev | 实时调动画 |
| Preview | `npm run build-preview` | `out/preview.mp4` (~38MB, jpeg) | 快速验证（~2 分钟） |
| Final | `npm run build-h264` | `out/water-rocket-h264.mp4` (~38MB, h264 crf 16) | 抖音上传成片（~85 秒） |

### 6.3 必跑的质量验收

```bash
# 1. 规格校验
ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames,bit_rate \
  -show_entries format=duration,size -of default \
  out/water-rocket-h264.mp4

# 2. 真实播放（必须跑到末尾不报错）
ffplay -autoexit -nodisp -hide_banner -loglevel error out/water-rocket-h264.mp4

# 3. 13 个关键帧样张（时间点见 TUTORIAL.md § 步骤 6）
ffmpeg -y -ss 2  -i out/water-rocket-h264.mp4 -frames:v 1 qa/final_frames/01_hook.png
# ... 一共 13 个

# 4. Contact sheet 4x3（见 scripts/contact_sheet.sh）
```

---

## 7. 验收清单（每次必跑）

### 7.1 规格

- [ ] 分辨率 1080×1920（竖屏 9:16）
- [ ] 帧率 30 fps
- [ ] 编码 h264 / yuv420p
- [ ] 比特率 ≥ 5 Mbps（保证抖音超清）
- [ ] 时长 40-70s
- [ ] 文件大小 ≤ 50 MB（抖音单条上限）

### 7.2 视觉

- [ ] 13 张抽帧 PNG 全部干净（无中文水印/原素材标签）
- [ ] 每个 Step 场景至少 2 层动画叠加
- [ ] 数字/关键词用黄色 `#FFD400` 高亮
- [ ] 标题字号 ≥ 70，caption 字号 ≥ 64
- [ ] 文案 caption 完整可见（不被插画遮挡）

### 7.3 音视频

- [ ] 13 段 TTS 全部存在 `public/voice/<key>.mp3`
- [ ] ffplay 完整跑到末尾，`aq=` 衰减到 0KB 无错误
- [ ] BGM 音量压到 0.18，不抢 TTS
- [ ] 真实视频片段播放流畅（Ken Burns 平滑）

### 7.4 内容

- [ ] 文字与 TTS 完全一致
- [ ] 步骤顺序与真实操作流程一致
- [ ] 倒计时数字 3/2/1 顺序正确
- [ ] 真实视频段与对应旁白节奏匹配

---

## 8. 交付规范

每次交付目录结构：

```
deliver/
├── <主题>_remotion_抖音竖屏超清.mp4    # 最终成片（中文文件名）
└── <主题>_成片_抽帧样张.jpg           # 4x3 contact sheet
```

文件名示例：

- `水火箭_学生实拍_remotion_抖音竖屏超清.mp4`
- `水火箭_成片_抽帧样张.jpg`
- `小苏打火山_remotion_抖音竖屏超清.mp4`（新内容示例）

---

## 9. 复用教程

**从 0 复刻一条新视频**（详见 `TUTORIAL.md`）：

1. 写文案（80-160 字，3-7 步骤 + Hook + 1-2 真实视频）
2. 拆 `SceneDef[]`（按本 SOP §2）
3. edge-tts 批量生成 `public/voice/<key>.mp3`，ffprobe 测 `voiceSec`
4. 改 `scripts/redraw.py`，按 8 个 PNG 调色板生成干净插画
5. 下载 Pexels 竖屏视频到 `public/pexels/`
6. 改 `src/data.ts`：替换文案/emphasis/videoSrc
7. 改 `src/scenes/*.tsx`：按 §5.3 模式套动画
8. `npm run build-preview` 验证
9. 跑 §7 验收清单
10. `npm run build-h264` 出成片
11. 抽帧 + contact sheet，复制到 `deliver/`

**微调要点**（详见 `TUTORIAL.md`）：

- 改时长：动 `data.ts` 的 `voiceSec` 和 `minDur`
- 改文案：动 `data.ts` 的 `text` 和 `emphasis`，重生成对应 voice mp3
- 改插画：动 `scripts/redraw.py` 的颜色/形状，重跑 `python scripts/redraw.py`
- 改真实视频：替换 `public/pexels/*.mp4`，保持文件名不变
- 改动画：动 `src/scenes/<key>.tsx` 的 `interpolate`/`spring` 帧范围

---

## 10. 常见问题与回退方案

| 现象 | 原因 | 修复 |
|---|---|---|
| 帧里有浅色中文水印 | PNG 内部残留素材标签 | 重跑 `python scripts/redraw.py` |
| Caption 文字被插画挡住 | caption `bottom` 太靠下或插画太满 | 改 `bottom` 到 100-210 区间；插画主体留在 y=300-1700 |
| 真实视频卡顿/卡帧 | 视频比例不对（非竖屏） | 重下载 1080×1920 竖屏源；或改 `objectFit: "cover"` |
| TTS 比画面短/长 | `voiceSec` 没更新 | 重测 `ffprobe ... format=duration` 写入 `data.ts` |
| 渲染报 chrome cache | Remotion 内部 PNG 缓存 | 杀 chrome + 清 `D:\\cache\\tmp\\*` |
| 字幕字体糊 | 系统缺中文字体 | 安装 `msyh.ttc` 或 `simhei.ttf`（Win 自带） |

---

## 附录 A：本仓库产出物清单（v1.0 验证）

```
D:\\kaifa-teacher\\moneyprinter\\
├── deliver/
│   ├── 水火箭_学生实拍_remotion_抖音竖屏超清.mp4   # 38 MB / 1080x1920 / 52s / h264 crf 16
│   └── 水火箭_成片_抽帧样张.jpg                    # 4x3 contact sheet
├── video_build/remotion/
│   ├── out/water-rocket-h264.mp4
│   ├── qa/final_frames/*.png                       # 13 帧样张
│   ├── qa/remotion_final_sheet.jpg
│   ├── scripts/redraw.py
│   ├── public/illustrations/*.png                  # 8 张干净 PNG
│   ├── public/voice/*.mp3                          # 13 段 TTS
│   ├── public/pexels/*.mp4                         # 2 段真实视频
│   ├── public/music/output014.mp3
│   └── src/                                        # 完整组件代码
└── MoneyPrinterTurbo/                              # 原始 clone（参考用）
```

## 附录 B：版本

- **Remotion** 4.0.290
- **React** 19.0.0
- **TypeScript** 5.4.5
- **Node** 20+
- **ffmpeg** 6.x（含 ffprobe / ffplay）
- **Pillow** 10+
- **edge-tts** 6.x
