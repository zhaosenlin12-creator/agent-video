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
