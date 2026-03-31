interface EpisodeLine {
  speaker: string;
  text: string;
  direction?: string;
}

const INVESTOR_LABELS: Record<string, string> = {
  "Victor Chen": "VICTOR CHEN",
  "Sterling Cross": "MR. MAGNIFICENT",
  "Nina Pascale": "NINA PASCALE",
  "Gloria Vance": "GLORIA VANCE",
  "Sasha Petrov": "SASHA PETROV",
  "Malik Thompson": "MALIK THOMPSON",
};

const INVESTOR_PHOTOS: Record<string, string> = {
  "Victor Chen": "/investors/victor-chen.svg",
  "Sterling Cross": "/investors/sterling-cross.svg",
  "Nina Pascale": "/investors/nina-pascale.svg",
  "Gloria Vance": "/investors/gloria-vance.svg",
  "Sasha Petrov": "/investors/sasha-petrov.svg",
  "Malik Thompson": "/investors/malik-thompson.svg",
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
  const photo = INVESTOR_PHOTOS[currentLine.speaker];

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

        {photo && (
          <img
            src={photo}
            alt={currentLine.speaker}
            className="cine-investor-photo"
          />
        )}

        {label && <span className="cine-speaker-tag">{label}</span>}
        {isFounder && <span className="cine-speaker-tag">YOU</span>}

        <div className="cine-dialogue-text">{currentLine.text}</div>
      </div>
    </div>
  );
}
