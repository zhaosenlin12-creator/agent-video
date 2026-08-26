import React from "react";
import { interpolate, useCurrentFrame, spring, Img, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { Caption } from "../components/Caption";

// Paparazzi-flash (B式: 连闪定格) implementation:
// - Build 0-30f: main endcard image, slow scale 1.0→1.05
// - Flash 1 at 30f → flash1 image (4f white flash 0.95→0)
// - Flash 2 at 52f → flash2 image (4f white flash)
// - Flash 3 at 70f → flash3 image (4f white flash)
// - Hold 70-130f (60f): flash3 image with settle (1.03→1.0)
// - Final 130-end: return to main endcard with CTA text
const FLASH_FRAMES = [30, 52, 70];

// Hash-based deterministic jitter (-2 to +2 px) - replaces Math.random for deterministic render
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 4;
}

export const EndCardScene: React.FC<{
  text: string;
  emphasis: string[];
  illustration: string;
  flashCuts: string[];
}> = ({ text, emphasis, illustration, flashCuts }) => {
  const f = useCurrentFrame();
  const fps = 30;
  const flashes = flashCuts && flashCuts.length > 0 ? flashCuts : [];

  // Determine current "phase"
  // Phase 0 (build): 0-30f, show main endcard
  // Phase 1 (flash1): 30-52f
  // Phase 2 (flash2): 52-70f
  // Phase 3 (flash3 hold): 70-130f
  // Phase 4 (final CTA): 130f+
  let currentImg = illustration;
  let phase = 0;
  if (f >= 30 && f < 52 && flashes[0]) { currentImg = flashes[0]; phase = 1; }
  else if (f >= 52 && f < 70 && flashes[1]) { currentImg = flashes[1]; phase = 2; }
  else if (f >= 70 && f < 130 && flashes[2]) { currentImg = flashes[2]; phase = 3; }
  else if (f >= 130) { currentImg = illustration; phase = 4; }

  // White flash overlay opacity (peaks at exact flash frame, decays over 4f)
  const flashOpacity = (() => {
    for (const cf of FLASH_FRAMES) {
      const delta = f - cf;
      if (delta >= 0 && delta < 4) {
        return 0.95 * (1 - delta / 4);
      }
    }
    return 0;
  })();

  // Jitter on flash frames (deterministic hash)
  const isFlashFrame = FLASH_FRAMES.some(cf => f === cf);
  const jx = isFlashFrame ? jitter(Math.floor(f / 4) + 1) : 0;
  const jy = isFlashFrame ? jitter(Math.floor(f / 4) + 7) : 0;

  // Scale animation per phase
  let scale = 1.0;
  if (phase === 0) scale = interpolate(f, [0, 30], [1.0, 1.05]);
  else if (phase === 1 || phase === 2 || phase === 3) {
    // After flash: 1.03→1.0 settle over 6f
    const phaseStart = FLASH_FRAMES[phase - 1];
    scale = interpolate(f, [phaseStart, phaseStart + 6], [1.03, 1.0], { extrapolateRight: "clamp" });
  } else if (phase === 4) scale = interpolate(f, [130, 165], [1.0, 1.04]);

  // Final CTA lines (phase 4 only)
  const lines = [
    { text: "点赞收藏", delay: 134, color: "#FFD400", size: 110 },
    { text: "下期教你做四足机甲", delay: 148, color: "#FFFFFF", size: 72 },
  ];

  return (
    <Stage bg="#0a0c14">
      {/* Main illustration layer (with jitter applied during flash frames) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          transform: `translate(${jx}px, ${jy}px) scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        <Img
          src={staticFile(currentImg)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* White flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Subtle scanlines overlay (builds energy) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent 0 22px, rgba(255,80,0,0.10) 22px 26px)",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      {/* Final CTA text (phase 4 only) */}
      {phase === 4 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 920,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          {lines.map((l, i) => {
            const s = spring({ frame: f - l.delay, fps, config: { damping: 12, stiffness: 130, mass: 0.6 } });
            const y = interpolate(s, [0, 1], [40, 0]);
            const op = interpolate(s, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  fontSize: l.size,
                  color: l.color,
                  fontWeight: 900,
                  textShadow: "0 6px 0 rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.5)",
                  WebkitTextStroke: l.color === "#FFD400" ? "3px #B81F1F" : "0",
                  opacity: op,
                  transform: `translateY(${y}px)`,
                }}
              >
                {l.text}
              </div>
            );
          })}
        </div>
      )}

      {/* During flash hold (phase 3), overlay a big "100k" / "next" preview text */}
      {phase === 3 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 140,
              color: "#FFD400",
              fontWeight: 900,
              textShadow: "0 8px 0 rgba(0,0,0,0.6), 0 0 30px rgba(255,212,0,0.7)",
              WebkitTextStroke: "3px #B81F1F",
              opacity: interpolate(f, [70, 80], [0, 1], { extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(f, [70, 80], [0.5, 1.0], { extrapolateRight: "clamp" })})`,
            }}
          >
            下期预告
          </div>
        </div>
      )}

      {/* Caption only in final phase */}
      {phase === 4 && (
        <Caption text="更酷的实验，等你来看" emphasis={["更酷"]} bottom={140} fadeIn={134} size={56} color="#FFD400" />
      )}
    </Stage>
  );
};
