import React from "react";
import { useCurrentFrame, Img, staticFile, interpolate } from "remotion";
import { elementStyle } from "../components/motion";
import type { SceneElement } from "../data";

// Hook Scene: 节奏感 hook，开场视觉冲击
// 设计：纯色背景 + 大字弹性入场 + 恐龙图 axial-flyin + 副标
// 总时长 ~5s = 150f，节奏卡点
export const HookScene: React.FC = () => {
  const f = useCurrentFrame();

  // 主元素按节奏入场
  // 0-15: 大字"一节课打印"弹性入场（spring-rise）
  // 4-19: 大字"只活恐龙" 弹性入场
  // 14-29: 恐龙图 axial-flyin 从右侧飞入
  // 24-39: 副标题"课间直接炸了！" 弹性入场
  // 30-45: 底部提示 渐入
  // 45+: 全部静止 hold

  // 背景缩放呼吸
  const bgScale = interpolate(f, [0, 150], [1.0, 1.06]);

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
      {/* Grid bg */}
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
          top: "55%",
          translate: "-50% -50%",
          width: 1600,
          height: 1600,
          background: "radial-gradient(circle, rgba(255,212,0,0.18) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* 速度辐射线（背景动效） */}
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const r1 = 200;
          const r2 = 900;
          const x1 = 540 + Math.cos(angle) * r1;
          const y1 = 1100 + Math.sin(angle) * r1;
          const x2 = 540 + Math.cos(angle) * r2;
          const y2 = 1100 + Math.sin(angle) * r2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFD400"
              strokeWidth="3"
              strokeDasharray="40 60"
              opacity={0.3}
              style={{
                strokeDashoffset: interpolate(f, [0, 150], [0, -300]),
                transform: `rotate(${interpolate(f, [0, 150], [0, 20])}deg)`,
                transformOrigin: "540px 1100px",
              }}
            />
          );
        })}
      </svg>

      {/* 主标题行 1: 一节课打印 */}
      <div
        style={{
          ...elementStyle({ f, delay: 0, entrance: "spring-rise", fromY: 80, duration: 14 }),
          position: "absolute",
          left: "50%",
          top: 280,
          translate: "-50% 0",
          fontSize: 130,
          color: "#FFD400",
          fontWeight: 900,
          textShadow: "0 6px 0 rgba(0,0,0,0.6), 0 0 30px rgba(255,212,0,0.7)",
          WebkitTextStroke: "4px #B81F1F",
          whiteSpace: "nowrap",
          letterSpacing: "0.08em",
        }}
      >
        一节课打印
      </div>

      {/* 主标题行 2: 只活恐龙 */}
      <div
        style={{
          ...elementStyle({ f, delay: 4, entrance: "spring-rise", fromY: 80, duration: 14 }),
          position: "absolute",
          left: "50%",
          top: 450,
          translate: "-50% 0",
          fontSize: 140,
          color: "#FFD400",
          fontWeight: 900,
          textShadow: "0 6px 0 rgba(0,0,0,0.6), 0 0 40px rgba(255,212,0,0.9)",
          WebkitTextStroke: "4px #B81F1F",
          whiteSpace: "nowrap",
          letterSpacing: "0.08em",
        }}
      >
        只活恐龙
      </div>

      {/* 恐龙图 axial-flyin 从右侧 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1150,
          translate: "-50% -50%",
          width: 800,
          height: 800,
          ...elementStyle({ f, delay: 14, entrance: "axial-flyin", fromX: 1200, fromY: 200, duration: 18 }),
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.5))",
        }}
      >
        <Img
          src={staticFile("illustrations/01_hook.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* 副标题：课间直接炸了！ */}
      <div
        style={{
          ...elementStyle({ f, delay: 24, entrance: "spring-rise", fromY: 60, duration: 14 }),
          position: "absolute",
          left: "50%",
          top: 1620,
          translate: "-50% 0",
          fontSize: 90,
          color: "#FFFFFF",
          fontWeight: 900,
          textShadow: "0 4px 0 rgba(0,0,0,0.6), 0 0 20px rgba(255,212,0,0.5)",
          background: "rgba(15,16,24,0.85)",
          padding: "16px 32px",
          borderRadius: 16,
          borderLeft: "6px solid #FFD400",
        }}
      >
        课间直接炸了！
      </div>

      {/* 底部小提示 */}
      <div
        style={{
          ...elementStyle({ f, delay: 30, entrance: "fade", duration: 14 }),
          position: "absolute",
          left: "50%",
          top: 1820,
          translate: "-50% 0",
          fontSize: 50,
          color: "#FFD400",
          fontWeight: 700,
          textShadow: "0 2px 0 rgba(0,0,0,0.5)",
        }}
      >
        全班同学都看呆了 · 点击看完整实验
      </div>
    </div>
  );
};
