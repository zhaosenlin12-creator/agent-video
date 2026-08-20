import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// NozzleScene: nozzle part drops onto the bottle opening, then warning pulse.
export const NozzleScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string }> = ({ text, emphasis, stepEn, stepCn }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // Nozzle drops from top
  const s1 = spring({ frame: f - 6, fps, config: { damping: 12, stiffness: 110, mass: 0.6 } });
  const nozzleY = interpolate(s1, [0, 1], [-200, 0]);
  const nozzleX = interpolate(s1, [0, 1], [-100, 0]);
  const nozzleOp = interpolate(s1, [0, 1], [0, 1]);

  // Tape wraps
  const s2 = spring({ frame: f - 40, fps, config: { damping: 12, stiffness: 110, mass: 0.6 } });
  const tapeP = interpolate(s2, [0, 1], [0, 1]);

  // Twisting motion after wrap
  const twist = interpolate(f, [70, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Warning pulse
  const warnOp = interpolate(f, [85, 95, 105, 115, 125], [0, 1, 0.3, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage bg="#cfe2f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile("illustrations/05_nozzle.png")}
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

      {/* Animated nozzle overlay dropping in */}
      <div
        style={{
          position: "absolute",
          left: 460 + nozzleX,
          top: 460 + nozzleY,
          opacity: nozzleOp,
          transform: `rotate(${twist * 15}deg)`,
        }}
      >
        <div style={{ width: 160, height: 80, background: "linear-gradient(180deg, #555 0%, #222 100%)", border: "4px solid #000", borderRadius: "12px 12px 8px 8px" }} />
        <div style={{ width: 110, height: 35, background: "#999", border: "4px solid #000", borderRadius: 6, marginLeft: 25, marginTop: -8 }} />
      </div>

      {/* Tape wrap */}
      <div
        style={{
          position: "absolute",
          left: 440,
          right: 440,
          top: 470,
          height: 30,
          background: "linear-gradient(90deg, #ffe066 0%, #ffd400 50%, #ffe066 100%)",
          border: "3px solid #8a6010",
          borderRadius: 4,
          opacity: tapeP,
          transform: `scaleX(${tapeP})`,
          transformOrigin: "left center",
          boxShadow: "0 0 18px rgba(255,212,0,0.6)",
        }}
      />

      {/* Warning pulse */}
      <div
        style={{
          position: "absolute",
          left: 130,
          right: 130,
          bottom: 280,
          height: 90,
          background: "#ff3030",
          border: "5px solid #fff",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 900,
          fontSize: 56,
          textShadow: "0 4px 0 rgba(0,0,0,0.4)",
          opacity: warnOp,
          boxShadow: "0 0 32px rgba(255,80,80,0.7)",
        }}
      >
        千万别漏气！
      </div>

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};

