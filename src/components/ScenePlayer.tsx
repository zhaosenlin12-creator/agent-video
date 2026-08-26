import React from "react";
import { useCurrentFrame, Img, staticFile } from "remotion";
import type { SceneElement } from "../data";
import { ElementRenderer } from "./ElementRenderer";
import { elementStyle } from "./motion";

interface Props {
  bg?: string;
  elements: SceneElement[];
  // SVG overlays (per element with kind="line")
  overlays?: React.ReactNode[];
  // Optional pre-render content (full-screen background illustration)
  backgroundImage?: string;
  backgroundOpacity?: number;
}

// 通用场景播放器：基于 elements 数组渲染
export const ScenePlayer: React.FC<Props> = ({
  bg = "#0a0c14",
  elements,
  overlays,
  backgroundImage,
  backgroundOpacity = 0.5,
}) => {
  const f = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: bg,
        overflow: "hidden",
        fontFamily: "Microsoft YaHei, PingFang SC, sans-serif",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,212,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,212,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.7,
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
          width: 1400,
          height: 1400,
          background: "radial-gradient(circle, rgba(255,212,0,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Background illustration (small, behind elements) */}
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            translate: "-50% -50%",
            width: "70%",
            height: "60%",
            opacity: backgroundOpacity,
            pointerEvents: "none",
            filter: "blur(2px)",
          }}
        >
          <Img
            src={staticFile(backgroundImage)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Custom overlays (SVG animations specific to scene) */}
      {overlays}

      {/* Elements (sorted by delay so earlier elements render first) */}
      {elements
        .filter((el) => el.kind !== "line") // line elements handled by overlays
        .sort((a, b) => a.delay - b.delay)
        .map((el) => (
          <ElementRenderer key={el.id} el={el} />
        ))}
    </div>
  );
};
