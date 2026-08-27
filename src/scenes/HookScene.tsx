import React from "react";
import { useCurrentFrame, Img, staticFile, interpolate } from "remotion";
import { elementStyle } from "../components/motion";

// Hook Scene: 节奏感 hook，开场视觉冲击
// v15: 修复标题/副标题/恐龙图/底部提示的布局重叠问题
// 主标题(上) → 恐龙图(中) → 副标题(下) → 底部提示(最下)
// 总时长 5s = 150f

export const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const bgScale = interpolate(f, [0, 150], [1.0, 1.04]);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0a0c14", overflow: "hidden", fontFamily: "Microsoft YaHei, PingFang SC, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,212,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,212,0,0.05) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", width: 1400, height: 1400, background: "radial-gradient(circle, rgba(255,212,0,0.15) 0%, transparent 55%)", pointerEvents: "none" }} />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const r1 = 200;
          const r2 = 900;
          const x1 = 540 + Math.cos(angle) * r1;
          const y1 = 960 + Math.sin(angle) * r1;
          const x2 = 540 + Math.cos(angle) * r2;
          const y2 = 960 + Math.sin(angle) * r2;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD400" strokeWidth="3" strokeDasharray="40 60" opacity={0.3} style={{ strokeDashoffset: interpolate(f, [0, 150], [0, -300]), transform: "rotate(" + interpolate(f, [0, 150], [0, 20]) + "deg)", transformOrigin: "540px 960px" }} />
          );
        })}
      </svg>
      <div style={{ ...elementStyle({ f, delay: 0, entrance: "spring-rise", fromY: 80, duration: 14 }), position: "absolute", left: "50%", top: 300, translate: "-50% -50%", fontSize: 128, color: "#FFD400", fontWeight: 900, textShadow: "0 4px 0 rgba(0,0,0,0.6), 0 2px 12px rgba(255,212,0,0.6)", WebkitTextStroke: "2px #B81F1F", whiteSpace: "nowrap", letterSpacing: "0.06em" }}>一节课打印</div>
      <div style={{ ...elementStyle({ f, delay: 6, entrance: "spring-rise", fromY: 80, duration: 14 }), position: "absolute", left: "50%", top: 480, translate: "-50% -50%", fontSize: 138, color: "#FFD400", fontWeight: 900, textShadow: "0 4px 0 rgba(0,0,0,0.6), 0 2px 12px rgba(255,212,0,0.6)", WebkitTextStroke: "2px #B81F1F", whiteSpace: "nowrap", letterSpacing: "0.06em" }}>只活恐龙</div>
      <div style={{ position: "absolute", left: "50%", top: 960, translate: "-50% -50%", width: 750, height: 750, ...elementStyle({ f, delay: 14, entrance: "axial-flyin", fromX: 1200, fromY: 200, duration: 18 }), filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.5))" }}>
        <Img src={staticFile("illustrations/01_hook_tc.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ ...elementStyle({ f, delay: 28, entrance: "spring-rise", fromY: 60, duration: 14 }), position: "absolute", left: "50%", top: 1480, translate: "-50% -50%", fontSize: 76, color: "#FFFFFF", fontWeight: 900, textShadow: "0 4px 0 rgba(0,0,0,0.6), 0 2px 8px rgba(255,212,0,0.5)", background: "rgba(15,16,24,0.85)", padding: "14px 32px", borderRadius: 14, borderLeft: "6px solid #FFD400", whiteSpace: "nowrap" }}>课间直接炸了!</div>
      <div style={{ ...elementStyle({ f, delay: 36, entrance: "fade", duration: 14 }), position: "absolute", left: "50%", top: 1720, translate: "-50% -50%", fontSize: 44, color: "#FFD400", fontWeight: 700, textShadow: "0 2px 0 rgba(0,0,0,0.6)", background: "rgba(15,16,24,0.7)", padding: "10px 24px", borderRadius: 12, whiteSpace: "nowrap" }}>全班同学都看呆了</div>
    </div>
  );
};
