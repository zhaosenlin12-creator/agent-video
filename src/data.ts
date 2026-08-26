// All scene data for the "一节课打印只活恐龙" 3D printing dinosaur video.
// 13 scenes, viral formula: 数字 + 颠覆 + 情绪词 + 节奏短句
// 每段多元素逐个入场（product-card-progressive-assemble）
//
// Layout zones (1920h):
//   y=120  Step label / Top headline (handled by StepLabel component)
//   y=300-1200  Hero subject zone (main illustration centered)
//   y=1300-1500  Mid labels / stats
//   y=1700-1850  Caption (rendered by StepScene, bottom: 200 = y≈1700)

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
  src?: string;
  scale?: number;
  x?: number | string;
  y?: number | string;
  w?: number | string;
  h?: number | string;
  entrance?: "spring-rise" | "spring-pop" | "axial-flyin" | "fade" | "shutter" | "sweep";
  delay: number; // frames
  text?: string;
  textColor?: string;
  textSize?: number;
  highlight?: boolean;
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
  elements: SceneElement[];
  bgmBeatAt?: number;
  sfxCues?: { frame: number; sound: "pop" | "whoosh" | "click" | "snap" | "riser" | "count" | "power" }[];
}

export const SCENES: SceneDef[] = [
  // ====== 01 HOOK ====== 5s ======
  { key: "01_hook", text: "一节课打印只活恐龙，课间直接炸了。", emphasis: ["活恐龙", "课间炸了"], voiceSec: 3.89, minDur: 5.0, style: "Hook",
    sceneType: "Hook",
    elements: [
      { id: "headline", kind: "title", entrance: "spring-rise", delay: 0, text: "一节课打印", textColor: "#FFD400", textSize: 130, highlight: true, x: "50%", y: 380 },
      { id: "headline-2", kind: "title", entrance: "spring-rise", delay: 6, text: "只活恐龙", textColor: "#FFD400", textSize: 130, highlight: true, x: "50%", y: 540 },
      { id: "dino", kind: "image", src: "illustrations/01_hook.png", entrance: "axial-flyin", delay: 14, scale: 1.0, x: "50%", y: 1150 },
      { id: "cap", kind: "label", entrance: "fade", delay: 30, text: "全班同学都看呆了，点击看完整实验", textColor: "#FFD400", textSize: 52, x: "50%", y: 1700 },
    ],
    bgmBeatAt: 30,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "tick" },
      { frame: 14, sound: "tick" },
    ]
  },

  // ====== 02 MATERIALS ====== 5.8s ======
  { key: "02_materials", text: "4件东西，30块搞定，学生党都能玩。", emphasis: ["4件", "30块", "学生党"], voiceSec: 4.50, minDur: 5.8, style: "Step",
    sceneType: "Materials",
    stepLabel: { en: "STEP 1", cn: "材料清单" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 1 · 材料清单", textColor: "#FFD400", textSize: 56 },
      { id: "tile-1", kind: "icon", entrance: "spring-pop", delay: 10, iconShape: "printer", text: "3D打印机", textColor: "#FFFFFF", textSize: 48, x: 280, y: 460 },
      { id: "tile-2", kind: "icon", entrance: "spring-pop", delay: 18, iconShape: "filament", text: "PLA耗材", textColor: "#FFFFFF", textSize: 48, x: 800, y: 460 },
      { id: "tile-3", kind: "icon", entrance: "spring-pop", delay: 26, iconShape: "arduino", text: "Arduino", textColor: "#FFFFFF", textSize: 48, x: 280, y: 880 },
      { id: "tile-4", kind: "icon", entrance: "spring-pop", delay: 34, iconShape: "servo", text: "舵机", textColor: "#FFFFFF", textSize: 48, x: 800, y: 880 },
      { id: "price", kind: "label", entrance: "spring-rise", delay: 46, text: "全套 30 元搞定", textColor: "#FFD400", textSize: 88, highlight: true, x: 540, y: 1320 },
      { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "学生党都能玩", textColor: "#FFFFFF", textSize: 52, x: 540, y: 1700 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 10, sound: "pop" },
      { frame: 18, sound: "pop" },
      { frame: 26, sound: "pop" },
      { frame: 34, sound: "pop" },
      { frame: 46, sound: "tick" },
    ]
  },

  // ====== 03 MODEL ====== 5.0s ======
  { key: "03_model", text: "电脑里建出小恐龙，耳朵眼睛一条尾巴。", emphasis: ["建模", "三维结构"], voiceSec: 4.30, minDur: 5.0, style: "Step",
    sceneType: "Model",
    stepLabel: { en: "STEP 2", cn: "三维建模" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 2 · 三维建模", textColor: "#FFD400", textSize: 56 },
      { id: "head", kind: "image", src: "illustrations/03_model.png", entrance: "axial-flyin", delay: 6, scale: 0.85, x: 540, y: 850 },
      { id: "lbl-head", kind: "label", entrance: "spring-rise", delay: 22, text: "头部", textColor: "#FFD400", textSize: 60, x: 540, y: 380 },
      { id: "lbl-body", kind: "label", entrance: "spring-rise", delay: 30, text: "躯干", textColor: "#FFD400", textSize: 60, x: 540, y: 1000 },
      { id: "lbl-tail", kind: "label", entrance: "spring-rise", delay: 38, text: "尾巴", textColor: "#FFD400", textSize: 60, x: 540, y: 1280 },
      { id: "timer", kind: "label", entrance: "spring-pop", delay: 50, text: "10 分钟", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1520 },
      { id: "cap", kind: "label", entrance: "fade", delay: 60, text: "三维结构一目了然", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1700 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "tick" },
      { frame: 22, sound: "pop" },
      { frame: 30, sound: "pop" },
      { frame: 38, sound: "pop" },
      { frame: 50, sound: "tick" },
    ]
  },

  // ====== 04 SLICE ====== 5.0s ======
  { key: "04_slice", text: "犀牛切片，告诉机器每层怎么吐丝。", emphasis: ["切片", "每层怎么走"], voiceSec: 4.20, minDur: 5.0, style: "Step",
    sceneType: "Slice",
    stepLabel: { en: "STEP 3", cn: "切片路径" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 3 · 切片路径", textColor: "#FFD400", textSize: 56 },
      { id: "screen", kind: "image", src: "illustrations/04_slice.png", entrance: "axial-flyin", delay: 8, scale: 0.85, x: 540, y: 900 },
      { id: "layers", kind: "line", entrance: "sweep", delay: 22 },
      { id: "info", kind: "label", entrance: "spring-rise", delay: 44, text: "200 层路径", textColor: "#FFD400", textSize: 86, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "层层堆叠成型", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1700 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 44, sound: "tick" },
    ]
  },

  // ====== 05 PRINT ====== 5.5s ======
  { key: "05_print", text: "按下打印。喷头来回扫，塑料一秒秒堆出来。", emphasis: ["按下打印", "塑料堆出来"], voiceSec: 5.20, minDur: 5.5, style: "Step",
    sceneType: "Print",
    stepLabel: { en: "STEP 4", cn: "开始打印" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 4 · 开始打印", textColor: "#FFD400", textSize: 56 },
      { id: "printer", kind: "image", src: "illustrations/05_print.png", entrance: "axial-flyin", delay: 8, scale: 0.95, x: 540, y: 900 },
      { id: "progress-bar", kind: "line", entrance: "sweep", delay: 38 },
      { id: "progress", kind: "label", entrance: "spring-pop", delay: 50, text: "78%", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 60, text: "塑料一秒秒堆出来", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1700 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 16, sound: "click" },
      { frame: 50, sound: "tick" },
    ]
  },

  // ====== 06 LAYER ====== 5.5s ======
  { key: "06_layer", text: "一层 0.2 毫米，肉眼可见在堆高。", emphasis: ["0.2毫米", "肉眼可见"], voiceSec: 4.50, minDur: 5.5, style: "Step",
    sceneType: "Layer",
    stepLabel: { en: "STEP 5", cn: "逐层堆叠" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 5 · 逐层堆叠", textColor: "#FFD400", textSize: 56 },
      { id: "layer-img", kind: "image", src: "illustrations/06_layer.png", entrance: "axial-flyin", delay: 8, scale: 0.9, x: 540, y: 900 },
      { id: "layers", kind: "line", entrance: "sweep", delay: 22 },
      { id: "layer-count", kind: "label", entrance: "spring-pop", delay: 44, text: "120 层", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "肉眼可见在堆高", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1700 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 44, sound: "tick" },
    ]
  },

  // ====== 07 REMOVE ====== 5.0s ======
  { key: "07_remove", text: "抠下成品，掰掉支撑，打磨边角。", emphasis: ["取下", "一气呵成"], voiceSec: 4.00, minDur: 5.0, style: "Step",
    sceneType: "Remove",
    stepLabel: { en: "STEP 6", cn: "取下成品" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 6 · 取下成品", textColor: "#FFD400", textSize: 56 },
      { id: "part", kind: "image", src: "illustrations/07_remove.png", entrance: "axial-flyin", delay: 8, scale: 0.85, x: 540, y: 880 },
      { id: "grip", kind: "line", entrance: "sweep", delay: 22 },
      { id: "twist", kind: "line", entrance: "sweep", delay: 34 },
      { id: "check", kind: "label", entrance: "spring-pop", delay: 52, text: "完成", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 64, text: "一气呵成", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1700 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 34, sound: "tick" },
      { frame: 52, sound: "tick" },
    ]
  },

  // ====== 08 SERVO ====== 5.0s ======
  { key: "08_servo", text: "舵机塞进身体，接三根控制线。", emphasis: ["装舵机", "接三根线"], voiceSec: 4.20, minDur: 5.0, style: "Step",
    sceneType: "Servo",
    stepLabel: { en: "STEP 7", cn: "安装舵机" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 7 · 安装舵机", textColor: "#FFD400", textSize: 56 },
      { id: "dino-body", kind: "image", src: "illustrations/08_servo.png", entrance: "fade", delay: 8, scale: 0.85, x: 540, y: 880 },
      { id: "servo", kind: "image", src: "illustrations/_aux_servo.png", entrance: "axial-flyin", delay: 22, scale: 0.4, x: 200, y: 480 },
      { id: "wire-1", kind: "line", entrance: "sweep", delay: 36 },
      { id: "wire-2", kind: "line", entrance: "sweep", delay: 42 },
      { id: "wire-3", kind: "line", entrance: "sweep", delay: 48 },
      { id: "count", kind: "label", entrance: "spring-pop", delay: 60, text: "3 根线", textColor: "#FFD400", textSize: 100, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 70, text: "控制信号", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1700 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "tick" },
      { frame: 36, sound: "click" },
      { frame: 42, sound: "click" },
      { frame: 48, sound: "click" },
      { frame: 60, sound: "tick" },
    ]
  },

  // ====== 09 CODE ====== 5.3s ======
  { key: "09_code", text: "三行代码，让尾巴按节奏摇摆。", emphasis: ["三行", "按节奏摇"], voiceSec: 4.50, minDur: 5.3, style: "Step",
    sceneType: "Code",
    stepLabel: { en: "STEP 8", cn: "写控制代码" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 8 · 写控制代码", textColor: "#FFD400", textSize: 56 },
      { id: "screen", kind: "image", src: "illustrations/09_code.png", entrance: "fade", delay: 6, scale: 0.78, x: 540, y: 820 },
      { id: "line-1", kind: "line", entrance: "sweep", delay: 20 },
      { id: "line-2", kind: "line", entrance: "sweep", delay: 28 },
      { id: "line-3", kind: "line", entrance: "sweep", delay: 36 },
      { id: "highlight", kind: "line", entrance: "sweep", delay: 46 },
      { id: "ready", kind: "label", entrance: "spring-pop", delay: 60, text: "三行搞定", textColor: "#FFD400", textSize: 86, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 72, text: "节奏摇摆", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1700 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "tick" },
      { frame: 20, sound: "click" },
      { frame: 28, sound: "click" },
      { frame: 36, sound: "click" },
      { frame: 60, sound: "tick" },
    ]
  },

  // ====== 10 POWER ====== 4.2s ======
  { key: "10_power", text: "插上电，三二一，尾巴立刻晃。", emphasis: ["通电", "三二一", "尾巴晃"], voiceSec: 3.30, minDur: 4.2, style: "Counter",
    sceneType: "Power",
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 9 · 通电测试", textColor: "#FFD400", textSize: 56 },
      { id: "dino-off", kind: "image", src: "illustrations/10_power.png", entrance: "fade", delay: 6, scale: 0.85, x: 540, y: 900 },
      { id: "counter", kind: "line", entrance: "sweep", delay: 16 },
      { id: "zap", kind: "line", entrance: "shutter", delay: 80 },
      { id: "cap", kind: "label", entrance: "fade", delay: 30, text: "尾巴立刻晃", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1700 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 16, sound: "count" },
      { frame: 28, sound: "count" },
      { frame: 40, sound: "count" },
      { frame: 80, sound: "power" },
    ]
  },

  // ====== 11 DEMO ====== 3.5s ======
  { key: "11_demo", text: "摆在桌上，冲你摇头摆尾。", emphasis: ["摇头摆尾"], voiceSec: 2.80, minDur: 3.5, style: "Caption",
    sceneType: "Demo",
    elements: [
      { id: "dino", kind: "image", src: "illustrations/11_demo.png", entrance: "spring-rise", delay: 0, scale: 0.95, x: 540, y: 880 },
      { id: "tail", kind: "line", entrance: "sweep", delay: 12 },
      { id: "head", kind: "line", entrance: "sweep", delay: 20 },
      { id: "tag", kind: "label", entrance: "spring-pop", delay: 30, text: "好可爱", textColor: "#FFD400", textSize: 110, highlight: true, x: 540, y: 1500 },
      { id: "cap", kind: "label", entrance: "fade", delay: 40, text: "摇头摆尾", textColor: "#FFFFFF", textSize: 52, x: 540, y: 1700 },
    ],
    bgmBeatAt: 50,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 12, sound: "pop" },
      { frame: 20, sound: "pop" },
      { frame: 30, sound: "tick" },
    ]
  },

  // ====== 12 ROAR ====== 5.5s ======
  { key: "12_roar", text: "按下遥控，一声吼叫，全班都围过来。", emphasis: ["吼叫", "全班围过来"], voiceSec: 3.50, minDur: 5.5, style: "Caption",
    sceneType: "Roar",
    elements: [
      { id: "dino", kind: "image", src: "illustrations/12_roar.png", entrance: "spring-rise", delay: 0, scale: 0.95, x: 540, y: 880 },
      { id: "roar", kind: "line", entrance: "sweep", delay: 12 },
      { id: "wave", kind: "line", entrance: "sweep", delay: 22 },
      { id: "people", kind: "line", entrance: "sweep", delay: 36 },
      { id: "burst", kind: "label", entrance: "spring-pop", delay: 70, text: "全班围过来", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1500 },
      { id: "cap", kind: "label", entrance: "fade", delay: 50, text: "一声吼叫", textColor: "#FFFFFF", textSize: 52, x: 540, y: 1700 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 12, sound: "tick" },
      { frame: 22, sound: "riser" },
      { frame: 70, sound: "tick" },
    ]
  },

  // ====== 13 ENDCARD ====== 5.5s ======
  { key: "13_endcard", text: "点赞收藏，下期教你做四足机甲。", emphasis: ["点赞收藏", "四足机甲"], voiceSec: 4.00, minDur: 5.5, style: "End",
    sceneType: "End",
    elements: [
      { id: "heart", kind: "icon", entrance: "spring-pop", delay: 0, iconShape: "rocket", text: "点赞", textColor: "#FFFFFF", textSize: 72, x: 320, y: 480 },
      { id: "star", kind: "icon", entrance: "spring-pop", delay: 8, iconShape: "rocket", text: "收藏", textColor: "#FFFFFF", textSize: 72, x: 760, y: 480 },
      { id: "title", kind: "title", entrance: "spring-rise", delay: 22, text: "下期更精彩", textColor: "#FFD400", textSize: 120, highlight: true, x: "50%", y: 900 },
      { id: "preview", kind: "image", src: "illustrations/13_flash3.png", entrance: "axial-flyin", delay: 36, scale: 0.45, x: "50%", y: 1280 },
      { id: "follow", kind: "label", entrance: "spring-pop", delay: 60, text: "关注我不错过", textColor: "#FFD400", textSize: 80, highlight: true, x: "50%", y: 1640 },
      { id: "cap", kind: "label", entrance: "fade", delay: 76, text: "下期教你做四足机甲", textColor: "#FFFFFF", textSize: 50, x: "50%", y: 1700 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "pop" },
      { frame: 8, sound: "pop" },
      { frame: 22, sound: "tick" },
      { frame: 36, sound: "tick" },
      { frame: 60, sound: "tick" },
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