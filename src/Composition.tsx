import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { SCENES, sceneFrameRange } from "./data";
import { AudioLayer } from "./audio";

import { HookScene } from "./scenes/HookScene";
import { StepScene } from "./scenes/StepScene";
import { CountdownScene } from "./scenes/CountdownScene";
import { RealVideoScene } from "./scenes/RealVideoScene";
import { EndCardScene } from "./scenes/EndCardScene";
import { MaterialsScene } from "./scenes/MaterialsScene";
import { DrawScene } from "./scenes/DrawScene";
import { CutScene } from "./scenes/CutScene";
import { GlueScene } from "./scenes/GlueScene";
import { MotorScene } from "./scenes/MotorScene";
import { PropScene } from "./scenes/PropScene";
import { WireScene } from "./scenes/WireScene";
import { BalanceScene } from "./scenes/BalanceScene";
import { LaunchScene } from "./scenes/LaunchScene";

const SceneRenderer: React.FC<{ idx: number }> = ({ idx }) => {
  const s = SCENES[idx];
  const stepProps = {
    text: s.text,
    emphasis: s.emphasis,
    stepEn: s.stepLabel && s.stepLabel.en ? s.stepLabel.en : "",
    stepCn: s.stepLabel && s.stepLabel.cn ? s.stepLabel.cn : "",
    illustration: s.illustration ? s.illustration : "",
  };
  switch (s.sceneType) {
    case "Hook":
      return <HookScene text={s.text} emphasis={s.emphasis} />;
    case "Materials":
      return <MaterialsScene {...stepProps} />;
    case "Draw":
      return <DrawScene {...stepProps} />;
    case "Cut":
      return <CutScene {...stepProps} />;
    case "Glue":
      return <GlueScene {...stepProps} />;
    case "Motor":
      return <MotorScene {...stepProps} />;
    case "Prop":
      return <PropScene {...stepProps} />;
    case "Wire":
      return <WireScene {...stepProps} />;
    case "Balance":
      return <BalanceScene {...stepProps} />;
    case "Launch":
      return <LaunchScene text={s.text} emphasis={s.emphasis} illustration={s.illustration ? s.illustration : ""} />;
    case "Counter":
      return <CountdownScene number={s.counterNumber ? s.counterNumber : ""} />;
    case "RealVideo":
      return <RealVideoScene text={s.text} emphasis={s.emphasis} videoSrc={s.videoSrc ? s.videoSrc : ""} />;
    case "End":
      return <EndCardScene text={s.text} emphasis={s.emphasis} />;
    default:
      return <StepScene {...stepProps} />;
  }
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
