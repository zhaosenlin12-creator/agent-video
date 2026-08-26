import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { SCENES, sceneFrameRange } from "./data";
import { AudioLayer } from "./audio";

import { HookScene } from "./scenes/HookScene";
import { GenericScene } from "./scenes/GenericScene";
import { EndCardScene } from "./scenes/EndCardScene";

const SceneRenderer: React.FC<{ idx: number }> = ({ idx }) => {
  const s = SCENES[idx];

  // Hook 单独处理
  if (s.sceneType === "Hook") {
    return <HookScene />;
  }

  // Endcard 单独处理
  if (s.sceneType === "End") {
    return <EndCardScene />;
  }

  // 其余全部走 GenericScene（基于 elements 数组 + overlay）
  return <GenericScene scene={s} />;
};

export const Composition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AudioLayer />
      {SCENES.map((_, i) => {
        const { start, duration } = sceneFrameRange(i);
        return (
          <Sequence key={i} from={start} durationInFrames={duration}>
            <SceneRenderer idx={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
