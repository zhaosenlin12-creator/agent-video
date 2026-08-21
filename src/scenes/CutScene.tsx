import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// CutScene: foam board splits. Knife SVG swooshes in, dashed cut line draws across,
// then the top half lifts away with foam dust particles.
export const CutScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string; illustration: string }> = ({ text, emphasis, stepEn, stepCn, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // 0-15: dashed line draws
  const lineProgress = interpolate(f, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 15-45: knife swooshes across
  const knifeX = interpolate(f, [15, 50], [-300, 1100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const knifeOp = interpolate(f, [15, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 45-50: flash
  const flash = interpolate(f, [48, 54, 64], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 50-110: top half lifts away
  const sep = interpolate(f, [55, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topLift = interpolate(sep, [0, 1], [0, -120]);
  const topShake = sep < 0.7 ? Math.sin((f - 55) * 0.5) * 4 : 0;

  // Foam dust particles
  const dust = [];
  for (let i = 0; i < 10; i++) {
    const phase = (f - 55) * 0.1 + i * 0.6;
    const dx = Math.cos(phase + i) * (5 + sep * 80);
    const dy = Math.sin(phase + i * 1.3) * (10 + sep * 60) - sep * 40;
    const op = interpolate(sep, [0, 0.3, 1], [0, 0.7, 0]);
    dust.push(<div key={i} style={{ position: "absolute", left: 380 + dx + i * 30, top: 900 + dy, width: 8, height: 8, borderRadius: "50%", background: "#F5F5F5", opacity: op, boxShadow: "0 0 4px #fff" }} />);
  }

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </div>

      {/* Top half lifts after cut - use clipPath to show lifted region */}
      <div style={{
        position: "absolute",
        left: 0, top: topLift + topShake, right: 0, height: 540,
        overflow: "hidden",
        background: "linear-gradient(180deg, rgba(255,255,255,0.5), transparent)",
        opacity: 0.4,
      }} />

      {/* StepLabel disabled (banner already in illustration) */}

      {/* Animated red dashed cut line */}
      <div style={{
        position: "absolute",
        left: 100,
        right: 100,
        top: 900,
        height: 8,
        background: "repeating-linear-gradient(to right, #FF2D2D 0 14px, transparent 14px 28px)",
        clipPath: `inset(0 ${(1 - lineProgress) * 100}% 0 0)`,
        transform: "translateY(-4px)",
        boxShadow: "0 0 22px rgba(255, 45, 45, 0.7)",
        zIndex: 4,
      }} />

      {/* Knife SVG swooshes in */}
      <div style={{
        position: "absolute",
        left: knifeX,
        top: 820,
        opacity: knifeOp,
        transform: "rotate(-15deg)",
        zIndex: 5,
      }}>
        <svg width="280" height="120" viewBox="0 0 280 120">
          <polygon points="0,60 160,40 160,80" fill="#C0C0C0" stroke="#888" strokeWidth="3" />
          <polygon points="0,60 20,55 20,65" fill="#888" />
          <rect x="160" y="40" width="100" height="40" fill="#8B4513" rx="6" />
          <rect x="180" y="50" width="60" height="6" fill="#A0522D" />
          <rect x="180" y="64" width="60" height="6" fill="#A0522D" />
        </svg>
      </div>

      {/* Flash */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `rgba(255, 255, 255, ${flash})`,
        pointerEvents: "none",
        zIndex: 6,
      }} />

      {dust}

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};
