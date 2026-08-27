// All scene data for the "一节课打印只活恐龙" 3D printing dinosaur video.
// v8: 透明角色 + Remotion 动画 + 全屏场景背景 + 简洁分层布局
// 13 scenes, viral formula: 数字 + 颠覆 + 情绪词 + 节奏短句
//
// Layout zones (1920h):
//   y=80-180     Top step label / headline
//   y=200-1380   Hero subject zone (transparent character centered)
//   y=1400-1650  Mid labels / stats / overlay effects
//   y=1700-1860  Caption (rendered by StepScene, bottom:200 = y≈1720)

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
  delay: number;
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
  {
    key: "01_hook",
    text: "一节课打印只活恐龙，课间直接炸了。",
    emphasis: ["活恐龙", "课间炸了"],
    voiceSec: 3.89,
    minDur: 5.0,
    style: "Hook",
    sceneType: "Hook",
    elements: [
      { id: "headline", kind: "title", entrance: "spring-rise", delay: 0, text: "一节课打印", textColor: "#FFD400", textSize: 132, highlight: true, x: "50%", y: 340 },
      { id: "headline-2", kind: "title", entrance: "spring-rise", delay: 6, text: "只活恐龙", textColor: "#FFD400", textSize: 132, highlight: true, x: "50%", y: 500 },
      { id: "dino", kind: "image", src: "illustrations/01_hook_t.png", entrance: "axial-flyin", delay: 14, scale: 0.66, x: "50%", y: 1050 },
      { id: "tag", kind: "label", entrance: "spring-pop", delay: 30, text: "全班看呆", textColor: "#FFD400", textSize: 78, highlight: true, x: "50%", y: 1500 },
      { id: "cap", kind: "label", entrance: "fade", delay: 38, text: "课间直接炸了", textColor: "#FFFFFF", textSize: 50, x: "50%", y: 1720 },
    ],
    bgmBeatAt: 30,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "tick" },
      { frame: 14, sound: "tick" },
      { frame: 30, sound: "tick" },
    ],
  },

  // ====== 02 MATERIALS ====== 5.8s ======
  {
    key: "02_materials",
    text: "4件东西，30块搞定，学生党都能玩。",
    emphasis: ["4件", "30块", "学生党"],
    voiceSec: 4.50,
    minDur: 5.8,
    style: "Step",
    sceneType: "Materials",
    stepLabel: { en: "STEP 1", cn: "材料清单" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 1 · 材料清单", textColor: "#FFD400", textSize: 56 },
      { id: "tile-1", kind: "icon", entrance: "spring-pop", delay: 10, iconShape: "printer", text: "3D打印机", textColor: "#FFFFFF", textSize: 48, x: 280, y: 460 },
      { id: "tile-2", kind: "icon", entrance: "spring-pop", delay: 18, iconShape: "filament", text: "PLA耗材", textColor: "#FFFFFF", textSize: 48, x: 800, y: 460 },
      { id: "tile-3", kind: "icon", entrance: "spring-pop", delay: 26, iconShape: "arduino", text: "Arduino", textColor: "#FFFFFF", textSize: 48, x: 280, y: 880 },
      { id: "tile-4", kind: "icon", entrance: "spring-pop", delay: 34, iconShape: "servo", text: "舵机", textColor: "#FFFFFF", textSize: 48, x: 800, y: 880 },
      { id: "price", kind: "label", entrance: "spring-rise", delay: 46, text: "全套 30 元搞定", textColor: "#FFD400", textSize: 88, highlight: true, x: 540, y: 1340 },
      { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "学生党都能玩", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 10, sound: "pop" },
      { frame: 18, sound: "pop" },
      { frame: 26, sound: "pop" },
      { frame: 34, sound: "pop" },
      { frame: 46, sound: "tick" },
    ],
  },

  // ====== 03 MODEL ====== 5.0s ======
  {
    key: "03_model",
    text: "电脑里建出小恐龙，耳朵眼睛一条尾巴。",
    emphasis: ["建模", "三维结构"],
    voiceSec: 4.30,
    minDur: 5.0,
    style: "Step",
    sceneType: "Model",
    stepLabel: { en: "STEP 2", cn: "三维建模" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 2 · 三维建模", textColor: "#FFD400", textSize: 56 },
      { id: "head", kind: "image", src: "illustrations/03_model_t.png", entrance: "axial-flyin", delay: 8, scale: 0.62, x: 540, y: 920 },
      { id: "lbl-head", kind: "label", entrance: "spring-rise", delay: 22, text: "头", textColor: "#FFD400", textSize: 56, x: 220, y: 540 },
      { id: "lbl-body", kind: "label", entrance: "spring-rise", delay: 30, text: "躯干", textColor: "#FFD400", textSize: 56, x: 860, y: 900 },
      { id: "lbl-tail", kind: "label", entrance: "spring-rise", delay: 38, text: "尾", textColor: "#FFD400", textSize: 56, x: 220, y: 1280 },
      { id: "info", kind: "label", entrance: "spring-pop", delay: 50, text: "三维结构", textColor: "#FFD400", textSize: 78, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 60, text: "耳朵眼睛一条尾巴", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 30, sound: "click" },
      { frame: 38, sound: "click" },
      { frame: 50, sound: "tick" },
    ],
  },

  // ====== 04 SLICE ====== 5.0s ======
  {
    key: "04_slice",
    text: "切片软件自动分200层路径。",
    emphasis: ["200层", "层层堆叠"],
    voiceSec: 4.00,
    minDur: 5.0,
    style: "Step",
    sceneType: "Slice",
    stepLabel: { en: "STEP 3", cn: "切片路径" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 3 · 切片路径", textColor: "#FFD400", textSize: 56 },
      { id: "screen", kind: "image", src: "illustrations/04_slice_t.png", entrance: "axial-flyin", delay: 8, scale: 0.66, x: 540, y: 920 },
      { id: "layers", kind: "line", entrance: "sweep", delay: 24 },
      { id: "info", kind: "label", entrance: "spring-rise", delay: 44, text: "200 层路径", textColor: "#FFD400", textSize: 88, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "层层堆叠成型", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 24, sound: "click" },
      { frame: 44, sound: "tick" },
    ],
  },

  // ====== 05 PRINT ====== 5.5s ======
  {
    key: "05_print",
    text: "按下打印。喷头来回扫，塑料一秒秒堆出来。",
    emphasis: ["按下打印", "塑料堆出来"],
    voiceSec: 5.20,
    minDur: 5.5,
    style: "Step",
    sceneType: "Print",
    stepLabel: { en: "STEP 4", cn: "开始打印" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 4 · 开始打印", textColor: "#FFD400", textSize: 56 },
      { id: "printer", kind: "image", src: "illustrations/05_print_t.png", entrance: "axial-flyin", delay: 8, scale: 0.66, x: 540, y: 940 },
      { id: "progress-bar", kind: "line", entrance: "sweep", delay: 38 },
      { id: "progress", kind: "label", entrance: "spring-pop", delay: 50, text: "78%", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1500 },
      { id: "cap", kind: "label", entrance: "fade", delay: 60, text: "塑料一秒秒堆出来", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 18, sound: "click" },
      { frame: 50, sound: "tick" },
    ],
  },

  // ====== 06 LAYER ====== 5.5s ======
  {
    key: "06_layer",
    text: "一层 0.2 毫米，肉眼可见在堆高。",
    emphasis: ["0.2毫米", "肉眼可见"],
    voiceSec: 4.50,
    minDur: 5.5,
    style: "Step",
    sceneType: "Layer",
    stepLabel: { en: "STEP 5", cn: "逐层堆叠" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 5 · 逐层堆叠", textColor: "#FFD400", textSize: 56 },
      { id: "layer-img", kind: "image", src: "illustrations/06_layer_t.png", entrance: "axial-flyin", delay: 8, scale: 0.66, x: 540, y: 920 },
      { id: "layers", kind: "line", entrance: "sweep", delay: 22 },
      { id: "layer-count", kind: "label", entrance: "spring-pop", delay: 44, text: "120 层", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "肉眼可见在堆高", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 44, sound: "tick" },
    ],
  },

  // ====== 07 REMOVE ====== 5.0s ======
  {
    key: "07_remove",
    text: "抠下成品，掰掉支撑，打磨边角。",
    emphasis: ["取下", "一气呵成"],
    voiceSec: 4.00,
    minDur: 5.0,
    style: "Step",
    sceneType: "Remove",
    stepLabel: { en: "STEP 6", cn: "取下成品" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 6 · 取下成品", textColor: "#FFD400", textSize: 56 },
      { id: "part", kind: "image", src: "illustrations/07_remove_t.png", entrance: "axial-flyin", delay: 8, scale: 0.66, x: 540, y: 900 },
      { id: "grip", kind: "line", entrance: "sweep", delay: 22 },
      { id: "twist", kind: "line", entrance: "sweep", delay: 34 },
      { id: "check", kind: "label", entrance: "spring-pop", delay: 52, text: "完成", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 64, text: "一气呵成", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 34, sound: "tick" },
      { frame: 52, sound: "tick" },
    ],
  },

  // ====== 08 SERVO ====== 5.0s ======
  {
    key: "08_servo",
    text: "舵机塞进身体，接三根控制线。",
    emphasis: ["装舵机", "接三根线"],
    voiceSec: 4.20,
    minDur: 5.0,
    style: "Step",
    sceneType: "Servo",
    stepLabel: { en: "STEP 7", cn: "安装舵机" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 7 · 安装舵机", textColor: "#FFD400", textSize: 56 },
      { id: "servo", kind: "image", src: "illustrations/08_servo_t.png", entrance: "axial-flyin", delay: 8, scale: 0.66, x: 540, y: 900 },
      { id: "wires", kind: "line", entrance: "sweep", delay: 22 },
      { id: "wires-tag", kind: "label", entrance: "spring-pop", delay: 40, text: "3 根线", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 52, text: "舵机塞进身体", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 40, sound: "tick" },
    ],
  },

  // ====== 09 CODE ====== 5.0s ======
  {
    key: "09_code",
    text: "16行代码，尾巴左右摆90度。",
    emphasis: ["16行代码", "90度摆动"],
    voiceSec: 4.00,
    minDur: 5.0,
    style: "Step",
    sceneType: "Code",
    stepLabel: { en: "STEP 8", cn: "烧录代码" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 8 · 烧录代码", textColor: "#FFD400", textSize: 56 },
      { id: "code", kind: "image", src: "illustrations/09_code_t.png", entrance: "axial-flyin", delay: 8, scale: 0.66, x: 540, y: 920 },
      { id: "caret", kind: "line", entrance: "shutter", delay: 30 },
      { id: "info", kind: "label", entrance: "spring-pop", delay: 44, text: "16 行代码", textColor: "#FFD400", textSize: 92, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "尾巴摆动 90 度", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 30, sound: "click" },
      { frame: 44, sound: "tick" },
    ],
  },

  // ====== 10 POWER ====== 5.0s ======
  {
    key: "10_power",
    text: "三节电池一插，尾巴立刻晃。",
    emphasis: ["3节电池", "尾巴立刻晃"],
    voiceSec: 4.00,
    minDur: 5.0,
    style: "Step",
    sceneType: "Power",
    stepLabel: { en: "STEP 9", cn: "通电测试" },
    elements: [
      { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 9 · 通电测试", textColor: "#FFD400", textSize: 56 },
      { id: "dino-off", kind: "image", src: "illustrations/10_power_t.png", entrance: "fade", delay: 6, scale: 0.66, x: 540, y: 920 },
      { id: "counter", kind: "line", entrance: "sweep", delay: 16 },
      { id: "zap", kind: "line", entrance: "shutter", delay: 80 },
      { id: "info", kind: "label", entrance: "spring-pop", delay: 36, text: "3 节电池", textColor: "#FFD400", textSize: 88, highlight: true, x: 540, y: 1480 },
      { id: "cap", kind: "label", entrance: "fade", delay: 50, text: "尾巴立刻晃", textColor: "#FFFFFF", textSize: 50, x: 540, y: 1720 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 16, sound: "count" },
      { frame: 28, sound: "count" },
      { frame: 40, sound: "count" },
      { frame: 80, sound: "power" },
    ],
  },

  // ====== 11 DEMO ====== 3.5s ======
  {
    key: "11_demo",
    text: "摆在桌上，冲你摇头摆尾。",
    emphasis: ["摇头摆尾"],
    voiceSec: 2.80,
    minDur: 3.5,
    style: "Caption",
    sceneType: "Demo",
    elements: [
      { id: "dino", kind: "image", src: "illustrations/11_demo_t.png", entrance: "spring-rise", delay: 0, scale: 0.66, x: 540, y: 900 },
      { id: "tail", kind: "line", entrance: "sweep", delay: 12 },
      { id: "head", kind: "line", entrance: "sweep", delay: 20 },
      { id: "tag", kind: "label", entrance: "spring-pop", delay: 30, text: "好可爱", textColor: "#FFD400", textSize: 108, highlight: true, x: 540, y: 1500 },
      { id: "cap", kind: "label", entrance: "fade", delay: 40, text: "摇头摆尾", textColor: "#FFFFFF", textSize: 52, x: 540, y: 1720 },
    ],
    bgmBeatAt: 50,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 12, sound: "pop" },
      { frame: 20, sound: "pop" },
      { frame: 30, sound: "tick" },
    ],
  },

  // ====== 12 ROAR ====== 5.5s ======
  {
    key: "12_roar",
    text: "按下遥控，一声吼叫，全班都围过来。",
    emphasis: ["吼叫", "全班围过来"],
    voiceSec: 3.50,
    minDur: 5.5,
    style: "Caption",
    sceneType: "Roar",
    elements: [
      { id: "dino", kind: "image", src: "illustrations/12_roar_t.png", entrance: "spring-rise", delay: 0, scale: 0.66, x: 540, y: 900 },
      { id: "roar", kind: "line", entrance: "sweep", delay: 12 },
      { id: "wave", kind: "line", entrance: "sweep", delay: 22 },
      { id: "people", kind: "line", entrance: "sweep", delay: 36 },
      { id: "burst", kind: "label", entrance: "spring-pop", delay: 70, text: "全班围过来", textColor: "#FFD400", textSize: 96, highlight: true, x: 540, y: 1500 },
      { id: "cap", kind: "label", entrance: "fade", delay: 50, text: "一声吼叫", textColor: "#FFFFFF", textSize: 52, x: 540, y: 1720 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 12, sound: "tick" },
      { frame: 22, sound: "riser" },
      { frame: 70, sound: "tick" },
    ],
  },

  // ====== 13 ENDCARD ====== 5.5s ======
  {
    key: "13_endcard",
    text: "点赞收藏，下期教你做四足机甲。",
    emphasis: ["点赞收藏", "四足机甲"],
    voiceSec: 4.00,
    minDur: 5.5,
    style: "End",
    sceneType: "End",
    elements: [
      { id: "heart", kind: "icon", entrance: "spring-pop", delay: 0, iconShape: "rocket", text: "点赞", textColor: "#FFFFFF", textSize: 72, x: 320, y: 480 },
      { id: "star", kind: "icon", entrance: "spring-pop", delay: 8, iconShape: "rocket", text: "收藏", textColor: "#FFFFFF", textSize: 72, x: 760, y: 480 },
      { id: "title", kind: "title", entrance: "spring-rise", delay: 22, text: "下期更精彩", textColor: "#FFD400", textSize: 120, highlight: true, x: "50%", y: 900 },
      { id: "preview", kind: "image", src: "illustrations/13_flash3.png", entrance: "axial-flyin", delay: 36, scale: 0.45, x: "50%", y: 1280 },
      { id: "follow", kind: "label", entrance: "spring-pop", delay: 60, text: "关注我不错过", textColor: "#FFD400", textSize: 80, highlight: true, x: "50%", y: 1640 },
      { id: "cap", kind: "label", entrance: "fade", delay: 76, text: "下期教你做四足机甲", textColor: "#FFFFFF", textSize: 50, x: "50%", y: 1720 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "pop" },
      { frame: 8, sound: "pop" },
      { frame: 22, sound: "tick" },
      { frame: 36, sound: "tick" },
      { frame: 60, sound: "tick" },
    ],
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