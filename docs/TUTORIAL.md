# 复用教程：从一段新文案到爆款竖屏成片

> 本教程基于 `SOP.md`，目标是让你（或团队其他人）拿到新文案后，**2-4 小时内**产出同质量竖屏视频。
> 已验证：水火箭文案 → 成片（52s），航模搭建文案 → 成片（67s），按本教程操作能完整复用。

---

## Step 0：准备工作（10 分钟）

### 0.1 克隆仓库

```powershell
git clone https://github.com/zhaosenlin12-creator/agent-video.git
cd agent-video
```

### 0.2 一键安装

```powershell
.\bootstrap.ps1
```

这个脚本会：
- 检查 Node 20+ / ffmpeg / Python 3.10+ / Pillow / edge-tts 是否齐全
- `npm install` 安装 Remotion 4 + React 19
- 测试 `npx remotion --version` 是否可用

### 0.3 立刻试跑一遍

```powershell
npm run build-h264
.\qa\qa_check.ps1
```

如果 9/9 PASS → 进入 Step 1。
如果有 FAIL → 看 `docs\QA_CHECKLIST.md` 对应章节排查。

---

## Step 1：编写文案（30-60 分钟）

文案模板（13 段，**80-160 字**总长度）：

```
[01_hook] 一句话爆点（<12 字），节奏感强
[02_materials] N 件材料 / 工具清单
[03_draw] 第二步，...
[04_cut] 第三步，...
[05_glue] 第四步，...
[06_install_A] 第五步，...
[07_install_B] 第六步，...
[08_connect] 第七步，...
[09_balance] 第八步，...
[10_countdown] 三、二、一，发射！（或行动号令）
[11_takeoff] 第一段真实反馈（爆点）
[12_soaring] 第二段真实反馈（升华）
[13_endcard] 点赞收藏 + 下一期预告
```

**要点**：
- 每段 ≤ 14 字，否则 TTS > 4.5s 会让观众不耐烦
- 关键动词用"亮黄高亮"（emphasis 字段），比如 `emphasis: ["搓架", "全班"]`
- 真实视频段（第 11、12 段）的旁白用"事实+情绪"双层

---

## Step 2：修改 data.ts（10 分钟）

打开 `src/data.ts`，把 `SCENES` 数组替换为你的 13 段。

每个 SceneDef 字段：

```typescript
{
  key: "01_hook",                          // 文件名 key
  text: "一节课搓架航模，全班直接炸了！",  // TTS 文本
  emphasis: ["一节课", "搓架航模"],        // 黄字高亮
  voiceSec: 3.31,                          // edge-tts 实际时长
  minDur: 4.0,                             // 最小场景时长
  style: "Hook",                           // Hook | Step | Counter | Caption | End
  illustration: "illustrations/01_hook.png", // 对应插画
  sceneType: "Hook"                        // 路由到哪个场景组件
}
```

13 段场景对应 sceneType：
```
Hook / Materials / Draw / Cut / Glue / Motor / Prop / Wire / Balance / Launch / RealVideo / End
```

---

## Step 3：录制 TTS（5 分钟）

批量生成 13 个 mp3 到 `public\voice\`：

```powershell
$voice = "zh-CN-XiaoxiaoNeural"
$rate = "+5%"
$pitch = "+0Hz"

$lines = @{
  "01_hook" = "一节课搓架航模，全班直接炸了！"
  "02_materials" = "一张泡沫板、一个电机、一片螺旋桨、一块电池、一瓶胶水、一把刻刀。"
  # ... 11 more
}

foreach ($k in $lines.Keys) {
  edge-tts --voice $voice --rate $rate --pitch $pitch --text $lines[$k] --write-media "public\voice\$k.mp3"
}
```

⚠️ **坑**：`--rate "+5%"` 必须带引号。

---

## Step 4：生成插画（5-10 分钟）

修改 `scripts\redraw.py`：

1. `draw_step(num, cn_title, en_subtitle, drawer)` 调用列表更新为你的 13 段
2. 如果有新场景类型，加 `draw_XX_xxx(d, sx, sy, sw)` 函数
3. 运行：

```powershell
python scripts\redraw.py
```

⚠️ **坑**：中文文字必须 `font=font(N, bold=True, en=False)`，否则变成豆腐块。

---

## Step 5：下载 Pexels 视频（10-30 分钟）

去 https://www.pexels.com/search/videos/<关键词> 找 8 段 CC0 视频，存到 `public\pexels\`：

- `airport_takeoff.mp4` — 飞机起飞 / 机场
- `drone_view1.mp4` — 居民区俯视
- `drone_view2.mp4` — 城市航拍
- `hands_craft.mp4` — 手工作业
- `paper_foam.mp4` — 纸张/泡沫板特写
- `wing_view.mp4` — 舷窗外
- `medal_success.mp4` — 奖牌
- `trophy_winner.mp4` — 举奖杯

---

## Step 6：编写 / 调整场景组件（30-90 分钟）

如果你的 13 段结构和模板一致，复用现有 13 个组件即可。

如果新增场景类型：
1. 创建 `src\scenes\YourScene.tsx`
2. 在 `src\Composition.tsx` 的 switch 加 case
3. 在 `src\data.ts` 给对应 SCENE 设 `sceneType: "Your"`

每个场景组件核心结构：

```tsx
export const YourScene: React.FC<{text, emphasis, illustration, ...}> = (props) => {
  const f = useCurrentFrame();
  const drop = interpolate(f, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage bg="#dee9f3">
      <Img src={staticFile(illustration)} style={{...}} />
      {/* SVG overlay 动效 */}
      <svg>...</svg>
      <Caption text={text} emphasis={emphasis} bottom={210} />
    </Stage>
  );
};
```

---

## Step 7：渲染（30-60 秒）

```powershell
npx remotion render WaterRocketDouyin out\video-h264.mp4 --codec h264 --crf 17
```

⚠️ 如果 size > 50MB，先试 `--crf 17`（推荐），还不行改 `--crf 18`。

---

## Step 8：QA 验收（30 秒）

```powershell
.\qa\qa_check.ps1
```

必须 9/9 PASS：
- A1-A6 规格（分辨率/帧率/编码/时长/大小/码率）
- B1 13 帧抽帧
- C1 13 个 voice mp3
- C2 ffplay 完整播放无错

任意 FAIL → 按 `docs\QA_CHECKLIST.md` 排查 → 修复 → 重跑。

---

## Step 9：抽帧样张 + 交付

```powershell
ffmpeg -y -i out\video-h264.mp4 -vf "fps=1/5,scale=270:480,tile=4x4" -frames:v 1 -update 1 qa\remotion_final_sheet.jpg
```

样张 4×4 网格，13 段全覆盖。如果任意帧有"？"或布局混乱，回到 Step 6 修复对应组件。

---

## 微调（按需）

### 改 BGM 音量

`src\audio.tsx`：`volume={() => 0.18}` — 0.18 是默认值。如果旁白更响就降到 0.12。

### 改 TTS 语速

`edge-tts --rate "+8%"` — 比默认 +5% 更快，适合节奏紧凑的剪辑。

### 加字幕动画

每个 Caption 已经自动 fade-in / highlight（黄字）。如果想加 stroke 描边，编辑 `src\components\Caption.tsx` 的 `textShadow` 改成 `textShadow: "0 0 8px #000, 0 0 18px #000"`。

### 加更多真实视频

直接修改 `data.ts` 里 11_takeoff / 12_soaring 的 `videoSrc`，指向新下载的 Pexels 文件。

---

## 验收 Checklist（自查）

产出前对照检查：

- [ ] 13 段结构完整（Hook + 8 steps + countdown + 2 real + end）
- [ ] data.ts 每段都有 sceneType
- [ ] voice mp3 13 个，命名匹配 SCENE.key
- [ ] illustrations 12 张（10_launch / 11_soaring / 13_endcard 是单独函数画）
- [ ] pexels 至少 2 段（11 + 12 用）
- [ ] 没有任何"？"乱码
- [ ] QA 9/9 PASS
- [ ] 抽帧样张视觉清晰，无明显缺陷
- [ ] 文件名用 `_remotion_抖音竖屏超清` 后缀
