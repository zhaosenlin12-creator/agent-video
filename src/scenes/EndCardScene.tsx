import React from "react";
import { useCurrentFrame, Img, staticFile, interpolate } from "remotion";
import { elementStyle } from "../components/motion";
import { HeartIcon, StarIcon } from "../components/Icons";

// EndCard Scene: 多元素依次弹出 + 下期预告
// 节奏：心形弹出 → 星形弹出 → 大字 → 预览图 → 关注提示
export const EndCardScene: React.FC = () => {
  const f = useCurrentFrame();

  // 装饰圆环背景
  const ring1 = interpolate(f, [0, 30], [0, 360], { extrapolateRight: "clamp" });
  const ring2 = interpolate(f, [10, 40], [0, 360], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0a0c14",
        overflow: "hidden",
        fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
      }}
    >
      {/* 网格背景 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,212,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,212,0,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* 中心光晕 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
          width: 1400,
          height: 1400,
          background: "radial-gradient(circle, rgba(255,212,0,0.18) 0%, transparent 55%)",
        }}
      />

      {/* 装饰圆环 */}
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <circle cx="540" cy="800" r={ring1} stroke="#FFD400" strokeWidth="3" fill="none" opacity={0.4} />
        <circle cx="540" cy="800" r={ring2} stroke="#FF6B00" strokeWidth="2" fill="none" opacity={0.3} />
      </svg>

      {/* 心形图标 - 左侧 */}
      <div
        style={{
          ...elementStyle({ f, delay: 0, entrance: "spring-pop", fromScale: 0.3, duration: 12 }),
          position: "absolute",
          left: 240,
          top: 780,
          width: 220,
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,64,129,0.15)",
          borderRadius: 24,
          border: "3px solid #FF4081",
          boxShadow: "0 0 30px rgba(255,64,129,0.4)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <HeartIcon size={110} />
          <div style={{ fontSize: 60, color: "#FFFFFF", fontWeight: 800 }}>点赞</div>
        </div>
      </div>

      {/* 星形图标 - 右侧 */}
      <div
        style={{
          ...elementStyle({ f, delay: 6, entrance: "spring-pop", fromScale: 0.3, duration: 12 }),
          position: "absolute",
          left: 620,
          top: 780,
          width: 220,
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,212,0,0.15)",
          borderRadius: 24,
          border: "3px solid #FFD400",
          boxShadow: "0 0 30px rgba(255,212,0,0.4)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <StarIcon size={110} color="#FFD400" />
          <div style={{ fontSize: 60, color: "#FFFFFF", fontWeight: 800 }}>收藏</div>
        </div>
      </div>

      {/* 大字：下期更精彩 */}
      <div
        style={{
          ...elementStyle({ f, delay: 18, entrance: "spring-rise", fromY: 80, duration: 14 }),
          position: "absolute",
          left: "50%",
          top: 1080,
          translate: "-50% 0",
          fontSize: 130,
          color: "#FFD400",
          fontWeight: 900,
          textShadow: "0 6px 0 rgba(0,0,0,0.6), 0 0 30px rgba(255,212,0,0.7)",
          WebkitTextStroke: "4px #B81F1F",
          whiteSpace: "nowrap",
        }}
      >
        下期更精彩
      </div>

      {/* 下期预告图 */}
      <div
        style={{
          ...elementStyle({ f, delay: 28, entrance: "axial-flyin", fromX: -800, fromY: 100, duration: 16 }),
          position: "absolute",
          left: "50%",
          top: 1450,
          translate: "-50% -50%",
          width: 540,
          height: 540,
          borderRadius: 24,
          overflow: "hidden",
          border: "4px solid #FFD400",
          boxShadow: "0 0 30px rgba(255,212,0,0.5)",
        }}
      >
        <Img
          src={staticFile("illustrations/13_flash3.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(0,0,0,0.7)",
            padding: "6px 16px",
            borderRadius: 8,
            color: "#FFD400",
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          NEXT
        </div>
      </div>

      {/* 关注提示 */}
      <div
        style={{
          ...elementStyle({ f, delay: 50, entrance: "spring-pop", fromScale: 0.5, duration: 12 }),
          position: "absolute",
          left: "50%",
          top: 1750,
          translate: "-50% 0",
          fontSize: 80,
          color: "#FFD400",
          fontWeight: 900,
          padding: "16px 32px",
          background: "rgba(15,16,24,0.9)",
          borderRadius: 16,
          border: "3px solid #FFD400",
          textShadow: "0 4px 0 rgba(0,0,0,0.6)",
        }}
      >
        关注我 · 不错过
      </div>
    </div>
  );
};
