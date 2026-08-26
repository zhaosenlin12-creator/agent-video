﻿// All scene data for the "一节课打印只活恐龙" 3D printing dinosaur video.
// 13 scenes: 1 Hook (with beat-cut-moves cuts) + 8 build steps + 1 demo + 2 climax + 1 End card (paparazzi-flash).
// Durations use voiceSec from edge-tts + 0.4s padding.

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

export interface SceneDef {
  key: SceneKey;
  text: string;
  emphasis: string[];
  voiceSec: number;
  minDur: number;
  style: StepStyle;
  stepLabel?: { en: string; cn: string };
  counterNumber?: string;
  useRealVideo?: boolean;
  videoSrc?: string;
  illustration?: string;
  sceneType?: string;
  hookCuts?: string[]; // for HookScene beat-cut-moves
  flashCuts?: string[]; // for EndCardScene paparazzi-flash
}

export const SCENES: SceneDef[] = [
  // Hook uses beat-cut-moves: 5 escalating hard cuts + final hold with main headline (R1 ≥1s hold, R2 acceleration, R3 ≥3s arc)
  { key: "01_hook",        text: "一节课打印只活恐龙，课间直接炸了！",                       emphasis: ["活恐龙", "课间炸了"],                      voiceSec: 3.74, minDur: 5.0, style: "Hook",    illustration: "illustrations/01_hook.png",   sceneType: "Hook",
    hookCuts: [
      "illustrations/01_hook_cut1.png",
      "illustrations/01_hook_cut2.png",
      "illustrations/01_hook_cut3.png",
      "illustrations/01_hook_cut4.png",
      "illustrations/01_hook_cut5.png"
    ]
  },

  // Materials: spring-in for each tool
  { key: "02_materials",   text: "打印机一台，PLA 耗材一卷，Arduino 一块，舵机一个。",         emphasis: ["打印机", "PLA", "Arduino", "舵机"], voiceSec: 5.40, minDur: 5.5, style: "Step", stepLabel: { en: "STEP 1", cn: "准备设备" }, illustration: "illustrations/02_materials.png",  sceneType: "Step" },

  // Model: build 3D model
  { key: "03_model",       text: "第一步，电脑里建出小恐龙，耳朵眼睛一条尾巴。",             emphasis: ["建出模型", "耳朵眼睛尾巴"],            voiceSec: 4.61, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 2", cn: "三维建模" }, illustration: "illustrations/03_model.png",       sceneType: "Step" },

  // Slice: software slicing
  { key: "04_slice",       text: "第二步，犀牛切片，告诉机器每一层怎么吐丝。",               emphasis: ["切片", "每一层"],                       voiceSec: 4.54, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 3", cn: "切片路径" }, illustration: "illustrations/04_slice.png",       sceneType: "Step" },

  // Print: 3D printer working
  { key: "05_print",       text: "第三步，机器开始吐丝，喷头来回扫动，塑料一层层堆出来。",   emphasis: ["吐丝", "一层层堆出来"],                  voiceSec: 5.86, minDur: 5.5, style: "Step", stepLabel: { en: "STEP 4", cn: "开始打印" }, illustration: "illustrations/05_print.png",       sceneType: "Step" },

  // Layer: layers stacking
  { key: "06_layer",       text: "第四步，层层堆叠，半小时过去，恐龙轮廓基本成型。",         emphasis: ["层层堆叠", "轮廓成型"],                  voiceSec: 5.42, minDur: 5.5, style: "Step", stepLabel: { en: "STEP 5", cn: "层层堆叠" }, illustration: "illustrations/06_layer.png",       sceneType: "Step" },

  // Remove: take off the bed
  { key: "07_remove",      text: "第五步，抠下成品，掰掉支撑，打磨边角。",                   emphasis: ["抠下成品", "掰掉支撑"],                  voiceSec: 4.51, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 6", cn: "取下成品" }, illustration: "illustrations/07_remove.png",      sceneType: "Step" },

  // Servo: install servo into body
  { key: "08_servo",       text: "第六步，舵机塞进恐龙身体，接三根控制线。",                 emphasis: ["舵机塞进", "控制线"],                    voiceSec: 4.56, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 7", cn: "安装舵机" }, illustration: "illustrations/08_servo.png",       sceneType: "Step" },

  // Code: Arduino code
  { key: "09_code",        text: "第七步，Arduino 写三行代码，让尾巴按节奏摇摆。",          emphasis: ["三行代码", "按节奏摇摆"],                 voiceSec: 4.94, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 8", cn: "写控制代码" }, illustration: "illustrations/09_code.png",        sceneType: "Step" },

  // Power: power on, tail starts moving
  { key: "10_power",       text: "第八步，插上电源，尾巴立刻开始晃。",                       emphasis: ["尾巴开始晃"],                            voiceSec: 3.84, minDur: 4.0, style: "Counter", illustration: "illustrations/10_power.png",       sceneType: "Launch" },

  // Demo: dinosaur wags tail on desk
  { key: "11_demo",        text: "摆在桌上，它冲你摇头摆尾。",                               emphasis: ["摇头摆尾"],                              voiceSec: 3.00, minDur: 3.5, style: "Caption", illustration: "illustrations/11_demo.png",        sceneType: "Step" },

  // Roar: button press + roar
  { key: "12_roar",        text: "按下遥控，一声吼叫，全班都围过来。",                       emphasis: ["一声吼叫", "全班围过来"],                 voiceSec: 3.82, minDur: 5.5, style: "Caption", illustration: "illustrations/12_roar.png",        sceneType: "Step" },

  // End card: paparazzi-flash (3 white flashes + hold ≥2s with main CTA)
  { key: "13_endcard",     text: "点赞收藏，下期教你做更复杂的四足机甲。",                   emphasis: ["点赞收藏", "四足机甲"],                  voiceSec: 4.39, minDur: 5.5, style: "End", illustration: "illustrations/13_endcard.png", sceneType: "End",
    flashCuts: [
      "illustrations/13_flash1.png",
      "illustrations/13_flash2.png",
      "illustrations/13_flash3.png"
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

