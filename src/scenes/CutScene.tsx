import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// CutScene: red dashed cut line draws across the bottle, scissors swoop in, then top/bottom halves separate.
export const CutScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string }> = ({ text, emphasis, stepEn, stepCn }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  const lineProgress = interpolate(f, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scissorX = interpolate(f, [30, 60], [-360, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const scissorOp = interpolate(f, [30, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(f, [60, 66, 74], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // After cut: top half lifts, bottom half stays
  const sep = interpolate(f, [70, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topLift = interpolate(sep, [0, 1], [0, -50]);
  const topShake = sep < 0.6 ? Math.sin((f - 70) * 0.6) * 3 : 0;

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile("illustrations/03_cut.png")}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      </div>
      <StepLabel en={stepEn} cn={stepCn} />

      {/* Animated red dashed cut line */}
      <div
        style={{
          position: "absolute",
          left: 240,
          right: 240,
          top: 870,
          height: 6,
          background: "repeating-linear-gradient(to right, #FF2D2D 0 12px, transparent 12px 24px)",
          clipPath: `inset(0 ${(1 - lineProgress) * 100}% 0 0)`,
          transform: "translateY(-3px)",
          boxShadow: "0 0 18px rgba(255, 45, 45, 0.6)",
        }}
      />

      {/* Scissors swoop in from left */}
      <div
        style={{
          position: "absolute",
          left: scissorX,
          top: 760,
          opacity: scissorOp,
          transform: "rotate(-12deg)",
        }}
      >
        <ScissorsSVG />
      </div>

      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(255, 255, 255, ${flash})`,
          pointerEvents: "none",
        }}
      />

      {/* Top bottle half lifts after cut (mask / split visual) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 870,
          background: "#dee9f3",
          opacity: sep,
          transform: `translateY(${-topLift + topShake}px)`
        }}
      />

      {/* "Cut!" badge */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 760,
          fontSize: 100,
          fontWeight: 900,
          color: "#FF3030",
          WebkitTextStroke: "4px #fff",
          textShadow: "0 5px 0 rgba(0,0,0,0.4)",
          opacity: interpolate(f, [62, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `rotate(15deg) scale(${interpolate(f, [62, 75, 90], [1.6, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
        }}
      >
        咔嚓!
      </div>

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};

const ScissorsSVG: React.FC = () => (
  <svg width="220" height="120" viewBox="0 0 220 120">
    <circle cx="30" cy="35" r="20" fill="#ff4040" stroke="#5a0000" strokeWidth="4" />
    <circle cx="30" cy="85" r="20" fill="#ff4040" stroke="#5a0000" strokeWidth="4" />
    <polygon points="40,40 200,40 200,55 60,70" fill="#dadde6" stroke="#222" strokeWidth="3" />
    <polygon points="40,80 200,80 200,65 60,50" fill="#b8bcc8" stroke="#222" strokeWidth="3" />
  </svg>
);

