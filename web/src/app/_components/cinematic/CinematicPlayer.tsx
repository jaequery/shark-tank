"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCinematicTimer, type Phase } from "./useCinematicTimer";
import { useAudioEngine } from "./useAudioEngine";
import CinematicIntro from "./CinematicIntro";
import CinematicDialogue from "./CinematicDialogue";
import CinematicScoreReveal from "./CinematicScoreReveal";
import CinematicVerdict from "./CinematicVerdict";
import "./cinematic.css";

interface EpisodeLine {
  speaker: string;
  text: string;
  direction?: string;
}

interface Score {
  id: string;
  category: string;
  score: number;
  oneLiner: string;
}

interface CinematicPlayerProps {
  episode: EpisodeLine[];
  narration: string;
  projectName: string;
  scores: Score[];
  overallScore: number;
  deal: string | null;
  onClose: () => void;
}

export default function CinematicPlayer({
  episode,
  narration,
  projectName,
  scores,
  overallScore,
  deal,
  onClose,
}: CinematicPlayerProps) {
  const audio = useAudioEngine();
  const audioRef = useRef(audio);
  audioRef.current = audio;

  const handlePhaseChange = useCallback((phase: Phase) => {
    if (phase === "INTRO") {
      audioRef.current.playThemeSting();
    }
    if (phase === "DIALOGUE") {
      audioRef.current.startDrone();
    }
    if (phase === "SCORES") {
      audioRef.current.stopDrone();
    }
  }, []);

  const timer = useCinematicTimer(episode, handlePhaseChange);
  const { state, start, togglePause, setSpeed, skipToScores, goToVerdict, finish } = timer;

  // Auto-start on mount
  const startedRef = useRef(false);
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      start();
    }
  }, [start]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePause();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, togglePause]);

  // Play buzzer on "I'm out" lines
  useEffect(() => {
    if (state.phase !== "DIALOGUE" || state.dialogueIndex < 0) return;
    const line = episode[state.dialogueIndex];
    if (line && line.text.toLowerCase().includes("i'm out")) {
      audioRef.current.playBuzzer();
    }
  }, [state.dialogueIndex, state.phase, episode]);

  const actBreak = state.phase === "DIALOGUE" ? timer.getActBreak(state.dialogueIndex) : null;

  return (
    <div className="cine-overlay">
      <div className="cine-vignette" />

      {/* Close button */}
      <button className="cine-controls-close" onClick={onClose} title="Close (Esc)">
        &times;
      </button>

      {/* Phases */}
      {state.phase === "INTRO" && <CinematicIntro projectName={projectName} />}

      {state.phase === "COLD_OPEN" && (
        <div className="cine-cold-open">
          <div className="cine-cold-open-text">{narration}</div>
        </div>
      )}

      {state.phase === "DIALOGUE" && (
        <CinematicDialogue
          episode={episode}
          currentIndex={state.dialogueIndex}
          actBreak={actBreak}
        />
      )}

      {state.phase === "SCORES" && (
        <CinematicScoreReveal
          scores={scores}
          overallScore={overallScore}
          onComplete={goToVerdict}
          playScoreTick={audio.playScoreTick}
        />
      )}

      {state.phase === "VERDICT" && (
        <CinematicVerdict
          deal={deal}
          onComplete={finish}
          playDealFanfare={audio.playDealFanfare}
        />
      )}

      {state.phase === "DONE" && (
        <div className="cine-verdict">
          <div className="cine-verdict-deal cine-fade-enter" style={{ animationDelay: "0s" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem", marginBottom: "1.5rem" }}>
              End of Episode
            </div>
            <button
              className="btn-cinematic"
              onClick={onClose}
              style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}
            >
              Back to Evaluation
            </button>
          </div>
        </div>
      )}

      {/* Playback controls */}
      {state.phase !== "IDLE" && state.phase !== "DONE" && (
        <div className="cine-controls">
          <button onClick={togglePause}>
            {state.isPaused ? "Play" : "Pause"}
          </button>

          {[1, 1.5, 2].map((s) => (
            <button
              key={s}
              className={state.speed === s ? "cine-speed-active" : ""}
              onClick={() => setSpeed(s)}
            >
              {s}x
            </button>
          ))}

          {state.phase === "DIALOGUE" && (
            <button onClick={skipToScores}>Skip to Scores</button>
          )}
        </div>
      )}
    </div>
  );
}
