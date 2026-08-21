import React from "react";
import { interpolate, useCurrentFrame, spring, Easing, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { StepLabel } from "../components/StepLabel";
import { Caption } from "../components/Caption";

// MaterialsScene: 6 material items pop up one by one with bouncy entrance + name tag.
export const MaterialsScene: React.FC<{ text: string; emphasis: string[]; stepEn: string; stepCn: string; illustration: string }> = ({ text, emphasis, stepEn, stepCn, illustration }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const scale = interpolate(f, [0, 130], [1.0, 1.06]);

  // 6 materials appear one by one (every 12 frames)
  const items = [
    { name: "泡沫板", color: "#F5F5F5", icon: "📦" },
    { name: "电机", color: "#FFD400", icon: "⚙" },
    { name: "螺旋桨", color: "#E94B3C", icon: "✈" },
    { name: "电池", color: "#3a7", icon: "🔋" },
    { name: "胶水", color: "#FFF8E5", icon: "🧴" },
    { name: "刻刀", color: "#C0C0C0", icon: "🔪" },
  ];

  return (
    <Stage bg="#dee9f3">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img src={staticFile(illustration)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }} />
      </div>

      {/* StepLabel disabled (banner already in illustration) */}

      {/* 6 materials grid 2x3 */}
      {items.map((item, i) => {
        const enter = Math.max(0, f - 8 - i * 10);
        const op = interpolate(enter, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const bounce = spring({ frame: enter, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 100 + col * 290;
        const y = 800 + row * 220;
        return (
          <div key={i} style={{
            position: "absolute",
            left: x, top: y,
            width: 240, height: 180,
            background: item.color,
            border: "4px solid #222",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: op,
            transform: `scale(${bounce})`,
            boxShadow: "0 6px 0 rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize: 64, color: "#222" }}>{item.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#222", marginTop: 8 }}>{item.name}</div>
          </div>
        );
      })}

      <Caption text={text} emphasis={emphasis} bottom={160} fadeIn={10} size={56} />
    </Stage>
  );
};
