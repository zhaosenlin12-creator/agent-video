import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile, useVideoConfig } from "remotion";
import type { SceneElement } from "../data";
import { ElementRenderer } from "../components/ElementRenderer";

interface Props {
  elements: SceneElement[];
  caption: string;
  captionEmphasis?: string[];
  captionDelay?: number;
  captionSize?: number;
  bg?: string;
  sceneBackground?: string;
  duration?: number;
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
  duration,
  Overlay,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const totalDur = duration || durationInFrames;
  const FADE_DUR = 12;

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

  // 场景结束淡入黑色：最后 FADE_DUR 帧
  const endFadeOpacity = interpolate(f, [totalDur - FADE_DUR, totalDur], [0, 0.92], {
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
              src={staticFile("illustrations/" + sceneBackground + ".png")}
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

      {elements
        .filter((el) => el.kind !== "line")
        .sort((a, b) => a.delay - b.delay)
        .map((el) => (
          <div key={el.id} style={{ zIndex: 3, position: "absolute", inset: 0, pointerEvents: "none" }}>
            <ElementRenderer el={el} />
          </div>
        ))}

      {Overlay && (
        <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
          <Overlay f={f} />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 200,
          textAlign: "center",
          opacity: captionOpacity,
          transform: "translateY(" + captionY + "px)",
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
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {renderCaption()}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          opacity: endFadeOpacity,
          pointerEvents: "none",
          zIndex: 6,
        }}
      />
    </div>
  );
};