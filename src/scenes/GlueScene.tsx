import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// GlueScene: animated glue bottle pours liquid onto foam joint. Foam pieces snap together with shimmer.
export const GlueScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string; illustration: string }> = ({ text, emphasis, stepEn, stepCn, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // 0-25: glue bottle tilts and pours
  const bottleTilt = interpolate(f, [5, 30], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const bottleX = interpolate(f, [0, 30], [800, 540], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 30-50: liquid drop animation
  const liquidStream = interpolate(f, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 50-100: foam pieces come together
  const bondProgress = interpolate(f, [50, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const leftPartX = interpolate(bondProgress, [0, 1], [-200, 0]);
  const rightPartX = interpolate(bondProgress, [0, 1], [200, 0]);

  // Shimmer at bond point
  const shimmerOp = interpolate(f, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shimmerScale = interpolate(f, [100, 130], [0.5, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Droplets flying out
  const droplets = [];
  for (let i = 0; i < 5; i++) {
    const phase = (f - 30) * 0.12 + i;
    const dx = Math.cos(phase + i) * (10 + (f - 30) * 4);
    const dy = -((f - 30) * 3) + Math.sin(phase + i) * 5;
    const op = interpolate(f, [30 + i * 3, 30 + i * 3 + 5, 60], [0, 0.8, 0]);
    if (f > 30) {
      droplets.push(<div key={i} style={{ position: "absolute", left: 540 + dx, top: 900 + dy, width: 6, height: 6, borderRadius: "50%", background: "#FFE0B5", opacity: op }} />);
    }
  }

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </div>

      {/* Left foam piece slides in */}
      <div style={{
        position: "absolute",
        left: leftPartX,
        top: 700,
        width: 280, height: 360,
        background: "linear-gradient(135deg, #F0F0F0, #D8D8D8)",
        border: "4px solid #888",
        borderRadius: 12,
      }} />
      {/* Right foam piece slides in */}
      <div style={{
        position: "absolute",
        right: -rightPartX,
        top: 700,
        width: 280, height: 360,
        background: "linear-gradient(135deg, #F0F0F0, #D8D8D8)",
        border: "4px solid #888",
        borderRadius: 12,
      }} />
      {/* Bond line glow */}
      {bondProgress > 0.3 && (
        <div style={{
          position: "absolute", left: 540 - 60, top: 700,
          width: 120, height: 360,
          background: "linear-gradient(90deg, transparent, rgba(255,212,0,0.6), transparent)",
          opacity: shimmerOp,
        }} />
      )}

      {/* StepLabel disabled (banner already in illustration) */}

      {/* Glue bottle */}
      <div style={{
        position: "absolute",
        left: bottleX - 100, top: 700,
        transform: `rotate(${bottleTilt}deg)`,
        zIndex: 5,
      }}>
        <svg width="200" height="280" viewBox="0 0 200 280">
          <rect x="50" y="0" width="100" height="40" fill="#888" />
          <polygon points="60,40 140,40 130,60 70,60" fill="#666" />
          <rect x="60" y="60" width="80" height="160" fill="#FFFFFF" stroke="#888" strokeWidth="3" />
          <rect x="65" y="100" width="70" height="40" fill="#E94B3C" />
          <text x="100" y="125" textAnchor="middle" fill="#FFF" fontSize="22" fontWeight="900">胶</text>
          <rect x="85" y="220" width="30" height="20" fill="#FF6B6B" />
          {liquidStream > 0 && (
            <rect x="92" y="240" width="16" height={40 * liquidStream} fill="#FFE0B5" opacity="0.9" />
          )}
        </svg>
      </div>

      {droplets}

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};
