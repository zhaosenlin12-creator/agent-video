import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";

export const StepLabel: React.FC<{ en: string; cn: string; delay?: number }> = ({ en, cn, delay = 0 }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - delay);
  const slide = interpolate(t, [0, 18], [60, 0], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const op = interpolate(t, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 70 + slide,
        opacity: op,
        color: "#FFD400",
        fontWeight: 900,
        textShadow: "0 0 10px rgba(0,0,0,0.45), 0 3px 0 rgba(0,0,0,0.55)",
      }}
    >
      <div style={{ fontSize: 70, letterSpacing: 2 }}>{en}</div>
      <div style={{ fontSize: 84, color: "#ffffff", marginTop: 6 }}>{cn}</div>
    </div>
  );
};

