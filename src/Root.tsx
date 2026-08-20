import React from "react";
import { Composition as RemotionComposition } from "remotion";
import { Composition } from "./Composition";
import { FPS, totalFrames, SCENES } from "./data";

export const Root: React.FC = () => {
  return (
    <RemotionComposition
      id="WaterRocketDouyin"
      component={Composition}
      durationInFrames={totalFrames()}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

