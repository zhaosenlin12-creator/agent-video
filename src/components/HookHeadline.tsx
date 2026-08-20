import React from "react";
import { interpolate, useCurrentFrame, spring, Easing } from "remotion";

// Headline text with stagger per character.
export const HookHeadline: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const fps = 30;
  // 6 chars: "塑料瓶也能飞上天！"
  const chars = Array.from(text);
  return (
    <div
      style={{
        position: "absolute",
        top: 180,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
      }}
    >
      {chars.map((c, i) => {
        const s = spring({ frame: f - i * 3, fps, config: { damping: 14, stiffness: 180, mass: 0.4 } });
        const y = interpolate(s, [0, 1], [120, 0]);
        const op = interpolate(s, [0, 1], [0, 1]);
        return (
          <span
            key={i}
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#FFFFFF",
              WebkitTextStroke: "3px #B81F1F",
              textShadow: "0 8px 0 rgba(0,0,0,0.45)",
              transform: `translateY(${y}px)`,
              opacity: op,
              display: "inline-block",
            }}
          >
            {c}
          </span>
        );
      })}
    </div>
  );
};

