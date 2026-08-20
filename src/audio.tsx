import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SCENES, sceneFrameRange } from "./data";

export const AudioLayer: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("music/output014.mp3")} volume={() => 0.18} loop />
      {SCENES.map((s, i) => {
        const { start, duration } = sceneFrameRange(i);
        return (
          <Sequence key={s.key} from={start} durationInFrames={duration}>
            <Audio src={staticFile(`voice/${s.key}.mp3`)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

