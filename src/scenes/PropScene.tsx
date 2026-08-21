import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// PropScene: propeller attaches to motor shaft with snap, then spins up to high RPM.
export const PropScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string; illustration: string }> = ({ text, emphasis, stepEn, stepCn, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // Prop approaches motor (10-30), snaps on at 30
  const dropProgress = interpolate(f, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const propY = interpolate(dropProgress, [0, 1], [-300, 0]);

  // Snap impact flash at frame 30
  const snapFlash = interpolate(f, [30, 33, 43], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Spin-up rotation (starts slow, accelerates)
  const baseRot = 0;
  const spinUp = interpolate(f, [30, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const rotPerFrame = spinUp * 40;
  const accumRot = (f - 30) * rotPerFrame;

  // Motion blur effect (faint semi-transparent copies)
  const blurOp = spinUp * 0.3;

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </div>

      {/* StepLabel disabled (banner already in illustration) */}

      {/* Motion blur copies */}
      {[0, 30, 60].map((rotOff, i) => (
        <div key={i} style={{
          position: "absolute",
          left: 540 - 220, top: 880 + propY,
          width: 440, height: 60,
          transform: `rotate(${accumRot + rotOff}deg)`,
          transformOrigin: "220px 30px",
          opacity: blurOp,
        }}>
          <svg width="440" height="60" viewBox="0 0 440 60">
            <ellipse cx="220" cy="30" rx="180" ry="14" fill="#888" />
            <ellipse cx="220" cy="30" rx="14" ry="14" fill="#444" />
          </svg>
        </div>
      ))}

      {/* Main propeller */}
      <div style={{
        position: "absolute",
        left: 540 - 220, top: 880 + propY,
        width: 440, height: 60,
        transform: `rotate(${accumRot}deg)`,
        transformOrigin: "220px 30px",
        zIndex: 5,
      }}>
        <svg width="440" height="60" viewBox="0 0 440 60">
          <ellipse cx="220" cy="30" rx="180" ry="14" fill="#444" stroke="#222" strokeWidth="3" />
          <ellipse cx="220" cy="30" rx="14" ry="14" fill="#FFD400" stroke="#222" strokeWidth="3" />
          <circle cx="220" cy="30" r="4" fill="#222" />
        </svg>
      </div>

      {/* Snap flash */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `rgba(255, 255, 255, ${snapFlash})`,
        pointerEvents: "none",
        zIndex: 6,
      }} />

      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};
