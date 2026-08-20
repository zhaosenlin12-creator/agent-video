import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// WaterScene: water fills bottle from 0 to 1/3, with bubbles & droplets.
export const WaterScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string }> = ({ text, emphasis, stepEn, stepCn }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // Bottle interior (within 06_water.png rocket body):
  // Body x range roughly 360-720 (cx=540, half width 180).
  // Body y range from top of body (540) down to bottom (1480).
  const waterFill = interpolate(f, [10, 90], [0, 0.33], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bodyTop = 540;
  const bodyBot = 1480;
  const bodyH = bodyBot - bodyTop;
  const waterH = waterFill * bodyH;
  const waterTop = bodyBot - waterH;

  // Bubble animation
  const bubbleOp = interpolate(f, [10, 25, 80, 100], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Pour spout above bottle (water drops in)
  const spoutOp = interpolate(f, [5, 15], [0, 1], { extrapolateRight: "clamp" });
  const dropY = (f * 18) % 220;

  return (
    <Stage bg="#dfeaf2">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile("illustrations/06_water.png")}
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

      {/* Pour spout (transparent jug pouring water) */}
      <div
        style={{
          position: "absolute",
          left: 480,
          top: 320,
          opacity: spoutOp,
          transform: "rotate(20deg)",
        }}
      >
        <div style={{ width: 90, height: 110, background: "rgba(80, 170, 230, 0.6)", border: "4px solid #1d4f7a", borderRadius: 8 }} />
        <div style={{ width: 30, height: 40, background: "rgba(80, 170, 230, 0.6)", border: "4px solid #1d4f7a", marginLeft: 70, marginTop: -10, borderRadius: "0 0 6px 6px" }} />
      </div>

      {/* Falling drops from spout into bottle */}
      <div
        style={{
          position: "absolute",
          left: 580,
          top: 480 + dropY,
          width: 16,
          height: 26,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          background: "rgba(100, 200, 250, 0.85)",
          border: "2px solid #1d4f7a",
          opacity: spoutOp * (dropY < 200 ? 1 : 0),
        }}
      />

      {/* Animated blue water fill */}
      <div
        style={{
          position: "absolute",
          left: 360,
          right: 360,
          top: waterTop,
          height: waterH,
          background: "linear-gradient(180deg, rgba(110, 200, 250, 0.55) 0%, rgba(60, 140, 220, 0.85) 100%)",
          borderTop: "3px solid rgba(255,255,255,0.7)",
          boxShadow: "inset 0 0 24px rgba(255,255,255,0.3)",
        }}
      />

      {/* Water surface highlight */}
      <div
        style={{
          position: "absolute",
          left: 360,
          right: 360,
          top: waterTop,
          height: 6,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          opacity: waterFill > 0 ? 1 : 0,
        }}
      />

      {/* Bubble drops inside water */}
      {Array.from({ length: 8 }).map((_, i) => {
        const phase = ((f * 0.08) + i * 0.6) % 3;
        const bubbleY = interpolate(phase, [0, 1, 2, 3], [bodyBot, bodyBot - waterH * 0.3, bodyBot - waterH * 0.6, waterTop], { extrapolateRight: "clamp" });
        const xOff = Math.sin(phase * 4 + i) * 16;
        const op = bubbleOp * (1 - phase / 3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 460 + xOff + (i % 3) * 60,
              top: bubbleY,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.6)",
              border: "2px solid rgba(120, 200, 255, 0.7)",
              opacity: op,
            }}
          />
        );
      })}

      {/* 1/3 marker */}
      <div
        style={{
          position: "absolute",
          left: 320,
          top: waterTop - 40,
          fontSize: 56,
          fontWeight: 900,
          color: "#FFD400",
          WebkitTextStroke: "3px #B81F1F",
          opacity: interpolate(f, [80, 95], [0, 1], { extrapolateRight: "clamp" }),
          textShadow: "0 4px 0 rgba(0,0,0,0.5)",
        }}
      >
        1/3
      </div>

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};

