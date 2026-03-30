interface EpisodeLine {
  speaker: string;
  text: string;
  direction?: string;
}

const INVESTOR_LABELS: Record<string, string> = {
  "Marc Havens": "MARC HAVENS",
  "Keith O'Reilly": "MR. MAGNIFICENT",
  "Lana Gold": "LANA GOLD",
  "Brenda Callahan": "BRENDA CALLAHAN",
  "Roman Hart": "ROMAN HART",
  "Devon James": "DEVON JAMES",
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
  if (actBreak) {
    return (
      <div className="cine-act-break">
        <div className="cine-act-break-text">{actBreak}</div>
      </div>
    );
  }

  if (currentIndex < 0) return null;

  const currentLine = episode[currentIndex]!;
  const isNarrator = currentLine.speaker === "Narrator";
  const isFounder = currentLine.speaker === "Founder";
  const label = INVESTOR_LABELS[currentLine.speaker];

  return (
    <div className="cine-dialogue">
      <div
        key={currentIndex}
        className={`cine-dialogue-current ${
          isNarrator ? "cine-dialogue-narrator" : ""
        } ${isFounder ? "cine-dialogue-founder" : ""}`}
      >
        {currentLine.direction && (
          <div className="cine-dialogue-direction">[{currentLine.direction}]</div>
        )}

        {label && <span className="cine-speaker-tag">{label}</span>}
        {isFounder && <span className="cine-speaker-tag">YOU</span>}

        <div className="cine-dialogue-text">{currentLine.text}</div>
      </div>
    </div>
  );
}
