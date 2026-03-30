import { useMemo } from "react";

interface EpisodeLine {
  speaker: string;
  text: string;
  direction?: string;
}

const SHARK_CINE_STYLES: Record<string, { className: string; label: string }> = {
  "Mark Cuban": { className: "cine-shark-mark", label: "MARK CUBAN" },
  "Kevin O'Leary": { className: "cine-shark-kevin", label: "MR. WONDERFUL" },
  "Lori Greiner": { className: "cine-shark-lori", label: "LORI GREINER" },
  "Barbara Corcoran": { className: "cine-shark-barbara", label: "BARBARA CORCORAN" },
  "Robert Herjavec": { className: "cine-shark-robert", label: "ROBERT HERJAVEC" },
  "Daymond John": { className: "cine-shark-daymond", label: "DAYMOND JOHN" },
};

interface CinematicDialogueProps {
  episode: EpisodeLine[];
  currentIndex: number;
  actBreak: string | null;
}

export default function CinematicDialogue({
  episode,
  currentIndex,
  actBreak,
}: CinematicDialogueProps) {
  // Show current line + up to 3 past lines
  const visibleLines = useMemo(() => {
    const start = Math.max(0, currentIndex - 3);
    return episode.slice(start, currentIndex + 1).map((line, i) => ({
      line,
      isCurrent: start + i === currentIndex,
      originalIndex: start + i,
    }));
  }, [episode, currentIndex]);

  const currentLine = currentIndex >= 0 ? episode[currentIndex] : null;
  const prevLine = currentIndex > 0 ? episode[currentIndex - 1] : null;
  const isCameraCut = currentLine && prevLine && currentLine.speaker !== prevLine.speaker;

  if (actBreak) {
    return (
      <div className="cine-act-break">
        <div className="cine-act-break-text">{actBreak}</div>
      </div>
    );
  }

  if (currentIndex < 0) return null;

  return (
    <div className="cine-dialogue">
      {/* Past lines (dimmed) */}
      <div className="cine-dialogue-history">
        {visibleLines
          .filter((v) => !v.isCurrent)
          .map((v) => {
            const shark = SHARK_CINE_STYLES[v.line.speaker];
            return (
              <div key={v.originalIndex} className="cine-dialogue-past">
                {v.line.speaker !== "Narrator" && (
                  <span className={`cine-speaker-tag ${shark?.className ?? ""}`}>
                    {shark?.label ?? v.line.speaker.toUpperCase()}
                  </span>
                )}
                <span> {v.line.text}</span>
              </div>
            );
          })}
      </div>

      {/* Current line */}
      {currentLine && (
        <div
          key={currentIndex}
          className={`cine-dialogue-current ${
            isCameraCut ? "cine-camera-cut" : "cine-fade-enter"
          } ${
            currentLine.speaker === "Narrator"
              ? "cine-dialogue-narrator"
              : currentLine.speaker === "Founder"
              ? "cine-dialogue-founder"
              : ""
          }`}
        >
          {currentLine.direction && (
            <div className="cine-dialogue-direction">[{currentLine.direction}]</div>
          )}
          {currentLine.speaker !== "Narrator" && (
            <div>
              <span
                className={`cine-speaker-tag cine-speaker-active ${
                  SHARK_CINE_STYLES[currentLine.speaker]?.className ?? ""
                }`}
              >
                {SHARK_CINE_STYLES[currentLine.speaker]?.label ??
                  currentLine.speaker.toUpperCase()}
              </span>
            </div>
          )}
          <div className="cine-dialogue-text">{currentLine.text}</div>
        </div>
      )}
    </div>
  );
}
