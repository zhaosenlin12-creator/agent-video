// All scene data for the "一节课搓架航模" video.
// 13 scenes: 1 Hook + 8 build steps + 1 countdown + 2 real flight + 1 End card.
// Durations use voiceSec from edge-tts + 0.4s padding, min 4.5s for steps.

export type SceneKey =
  | "01_hook"
  | "02_materials"
  | "03_draw"
  | "04_cut"
  | "05_glue"
  | "06_motor"
  | "07_prop"
  | "08_wire"
  | "09_balance"
  | "10_countdown"
  | "11_takeoff"
  | "12_soaring"
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
  sceneType?: string; // dispatches to specific scene component
}

export const SCENES: SceneDef[] = [
  { key: "01_hook",        text: "一节课搓架航模，全班直接炸了！",                                          emphasis: ["一节课", "搓架航模", "全班炸了"],                voiceSec: 3.31, minDur: 4.0, style: "Hook",    illustration: "illustrations/01_hook.png",         sceneType: "Hook" },

  { key: "02_materials",   text: "一张泡沫板、一个电机、一片螺旋桨、一块电池、一瓶胶水、一把刻刀。",         emphasis: ["泡沫板", "电机", "螺旋桨", "电池", "胶水", "刻刀"], voiceSec: 6.91, minDur: 5.5, style: "Step", stepLabel: { en: "STEP 1", cn: "准备材料" }, illustration: "illustrations/02_materials.png",  sceneType: "Materials" },
  { key: "03_draw",        text: "第二步，在泡沫板上画出机翼、机身、尾翼的轮廓。",                              emphasis: ["画轮廓", "机翼、机身、尾翼"],                    voiceSec: 5.14, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 2", cn: "画设计图" }, illustration: "illustrations/03_draw.png",       sceneType: "Draw" },
  { key: "04_cut",         text: "第三步，刻刀沿线切开，泡沫板一分为二。",                                    emphasis: ["刻刀切开", "一分为二"],                          voiceSec: 4.30, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 3", cn: "切割机翼" }, illustration: "illustrations/04_cut.png",        sceneType: "Cut" },
  { key: "05_glue",        text: "第四步，胶水涂抹接缝，机翼和机身粘成一体。",                                emphasis: ["胶水粘合", "粘成一体"],                          voiceSec: 4.80, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 4", cn: "粘合机身" }, illustration: "illustrations/05_glue.png",       sceneType: "Glue" },
  { key: "06_motor",       text: "第五步，电机卡进机头，拧紧螺丝，固定死。",                                 emphasis: ["电机卡进机头", "拧紧螺丝"],                      voiceSec: 4.68, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 5", cn: "安装电机" }, illustration: "illustrations/06_motor.png",      sceneType: "Motor" },
  { key: "07_prop",        text: "第六步，螺旋桨卡到电机轴上，顺时针锁紧。",                                 emphasis: ["螺旋桨锁紧", "顺时针"],                          voiceSec: 4.66, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 6", cn: "装螺旋桨" }, illustration: "illustrations/07_prop.png",       sceneType: "Prop" },
  { key: "08_wire",        text: "第七步，电调和电池接好，正负极千万别接反。",                                emphasis: ["正负极", "千万别接反"],                          voiceSec: 4.80, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 7", cn: "接电调电池" }, illustration: "illustrations/08_wire.png",     sceneType: "Wire" },
  { key: "09_balance",     text: "第八步，调整重心，机翼微微上扬，飞机就稳了。",                              emphasis: ["调整重心", "微微上扬"],                          voiceSec: 4.80, minDur: 5.0, style: "Step", stepLabel: { en: "STEP 8", cn: "重心调试" }, illustration: "illustrations/09_balance.png",   sceneType: "Balance" },

  { key: "10_countdown",   text: "三、二、一，发射！",                                                        emphasis: ["三、二、一", "发射"],                            voiceSec: 2.66, minDur: 3.0, style: "Counter", illustration: "illustrations/10_launch.png",      sceneType: "Launch" },

  { key: "11_takeoff",     text: "模型飞机呼啸升空，整节课彻底燃起来了！",                                  emphasis: ["呼啸升空", "燃起来了"],                          voiceSec: 4.10, minDur: 5.5, style: "Caption", useRealVideo: true, videoSrc: "pexels/airport_takeoff.mp4", sceneType: "RealVideo" },
  { key: "12_soaring",     text: "高空俯瞰，全班都在欢呼，评论区告诉我你的下一架航模。",                    emphasis: ["高空俯瞰", "评论区告诉我"],                      voiceSec: 5.40, minDur: 5.5, style: "Caption", useRealVideo: true, videoSrc: "pexels/drone_view1.mp4", sceneType: "RealVideo" },

  { key: "13_endcard",     text: "点赞收藏，跟着我下期教你做更大、更远的遥控航模！",                          emphasis: ["点赞收藏", "遥控航模"],                          voiceSec: 5.16, minDur: 5.5, style: "End", illustration: "illustrations/13_endcard.png", sceneType: "End" },
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
