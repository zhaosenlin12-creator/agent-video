import React from "react";
import { useCurrentFrame } from "remotion";
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

// Map sceneType → backgroundImage (用于各场景的浅背景 AI 图)
const getBackgroundImage = (sceneType: string | undefined): string | undefined => {
  switch (sceneType) {
    case "Materials": return "illustrations/02_materials.png";
    case "Model": return "illustrations/03_model.png";
    case "Slice": return "illustrations/04_slice.png";
    case "Print": return "illustrations/05_print.png";
    case "Layer": return "illustrations/06_layer.png";
    case "Remove": return "illustrations/07_remove.png";
    case "Servo": return "illustrations/08_servo.png";
    case "Code": return "illustrations/09_code.png";
    case "Power": return "illustrations/10_power.png";
    case "Demo": return "illustrations/11_demo.png";
    case "Roar": return "illustrations/12_roar.png";
    default: return undefined;
  }
};

// 通用场景渲染器：从 SceneDef 派发
export const GenericScene: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const overlay = getOverlay(scene.sceneType);
  const bgImg = getBackgroundImage(scene.sceneType);

  // 把 line 元素过滤掉（这些由 Overlay 渲染），保留其它元素
  const filtered = scene.elements.filter((el) => el.kind !== "line");

  // 找到 caption 元素（label 类型的，无 highlight，textSize < 80）
  const captionEl = filtered.find((el) => el.kind === "label" && !el.highlight && (el.textSize || 0) < 80);
  const caption = captionEl?.text || scene.text;
  const captionEmphasis = scene.emphasis;
  const captionDelay = captionEl?.delay ?? 8;

  // 把 captionEl 从 elements 中过滤掉，避免双重渲染（caption 由 StepScene 统一渲染）
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
      backgroundImage={bgImg}
      backgroundOpacity={0.12}
      Overlay={overlay}
    />
  );
};