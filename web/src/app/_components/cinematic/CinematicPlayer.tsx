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
  themeAudio: HTMLAudioElement | null;
  onClose: () => void;
}

export default function CinematicPlayer({
  episode,
  narration,
  projectName,
  scores,
  overallScore,
  deal,
  themeAudio,
  onClose,
}: CinematicPlayerProps) {
  const audio = useAudioEngine();
  const audioRef = useRef(audio);
  audioRef.current = audio;
  const themeAudioRef = useRef(themeAudio);
  themeAudioRef.current = themeAudio;

  const handlePhaseChange = useCallback((phase: Phase) => {
    if (phase === "DIALOGUE") {
      // Fade out theme when founder starts pitching
      const el = themeAudioRef.current;
      if (el) {
        const fade = setInterval(() => {
          if (el.volume > 0.05) {
            el.volume = Math.max(0, el.volume - 0.05);
          } else {
            clearInterval(fade);
            el.pause();
          }
        }, 30);
      }
      audioRef.current.startDrone();
    }
    if (phase === "SCORES") {
      audioRef.current.stopDrone();
    }
  }, []);

  const timer = useCinematicTimer(episode, handlePhaseChange);
  const { state, start, next, prev, skipToScores } = timer;

  const startedRef = useRef(false);
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      start();
    }
  }, [start]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, next, prev]);

  useEffect(() => {
    if (state.phase !== "DIALOGUE" || state.dialogueIndex < 0) return;
    const line = episode[state.dialogueIndex];
    if (line && line.text.toLowerCase().includes("i'm out")) {
      audioRef.current.playBuzzer();
    }
  }, [state.dialogueIndex, state.phase, episode]);

  const actBreak = state.phase === "DIALOGUE" ? timer.getActBreak(state.dialogueIndex) : null;

  const canGoBack =
    state.phase === "COLD_OPEN" ||
    state.phase === "SCORES" ||
    state.phase === "VERDICT" ||
    (state.phase === "DIALOGUE" && state.dialogueIndex >= 0);

  const canGoForward = state.phase !== "IDLE" && state.phase !== "DONE";

  return (
    <div className="cine-overlay">
      <button className="cine-controls-close" onClick={onClose} title="Close (Esc)">
        &times;
      </button>

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
          playScoreTick={audio.playScoreTick}
        />
      )}

      {state.phase === "VERDICT" && (
        <CinematicVerdict
          deal={deal}
          playDealFanfare={audio.playDealFanfare}
        />
      )}

      {state.phase === "DONE" && (
        <div className="cine-verdict">
          <div className="cine-verdict-deal" style={{ opacity: 1 }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
              END OF EPISODE
            </div>
            <button
              className="btn-cinematic"
              onClick={onClose}
            >
              Back to Evaluation
            </button>
          </div>
        </div>
      )}

      {state.phase !== "IDLE" && state.phase !== "DONE" && (
        <>
          {canGoBack && (
            <button className="cine-nav cine-nav-prev" onClick={prev} title="Back (Left Arrow)">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <button className="cine-nav cine-nav-next" onClick={next} title="Next (Right Arrow / Space)">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {state.phase === "DIALOGUE" && (
        <div className="cine-controls">
          {timer.dialogueProgress && (
            <span className="cine-progress">
              {timer.dialogueProgress.current} / {timer.dialogueProgress.total}
            </span>
          )}
          <button onClick={skipToScores}>Skip to Scores</button>
        </div>
      )}
    </div>
  );
}
