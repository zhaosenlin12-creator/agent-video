import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { SCENES, sceneFrameRange } from "./data";
import { AudioLayer } from "./audio";

import { HookScene } from "./scenes/HookScene";
import { StepScene } from "./scenes/StepScene";
import { CutScene } from "./scenes/CutScene";
import { FinsScene } from "./scenes/FinsScene";
import { NozzleScene } from "./scenes/NozzleScene";
import { WaterScene } from "./scenes/WaterScene";
import { PumpScene } from "./scenes/PumpScene";
import { CountdownScene } from "./scenes/CountdownScene";
import { RealVideoScene } from "./scenes/RealVideoScene";
import { EndCardScene } from "./scenes/EndCardScene";

const SceneRenderer: React.FC<{ idx: number }> = ({ idx }) => {
  const s = SCENES[idx];
  switch (s.style) {
    case "Hook":
      return <HookScene text={s.text} emphasis={s.emphasis} />;
    case "Step":
      if (s.key === "03_cut")
        return <CutScene text={s.text} emphasis={s.emphasis} stepEn={s.stepLabel!.en} stepCn={s.stepLabel!.cn} />;
      if (s.key === "04_fins")
        return <FinsScene text={s.text} emphasis={s.emphasis} stepEn={s.stepLabel!.en} stepCn={s.stepLabel!.cn} />;
      if (s.key === "05_nozzle")
        return <NozzleScene text={s.text} emphasis={s.emphasis} stepEn={s.stepLabel!.en} stepCn={s.stepLabel!.cn} />;
      if (s.key === "06_water")
        return <WaterScene text={s.text} emphasis={s.emphasis} stepEn={s.stepLabel!.en} stepCn={s.stepLabel!.cn} />;
      if (s.key === "07_pump")
        return <PumpScene text={s.text} emphasis={s.emphasis} stepEn={s.stepLabel!.en} stepCn={s.stepLabel!.cn} />;
      return (
        <StepScene
          text={s.text}
          emphasis={s.emphasis}
          stepEn={s.stepLabel!.en}
          stepCn={s.stepLabel!.cn}
          illustration={s.illustration!}
        />
      );
    case "Counter":
      return <CountdownScene number={s.counterNumber!} />;
    case "Caption":
      return <RealVideoScene text={s.text} emphasis={s.emphasis} videoSrc={s.videoSrc!} />;
    case "End":
      return <EndCardScene text={s.text} emphasis={s.emphasis} />;
  }
  return null;
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

