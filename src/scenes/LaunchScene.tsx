import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { CounterNumber } from "../components/CounterNumber";
import { Caption } from "../components/Caption";

// LaunchScene: dramatic 3-2-1 countdown with shockwave, then plane launches with flame trail.
export const LaunchScene: React.FC<{ text: string; emphasis: string[]; illustration: string }> = ({ text, emphasis, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;

  // Count phase: 0-20=3, 20-40=2, 40-60=1, 60+ = LAUNCH!
  let number = "3";
  if (f >= 20 && f < 40) number = "2";
  else if (f >= 40 && f < 60) number = "1";
  else if (f >= 60) number = "馃殌";

  // Number bounce
  const numScale = spring({ frame: f % 20, fps, config: { damping: 8, stiffness: 220, mass: 0.5 } });

  // Shockwave ring at each transition
  const shockwave = interpolate(f % 20, [0, 4, 12], [0, 1, 1.4], { extrapolateRight: "clamp" });
  const shockOp = interpolate(f % 20, [0, 2, 12], [0, 1, 0], { extrapolateRight: "clamp" });

  // Final launch flash + shake
  const launchFlash = interpolate(f, [60, 62, 75], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shakeX = f >= 60 && f < 80 ? Math.sin(f * 4) * 6 : 0;
  const shakeY = f >= 60 && f < 80 ? Math.cos(f * 5) * 6 : 0;

  // Plane launching upward
  const planeY = f >= 60 ? interpolate(f, [60, 130], [0, -800], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // Flame trail
  const flameOp = f >= 60 ? 1 : 0;

  return (
    <Stage bg="#0a0a14">
      {/* Diagonal speed lines background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(45deg, transparent 0 60px, rgba(255,80,0,0.12) 60px 64px)",
      }} />

      {/* Background illustration */}
      <div style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
      </div>


      {/* Shockwave ring */}
      <div style={{
        position: "absolute",
        left: 540 - shockwave * 300,
        top: 900 - shockwave * 300,
        width: shockwave * 600,
        height: shockwave * 600,
        border: "8px solid #FFD400",
        borderRadius: "50%",
        opacity: shockOp,
        pointerEvents: "none",
      }} />

      {/* Big counter number */}
      {f < 60 && (
        <div style={{
          position: "absolute",
          left: 0, right: 0, top: 700,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${numScale})`,
        }}>
          <div style={{ color: "#FFD400", fontSize: 400, fontWeight: 900, textShadow: "0 0 30px #FF2D2D, 0 8px 0 #000", WebkitTextStroke: "8px #000" }}>
            {number}
          </div>
        </div>
      )}

      {/* Final launch text */}
      {f >= 60 && (
        <div style={{
          position: "absolute",
          left: 0, right: 0, top: 800,
          textAlign: "center",
          color: "#FFD400",
          fontSize: 200, fontWeight: 900,
          textShadow: "0 0 40px #FF2D2D, 0 8px 0 #000",
          WebkitTextStroke: "8px #000",
          transform: `scale(${numScale})`,
        }}>
          馃殌
        </div>
      )}

      {/* Launch flash */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `rgba(255, 255, 255, ${launchFlash})`,
        pointerEvents: "none",
        zIndex: 8,
      }} />

      <Caption text={text} emphasis={emphasis} bottom={140} fadeIn={8} size={64} />
    </Stage>
  );
};

