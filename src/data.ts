// All scene data for the water-rocket Douyin video.
// Durations (in seconds) come from the previous ffmpeg probe of each edge_tts voice mp3.

export type SceneKey =
  | "01_hook"
  | "02_materials"
  | "03_cut"
  | "04_fins"
  | "05_nozzle"
  | "06_water"
  | "07_pump"
  | "08_count3"
  | "09_count2"
  | "10_count1"
  | "11_launch"
  | "12_success"
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
}

export const SCENES: SceneDef[] = [
  { key: "01_hook",      text: "塑料瓶也能飞上天！",          emphasis: ["塑料瓶", "飞上天"],     voiceSec: 2.35, minDur: 3.0, style: "Hook",    illustration: "illustrations/01_hook.png" },
  { key: "02_materials", text: "一个可乐瓶、一卷胶带、一把剪刀、一个打气筒就够了。", emphasis: ["可乐瓶", "胶带", "打气筒"], voiceSec: 4.85, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 1", cn: "准备材料" }, illustration: "illustrations/02_materials.png" },
  { key: "03_cut",       text: "沿瓶身中间剪开，做成可以翻折的底座。",            emphasis: ["剪开", "底座"],         voiceSec: 3.74, minDur: 4.5, style: "Step", stepLabel: { en: "STEP 2", cn: "切割瓶身" }, illustration: "illustrations/03_cut.png" },
  { key: "04_fins",      text: "硬卡纸剪三角翼，十字缠绕胶带固定在瓶身两侧。",     emphasis: ["三角翼", "十字缠绕"],    voiceSec: 4.80, minDur: 4.8, style: "Step", stepLabel: { en: "STEP 3", cn: "加装机翼" }, illustration: "illustrations/04_fins.png" },
  { key: "05_nozzle",    text: "瓶口装上喷嘴转接头，胶带死死缠紧，千万别漏气。",   emphasis: ["喷嘴", "千万别漏气"],   voiceSec: 5.02, minDur: 4.8, style: "Step", stepLabel: { en: "STEP 4", cn: "安装喷嘴" }, illustration: "illustrations/05_nozzle.png" },
  { key: "06_water",     text: "往瓶子里倒三分之一的水，太多飞不远，太少没动力。", emphasis: ["三分之一", "没动力"],   voiceSec: 4.43, minDur: 4.8, style: "Step", stepLabel: { en: "STEP 5", cn: "加入水" }, illustration: "illustrations/06_water.png" },
  { key: "07_pump",      text: "瓶子倒扣在发射架上，充气大约六个大气压。",         emphasis: ["六个大气压", "安全线"],  voiceSec: 3.81, minDur: 4.6, style: "Step", stepLabel: { en: "STEP 6", cn: "开始充气" }, illustration: "illustrations/07_pump.png" },
  { key: "08_count3",    text: "三！",                                          emphasis: ["三"],                  voiceSec: 0.69, minDur: 1.4, style: "Counter", counterNumber: "3", illustration: "illustrations/08_countdown.png" },
  { key: "09_count2",    text: "二！",                                          emphasis: ["二"],                  voiceSec: 0.61, minDur: 1.4, style: "Counter", counterNumber: "2", illustration: "illustrations/08_countdown.png" },
  { key: "10_count1",    text: "一！",                                          emphasis: ["一"],                  voiceSec: 0.56, minDur: 1.4, style: "Counter", counterNumber: "1", illustration: "illustrations/08_countdown.png" },
  { key: "11_launch",    text: "水火箭腾空而起！作用力与反作用力！",                emphasis: ["腾空而起", "作用力"],   voiceSec: 3.65, minDur: 5.0, style: "Caption", useRealVideo: true, videoSrc: "pexels/7106862_actual_launch_vertical.mp4" },
  { key: "12_success",   text: "全班同学瞬间炸锅鼓掌！",                          emphasis: ["全班", "鼓掌"],        voiceSec: 2.61, minDur: 4.5, style: "Caption", useRealVideo: true, videoSrc: "pexels/7106839_success_run.mp4" },
  { key: "13_endcard",   text: "全程没花一分钱，点赞收藏，跟着我下期做更酷的实验。", emphasis: ["点赞收藏", "更酷的实验"], voiceSec: 5.21, minDur: 5.8, style: "End", illustration: "illustrations/08_countdown.png" },
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

