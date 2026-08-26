﻿﻿﻿// All scene data for the "一节课打印只活恐龙" 3D printing dinosaur video.
// 13 scenes, viral formula: 数字 + 颠覆 + 情绪词 + 节奏短句
// 每段多元素逐个入场（product-card-progressive-assemble）

export type SceneKey =
  | "01_hook"
  | "02_materials"
  | "03_model"
  | "04_slice"
  | "05_print"
  | "06_layer"
  | "07_remove"
  | "08_servo"
  | "09_code"
  | "10_power"
  | "11_demo"
  | "12_roar"
  | "13_endcard";

export type StepStyle = "Hook" | "Step" | "Counter" | "Caption" | "End";

export interface SceneElement {
  id: string;
  kind: "title" | "subtitle" | "image" | "icon" | "label" | "step" | "line" | "tag" | "cta";
  // For image elements
  src?: string;
  scale?: number;
  // Layout
  x?: number | string;
  y?: number | string;
  w?: number | string;
  h?: number | string;
  // Animation
  entrance?: "spring-rise" | "spring-pop" | "axial-flyin" | "fade" | "shutter" | "sweep";
  delay: number; // frames
  text?: string;
  textColor?: string;
  textSize?: number;
  highlight?: boolean;
  // For icons (SVG inline path data)
  iconShape?: "printer" | "filament" | "arduino" | "servo" | "usb" | "tool" | "rocket" | "bolt";
}

export interface SceneDef {
  key: SceneKey;
  text: string;
  emphasis: string[];
  voiceSec: number;
  minDur: number;
  style: StepStyle;
  stepLabel?: { en: string; cn: string };
  counterNumber?: string;
  illustration?: string;
  sceneType?: string;
  // New: elements array
  elements: SceneElement[];
  // Audio cue for BGM sync
  bgmBeatAt?: number; // frame index where key beat lands
  sfxCues?: { frame: number; sound: "pop" | "whoosh" | "click" | "snap" | "riser" | "count" | "power" }[];
}

export const SCENES: SceneDef[] = [
  // ====== HOOK ====== 5s =====
  // 前 3 秒决胜负：大字弹入 + 主体恐龙飞入 + 桌面其他道具升起
  { key: "01_hook", text: "一节课打印只活恐龙，课间直接炸了。", emphasis: ["活恐龙", "课间炸了"], voiceSec: 3.89, minDur: 5.0, style: "Hook",
    sceneType: "Hook",
    elements: [
      { id: "bg-glow", kind: "title", entrance: "fade", delay: 0, text: "" },
      { id: "headline", kind: "title", entrance: "spring-rise", delay: 0, text: "一节课打印", textColor: "#FFD400", textSize: 140, highlight: true, x: "50%", y: 320 },
      { id: "headline-2", kind: "title", entrance: "spring-rise", delay: 4, text: "只活恐龙", textColor: "#FFD400", textSize: 140, highlight: true, x: "50%", y: 480 },
      { id: "dino", kind: "image", src: "illustrations/01_hook.png", entrance: "axial-flyin", delay: 14, scale: 1.0, x: "50%", y: 1200 },
      { id: "subtitle", kind: "subtitle", entrance: "spring-rise", delay: 24, text: "课间直接炸了！", textColor: "#FFFFFF", textSize: 80, x: "50%", y: 1700 },
      { id: "cap", kind: "label", entrance: "fade", delay: 30, text: "全班同学都看呆了，点击看完整实验", textColor: "#FFD400", textSize: 50, x: "50%", y: 1830 },
    ],
    bgmBeatAt: 30,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 4, sound: "snap" },
      { frame: 14, sound: "snap" },
      { frame: 24, sound: "snap" },
    ]
  },

  // ====== MATERIALS ====== 5.8s =====
  // 4件东西依次弹出，每件间隔 8f
  { key: "02_materials", text: "4件东西，30块搞定，学生党都能玩。", emphasis: ["4件", "30块", "学生党"], voiceSec: 4.50, minDur: 5.8, style: "Step",
    sceneType: "Materials",
    stepLabel: { en: "STEP 1", cn: "材料清单" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 1 · 材料清单", textColor: "#FFD400", textSize: 56 },
      { id: "tile-1", kind: "icon", entrance: "spring-pop", delay: 8, iconShape: "printer", text: "3D打印机", textColor: "#FFFFFF", textSize: 50, x: 270, y: 600 },
      { id: "tile-2", kind: "icon", entrance: "spring-pop", delay: 16, iconShape: "filament", text: "PLA耗材", textColor: "#FFFFFF", textSize: 50, x: 810, y: 600 },
      { id: "tile-3", kind: "icon", entrance: "spring-pop", delay: 24, iconShape: "arduino", text: "Arduino", textColor: "#FFFFFF", textSize: 50, x: 270, y: 980 },
      { id: "tile-4", kind: "icon", entrance: "spring-pop", delay: 32, iconShape: "servo", text: "舵机", textColor: "#FFFFFF", textSize: 50, x: 810, y: 980 },
      { id: "price", kind: "label", entrance: "spring-rise", delay: 44, text: "全套 30 元搞定", textColor: "#FFD400", textSize: 80, highlight: true, x: 540, y: 1380 },
      { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "学生党都能玩", textColor: "#FFFFFF", textSize: 56, x: 540, y: 1700 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "pop" },
      { frame: 16, sound: "pop" },
      { frame: 24, sound: "pop" },
      { frame: 32, sound: "pop" },
      { frame: 44, sound: "snap" },
    ]
  },

  // ====== MODEL ====== 5.0s =====
  // 3D模型从中心放大，分块显示（头/身/尾）
  { key: "03_model", text: "电脑里建出小恐龙，耳朵眼睛一条尾巴。", emphasis: ["建模", "三维结构"], voiceSec: 4.30, minDur: 5.0, style: "Step",
    sceneType: "Model",
    stepLabel: { en: "STEP 2", cn: "三维建模" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 2 · 三维建模", textColor: "#FFD400", textSize: 56 },
      { id: "head", kind: "image", src: "illustrations/03_model.png", entrance: "axial-flyin", delay: 4, scale: 0.7, x: 540, y: 700 },
      { id: "lbl-head", kind: "label", entrance: "spring-rise", delay: 18, text: "头部", textColor: "#FFD400", textSize: 60, x: 540, y: 280 },
      { id: "lbl-body", kind: "label", entrance: "spring-rise", delay: 26, text: "躯干", textColor: "#FFD400", textSize: 60, x: 540, y: 1000 },
      { id: "lbl-tail", kind: "label", entrance: "spring-rise", delay: 34, text: "尾巴", textColor: "#FFD400", textSize: 60, x: 540, y: 1280 },
      { id: "timer", kind: "label", entrance: "spring-pop", delay: 50, text: "10 分钟", textColor: "#FFD400", textSize: 100, highlight: true, x: 540, y: 1620 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 4, sound: "snap" },
      { frame: 18, sound: "pop" },
      { frame: 26, sound: "pop" },
      { frame: 34, sound: "pop" },
      { frame: 50, sound: "snap" },
    ]
  },

  // ====== SLICE ====== 5.0s =====
  // 切片软件界面，层从下往上扫
  { key: "04_slice", text: "犀牛切片，告诉机器每层怎么吐丝。", emphasis: ["切片", "每层怎么走"], voiceSec: 4.20, minDur: 5.0, style: "Step",
    sceneType: "Slice",
    stepLabel: { en: "STEP 3", cn: "切片路径" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 3 · 切片路径", textColor: "#FFD400", textSize: 56 },
      { id: "screen", kind: "image", src: "illustrations/04_slice.png", entrance: "axial-flyin", delay: 6, scale: 0.7, x: 540, y: 700 },
      // 切片层 SVG (动态)
      { id: "layers", kind: "line", entrance: "sweep", delay: 18 },
      { id: "info", kind: "label", entrance: "spring-rise", delay: 40, text: "200 层路径", textColor: "#FFD400", textSize: 80, highlight: true, x: 540, y: 1500 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "snap" },
      { frame: 18, sound: "click" },
      { frame: 40, sound: "snap" },
    ]
  },

  // ====== PRINT ====== 5.5s =====
  // 打印机扫动 + 喷头吐丝（动画）+ 半透明层堆叠
  { key: "05_print", text: "按下打印。喷头来回扫，塑料一秒秒堆出来。", emphasis: ["按下打印", "塑料堆出来"], voiceSec: 5.20, minDur: 5.5, style: "Step",
    sceneType: "Print",
    stepLabel: { en: "STEP 4", cn: "开始打印" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 4 · 开始打印", textColor: "#FFD400", textSize: 56 },
      { id: "printer", kind: "image", src: "illustrations/05_print.png", entrance: "axial-flyin", delay: 6, scale: 0.6, x: 540, y: 750 },
      { id: "nozzle-scan", kind: "line", entrance: "sweep", delay: 18 }, // SVG喷头扫描线
      { id: "filament", kind: "line", entrance: "sweep", delay: 28 }, // 塑料流体
      { id: "stats", kind: "label", entrance: "spring-rise", delay: 50, text: "0.2mm / 层", textColor: "#FFD400", textSize: 70, highlight: true, x: 540, y: 1500 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "snap" },
      { frame: 18, sound: "click" },
      { frame: 28, sound: "click" },
      { frame: 50, sound: "snap" },
    ]
  },

  // ====== LAYER ====== 5.5s =====
  // 恐龙轮廓扫描填充
  { key: "06_layer", text: "层层堆叠，半小时恐龙就长出来了。", emphasis: ["半小时", "一点一点长出来"], voiceSec: 4.80, minDur: 5.5, style: "Step",
    sceneType: "Layer",
    stepLabel: { en: "STEP 5", cn: "层层堆叠" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 5 · 层层堆叠", textColor: "#FFD400", textSize: 56 },
      { id: "dino-part", kind: "image", src: "illustrations/06_layer.png", entrance: "fade", delay: 6, scale: 0.65, x: 540, y: 700 },
      { id: "scan-fill", kind: "line", entrance: "sweep", delay: 16 }, // 扫描填充
      { id: "progress", kind: "label", entrance: "spring-pop", delay: 30, text: "30 min", textColor: "#FFD400", textSize: 100, highlight: true, x: 540, y: 1500 },
      { id: "progress-bar", kind: "line", entrance: "sweep", delay: 38 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "snap" },
      { frame: 16, sound: "click" },
      { frame: 30, sound: "snap" },
    ]
  },

  // ====== REMOVE ====== 5.0s =====
  // 抓手拿起，掰支撑
  { key: "07_remove", text: "抠下成品，掰掉支撑，打磨边角。", emphasis: ["取下", "一气呵成"], voiceSec: 4.00, minDur: 5.0, style: "Step",
    sceneType: "Remove",
    stepLabel: { en: "STEP 6", cn: "取下成品" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 6 · 取下成品", textColor: "#FFD400", textSize: 56 },
      { id: "part", kind: "image", src: "illustrations/07_remove.png", entrance: "axial-flyin", delay: 6, scale: 0.65, x: 540, y: 750 },
      { id: "grip", kind: "line", entrance: "sweep", delay: 18 }, // 抓手SVG
      { id: "twist", kind: "line", entrance: "sweep", delay: 30 }, // 掰支撑动画
      { id: "check", kind: "label", entrance: "spring-pop", delay: 50, text: "✓ 完成", textColor: "#FFD400", textSize: 90, highlight: true, x: 540, y: 1500 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "snap" },
      { frame: 18, sound: "click" },
      { frame: 30, sound: "snap" },
      { frame: 50, sound: "snap" },
    ]
  },

  // ====== SERVO ====== 5.0s =====
  // 舵机飞入 + 插入身体
  { key: "08_servo", text: "舵机塞进身体，接三根控制线。", emphasis: ["装舵机", "接三根线"], voiceSec: 4.20, minDur: 5.0, style: "Step",
    sceneType: "Servo",
    stepLabel: { en: "STEP 7", cn: "安装舵机" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 7 · 安装舵机", textColor: "#FFD400", textSize: 56 },
      { id: "dino-body", kind: "image", src: "illustrations/08_servo.png", entrance: "fade", delay: 6, scale: 0.65, x: 540, y: 750 },
      { id: "servo", kind: "image", src: "illustrations/_aux_servo.png", entrance: "axial-flyin", delay: 18, scale: 0.4, x: 200, y: 400 },
      { id: "wire-1", kind: "line", entrance: "sweep", delay: 32 },
      { id: "wire-2", kind: "line", entrance: "sweep", delay: 38 },
      { id: "wire-3", kind: "line", entrance: "sweep", delay: 44 },
      { id: "count", kind: "label", entrance: "spring-pop", delay: 56, text: "3 根线", textColor: "#FFD400", textSize: 100, highlight: true, x: 540, y: 1620 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "snap" },
      { frame: 18, sound: "snap" },
      { frame: 32, sound: "click" },
      { frame: 38, sound: "click" },
      { frame: 44, sound: "click" },
      { frame: 56, sound: "snap" },
    ]
  },

  // ====== CODE ====== 5.3s =====
  // 代码逐行打出
  { key: "09_code", text: "三行代码，让尾巴按节奏摇摆。", emphasis: ["三行", "按节奏摇"], voiceSec: 4.50, minDur: 5.3, style: "Step",
    sceneType: "Code",
    stepLabel: { en: "STEP 8", cn: "写控制代码" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 8 · 写控制代码", textColor: "#FFD400", textSize: 56 },
      { id: "screen", kind: "image", src: "illustrations/09_code.png", entrance: "fade", delay: 4, scale: 0.6, x: 540, y: 650 },
      { id: "line-1", kind: "line", entrance: "sweep", delay: 16 },
      { id: "line-2", kind: "line", entrance: "sweep", delay: 24 },
      { id: "line-3", kind: "line", entrance: "sweep", delay: 32 },
      { id: "highlight", kind: "line", entrance: "sweep", delay: 42 },
      { id: "ready", kind: "label", entrance: "spring-pop", delay: 56, text: "✓ 三行搞定", textColor: "#FFD400", textSize: 80, highlight: true, x: 540, y: 1620 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 4, sound: "snap" },
      { frame: 16, sound: "click" },
      { frame: 24, sound: "click" },
      { frame: 32, sound: "click" },
      { frame: 56, sound: "snap" },
    ]
  },

  // ====== POWER ====== 4.2s =====
  // 3-2-1 倒数 + 通电闪光
  { key: "10_power", text: "插上电，三二一，尾巴立刻晃。", emphasis: ["通电", "三二一", "尾巴晃"], voiceSec: 3.30, minDur: 4.2, style: "Counter",
    sceneType: "Power",
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 9 · 通电测试", textColor: "#FFD400", textSize: 56 },
      { id: "dino-off", kind: "image", src: "illustrations/10_power.png", entrance: "fade", delay: 4, scale: 0.65, x: 540, y: 800 },
      { id: "counter", kind: "line", entrance: "sweep", delay: 12 }, // SVG 倒数数字
      { id: "zap", kind: "line", entrance: "shutter", delay: 76 }, // 通电闪光
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 12, sound: "count" },
      { frame: 22, sound: "count" },
      { frame: 32, sound: "count" },
      { frame: 76, sound: "power" },
    ]
  },

  // ====== DEMO ====== 3.5s =====
  // 摇头摆尾动画
  { key: "11_demo", text: "摆在桌上，冲你摇头摆尾。", emphasis: ["摇头摆尾"], voiceSec: 2.80, minDur: 3.5, style: "Caption",
    sceneType: "Demo",
    elements: [
      { id: "dino", kind: "image", src: "illustrations/11_demo.png", entrance: "spring-rise", delay: 0, scale: 0.65, x: 540, y: 750 },
      { id: "tail", kind: "line", entrance: "sweep", delay: 8 },
      { id: "head", kind: "line", entrance: "sweep", delay: 16 },
      { id: "tag", kind: "label", entrance: "spring-pop", delay: 24, text: "好可爱！", textColor: "#FFD400", textSize: 100, highlight: true, x: 540, y: 1620 },
    ],
    bgmBeatAt: 50,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "pop" },
      { frame: 16, sound: "pop" },
      { frame: 24, sound: "snap" },
    ]
  },

  // ====== ROAR ====== 5.5s =====
  // 张嘴 + 声波 + 围过来
  { key: "12_roar", text: "按下遥控，一声吼叫，全班都围过来。", emphasis: ["吼叫", "全班围过来"], voiceSec: 3.50, minDur: 5.5, style: "Caption",
    sceneType: "Roar",
    elements: [
      { id: "dino", kind: "image", src: "illustrations/12_roar.png", entrance: "spring-rise", delay: 0, scale: 0.7, x: 540, y: 800 },
      { id: "roar", kind: "line", entrance: "sweep", delay: 8 }, // 张嘴动画
      { id: "wave", kind: "line", entrance: "sweep", delay: 16 }, // 声波
      { id: "people", kind: "line", entrance: "sweep", delay: 28 }, // 人影
      { id: "burst", kind: "label", entrance: "spring-pop", delay: 60, text: "全班围过来！", textColor: "#FFD400", textSize: 90, highlight: true, x: 540, y: 1620 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "snap" },
      { frame: 16, sound: "riser" },
      { frame: 60, sound: "snap" },
    ]
  },

  // ====== ENDCARD ====== 5.5s =====
  // 飞入点赞 + 关注 + 下期预告
  { key: "13_endcard", text: "点赞收藏，下期教你做四足机甲。", emphasis: ["点赞收藏", "四足机甲"], voiceSec: 4.00, minDur: 5.5, style: "End",
    sceneType: "End",
    elements: [
      { id: "heart", kind: "icon", entrance: "spring-pop", delay: 0, iconShape: "rocket", text: "点赞", textColor: "#FFFFFF", textSize: 70, x: 320, y: 800 },
      { id: "star", kind: "icon", entrance: "spring-pop", delay: 6, iconShape: "rocket", text: "收藏", textColor: "#FFFFFF", textSize: 70, x: 760, y: 800 },
      { id: "title", kind: "title", entrance: "spring-rise", delay: 18, text: "下期更精彩", textColor: "#FFD400", textSize: 130, highlight: true, x: 540, y: 1100 },
      { id: "preview", kind: "image", src: "illustrations/13_flash3.png", entrance: "axial-flyin", delay: 28, scale: 0.5, x: 540, y: 1500 },
      { id: "follow", kind: "label", entrance: "spring-pop", delay: 50, text: "关注我不错过", textColor: "#FFD400", textSize: 80, highlight: true, x: 540, y: 1700 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "pop" },
      { frame: 6, sound: "pop" },
      { frame: 18, sound: "snap" },
      { frame: 28, sound: "snap" },
      { frame: 50, sound: "snap" },
    ]
  },
];

export const FPS = 30;

export function durToFrames(sec: number): number {
  return Math.max(1, Math.round(sec * FPS));
}

export function sceneFrames(s: SceneDef): number {
  const dur = Math.max(s.minDur, s.voiceSec + 0.4);
  return durToFrames(dur);
}

export function totalFrames(): number {
  let total = 0;
  for (const s of SCENES) total += sceneFrames(s);
  return total;
}

export function sceneFrameRange(idx: number): { start: number; duration: number } {
  let start = 0;
  for (let i = 0; i < idx; i++) start += sceneFrames(SCENES[i]);
  return { start, duration: sceneFrames(SCENES[idx]) };
}



