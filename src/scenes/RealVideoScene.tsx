import React from "react";
import { interpolate, useCurrentFrame, spring, OffthreadVideo, staticFile } from "remotion";
import { Stage } from "../components/Stage";
import { Caption } from "../components/Caption";

// Real-video scene: plays a Pexels mp4 as background, scales (Ken Burns), and fades caption.
export const RealVideoScene: React.FC<{
  text: string;
  emphasis: string[];
  videoSrc: string;
  emphasisDelay?: number;
}> = ({ text, emphasis, videoSrc, emphasisDelay = 12 }) => {
  const f = useCurrentFrame();
  const fps = 30;
  // Slow Ken Burns zoom-in.
  const scale = interpolate(f, [0, 150], [1.0, 1.10]);
  // Slow horizontal pan to the right.
  const tx = interpolate(f, [0, 150], [0, -40]);
  return (
    <Stage bg="#000">
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <OffthreadVideo
          src={staticFile(videoSrc)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${tx}px)`,
          }}
          muted
        />
      </div>
      {/* Top fade for text contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <Caption text={text} emphasis={emphasis} bottom={210} fadeIn={10} size={68} />
    </Stage>
  );
};

