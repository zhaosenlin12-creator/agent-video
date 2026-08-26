﻿import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { SceneElement } from "../data";
import { ElementRenderer } from "../components/ElementRenderer";
import { elementStyle } from "../components/motion";

// 通用 Step Scene：背景 + elements + 顶部 step 标签 + 底部 caption
// 大部分场景都符合这个模式
interface Props {
  elements: SceneElement[];
  caption: string;
  captionEmphasis?: string[];
  captionDelay?: number;
  captionSize?: number;
  bg?: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
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
  backgroundOpacity = 0.12,
  Overlay,
}) => {
  const f = useCurrentFrame();
  const totalFrames = 30 * 6;
  const captionOpacity = interpolate(f, [captionDelay, captionDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const captionY = interpolate(f, [captionDelay, captionDelay + 15], [30, 0], {
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
      {/* Grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,212,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,212,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          translate: "-50% -50%",
          width: 1200,
          height: 1200,
          background: "radial-gradient(circle, rgba(255,212,0,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Background AI illustration (small accent, bottom-right corner) */}
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            left: "78%",
            top: "78%",
            translate: "-50% -50%",
            width: "32%",
            height: "28%",
            opacity: backgroundOpacity,
            pointerEvents: "none",
            filter: "blur(4px) saturate(0.6)",
          }}
        >
          <img
            src={`public/${backgroundImage}`}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            alt=""
          />
        </div>
      )}

      {/* Custom SVG overlay */}
      {Overlay && <Overlay f={f} />}

      {/* Elements (skip "line" kind, those are handled by Overlay) */}
      {elements
        .filter((el) => el.kind !== "line")
        .sort((a, b) => a.delay - b.delay)
        .map((el) => (
          <ElementRenderer key={el.id} el={el} />
        ))}

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 270,
          textAlign: "center",
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: captionSize,
            color: "#FFFFFF",
            fontWeight: 700,
            textShadow: "0 4px 0 rgba(0,0,0,0.6)",
            background: "rgba(10,12,20,0.85)",
            padding: "16px 32px",
            borderRadius: 16,
            borderLeft: "6px solid #FFD400",
          }}
        >
          {renderCaption()}
        </div>
      </div>
    </div>
  );
};



