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
    case "count": return "sfx/count_3.wav";
    case "power": return "sfx/power.wav";
    default: return null;
  }
};

// 过渡音（whoosh/pop/click/snap）全部直接跳过不渲染，仅保留 count / riser / power
const isTransition = (s: string) => ["whoosh", "pop", "click", "snap"].includes(s);

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

      {/* SFX per scene cue - transition sounds (whoosh/pop/click/snap) are skipped entirely */}
      {SCENES.map((s, sceneIdx) => {
        const { start } = sceneFrameRange(sceneIdx);
        const cues = (s.sfxCues || []).filter((cue) => !isTransition(cue.sound));
        return cues.map((cue, ci) => {
          let file = sfxFile(cue.sound);
          if (cue.sound === "count") {
            const countCues = cues.filter((c) => c.sound === "count");
            const idx = countCues.indexOf(cue);
            if (idx === 0) file = "sfx/count_3.wav";
            else if (idx === 1) file = "sfx/count_2.wav";
            else if (idx === 2) file = "sfx/count_1.wav";
          }
          if (!file) return null;
          const vol = cue.sound === "power" ? 0.6 : 0.5;
          return (
            <Sequence key={`sfx-${sceneIdx}-${ci}`} from={start + cue.frame} durationInFrames={20}>
              <Audio src={staticFile(file)} volume={() => vol} />
            </Sequence>
          );
        });
      })}
    </AbsoluteFill>
  );
};