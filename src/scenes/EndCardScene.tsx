import React from "react";
import { interpolate, useCurrentFrame, spring, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { Caption } from "../components/Caption";

// EndCardScene: rocket illustration background + 3 lines of yellow text stagger-fade in.
export const EndCardScene: React.FC<{ text: string; emphasis: string[] }> = ({ text, emphasis }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 150], [1.05, 1.0]);
  const lines = [
    { text: "点赞收藏", delay: 6, color: "#FFD400", size: 100 },
    { text: "全程没花一分钱", delay: 22, color: "#FFFFFF", size: 80 },
    { text: "下期做更酷的实验", delay: 40, color: "#FFFFFF", size: 70 },
  ];
  return (
    <Stage bg="#0f1018">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent 0 22px, rgba(255,80,0,0.15) 22px 26px)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={staticFile("illustrations/08_countdown.png")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.65 }}
        />
      </div>

      {/* Big stacked text */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 950,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        {lines.map((l, i) => {
          const s = spring({ frame: f - l.delay, fps, config: { damping: 12, stiffness: 130, mass: 0.6 } });
          const y = interpolate(s, [0, 1], [40, 0]);
          const op = interpolate(s, [0, 1], [0, 1]);
          return (
            <div
              key={i}
              style={{
                fontSize: l.size,
                color: l.color,
                fontWeight: 900,
                textShadow: "0 6px 0 rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.5)",
                WebkitTextStroke: l.color === "#FFD400" ? "3px #B81F1F" : "0",
                opacity: op,
                transform: `translateY(${y}px)`,
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>

      {/* Subtle top caption (kept small, lower priority than the stacked text) */}
      <Caption text="更酷的实验，等你来看" emphasis={["更酷"]} bottom={140} fadeIn={20} size={50} color="#FFD400" />
    </Stage>
  );
};

