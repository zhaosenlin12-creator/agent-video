import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SCENES, sceneFrameRange } from "./data";

// SFX cue type mapping
const sfxFile = (s: string): string | null => {
  switch (s) {
    case "pop": return "sfx/pop.wav";
    case "whoosh": return "sfx/whoosh.wav";
    case "click": return "sfx/click.wav";
    case "snap": return "sfx/snap.wav";
    case "riser": return "sfx/riser.wav";
    case "count": return "sfx/count_3.wav"; // default; power scene overrides
    case "power": return "sfx/power.wav";
    default: return null;
  }
};

export const AudioLayer: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* BGM */}
      <Audio src={staticFile("music/output014.mp3")} volume={() => 0.18} loop />

      {/* Voice per scene */}
      {SCENES.map((s, i) => {
        const { start, duration } = sceneFrameRange(i);
        return (
          <Sequence key={s.key} from={start} durationInFrames={duration}>
            <Audio src={staticFile(`voice/${s.key}.mp3`)} />
          </Sequence>
        );
      })}

      {/* SFX per scene cue */}
      {SCENES.map((s, sceneIdx) => {
        const { start } = sceneFrameRange(sceneIdx);
        const cues = s.sfxCues || [];
        return cues.map((cue, ci) => {
          let file = sfxFile(cue.sound);
          // Special: count_3/2/1 use different files
          if (cue.sound === "count") {
            // Use the cue index within the count sequence (0/1/2 → 3/2/1)
            const countCues = cues.filter((c) => c.sound === "count");
            const idx = countCues.indexOf(cue);
            if (idx === 0) file = "sfx/count_3.wav";
            else if (idx === 1) file = "sfx/count_2.wav";
            else if (idx === 2) file = "sfx/count_1.wav";
          }
          if (!file) return null;
          return (
            <Sequence key={`sfx-${sceneIdx}-${ci}`} from={start + cue.frame} durationInFrames={20}>
              <Audio src={staticFile(file)} volume={() => 0.65} />
            </Sequence>
          );
        });
      })}
    </AbsoluteFill>
  );
};
