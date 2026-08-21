import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// DrawScene: animated pencil drawing on foam board. Lines progressively appear
// while a pencil SVG swooshes across the surface.
export const DrawScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string; illustration: string }> = ({ text, emphasis, stepEn, stepCn, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // Pencil motion: across the board, then back, drawing lines
  const px = interpolate(f, [5, 30], [-200, 800], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const py = interpolate(f, [0, 30], [800, 800]);

  // Lines progressively appear (clip-path animation)
  const line1 = interpolate(f, [10, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2 = interpolate(f, [25, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3 = interpolate(f, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line4 = interpolate(f, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pencil swing motion
  const angle = Math.sin(f * 0.25) * 3;

  // Dust particles from pencil tip
  const dust = [];
  for (let i = 0; i < 6; i++) {
    const dx = Math.cos(f * 0.4 + i * 1.1) * 30;
    const dy = Math.sin(f * 0.6 + i * 1.1) * 20;
    const op = interpolate(f, [i * 5, i * 5 + 8, i * 5 + 18], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    dust.push(<div key={i} style={{ position: "absolute", left: 540 + px * 0.5 + dx, top: 880 + dy, width: 4, height: 4, borderRadius: "50%", background: "#888", opacity: op }} />);
  }

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </div>
      {/* StepLabel disabled (banner already in illustration) */}

      {/* Animated pencil */}
      <div style={{ position: "absolute", left: px, top: py, transform: `rotate(${angle - 30}deg)`, zIndex: 5 }}>
        <svg width="220" height="80" viewBox="0 0 220 80">
          <polygon points="0,40 50,30 50,50" fill="#3a2818" />
          <polygon points="0,40 20,35 20,45" fill="#1a1208" />
          <rect x="50" y="28" width="20" height="24" fill="#FFD400" />
          <rect x="70" y="28" width="100" height="24" fill="#E94B3C" />
          <rect x="170" y="28" width="50" height="24" fill="#888" />
          <line x1="50" y1="28" x2="50" y2="52" stroke="#000" strokeWidth="2" />
          <line x1="170" y1="28" x2="170" y2="52" stroke="#000" strokeWidth="2" />
        </svg>
      </div>
      {dust}

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};
