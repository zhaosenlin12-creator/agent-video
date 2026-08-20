import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// PumpScene: animated pressure gauge needle sweeps from 0 to 6 atm, handle pumps.
export const PumpScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string }> = ({ text, emphasis, stepEn, stepCn }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  const atm = interpolate(f, [8, 110], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const angle = -120 + (atm / 6) * 240;
  const pumpPhase = Math.sin(f * 0.6) * 14;
  const handleY = interpolate(pumpPhase, [-14, 14], [0, 0]);

  // Pressure number ticker
  const numOp = interpolate(f, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const numScale = interpolate(f, [40, 70], [1.6, 1], { extrapolateRight: "clamp" });

  return (
    <Stage bg="#f1e6c7">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile("illustrations/07_pump.png")}
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

      {/* Animated gauge dial */}
      <div
        style={{
          position: "absolute",
          left: 195,
          top: 1065,
          width: 175,
          height: 175,
          transform: `translateY(${pumpPhase * 0.6}px)`
        }}
      >
        {/* Dial face */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "linear-gradient(180deg, #fff 0%, #e2e2e2 100%)",
            border: "5px solid #333",
            boxShadow: "inset 0 0 24px rgba(0,0,0,0.25)",
          }}
        />
        {/* Tick marks */}
        {Array.from({ length: 7 }).map((_, i) => {
          const ang = -120 + i * 40;
          const rad = (ang * Math.PI) / 180;
          const x1 = 87.5 + Math.cos(rad - Math.PI / 2) * 70;
          const y1 = 87.5 + Math.sin(rad - Math.PI / 2) * 70;
          const x2 = 87.5 + Math.cos(rad - Math.PI / 2) * 80;
          const y2 = 87.5 + Math.sin(rad - Math.PI / 2) * 80;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x1,
                top: y1,
                width: x2 - x1,
                height: y2 - y1,
                background: i >= 5 ? "#B81F1F" : "#333",
                transformOrigin: "0% 50%",
                transform: `rotate(${ang + 90}deg)`,
              }}
            />
          );
        })}
        {/* Needle */}
        <div
          style={{
            position: "absolute",
            left: 87.5,
            top: 87.5,
            width: 6,
            height: 70,
            background: "linear-gradient(180deg, #B81F1F 0%, #ff4040 100%)",
            transformOrigin: "center bottom",
            transform: `translate(-50%, -100%) rotate(${angle}deg)` ,
            boxShadow: "0 0 8px rgba(184,31,31,0.6)",
          }}
        />
        {/* Hub */}
        <div
          style={{
            position: "absolute",
            left: 87.5 - 14,
            top: 87.5 - 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#222",
            border: "4px solid #fff",
          }}
        />
      </div>

      {/* Pump handle animation */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 730,
          transform: `translateY(${pumpPhase}px)`
        }}
      >
        <div style={{ width: 340, height: 28, background: "linear-gradient(180deg, #ff7020 0%, #c04020 100%)", border: "3px solid #402010", borderRadius: 4 }} />
      </div>

      {/* Pressure number */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 400,
          textAlign: "center",
          fontSize: 92,
          fontWeight: 900,
          color: "#B81F1F",
          textShadow: "0 0 14px rgba(255,255,255,0.8), 0 5px 0 rgba(0,0,0,0.4)",
          opacity: numOp,
          transform: `scale(${numScale})`,
        }}
      >
        {atm.toFixed(1)} <span style={{ fontSize: 56, color: "#fff" }}>大气压</span>
      </div>

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};

