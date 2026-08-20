import React from "react";
import { interpolate, useCurrentFrame, Easing, spring } from "remotion";

export const CounterNumber: React.FC<{ number: string }> = ({ number }) => {
  const f = useCurrentFrame();
  const { fps } = { fps: 30 };
  const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 220, mass: 0.5 } });
  const scale = interpolate(s, [0, 1], [3.0, 1.0]);
  const opacity = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  // Quick shake at the end.
  const shake = Math.max(0, f - 18) * (Math.sin(f * 3.7) * 4);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 720,
          fontWeight: 900,
          color: "#FF2D2D",
          WebkitTextStroke: "12px #FFFFFF",
          textShadow: "0 12px 0 rgba(0,0,0,0.5)",
          transform: `scale(${scale}) translateX(${shake}px)`,
          lineHeight: 0.9,
        }}
      >
        {number}
      </div>
    </div>
  );
};

