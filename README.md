# Agent Video

> **从一段 80-160 字的中文文案，到 1080x1920 / 30fps / h264 crf 17 的抖音竖屏短视频，端到端自动化产出。**
> 已用「航模搭建」（13 场景 / 67s）+「水火箭」（13 场景 / 52s）实战验证，QA 9/9 全通过。
> 支持 Codex 调用：`.codex/skills/knowledge-short-video-pipeline/`

## 5 步出片

```powershell
# 1. 克隆 + 安装依赖（PowerShell）
git clone https://github.com/zhaosenlin12-creator/agent-video.git
cd agent-video
.\bootstrap.ps1

# 2. 立刻渲染航模样例
npm run build-h264

# 3. 看成片
ffplay out/water-rocket-h264.mp4

# 4. 一键验收
.\qa\qa_check.ps1

# 5. 换成你自己的内容
#    改 src/data.ts (SceneDef[])
#    替换 public/illustrations/*.png
#    重录 public/voice/*.mp3
#    重跑 npm run build-h264
```

## 出片质量（航模搭建样片 v2.0）\n\n`\n规格：1080x1920 / 30fps / h264 / yuv420p / crf 17\n体积：64.9MB（AI 生图版）/ 45.9MB（PIL 版）\n时长：67s\nQA：9/9 PASS（自动校验）\n插图：12 张 minimax image-01 pop-art 风格（备选 PIL）\n`\n\n## 这个仓库能做什么

把任意 80-160 字的科普 / 教程 / 实验 / 步骤说明类文案，**2-4 小时内**变成一条抖音算法友好的竖屏短视频：

- 1080x1920 竖屏（9:16），单条 40-70s（抖音完播率黄金区间）
- h264 / yuv420p / crf 17（视觉等同抖音超清）
- **Remotion 4 + React 19**（每场景独立动效，告别"静态画面"）
- 中文旁白 + 黄色关键词高亮（`#FFD400`）
- **AI 生成 pop-art 风格插图**（minimax image-01，可选 PIL 兜底）
- edge-tts 中文 TTS（XiaoxiaoNeural 女声）
- 真实视频片段（Ken Burns 平移放大，CC0 Pexels）
- BGM 压到 0.18 不抢 TTS

## 仓库结构

```
agent-video/
├── README.md                   本文件（顶层入口）
├── LICENSE                     MIT
├── bootstrap.ps1               一键环境准备 + 渲染样例
├── .gitignore                  排除 node_modules / out / 中间产物
├── docs/                       完整文档（先读 README.md）
│   ├── README.md               文档入口（指向 SOP / TUTORIAL / QA）
│   ├── SOP.md                  10 章制作规范（讲清"为什么要这样做"）
│   ├── TUTORIAL.md             13 步复用教程（上手用）
│   └── QA_CHECKLIST.md         9 项硬验收 + 11 项软验收 + 失败处理 SOP
├── .codex/
│   └── skills/
│       └── knowledge-short-video-pipeline/
│           └── SKILL.md        Codex Skill（其他 agent 可直接调用）
├── public/                     静态素材
│   ├── illustrations/          12 张干净 PNG（无水印）
│   ├── voice/                  13 段 TTS mp3
│   ├── pexels/                 8 段真实视频（CC0）
│   └── music/                  BGM
├── src/                        React 组件
│   ├── components/             5 个核心组件
│   ├── scenes/                 14 个场景组件（13 种类型）
│   ├── Composition.tsx         SceneRenderer 分发
│   ├── Root.tsx                Composition 注册
│   ├── audio.tsx               音频层
│   └── data.ts                 13 个 SceneDef（航模样例）
├── scripts/
│   ├── redraw.py               PIL 干净插画生成脚本
│   ├── redraw_more.py          备用插画脚本
│   └── download_pexels.ps1     Pexels 视频下载参考
├── qa/
│   ├── qa_check.ps1            一键验收脚本（9 项硬性自动检查）
│   ├── final_frames/           13 张参考抽帧
│   └── remotion_final_sheet.jpg 4x4 contact sheet
├── package.json                Remotion 4.0.290 + React 19
├── remotion.config.ts          h264 crf 17 / yuv420p
└── tsconfig.json
```

## 三层阅读路径

| 你想做什么 | 看哪份文档 |
|---|---|
| **5 分钟跑通示例** | `bootstrap.ps1` + 上面"5 步出片" |
| **理解整套思路** | `docs/README.md` → `docs/SOP.md` |
| **手把手复用做新内容** | `docs/TUTORIAL.md`（13 步实操） |
| **出片前必跑** | `docs/QA_CHECKLIST.md` + `qa/qa_check.ps1` |
| **作为 agent 自动调用** | `.codex/skills/knowledge-short-video-pipeline/SKILL.md` |

## 技术栈

- **Remotion** 4.0.290 — React 风格视频合成
- **React** 19.0.0
- **TypeScript** 5.4.5
- **Node** 20+
- **ffmpeg** 6.x（含 ffprobe / ffplay）
- **Pillow** 10+ — 干净 PNG 插画生成
- **edge-tts** 6.x — 中文旁白

## 验收标准

每次 `npm run build-h264` 后必须 9 项硬验收 ✅ 才能交付：

- A1-A6 规格（分辨率 / 帧率 / 编码 / 时长 / 大小 / 比特率）
- B1 13 帧抽帧
- C1-C2 音视频（TTS 数 / ffplay 完整播放）

一键脚本自动跑 9 项硬性检查；人工 + 文档对比 11 项软验收。

## License

MIT

