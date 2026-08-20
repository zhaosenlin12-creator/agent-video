import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// FinsScene: 3 fins fly in from off-screen one by one, then tape wraps around.
export const FinsScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string }> = ({ text, emphasis, stepEn, stepCn }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  const fin = (delay: number, targetX: number, targetY: number, rot: number) => {
    const s = spring({ frame: f - delay, fps, config: { damping: 12, stiffness: 120, mass: 0.5 } });
    const op = interpolate(s, [0, 1], [0, 1]);
    const x = interpolate(s, [0, 1], [targetX + (delay % 2 ? -500 : 500), targetX]);
    const y = interpolate(s, [0, 1], [targetY - 360, targetY]);
    const r = interpolate(s, [0, 1], [rot - 90, rot]);
    const sc = interpolate(s, [0, 1], [0.4, 1]);
    return { op, x, y, r, sc };
  };

  const a = fin(8,  420, 1300, -12);
  const b = fin(28, 540, 1300, 0);
  const c = fin(48, 660, 1300, 12);

  // Tape wrap progress
  const tapeP = interpolate(f, [70, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage bg="#cfe2f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile("illustrations/04_fins.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      </div>
      <StepLabel en={stepEn} cn={stepCn} />

      {[a, b, c].map((it, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: it.x - 70,
            top: it.y,
            width: 140,
            height: 75,
            background: "linear-gradient(180deg, #ff4d4d, #c61c1c)",
            border: "4px solid #5a0000",
            borderRadius: 8,
            opacity: it.op,
            transform: `rotate(${it.r}deg) scale(${it.sc})`,
            boxShadow: "0 0 30px rgba(255,80,80,0.7)",
          }}
        />
      ))}

      {/* Tape wraps horizontally */}
      <div
        style={{
          position: "absolute",
          left: 300,
          right: 300,
          top: 1500,
          height: 36,
          background: "linear-gradient(90deg, #ffe066 0%, #ffd400 50%, #ffe066 100%)",
          border: "3px solid #8a6010",
          borderRadius: 4,
          opacity: tapeP,
          transform: `scaleX(${tapeP})`,
          transformOrigin: "left center",
          boxShadow: "0 0 18px rgba(255,212,0,0.5)",
        }}
      />

      {/* "Done" stamp */}
      <div
        style={{
          position: "absolute",
          right: 100,
          bottom: 280,
          fontSize: 90,
          fontWeight: 900,
          color: "#22aa22",
          WebkitTextStroke: "3px #fff",
          textShadow: "0 4px 0 rgba(0,0,0,0.4)",
          opacity: interpolate(f, [100, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `rotate(-15deg) scale(${interpolate(f, [100, 110], [1.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
        }}
      >
        OK!
      </div>

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};

