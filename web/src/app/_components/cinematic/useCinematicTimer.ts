import { useState, useRef, useCallback, useEffect } from "react";

export type Phase =
  | "IDLE"
  | "INTRO"
  | "COLD_OPEN"
  | "DIALOGUE"
  | "SCORES"
  | "VERDICT"
  | "DONE";

export interface CinematicState {
  phase: Phase;
  dialogueIndex: number;
  isPaused: boolean;
  speed: number;
}

interface EpisodeLine {
  speaker: string;
  text: string;
  direction?: string;
}

function getLineDuration(
  line: EpisodeLine,
  prevLine: EpisodeLine | null,
  speed: number
): number {
  const wordCount = line.text.split(/\s+/).length;
  let base = Math.max(wordCount * 80, 800);

  if (prevLine && prevLine.speaker !== line.speaker) {
    base += 500;
  }
  if (line.speaker === "Narrator") {
    base += 800;
  }
  if (line.text.toLowerCase().includes("i'm out")) {
    base += 1200;
  }

  return base / speed;
}

export function useCinematicTimer(
  episode: EpisodeLine[],
  onPhaseChange?: (phase: Phase) => void
) {
  const [state, setState] = useState<CinematicState>({
    phase: "IDLE",
    dialogueIndex: -1,
    isPaused: false,
    speed: 1,
  });

  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;

  const episodeRef = useRef(episode);
  episodeRef.current = episode;

  // Reactive phase transitions — each phase schedules its own next step
  useEffect(() => {
    if (state.isPaused) return;

    let timer: ReturnType<typeof setTimeout>;

    if (state.phase === "INTRO") {
      timer = setTimeout(() => {
        setState((s) => ({ ...s, phase: "COLD_OPEN" }));
        onPhaseChangeRef.current?.("COLD_OPEN");
      }, 4000);
    } else if (state.phase === "COLD_OPEN") {
      timer = setTimeout(() => {
        setState((s) => ({ ...s, phase: "DIALOGUE", dialogueIndex: -1 }));
        onPhaseChangeRef.current?.("DIALOGUE");
      }, 3500);
    } else if (state.phase === "DIALOGUE") {
      const ep = episodeRef.current;
      const nextIndex = state.dialogueIndex + 1;

      if (nextIndex >= ep.length) {
        // All lines done, go to scores
        timer = setTimeout(() => {
          setState((s) => ({ ...s, phase: "SCORES" }));
          onPhaseChangeRef.current?.("SCORES");
        }, 800);
      } else {
        // Schedule next line
        const line = ep[nextIndex]!;
        const prevLine = nextIndex > 0 ? ep[nextIndex - 1] : null;
        const delay = state.dialogueIndex === -1
          ? 500 // initial delay before first line
          : getLineDuration(line, prevLine, state.speed);

        timer = setTimeout(() => {
          setState((s) => ({ ...s, dialogueIndex: nextIndex }));
        }, delay);
      }
    }

    return () => clearTimeout(timer);
  }, [state.phase, state.dialogueIndex, state.isPaused, state.speed]);

  // Start
  const start = useCallback(() => {
    setState({ phase: "INTRO", dialogueIndex: -1, isPaused: false, speed: 1 });
    onPhaseChangeRef.current?.("INTRO");
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Change speed
  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  // Skip to scores
  const skipToScores = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: "SCORES",
      dialogueIndex: episodeRef.current.length - 1,
    }));
    onPhaseChangeRef.current?.("SCORES");
  }, []);

  // Move to verdict
  const goToVerdict = useCallback(() => {
    setState((s) => ({ ...s, phase: "VERDICT" }));
    onPhaseChangeRef.current?.("VERDICT");
  }, []);

  // Finish
  const finish = useCallback(() => {
    setState((s) => ({ ...s, phase: "DONE" }));
    onPhaseChangeRef.current?.("DONE");
  }, []);

  // Get act break info
  const getActBreak = useCallback(
    (index: number): string | null => {
      const len = episodeRef.current.length;
      const q1 = Math.floor(len * 0.25);
      const q3 = Math.floor(len * 0.75);
      if (index === q1) return "ACT II — THE GRILLING";
      if (index === q3) return "ACT III — THE VERDICT";
      return null;
    },
    []
  );

  return {
    state,
    start,
    togglePause,
    setSpeed,
    skipToScores,
    goToVerdict,
    finish,
    getActBreak,
  };
}
