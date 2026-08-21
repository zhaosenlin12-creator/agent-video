import React from "react";
import { interpolate, useCurrentFrame, spring, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { CounterNumber } from "../components/CounterNumber";

export const CountdownScene: React.FC<{ number: string }> = ({ number }) => {
  const f = useCurrentFrame();
  const fps = 30;
  // Number pulse + flash
  const numScale = spring({ frame: f, fps, config: { damping: 8, stiffness: 220, mass: 0.5 } });
  const flash = interpolate(f, [0, 4, 12], [1, 0.7, 0], { extrapolateRight: "clamp" });
  // Subtle screen shake
  const shakeX = f < 12 ? Math.sin(f * 4) * 4 : 0;
  const shakeY = f < 12 ? Math.cos(f * 5) * 4 : 0;
  // Stripes appear fast at start
  const stripeOp = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <Stage bg="#0f1018">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent 0 22px, rgba(255,80,0,0.18) 22px 26px)",
          opacity: stripeOp,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <Img
          src={staticFile("illustrations/11_soaring.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.85,
          }}
        />
      </div>

      {/* Flash overlay on number change */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, rgba(255,255,255," + flash + ") 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Big counter number with scale animation */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${numScale})`,
        }}
      >
        <CounterNumber number={number} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 140,
          textAlign: "center",
          color: "#FFD400",
          fontSize: 64,
          fontWeight: 900,
          opacity: interpolate(f, [10, 22], [0, 1], { extrapolateRight: "clamp" }),
          textShadow: "0 0 12px rgba(255,80,0,0.6), 0 4px 0 rgba(0,0,0,0.5)",
        }}
      >
        准备发射
      </div>
    </Stage>
  );
};

