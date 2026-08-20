import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export const Caption: React.FC<{
  text: string;
  emphasis?: string[];
  color?: string;
  highlight?: string;
  size?: number;
  bottom?: number;
  fadeIn?: number;
  fontWeight?: number;
  align?: "center" | "left";
}> = ({ text, emphasis = [], color = "#ffffff", highlight = "#FFD400", size = 78, bottom = 200, fadeIn = 18, fontWeight = 900, align = "center" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" });
  // Split text on emphasis keywords so we can colour each independently.
  const tokens: React.ReactNode[] = [];
  let rest = text;
  emphasis.forEach((kw) => {
    const i = rest.indexOf(kw);
    if (i < 0) return;
    if (i > 0) tokens.push(rest.slice(0, i));
    tokens.push(<span key={kw} style={{ color: highlight, textShadow: "0 0 12px rgba(255,212,0,0.5)" }}>{kw}</span>);
    rest = rest.slice(i + kw.length);
  });
  if (rest) tokens.push(rest);

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom,
        textAlign: align,
        opacity,
        fontSize: size,
        fontWeight,
        color,
        lineHeight: 1.25,
        textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.45)",
        whiteSpace: "pre-wrap",
      }}
    >
      {tokens}
    </div>
  );
};

