import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import type { SceneElement } from "../data";
import { ElementRenderer } from "../components/ElementRenderer";

// 通用 Step Scene：5 层 z-index 严格分层
//   z=0  Background scene image (full screen, dark overlay)
//   z=1  Grid lines (subtle)
//   z=2  AI accent (corner, optional)
//   z=3  Main hero elements (centered, scaled up)
//   z=4  Text overlays (labels, step number, side panels)
//   z=5  Caption (bottom, semi-transparent backdrop)
interface Props {
  elements: SceneElement[];
  caption: string;
  captionEmphasis?: string[];
  captionDelay?: number;
  captionSize?: number;
  bg?: string;
  backgroundImage?: string;       // 角落 AI 小图（值已含 illustrations/ 前缀，如 illustrations/02_materials.png）
  backgroundOpacity?: number;
  sceneBackground?: string;        // 场景背景 key（不含 .png），如 bg_01_hook
  // Specific overlay component (e.g., counter, scan, etc.)
  Overlay?: React.FC<{ f: number }>;
}

export const StepScene: React.FC<Props> = ({
  elements,
  caption,
  captionEmphasis = [],
  captionDelay = 8,
  captionSize = 64,
  bg = "#0a0c14",
  backgroundImage,
  backgroundOpacity = 0.18,
  sceneBackground,
  Overlay,
}) => {
  const f = useCurrentFrame();
  const captionOpacity = interpolate(f, [captionDelay, captionDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const captionY = interpolate(f, [captionDelay, captionDelay + 15], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background scene fade-in (only first 12 frames)
  const sceneBgOpacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Render emphasis words in caption
  const renderCaption = () => {
    let remaining = caption;
    const parts: React.ReactNode[] = [];
    let idx = 0;
    while (remaining.length > 0) {
      let matched = false;
      for (const emph of captionEmphasis) {
        if (remaining.startsWith(emph)) {
          parts.push(
            <span key={idx++} style={{ color: "#FFD400", fontWeight: 900 }}>
              {emph}
            </span>
          );
          remaining = remaining.slice(emph.length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        const ch = remaining[0];
        parts.push(<span key={idx++}>{ch}</span>);
        remaining = remaining.slice(1);
      }
    }
    return parts;
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        overflow: "hidden",
        fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
      }}
    >
      {/* === z=0 全屏场景背景 === */}
      {sceneBackground && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: sceneBgOpacity,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile(`illustrations/${sceneBackground}.png`)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          {/* 深色蒙层确保前景可读 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,12,20,0.55) 0%, rgba(10,12,20,0.78) 50%, rgba(10,12,20,0.92) 100%)",
              pointerEvents: "none",
              opacity: sceneBgOpacity,
            }}
          />
        </>
      )}

      {/* === z=1 网格 (subtle) === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,212,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,212,0,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />
      {/* 暖色径向高光（强化中心主体） */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          translate: "-50% -50%",
          width: 1400,
          height: 1400,
          background: "radial-gradient(circle, rgba(255,212,0,0.08) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* === z=2 AI 角落点缀（可选） === */}
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            left: "76%",
            top: "78%",
            translate: "-50% -50%",
            width: "30%",
            height: "22%",
            opacity: backgroundOpacity,
            pointerEvents: "none",
            filter: "blur(3px) saturate(0.65)",
            zIndex: 2,
          }}
        >
          <Img
            src={staticFile(backgroundImage)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            alt=""
          />
        </div>
      )}

      {/* === z=3 主体元素（hero） === */}
      {elements
        .filter((el) => el.kind !== "line")
        .sort((a, b) => a.delay - b.delay)
        .map((el) => (
          <div key={el.id} style={{ zIndex: 3, position: "absolute", inset: 0, pointerEvents: "none" }}>
            <ElementRenderer el={el} />
          </div>
        ))}

      {/* === z=4 SVG overlay (custom per scene) === */}
      {Overlay && (
        <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
          <Overlay f={f} />
        </div>
      )}

      {/* === z=5 字幕 (bottom safe zone) === */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 200,
          textAlign: "center",
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: captionSize,
            color: "#FFFFFF",
            fontWeight: 700,
            textShadow: "0 4px 0 rgba(0,0,0,0.6)",
            background: "rgba(10,12,20,0.78)",
            padding: "18px 36px",
            borderRadius: 18,
            borderLeft: "6px solid #FFD400",
            maxWidth: "90%",
            lineHeight: 1.35,
          }}
        >
          {renderCaption()}
        </div>
      </div>
    </div>
  );
};