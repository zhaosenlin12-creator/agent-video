import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// WireScene: animated electric wires plug into terminals with sparks. Polarity indicator.
export const WireScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string; illustration: string }> = ({ text, emphasis, stepEn, stepCn, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // Wire connector approaches terminal (0-30)
  const wireProgress = interpolate(f, [5, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Plug spark on contact (35)
  const plugSpark = interpolate(f, [35, 38, 50], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wire animation: electric current flowing through (40-130)
  const currentPos = interpolate(f, [40, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 4 wires: red (+), black), (yellow, (signal)
  const wirePaths = [
    { color: "#E94B3C", label: "+", startY: 800, endY: 1100 },
    { color: "#222", label: "-", startY: 850, endY: 1150 },
    { color: "#FFD400", label: "S", startY: 900, endY: 1200 },
    { color: "#3a7", label: "G", startY: 950, endY: 1250 },
  ];

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </div>

      {/* StepLabel disabled (banner already in illustration) */}

      {/* Animated wires with current dots */}
      {wirePaths.map((w, i) => {
        const x1 = 200 + i * 180;
        const x2 = 540 + (i - 1.5) * 100;
        const segs = 16;
        const segIdx = Math.floor(currentPos * segs) % segs;
        return (
          <svg key={i} style={{ position: "absolute", left: 0, top: 0, zIndex: 4 }} width="1080" height="1920">
            {/* Wire path */}
            <path d={`M ${x1} ${w.startY} Q ${x1 + 100} ${(w.startY + w.endY) / 2} ${x2} ${w.endY}`} stroke={w.color} strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Connector at start */}
            <rect x={x1 - 30} y={w.startY - 20} width="60" height="40" fill="#444" rx="6" />
            <rect x={x1 - 22} y={w.startY - 10} width="20" height="20" fill={w.color} />
            <text x={x1} y={w.startY - 30} textAnchor="middle" fill="#FFF" fontSize="22" fontWeight="900">{w.label}</text>
            {/* Terminal at end (ESC side) */}
            <rect x={x2 - 20} y={w.endY - 15} width="40" height="30" fill="#222" rx="4" />
            <circle cx={x2} cy={w.endY} r="6" fill="#FFD400" />
            {/* Current dots along path */}
            {Array.from({ length: 5 }).map((_, j) => {
              const t = (j + segIdx) / segs;
              if (t > currentPos || t < currentPos - 0.15) return null;
              const px = x1 + (x2 - x1) * t + 50 * Math.sin(t * Math.PI) * (i % 2 === 0 ? 1 : -1);
              const py = w.startY + (w.endY - w.startY) * t;
              return <circle key={j} cx={px} cy={py} r="8" fill={w.color} opacity="0.9" />;
            })}
          </svg>
        );
      })}

      {/* Spark on first contact */}
      <div style={{
        position: "absolute",
        left: 540 - 100, top: 1100 - 100,
        width: 200, height: 200,
        background: `radial-gradient(circle, rgba(255,255,255,${plugSpark}) 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 6,
      }} />

      {/* ESC label box */}
      <div style={{
        position: "absolute",
        left: 380, top: 1300,
        width: 320, height: 80,
        background: "#222", border: "4px solid #FFD400",
        borderRadius: 8, color: "#FFF",
        fontSize: 32, fontWeight: 900,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 5,
        opacity: wireProgress,
      }}>
        ESC + 电池
      </div>

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};
