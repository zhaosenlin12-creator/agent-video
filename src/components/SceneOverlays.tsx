import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

// ===== Print Overlay (05) =====
// 喷头来回扫描 + 塑料流体下落
export const PrintOverlay: React.FC<{ f: number }> = ({ f }) => {
  // 喷头扫描：循环往复
  const scanCycle = 60; // 60f = 2s 一个来回
  const scanPos = (Math.sin((f / scanCycle) * Math.PI * 2) + 1) / 2; // 0-1
  const scanX = interpolate(scanPos, [0, 1], [350, 730]);
  // 喷头 Y 固定
  const nozzleY = 600;
  // 流体：从喷头向下流
  const flowT = (f % 30) / 30; // 0-1, 流体从喷头喷出
  const flowScale = Math.max(0, Math.min(1, (f - 18) / 8)); // 18f 后开始流

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* 扫描喷头 */}
      {f >= 18 && (
        <g style={{
          transform: `translate(${scanX - 540}px, ${nozzleY - 960}px)`,
          transformOrigin: "540px 960px",
        }}>
          {/* 喷头阴影 */}
          <ellipse cx="0" cy="60" rx="35" ry="8" fill="rgba(0,0,0,0.4)" />
          {/* 喷头本体 */}
          <rect x="-20" y="-30" width="40" height="50" rx="4" fill="#333" stroke="#FFD400" strokeWidth="3" />
          <polygon points="-15,20 15,20 10,40 -10,40" fill="#FFD400" />
          {/* 火花 */}
          {f % 4 < 2 && (
            <g>
              <circle cx="-15" cy="25" r="2" fill="#FFD400" />
              <circle cx="0" cy="30" r="3" fill="#FF6B00" />
              <circle cx="15" cy="25" r="2" fill="#FFD400" />
            </g>
          )}
        </g>
      )}

      {/* 流体 */}
      {flowScale > 0 && (
        <g style={{ opacity: flowScale }}>
          {/* 流体路径 */}
          <path
            d={`M ${scanX} ${nozzleY + 40} Q ${scanX - 5} ${nozzleY + 200} ${scanX + 8} ${nozzleY + 400} T ${scanX + 5} ${nozzleY + 310}`}
            stroke="#FFD400"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            opacity={0.9 * Math.max(0, 1 - flowT)}
          />
          {/* 堆积层 - 半透明叠加 */}
          <ellipse
            cx={scanX}
            cy={nozzleY + 310}
            rx={60 + ((f - 28) % 60) * 0.5}
            ry={12}
            fill="#FFD400"
            opacity={0.7}
          />
        </g>
      )}

      {/* 层数指示 */}
      {f >= 28 && (
        <g>
          <line x1="200" y1="1480" x2="880" y2="1480" stroke="#FFD400" strokeWidth="6" strokeDasharray="12 8" opacity={0.6} />
          <rect x="800" y="1430" width="200" height="40" rx="8" fill="rgba(15,16,24,0.9)" stroke="#FFD400" strokeWidth="2" />
          <text x="900" y="1458" textAnchor="middle" fill="#FFD400" fontSize="24" fontWeight="800" fontFamily="Microsoft YaHei">
            LAYER {Math.floor((f - 28) / 4) + 1}
          </text>
        </g>
      )}
    </svg>
  );
};

// ===== Layer Overlay (06) =====
// 恐龙轮廓扫描填充
export const LayerOverlay: React.FC<{ f: number }> = ({ f }) => {
  const progress = interpolate(f, [16, 100], [0, 1], { extrapolateRight: "clamp" });
  const scanY = interpolate(progress, [0, 1], [600, 1400]);

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* 扫描线 */}
      {f >= 16 && (
        <>
          <line x1="200" y1={scanY} x2="880" y2={scanY} stroke="#FFD400" strokeWidth="4" opacity="0.8" />
          <rect x="200" y={scanY - 30} width="680" height="60" fill="url(#scanGrad)" opacity="0.4" />
          <defs>
            <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFD400" stopOpacity="0" />
              <stop offset="0.5" stopColor="#FFD400" stopOpacity="0.5" />
              <stop offset="1" stopColor="#FFD400" stopOpacity="0" />
            </linearGradient>
          </defs>
        </>
      )}

      {/* 进度条 */}
      {f >= 38 && (
        <g>
          <rect x="200" y="1340" width="680" height="36" rx="18" fill="rgba(15,16,24,0.9)" stroke="#FFD400" strokeWidth="2" />
          <rect x="206" y="1346" width={668 * progress} height="24" rx="12" fill="#FFD400" />
          <text x="540" y="1366" textAnchor="middle" fill="#000" fontSize="20" fontWeight="800" fontFamily="Microsoft YaHei">
            {Math.floor(progress * 100)}%
          </text>
        </g>
      )}
    </svg>
  );
};

// ===== Servo Overlay (08) =====
// 3根控制线动画
export const ServoOverlay: React.FC<{ f: number }> = ({ f }) => {
  // 3条线分别绘制
  const line1Progress = interpolate(f, [32, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Progress = interpolate(f, [38, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Progress = interpolate(f, [44, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const colors = ["#FF4081", "#FFD400", "#00E5FF"];

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* 3条线从舵机连到恐龙身体 */}
      {[line1Progress, line2Progress, line3Progress].map((p, i) => {
        const startX = 350;
        const startY = 700 + i * 40;
        const endX = 540;
        const endY = 1000 + i * 30;
        const currentX = startX + (endX - startX) * p;
        const currentY = startY + (endY - startY) * p;
        return p > 0 ? (
          <line
            key={i}
            x1={startX}
            y1={startY}
            x2={currentX}
            y2={currentY}
            stroke={colors[i]}
            strokeWidth="6"
            strokeLinecap="round"
          />
        ) : null;
      })}
    </svg>
  );
};

// ===== Code Overlay (09) =====
// 代码逐行打出
export const CodeOverlay: React.FC<{ f: number }> = ({ f }) => {
  const codeLines = [
    { text: "void setup() {", color: "#FF79C6" },
    { text: "  pinMode(9, OUTPUT);", color: "#8BE9FD" },
    { text: "  servo.attach(9);", color: "#50FA7B" },
    { text: "}", color: "#FF79C6" },
    { text: "void loop() {", color: "#FF79C6" },
    { text: "  servo.write(0);", color: "#F1FA8C" },
    { text: "  delay(500);", color: "#BD93F9" },
    { text: "  servo.write(180);", color: "#F1FA8C" },
    { text: "  delay(500);", color: "#BD93F9" },
    { text: "}", color: "#FF79C6" },
  ];

  // 每行的进度：16-24-32-...-2f/line
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {codeLines.map((line, i) => {
        const lineStart = 16 + i * 3;
        const progress = interpolate(f, [lineStart, lineStart + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (progress <= 0) return null;
        const charsToShow = Math.floor(line.text.length * progress);
        const displayText = line.text.slice(0, charsToShow);
        const y = 1100 + i * 38;
        const isHighlighted = i === 4 || i === 6; // 高亮关键行
        return (
          <g key={i}>
            {isHighlighted && (
              <rect
                x="190"
                y={y - 28}
                width={displayText.length * 16 + 20}
                height="36"
                fill="rgba(255,212,0,0.15)"
                rx="4"
              />
            )}
            <text
              x="200"
              y={y}
              fill={line.color}
              fontSize="28"
              fontFamily="Consolas, monospace"
              fontWeight="600"
            >
              {displayText}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ===== Power Overlay (10) =====
// 3-2-1 倒数 + 通电闪光
export const PowerOverlay: React.FC<{ f: number }> = ({ f }) => {
  let num = "";
  if (f < 22) num = "3";
  else if (f < 42) num = "2";
  else if (f < 62) num = "1";
  else num = "⚡";

  // 倒数数字 scale animation (each phase)
  const phaseFrame = f % 22;
  const numScale = phaseFrame < 8 ? interpolate(phaseFrame, [0, 8], [0.5, 1.0], { extrapolateRight: "clamp" }) : 1.0;

  // 通电闪光
  const flash = f >= 76 && f < 82 ? interpolate(f, [76, 78, 82], [0, 1, 0], { extrapolateRight: "clamp" }) : 0;

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* 数字 */}
      {f < 76 && (
        <text
          x="540"
          y="1100"
          textAnchor="middle"
          fontSize="380"
          fontWeight="900"
          fill="#FFD400"
          stroke="#000"
          strokeWidth="10"
          fontFamily="Impact"
          style={{
            transform: `scale(${numScale})`,
            transformOrigin: "540px 1080px",
            filter: "drop-shadow(0 0 30px rgba(255,212,0,0.8))",
          }}
        >
          {num}
        </text>
      )}

      {/* 通电闪光 */}
      {flash > 0 && (
        <>
          <rect x="0" y="0" width="1080" height="1920" fill="white" opacity={flash * 0.7} />
          {/* 闪电 */}
          <path
            d="M 540 700 L 480 900 L 540 900 L 480 1100 L 600 850 L 540 850 L 600 700 Z"
            fill="#FFD400"
            stroke="#000"
            strokeWidth="3"
            opacity={flash}
          />
        </>
      )}
    </svg>
  );
};

// ===== Demo Overlay (11) =====
// 摇头摆尾动画
export const DemoOverlay: React.FC<{ f: number }> = ({ f }) => {
  // 尾巴摆动：sin
  const tailAngle = Math.sin(f * 0.25) * 18;
  // 头摆动：sin 偏移
  const headAngle = Math.sin(f * 0.18 + 1) * 8;
  // 眨眼：每 30f 一次
  const blinkPhase = f % 30;
  const blinkScale = blinkPhase < 3 ? 0.1 : 1;

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* 摆动指示弧 */}
      <g opacity={0.6}>
        <path
          d={`M 800 1100 Q ${800 + Math.sin(f * 0.25) * 80} ${1100 + Math.cos(f * 0.25) * 30} 800 1100`}
          stroke="#FFD400"
          strokeWidth="4"
          fill="none"
          strokeDasharray="6 4"
        />
      </g>
    </svg>
  );
};

// ===== Roar Overlay (12) =====
// 张嘴 + 声波 + 人影
export const RoarOverlay: React.FC<{ f: number }> = ({ f }) => {
  // 声波扩散
  const wave1 = interpolate(f, [16, 50], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wave1Opacity = interpolate(f, [16, 50], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wave2 = interpolate(f, [22, 60], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wave2Opacity = interpolate(f, [22, 60], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 人影位置
  const peopleProgress = interpolate(f, [28, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* 声波 */}
      <g style={{ transform: "translate(540px, 1100px)" }}>
        <circle r={wave1} stroke="#FFD400" strokeWidth="6" fill="none" opacity={wave1Opacity} />
        <circle r={wave2} stroke="#FF6B00" strokeWidth="4" fill="none" opacity={wave2Opacity} />
      </g>

      {/* 人影从两侧涌入 */}
      {peopleProgress > 0 && (
        <>
          {/* 左侧人群 */}
          {[-1, -2, -3].map((i) => (
            <g
              key={`L${i}`}
              style={{
                transform: `translate(${-200 + (peopleProgress * 200) + i * 80}px, 0px)`,
                opacity: peopleProgress,
              }}
            >
              <circle cx={100 + i * 80} cy="1700" r="40" fill="#FF6B00" />
              <rect x={70 + i * 80} y="1740" width="60" height="120" rx="20" fill="#FF6B00" />
            </g>
          ))}
          {/* 右侧人群 */}
          {[1, 2, 3].map((i) => (
            <g
              key={`R${i}`}
              style={{
                transform: `translate(${(200 - peopleProgress * 200) - i * 80}px, 0px)`,
                opacity: peopleProgress,
              }}
            >
              <circle cx={980 - i * 80} cy="1700" r="40" fill="#FFD400" />
              <rect x={950 - i * 80} y="1740" width="60" height="120" rx="20" fill="#FFD400" />
            </g>
          ))}
        </>
      )}
    </svg>
  );
};

// ===== Slice Overlay (04) =====
// 切片层从下往上扫描
export const SliceOverlay: React.FC<{ f: number }> = ({ f }) => {
  // 切片层动画
  const layers = [];
  for (let i = 0; i < 8; i++) {
    const layerProgress = interpolate(f, [18 + i * 2, 20 + i * 2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    if (layerProgress > 0) {
      layers.push(
        <rect
          key={i}
          x="290"
          y={1300 - i * 100}
          width="500"
          height="14"
          rx="4"
          fill={i % 2 === 0 ? "#FF4081" : "#00E5FF"}
          opacity={layerProgress * 0.7}
        />
      );
    }
  }
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {layers}
    </svg>
  );
};

// ===== Remove Overlay (07) =====
// 抓手SVG动画
export const RemoveOverlay: React.FC<{ f: number }> = ({ f }) => {
  const gripX = interpolate(f, [18, 30], [-300, 540], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const twistR = interpolate(f, [30, 50], [0, -20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* 抓手 */}
      <g style={{ transform: `translate(${gripX}px, 1200px)` }}>
        <rect x="-30" y="-50" width="60" height="80" rx="8" fill="#FF6B00" stroke="#000" strokeWidth="3" />
        <rect x="-50" y="30" width="100" height="20" rx="4" fill="#FFD400" />
      </g>
      {/* 掰下动画线 */}
      {f >= 30 && (
        <g style={{ transform: `translate(540px, 1500px) rotate(${twistR}deg)` }}>
          <line x1="0" y1="0" x2="0" y2="80" stroke="#FFD400" strokeWidth="6" />
          <circle cx="0" cy="80" r="8" fill="#FFD400" />
        </g>
      )}
    </svg>
  );
};
