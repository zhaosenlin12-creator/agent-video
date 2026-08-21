import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// MotorScene: motor cylinder drops into the foam nose from above, impact sparks.
export const MotorScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string; illustration: string }> = ({ text, emphasis, stepEn, stepCn, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // Motor drops from y=200 to y=900 at frame 30
  const drop = interpolate(f, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const motorY = interpolate(drop, [0, 1], [-200, 0]);
  const motorShake = drop >= 1 ? Math.sin((f - 35) * 0.8) * (4 - (f - 35) * 0.1) : 0;

  // Impact flash + sparks at frame 35
  const impactFlash = Math.min(interpolate(f, [35, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(f, [38, 48], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sparkOp = interpolate(f, [35, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sparks (animated lines radiating outward)
  const sparks = [];
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * 2 * Math.PI;
    const len = 30 + (f - 35) * 4;
    const x1 = 540, y1 = 900;
    const x2 = 540 + Math.cos(ang) * len;
    const y2 = 900 + Math.sin(ang) * len;
    sparks.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD400" strokeWidth="3" opacity={sparkOp} />);
  }

  // Motor rotation animation (after drop)
  const motorRot = interpolate(f, [35, 130], [0, 720]);

  // Screwdriver twisting animation (40-100)
  const screwdriverRot = interpolate(f, [40, 100], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </div>

      {/* StepLabel disabled */}

      {/* Spark SVG overlay */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }} width="1080" height="1920">
        {sparks}
      </svg>

      {/* Motor (cylinder) */}
      <div style={{
        position: "absolute",
        left: 460, top: 700 + motorY + motorShake,
        transform: `rotate(${motorRot}deg)`,
        zIndex: 5,
      }}>
        <svg width="160" height="200" viewBox="0 0 160 200">
          <rect x="20" y="0" width="120" height="180" fill="#444" stroke="#222" strokeWidth="3" rx="6" />
          <rect x="20" y="0" width="120" height="40" fill="#FFD400" />
          <text x="80" y="110" textAnchor="middle" fill="#FFF" fontSize="32" fontWeight="900">M</text>
          <rect x="20" y="180" width="120" height="14" fill="#888" />
          <rect x="60" y="194" width="40" height="10" fill="#666" />
        </svg>
      </div>

      {/* Screwdriver - animated rotation */}
      {f >= 40 && (
        <div style={{
          position: "absolute",
          left: 700, top: 800,
          transform: `rotate(${screwdriverRot}deg)`,
          transformOrigin: "100px 100px",
          zIndex: 6,
        }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <polygon points="0,100 100,80 100,120" fill="#888" />
            <rect x="100" y="85" width="80" height="30" fill="#E94B3C" rx="4" />
          </svg>
        </div>
      )}

      {/* Impact flash */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `rgba(255, 255, 200, ${impactFlash})`,
        pointerEvents: "none",
        zIndex: 7,
      }} />

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};
