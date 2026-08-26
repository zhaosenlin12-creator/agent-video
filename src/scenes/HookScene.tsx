import React from "react";
import { interpolate, useCurrentFrame, Easing, Img, staticFile, AbsoluteFill } from "remotion";
import { Stage } from "../components/Stage";
import { HookHeadline } from "../components/HookHeadline";
import { Caption } from "../components/Caption";

const W = 1080;
const H = 1920;

// Beat-cut-moves (A式: 递进硬切串) implementation:
// - Build phase 0-49f: wide establishing shot with subtle zoom
// - 5 hard cuts at intervals 16→12→8→6→4 (frames 49, 65, 77, 85, 91, 95)
// - Each cut: 1f brightness flash + 6% white overlay (shutter click, not full flash)
// - Hold 95-end: wide hero with main headline reveal (R1 ≥1s hold)
const CUT_FRAMES = [49, 65, 77, 85, 91, 95];

// View index per cut: 0=wide, 1=cut1, 2=cut2, 3=cut3, 4=cut4, 5=wide again
const VIEWS_AT_FRAMES = (cutCount: number) => {
  // cutCount = number of intermediate views (here 5)
  const arr: number[] = [];
  for (let i = 0; i < cutCount; i++) arr.push(i + 1);
  arr.push(0); // back to wide
  return arr;
};

export const HookScene: React.FC<{
  text: string;
  emphasis: string[];
  illustration: string;
  hookCuts: string[];
}> = ({ text, emphasis, illustration, hookCuts }) => {
  const f = useCurrentFrame();
  const cuts = hookCuts && hookCuts.length > 0 ? hookCuts : [];
  const viewOrder = VIEWS_AT_FRAMES(cuts.length);

  // Find current view based on cut frames
  let viewIdx = 0;
  for (let i = 0; i < CUT_FRAMES.length; i++) {
    if (f >= CUT_FRAMES[i]) viewIdx = i + 1;
  }

  // Determine current image + transform
  const isWide = viewIdx === 0 || viewIdx === viewOrder.length;
  const currentImg = isWide ? illustration : cuts[viewIdx - 1] || illustration;

  // Transform per cut view (each cut has a different scale + transform-origin to feel like different camera)
  const viewTransforms: Array<{ scale: number; ox: string; oy: string }> = [
    { scale: 1.0, ox: "center", oy: "center" }, // wide
    { scale: 2.0, ox: "30% 60%", oy: "top" },
    { scale: 2.0, ox: "70% 40%", oy: "top" },
    { scale: 2.0, ox: "30% 70%", oy: "bottom" },
    { scale: 2.2, ox: "center 80%", oy: "bottom" },
    { scale: 2.0, ox: "center 50%", oy: "center" },
  ];
  const tx = viewTransforms[viewIdx] || viewTransforms[0];

  // Build-phase subtle scale (0-49f)
  const buildScale = interpolate(f, [0, 49], [1.0, 1.06], { extrapolateRight: "clamp" });
  // Hold-phase subtle scale (95-end)
  const holdScale = interpolate(f, [95, 135], [1.06, 1.10], { extrapolateRight: "clamp" });

  // Decide final scale based on phase
  let finalScale = tx.scale;
  if (isWide) {
    finalScale = f < 49 ? buildScale : f < 95 ? 1.06 : holdScale;
  }

  // Cut flash (1f brightness boost + 6% white overlay at exact cut frame)
  const onCutFrame = CUT_FRAMES.some(cf => f === cf);
  const flashBrightness = onCutFrame ? 1.06 : 1.0;
  const flashOpacity = onCutFrame ? 0.06 : 0.0;

  // Reveal mask during build (revealing from center outward)
  const revealR = interpolate(f, [0, 49], [0, 800], { extrapolateRight: "clamp" });

  // Stars overlay (only in wide phase)
  const stars = Array.from({ length: 18 });

  // Headline reveal: starts at frame 95 (after cuts land)
  const headlineScale = interpolate(f, [95, 110], [0.6, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1.25, 0.3, 1) });

  return (
    <Stage bg="#0a0c14">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Img
          src={staticFile(currentImg)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${finalScale})`,
            transformOrigin: `${tx.ox} ${tx.oy}`,
            filter: `brightness(${flashBrightness})`,
          }}
        />
      </div>

      {/* Cut flash overlay (subtle white at exact cut frame) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Vignette during build */}
      {f < 95 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Stars overlay (wide phase only) */}
      {isWide && stars.map((_, i) => {
        const sx = (i * 137) % (W - 40) + 20;
        const sy = (i * 211) % (H - 80) + 40;
        const tw = 0.4 + Math.abs(Math.sin(f * 0.15 + i)) * 0.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sx,
              top: sy,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#FFD400",
              opacity: tw * 0.6,
              boxShadow: "0 0 12px rgba(255,212,0,0.8)",
            }}
          />
        );
      })}

      {/* Headline: only show after cut sequence lands (frame 95+) - this is the "1s hold" */}
      {f >= 95 && (
        <div style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${headlineScale})`,
        }}>
          <HookHeadline text={text} />
        </div>
      )}

      {/* Caption appears during hold */}
      {f >= 100 && (
        <Caption text="全班都围过来了，点击看完整实验过程" emphasis={["全班"]} bottom={140} fadeIn={100} size={56} />
      )}
    </Stage>
  );
};
