import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import type { SceneElement } from "../data";
import { ElementRenderer } from "../components/ElementRenderer";

// 通用 Step Scene：5 层 z-index 严格分层
//   z=0  Background scene image (full screen, dark overlay)
//   z=1  Grid lines + radial glow
//   z=2  （已删除：AI 角落点缀，避免右下角突兀小图）
//   z=3  Main hero elements (centered, scaled up)
//   z=4  SVG Overlay (custom per scene)
//   z=5  Caption (bottom safe zone)
interface Props {
  elements: SceneElement[];
  caption: string;
  captionEmphasis?: string[];
  captionDelay?: number;
  captionSize?: number;
  bg?: string;
  sceneBackground?: string;
  Overlay?: React.FC<{ f: number }>;
}

export const StepScene: React.FC<Props> = ({
  elements,
  caption,
  captionEmphasis = [],
  captionDelay = 8,
  captionSize = 64,
  bg = "#0a0c14",
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

  const sceneBgOpacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        parts.push(<span key={idx++}>{remaining[0]}</span>);
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,12,20,0.45) 0%, rgba(10,12,20,0.55) 50%, rgba(10,12,20,0.75) 100%)",
              pointerEvents: "none",
              opacity: sceneBgOpacity,
            }}
          />
        </>
      )}

      {/* === z=1 网格 === */}
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
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          translate: "-50% -50%",
          width: 1400,
          height: 1400,
          background: "radial-gradient(circle, rgba(255,212,0,0.10) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* === z=3 主体元素（hero，含透明角色） === */}
      {elements
        .filter((el) => el.kind !== "line")
        .sort((a, b) => a.delay - b.delay)
        .map((el) => (
          <div key={el.id} style={{ zIndex: 3, position: "absolute", inset: 0, pointerEvents: "none" }}>
            <ElementRenderer el={el} />
          </div>
        ))}

      {/* === z=4 SVG overlay === */}
      {Overlay && (
        <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
          <Overlay f={f} />
        </div>
      )}

      {/* === z=5 字幕 === */}
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