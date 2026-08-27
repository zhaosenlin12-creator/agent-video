// All scene data for the "一节课打印只活恐龙" 3D printing dinosaur video.
// v15: layout refactor + cropped subject ("_tc.png") + cartoon vibe

export type SceneKey =
  | "01_hook" | "02_materials" | "03_model" | "04_slice" | "05_print"
  | "06_layer" | "07_remove" | "08_servo" | "09_code" | "10_power"
  | "11_demo" | "12_roar" | "13_endcard";

export type StepStyle = "Hook" | "Step" | "Counter" | "Caption" | "End";

export interface SceneElement {
  id: string;
  kind: "title" | "subtitle" | "image" | "icon" | "label" | "step" | "line" | "tag" | "cta" | "sparkle" | "burst";
  src?: string;
  scale?: number;
  x?: number | string;
  y?: number | string;
  w?: number;
  h?: number;
  entrance?: "spring-rise" | "spring-pop" | "axial-flyin" | "fade" | "shutter" | "sweep" | "spin-in";
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
  sfxCues?: { frame: number; sound: "pop" | "whoosh" | "click" | "snap" | "riser" | "count" | "power" | "tick" }[];
}

export const SCENES: SceneDef[] = [

  // ====== 01 HOOK ====== 5s ======
  {
    key: "01_hook",
    text: "一节课打印只活恐龙，课间直接炸了。",
    emphasis: ["活恐龙", "课间炸了"],
    voiceSec: 4.30,
    minDur: 5.0,
    style: "Hook",
    sceneType: "Hook",
    elements: [],
    bgmBeatAt: 30,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 6, sound: "tick" },
      { frame: 14, sound: "tick" },
      { frame: 20, sound: "tick" },
      { frame: 26, sound: "tick" },
      { frame: 32, sound: "tick" },
      { frame: 36, sound: "pop" },
      { frame: 50, sound: "tick" },
    ],
  },

  // ====== 02 MATERIALS ====== 5.8s ======
  {
    key: "02_materials",
    text: "4件东西，30块搞定，学生党都能玩。",
    emphasis: ["4件", "30块", "学生党"],
    voiceSec: 4.15,
    minDur: 5.8,
    style: "Step",
    sceneType: "Materials",
    stepLabel: { en: "STEP 1", cn: "材料清单" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 1 · 材料清单", textColor: "#FFD400", textSize: 54 },
  { id: "tile-1", kind: "icon", entrance: "spring-pop", delay: 8, iconShape: "printer", text: "3D打印机", textColor: "#FFFFFF", textSize: 44, x: 260, y: 440 },
  { id: "tile-2", kind: "icon", entrance: "spring-pop", delay: 16, iconShape: "filament", text: "PLA耗材", textColor: "#FFFFFF", textSize: 44, x: 820, y: 440 },
  { id: "tile-3", kind: "icon", entrance: "spring-pop", delay: 24, iconShape: "arduino", text: "Arduino", textColor: "#FFFFFF", textSize: 44, x: 260, y: 860 },
  { id: "tile-4", kind: "icon", entrance: "spring-pop", delay: 32, iconShape: "servo", text: "舵机", textColor: "#FFFFFF", textSize: 44, x: 820, y: 860 },
  { id: "tile-5", kind: "icon", entrance: "spring-pop", delay: 40, iconShape: "bolt", text: "电池", textColor: "#FFFFFF", textSize: 44, x: 260, y: 1240 },
  { id: "tile-6", kind: "icon", entrance: "spring-pop", delay: 48, iconShape: "tool", text: "胶水", textColor: "#FFFFFF", textSize: 44, x: 820, y: 1240 },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 56, x: 160, y: 1480 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 60, x: 920, y: 1500 },
  { id: "price", kind: "burst", entrance: "spring-pop", delay: 56, text: "全套30元", textColor: "#B81F1F", textSize: 58, x: 540, y: 1500 },
  { id: "cap", kind: "label", entrance: "fade", delay: 70, text: "学生党也能玩", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 30,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 16, sound: "tick" },
      { frame: 24, sound: "tick" },
      { frame: 32, sound: "tick" },
      { frame: 40, sound: "tick" },
      { frame: 48, sound: "tick" },
      { frame: 56, sound: "pop" },
    ],
  },

  // ====== 03 MODEL ====== 5.0s ======
  {
    key: "03_model",
    text: "电脑里建出小恐龙，耳朵眼睛一条尾巴。",
    emphasis: ["建模", "三维结构"],
    voiceSec: 4.03,
    minDur: 5.0,
    style: "Step",
    sceneType: "Model",
    stepLabel: { en: "STEP 2", cn: "三维建模" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 2 · 三维建模", textColor: "#FFD400", textSize: 54 },
  { id: "head", kind: "image", src: "illustrations/03_model_tc.png", entrance: "axial-flyin", delay: 8, x: 540, y: 870, w: 680, h: 1003 },
  { id: "lbl-head", kind: "tag", entrance: "spring-pop", delay: 24, text: "头", textColor: "#FFFFFF", textSize: 50, x: 240, y: 740 },
  { id: "lbl-body", kind: "tag", entrance: "spring-pop", delay: 32, text: "躯干", textColor: "#FFFFFF", textSize: 50, x: 800, y: 950 },
  { id: "lbl-tail", kind: "tag", entrance: "spring-pop", delay: 40, text: "尾", textColor: "#FFFFFF", textSize: 50, x: 850, y: 1180 },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 30, x: 200, y: 1180 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 44, x: 920, y: 700 },
  { id: "info", kind: "burst", entrance: "spring-pop", delay: 52, text: "三维结构", textColor: "#B81F1F", textSize: 62, x: 540, y: 1460 },
  { id: "cap", kind: "label", entrance: "fade", delay: 64, text: "耳朵眼睛一条尾巴", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 24, sound: "tick" },
      { frame: 32, sound: "tick" },
      { frame: 40, sound: "tick" },
      { frame: 52, sound: "pop" },
    ],
  },

  // ====== 04 SLICE ====== 5.0s ======
  {
    key: "04_slice",
    text: "切片软件自动分200层路径。",
    emphasis: ["200层", "层层堆叠"],
    voiceSec: 3.60,
    minDur: 5.0,
    style: "Step",
    sceneType: "Slice",
    stepLabel: { en: "STEP 3", cn: "切片路径" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 3 · 切片路径", textColor: "#FFD400", textSize: 54 },
  { id: "screen", kind: "image", src: "illustrations/04_slice_tc.png", entrance: "axial-flyin", delay: 8, x: 540, y: 870, w: 760, h: 897 },
  { id: "layers", kind: "line", entrance: "sweep", delay: 24 },
  { id: "info", kind: "burst", entrance: "spring-pop", delay: 50, text: "200层路径", textColor: "#B81F1F", textSize: 52, x: 540, y: 1400 },
  { id: "sub", kind: "label", entrance: "spring-rise", delay: 58, text: "自动分切", textColor: "#FFFFFF", textSize: 42, x: 540, y: 1560 },
  { id: "cap", kind: "label", entrance: "fade", delay: 68, text: "层层堆叠成型", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 24, sound: "click" },
      { frame: 50, sound: "pop" },
    ],
  },

  // ====== 05 PRINT ====== 5.5s ======
  {
    key: "05_print",
    text: "按下打印。喷头来回扫，塑料一秒秒堆出来。",
    emphasis: ["按下打印", "塑料堆出来"],
    voiceSec: 4.44,
    minDur: 5.5,
    style: "Step",
    sceneType: "Print",
    stepLabel: { en: "STEP 4", cn: "开始打印" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 4 · 开始打印", textColor: "#FFD400", textSize: 54 },
  { id: "printer", kind: "image", src: "illustrations/05_print_tc.png", entrance: "axial-flyin", delay: 8, x: 540, y: 880, w: 780, h: 1058 },
  { id: "progress-bar", kind: "line", entrance: "sweep", delay: 36 },
  { id: "progress", kind: "burst", entrance: "spring-pop", delay: 50, text: "78%", textColor: "#B81F1F", textSize: 58, x: 540, y: 1400 },
  { id: "progress-sub", kind: "label", entrance: "spring-rise", delay: 58, text: "正在打印中", textColor: "#FFFFFF", textSize: 40, x: 540, y: 1570 },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 50, x: 180, y: 1300 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 56, x: 900, y: 1340 },
  { id: "cap", kind: "label", entrance: "fade", delay: 68, text: "塑料一秒秒堆出来", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 24, sound: "click" },
      { frame: 36, sound: "click" },
      { frame: 50, sound: "pop" },
    ],
  },

  // ====== 06 LAYER ====== 5.5s ======
  {
    key: "06_layer",
    text: "一层0.2毫米，肉眼可见在堆高。",
    emphasis: ["0.2毫米", "肉眼可见"],
    voiceSec: 3.70,
    minDur: 5.5,
    style: "Step",
    sceneType: "Layer",
    stepLabel: { en: "STEP 5", cn: "逐层堆叠" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 5 · 逐层堆叠", textColor: "#FFD400", textSize: 54 },
  { id: "layer-img", kind: "image", src: "illustrations/06_layer_tc.png", entrance: "axial-flyin", delay: 8, x: 540, y: 870, w: 590, h: 1106 },
  { id: "layers", kind: "line", entrance: "sweep", delay: 22 },
  { id: "layer-count", kind: "burst", entrance: "spring-pop", delay: 48, text: "120层", textColor: "#B81F1F", textSize: 64, x: 540, y: 1460 },
  { id: "layer-sub", kind: "label", entrance: "spring-rise", delay: 56, text: "每层0.2毫米", textColor: "#FFFFFF", textSize: 42, x: 540, y: 1570 },
  { id: "cap", kind: "label", entrance: "fade", delay: 66, text: "肉眼可见在堆高", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 48, sound: "pop" },
    ],
  },

  // ====== 07 REMOVE ====== 5.0s ======
  {
    key: "07_remove",
    text: "抠下成品，抩掉支撑，打磨边角。",
    emphasis: ["取下", "一气呼成"],
    voiceSec: 3.86,
    minDur: 5.0,
    style: "Step",
    sceneType: "Remove",
    stepLabel: { en: "STEP 6", cn: "取下成品" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 6 · 取下成品", textColor: "#FFD400", textSize: 54 },
  { id: "part", kind: "image", src: "illustrations/07_remove_tc.png", entrance: "axial-flyin", delay: 8, x: 540, y: 880, w: 870, h: 1011 },
  { id: "grip", kind: "line", entrance: "sweep", delay: 22 },
  { id: "twist", kind: "line", entrance: "sweep", delay: 34 },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 28, x: 180, y: 900 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 36, x: 920, y: 1100 },
  { id: "check", kind: "burst", entrance: "spring-pop", delay: 52, text: "完成!", textColor: "#B81F1F", textSize: 64, x: 540, y: 1480 },
  { id: "cap", kind: "label", entrance: "fade", delay: 62, text: "一气呼成", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 36, sound: "click" },
      { frame: 52, sound: "pop" },
    ],
  },

  // ====== 08 SERVO ====== 5.0s ======
  {
    key: "08_servo",
    text: "舵机塞进身体，接三根控制线。",
    emphasis: ["装舵机", "接三根线"],
    voiceSec: 3.43,
    minDur: 5.0,
    style: "Step",
    sceneType: "Servo",
    stepLabel: { en: "STEP 7", cn: "安装舵机" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 7 · 安装舵机", textColor: "#FFD400", textSize: 54 },
  { id: "servo", kind: "image", src: "illustrations/08_servo_tc.png", entrance: "axial-flyin", delay: 8, x: 540, y: 880, w: 940, h: 969 },
  { id: "wires", kind: "line", entrance: "sweep", delay: 22 },
  { id: "wires-tag", kind: "burst", entrance: "spring-pop", delay: 42, text: "3根线", textColor: "#B81F1F", textSize: 64, x: 540, y: 1480 },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 30, x: 180, y: 1100 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 38, x: 900, y: 1150 },
  { id: "cap", kind: "label", entrance: "fade", delay: 56, text: "舵机塞进身体", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 22, sound: "click" },
      { frame: 42, sound: "pop" },
    ],
  },

  // ====== 09 CODE ====== 5.0s ======
  {
    key: "09_code",
    text: "16行代码，尾巴左右摆90度。",
    emphasis: ["16行代码", "90度摆动"],
    voiceSec: 3.53,
    minDur: 5.0,
    style: "Step",
    sceneType: "Code",
    stepLabel: { en: "STEP 8", cn: "烧录代码" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 8 · 烧录代码", textColor: "#FFD400", textSize: 54 },
  { id: "code", kind: "image", src: "illustrations/09_code_tc.png", entrance: "axial-flyin", delay: 8, x: 540, y: 880, w: 960, h: 971 },
  { id: "caret", kind: "line", entrance: "shutter", delay: 30 },
  { id: "info", kind: "burst", entrance: "spring-pop", delay: 46, text: "16行代码", textColor: "#B81F1F", textSize: 62, x: 540, y: 1480 },
  { id: "cap", kind: "label", entrance: "fade", delay: 58, text: "尾巴摆动90度", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 70,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 30, sound: "click" },
      { frame: 46, sound: "pop" },
    ],
  },

  // ====== 10 POWER ====== 5.0s ======
  {
    key: "10_power",
    text: "三节电池一插，尾巴立刻晃。",
    emphasis: ["3节电池", "尾巴立刻晃"],
    voiceSec: 3.26,
    minDur: 5.0,
    style: "Step",
    sceneType: "Power",
    stepLabel: { en: "STEP 9", cn: "通电测试" },
    elements: [
  { id: "step", kind: "step", entrance: "spring-pop", delay: 0, text: "STEP 9 · 通电测试", textColor: "#FFD400", textSize: 54 },
  { id: "dino-off", kind: "image", src: "illustrations/10_power_tc.png", entrance: "axial-flyin", delay: 8, x: 540, y: 880, w: 1000, h: 716 },
  { id: "counter", kind: "line", entrance: "sweep", delay: 16 },
  { id: "zap", kind: "line", entrance: "shutter", delay: 80 },
  { id: "info", kind: "burst", entrance: "spring-pop", delay: 40, text: "3节电池", textColor: "#B81F1F", textSize: 62, x: 540, y: 1380 },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 32, x: 200, y: 1100 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 44, x: 880, y: 1180 },
  { id: "cap", kind: "label", entrance: "fade", delay: 54, text: "尾巴立刻晃", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 60,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 8, sound: "tick" },
      { frame: 16, sound: "count" },
      { frame: 40, sound: "pop" },
      { frame: 80, sound: "power" },
    ],
  },

  // ====== 11 DEMO ====== 3.5s ======
  {
    key: "11_demo",
    text: "摆在桌上，冲你摆头摆尾。",
    emphasis: ["摆头摆尾"],
    voiceSec: 2.86,
    minDur: 3.5,
    style: "Caption",
    sceneType: "Demo",
    elements: [
  { id: "dino", kind: "image", src: "illustrations/11_demo_tc.png", entrance: "spring-rise", delay: 0, x: 540, y: 880, w: 800, h: 879 },
  { id: "tail", kind: "line", entrance: "sweep", delay: 12 },
  { id: "head", kind: "line", entrance: "sweep", delay: 20 },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 14, x: 200, y: 850 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 22, x: 880, y: 950 },
  { id: "sparkle-3", kind: "sparkle", entrance: "spring-pop", delay: 28, x: 240, y: 1180 },
  { id: "tag", kind: "burst", entrance: "spring-pop", delay: 30, text: "好可爱", textColor: "#B81F1F", textSize: 64, x: 540, y: 1460 },
  { id: "cap", kind: "label", entrance: "fade", delay: 42, text: "摆头摆尾", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 50,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 14, sound: "tick" },
      { frame: 22, sound: "tick" },
      { frame: 30, sound: "pop" },
    ],
  },

  // ====== 12 ROAR ====== 5.5s ======
  {
    key: "12_roar",
    text: "按下遥控，一声吶叫，全班都围过来。",
    emphasis: ["吶叫", "全班围过来"],
    voiceSec: 4.06,
    minDur: 5.5,
    style: "Caption",
    sceneType: "Roar",
    elements: [
  { id: "dino", kind: "image", src: "illustrations/12_roar_tc.png", entrance: "spring-rise", delay: 0, x: 540, y: 870, w: 780, h: 988 },
  { id: "roar", kind: "line", entrance: "sweep", delay: 12 },
  { id: "wave", kind: "line", entrance: "sweep", delay: 22 },
  { id: "people", kind: "line", entrance: "sweep", delay: 36 },
  { id: "burst", kind: "burst", entrance: "spring-pop", delay: 50, text: "全班围过来", textColor: "#B81F1F", textSize: 50, x: 540, y: 1400 },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 28, x: 200, y: 1100 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 38, x: 880, y: 900 },
  { id: "cap", kind: "label", entrance: "fade", delay: 62, text: "一声吶叫", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "whoosh" },
      { frame: 12, sound: "tick" },
      { frame: 22, sound: "riser" },
      { frame: 50, sound: "pop" },
    ],
  },

  // ====== 13 ENDCARD ====== 5.5s ======
  {
    key: "13_endcard",
    text: "点赞收藏，下期教你做四足机甲。",
    emphasis: ["点赞收藏", "四足机甲"],
    voiceSec: 3.79,
    minDur: 5.5,
    style: "End",
    sceneType: "End",
    elements: [
  { id: "heart", kind: "icon", entrance: "spring-pop", delay: 0, iconShape: "rocket", text: "点赞", textColor: "#FFFFFF", textSize: 60, x: 320, y: 420 },
  { id: "star", kind: "icon", entrance: "spring-pop", delay: 8, iconShape: "rocket", text: "收藏", textColor: "#FFFFFF", textSize: 60, x: 760, y: 420 },
  { id: "title", kind: "burst", entrance: "spring-pop", delay: 18, text: "下期更精彩", textColor: "#B81F1F", textSize: 54, x: 540, y: 720 },
  { id: "preview", kind: "image", src: "illustrations/13_flash3.png", entrance: "axial-flyin", delay: 30, x: 540, y: 1280, w: 700, h: 700 },
  { id: "follow", kind: "label", entrance: "spring-rise", delay: 48, text: "关注我不错过", textColor: "#FFD400", textSize: 50, x: 540, y: 1540, highlight: true },
  { id: "sparkle-1", kind: "sparkle", entrance: "spring-pop", delay: 22, x: 180, y: 700 },
  { id: "sparkle-2", kind: "sparkle", entrance: "spring-pop", delay: 26, x: 900, y: 750 },
  { id: "sparkle-3", kind: "sparkle", entrance: "spring-pop", delay: 32, x: 220, y: 1280 },
  { id: "sparkle-4", kind: "sparkle", entrance: "spring-pop", delay: 36, x: 860, y: 1300 },
  { id: "cap", kind: "label", entrance: "fade", delay: 68, text: "下期教你做四足机甲", textColor: "#FFFFFF", textSize: 44, x: 540, y: 1730 },
    ],
    bgmBeatAt: 80,
    sfxCues: [
      { frame: 0, sound: "pop" },
      { frame: 8, sound: "pop" },
      { frame: 18, sound: "pop" },
      { frame: 30, sound: "tick" },
      { frame: 48, sound: "tick" },
      { frame: 22, sound: "tick" },
      { frame: 26, sound: "tick" },
      { frame: 32, sound: "tick" },
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