import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// Each labelled material appears in sync with the narrator;
// callouts "fly in" from off-screen, then settle in a grid.
const COORDS: Array<{ x: number; y: number; w: number; h: number; label: string; delay: number; color: string }> = [
  { x: 160, y: 720, w: 230, h: 380, label: "可乐瓶", delay: 0, color: "#a7d6ff" },
  { x: 470, y: 760, w: 220, h: 220, label: "胶带", delay: 14, color: "#f3d34a" },
  { x: 740, y: 760, w: 220, h: 170, label: "剪刀", delay: 28, color: "#dadde6" },
  { x: 530, y: 1020, w: 180, h: 420, label: "打气筒", delay: 42, color: "#ffffff" },
];

export const MaterialsScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string }> = ({ text, emphasis, stepEn, stepCn }) => {
  const f = useCurrentFrame();
  const fps = 30;
  return (
    <Stage bg="#dee9f3">
      <StepLabel en={stepEn} cn={stepCn} delay={0} />
      <WoodBackground />
      {COORDS.map((c, i) => {
        const s = spring({ frame: f - c.delay, fps, config: { damping: 14, stiffness: 130, mass: 0.6 } });
        const y = interpolate(s, [0, 1], [800, c.y]);
        const op = interpolate(s, [0, 1], [0, 1]);
        const rot = interpolate(s, [0, 1], [i % 2 ? -8 : 8, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: y,
              width: c.w,
              height: c.h,
              opacity: op,
              transform: `rotate(${rot}deg)`,
              transformOrigin: "50% 100%",
            }}
          >
            <Bottle color={c.color} label={c.label} />
          </div>
        );
      })}
      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={70} />
    </Stage>
  );
};

const WoodBackground: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      top: 600,
      bottom: 360,
      background: "#8a5a32",
      border: "6px solid #4d2f17",
      borderRadius: 12,
      boxShadow: "inset 0 0 60px rgba(0,0,0,0.35)",
    }}
  />
);

const Bottle: React.FC<{ color: string; label: string }> = ({ color, label }) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: "60%",
          height: "75%",
          background: color,
          border: "4px solid #20324a",
          borderRadius: 12,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "10%",
          right: "10%",
          textAlign: "center",
          fontSize: 38,
          fontWeight: 800,
          color: "#152238",
          background: "#fff",
          border: "3px solid #20324a",
          padding: "4px 8px",
          borderRadius: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
};

