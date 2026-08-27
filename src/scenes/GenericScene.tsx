import React from "react";
import type { SceneDef } from "../data";
import { StepScene } from "./StepScene";
import {
  PrintOverlay,
  LayerOverlay,
  ServoOverlay,
  CodeOverlay,
  PowerOverlay,
  DemoOverlay,
  RoarOverlay,
  SliceOverlay,
  RemoveOverlay,
} from "../components/SceneOverlays";

// Map sceneType → overlay
const getOverlay = (sceneType: string | undefined): React.FC<{ f: number }> | undefined => {
  switch (sceneType) {
    case "Print": return PrintOverlay;
    case "Layer": return LayerOverlay;
    case "Servo": return ServoOverlay;
    case "Code": return CodeOverlay;
    case "Power": return PowerOverlay;
    case "Demo": return DemoOverlay;
    case "Roar": return RoarOverlay;
    case "Slice": return SliceOverlay;
    case "Remove": return RemoveOverlay;
    default: return undefined;
  }
};

// 全屏场景背景映射：每个 sceneType 对应一张新生成的空场景背景
const getSceneBackground = (sceneType: string | undefined): string | undefined => {
  switch (sceneType) {
    case "Hook": return "bg_01_hook";
    case "Materials": return "bg_02_materials";
    case "Model": return "bg_03_model";
    case "Slice": return "bg_04_slice";
    case "Print": return "bg_05_print";
    case "Layer": return "bg_06_layer";
    case "Remove": return "bg_07_remove";
    case "Servo": return "bg_08_servo";
    case "Code": return "bg_09_code";
    case "Power": return "bg_10_power";
    case "Demo": return "bg_11_demo";
    case "Roar": return "bg_12_roar";
    case "End": return "bg_13_endcard";
    default: return undefined;
  }
};

// 通用场景渲染器：从 SceneDef 派发
// v8: 不再传 backgroundImage（角落点缀），完全靠 sceneBackground + 透明角色 + Remotion 动画
export const GenericScene: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const overlay = getOverlay(scene.sceneType);
  const sceneBg = getSceneBackground(scene.sceneType);

  const filtered = scene.elements.filter((el) => el.kind !== "line");
  const captionEl = filtered.find(
    (el) => el.kind === "label" && !el.highlight && (el.textSize || 0) < 80
  );
  const caption = captionEl?.text || scene.text;
  const captionEmphasis = scene.emphasis;
  const captionDelay = captionEl?.delay ?? 8;

  const elements = captionEl
    ? filtered.filter((el) => el !== captionEl)
    : filtered;

  return (
    <StepScene
      elements={elements}
      caption={caption}
      captionEmphasis={captionEmphasis}
      captionDelay={captionDelay}
      captionSize={captionEl?.textSize || 64}
      sceneBackground={sceneBg}
      Overlay={overlay}
    />
  );
};