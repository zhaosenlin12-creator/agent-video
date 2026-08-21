import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// BalanceScene: weight slides along the plane's CG mark to balance. Plane tilts up slightly.
export const BalanceScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string; illustration: string }> = ({ text, emphasis, stepEn, stepCn, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // Weight oscillates back and forth (10-50), then settles (50-80)
  const weightX = interpolate(f, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                 - interpolate(f, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalX = interpolate(f, [50, 90], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Plane tilt
  const planeAngle = interpolate(f, [10, 60, 100], [-8, 4, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CG indicator (red dot pulsing)
  const cgOp = interpolate(f, [60, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cgScale = 1 + Math.sin(f * 0.2) * 0.3;

  // Check mark appearing
  const checkOp = interpolate(f, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </div>

      {/* StepLabel disabled (banner already in illustration) */}

      {/* Plane silhouette tilting */}
      <div style={{
        position: "absolute",
        left: 200, top: 850,
        width: 700, height: 160,
        transform: `rotate(${planeAngle}deg)`,
        transformOrigin: "550px 80px",
        zIndex: 4,
      }}>
        <svg width="700" height="160" viewBox="0 0 700 160">
          {/* Wings */}
          <polygon points="350,80 700,40 700,120" fill="#E94B3C" stroke="#222" strokeWidth="3" />
          <polygon points="350,80 0,40 0,120" fill="#E94B3C" stroke="#222" strokeWidth="3" />
          {/* Fuselage */}
          <ellipse cx="350" cy="80" rx="320" ry="22" fill="#FFD400" stroke="#222" strokeWidth="3" />
          <ellipse cx="80" cy="80" rx="40" ry="18" fill="#FFD400" stroke="#222" strokeWidth="3" />
          {/* Tail */}
          <polygon points="640,80 700,30 700,80 700,130" fill="#E94B3C" stroke="#222" strokeWidth="3" />
          {/* CG mark */}
          <circle cx="350" cy="80" r="14" fill="rgba(255,75,60,0)" stroke="#FF2D2D" strokeWidth="3" strokeDasharray="6 4" />
          {cgOp > 0.5 && <circle cx="350" cy="80" r="14" fill="#FF2D2D" opacity={cgOp} />}
        </svg>
      </div>

      {/* Sliding weight indicator */}
      <div style={{
        position: "absolute",
        left: 350 - 30 + (finalX + weightX) * 200,
        top: 920,
        zIndex: 5,
      }}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <rect x="0" y="0" width="80" height="40" fill="#444" rx="4" />
          <text x="40" y="28" textAnchor="middle" fill="#FFD400" fontSize="20" fontWeight="900">配重</text>
          <polygon points="20,40 60,40 50,58 30,58" fill="#222" />
        </svg>
      </div>

      {/* Final check mark */}
      {checkOp > 0.3 && (
        <div style={{
          position: "absolute",
          left: 800, top: 880,
          zIndex: 6,
          opacity: checkOp,
        }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="#3a7" />
            <polyline points="30,60 50,80 90,40" stroke="#FFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      )}

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};
