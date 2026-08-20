import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { HookHeadline } from "../components/HookHeadline";
import { Caption } from "../components/Caption";

const W = 1080;
const H = 1920;

export const HookScene: React.FC<{ text: string; emphasis: string[] }> = ({ text, emphasis }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 150], [1.0, 1.15]);
  const y = interpolate(f, [0, 150], [0, -80]);

  // Twinkling stars overlay
  const stars = Array.from({ length: 22 });

  // Color overlay flash at start
  const flash = interpolate(f, [0, 8, 18], [1, 0.4, 0], { extrapolateRight: "clamp" });

  return (
    <Stage bg="#0f1018">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile("illustrations/01_hook.png")}
          style={{
            position: "absolute",
            left: 0,
            top: y,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        />
      </div>

      {/* Color flash overlay (yellow/orange like fireworks) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, rgba(255,212,0,${flash}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Twinkling stars overlay */}
      {stars.map((_, i) => {
        const sx = (i * 137) % (W - 40) + 20;
        const sy = (i * 211) % (H - 80) + 40;
        const tw = 0.4 + Math.abs(Math.sin(f * 0.15 + i)) * 0.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sx,
              top: sy,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#FFD400",
              opacity: tw * 0.7,
              boxShadow: "0 0 12px rgba(255,212,0,0.8)",
            }}
          />
        );
      })}

      <HookHeadline text={text} />
      <Caption text="全班同学都看呆了，点击看完整实验" emphasis={["全班"]} bottom={140} fadeIn={20} size={64} />
    </Stage>
  );
};

