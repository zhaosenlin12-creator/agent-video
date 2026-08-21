# 文档入口

按你的角色选读：

| 你是什么角色 | 先看哪份 |
|---|---|
| **第一次接触这个项目** | [`../README.md`](../README.md) — 顶层入口（5 步出片） |
| **理解整套制作思路** | [`SOP.md`](./SOP.md) — 工作流总结，10 章 |
| **要做一个新主题的视频** | [`TUTORIAL.md`](./TUTORIAL.md) — 13 步复用教程 |
| **出片前怕踩坑** | [`QA_CHECKLIST.md`](./QA_CHECKLIST.md) — 9+11 项验收 |

## 文档之间的关系

```
README.md                    ← 顶层 5 步示例（最快上手）
  └── docs/README.md         ← 本文件（文档地图）
        ├── SOP.md           ← "为什么这样做"（设计原则 + 技术选型）
        ├── TUTORIAL.md      ← "怎么做新内容"（13 步实战）
        └── QA_CHECKLIST.md  ← "怎么保证质量"（验收清单）
```

## 推荐阅读顺序

1. **跑通示例**（5 分钟）：跟着顶层 README 走 `bootstrap.ps1` + `npm run build-h264` + `qa_check.ps1`，看到 9/9 PASS + 一个 67s 的航模视频输出
2. **理解设计**（30 分钟）：读 SOP.md，知道每一步为什么这样做
3. **复用做新内容**（2-4 小时）：跟着 TUTORIAL.md 的 13 步
4. **保质保量交付**：每次出片前跑 QA_CHECKLIST.md 的 9 项硬验收 + 11 项软验收
