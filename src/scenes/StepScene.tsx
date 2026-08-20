import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// Generic step scene: illustration slowly zooms + pans, step label slides in from left, caption fades in.
export const StepScene: React.FC<{
  text: string;
  emphasis: string[];
  stepEn: string;
  stepCn: string;
  illustration: string;
  overlay?: React.ReactNode;
}> = ({ text, emphasis, stepEn, stepCn, illustration, overlay }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 120], [1.0, 1.06]);
  const y = interpolate(f, [0, 120], [20, -20]);
  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile(illustration)}
          style={{
            position: "absolute",
            left: 0,
            top: y,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            transformOrigin: "center 60%",
          }}
        />
      </div>
      <StepLabel en={stepEn} cn={stepCn} />
      {overlay}
      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};

