import { useState, useRef, useCallback } from "react";

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
}

interface EpisodeLine {
  speaker: string;
  text: string;
  direction?: string;
}

export function useCinematicTimer(
  episode: EpisodeLine[],
  onPhaseChange?: (phase: Phase) => void
) {
  const [state, setState] = useState<CinematicState>({
    phase: "IDLE",
    dialogueIndex: -1,
  });

  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;

  const episodeRef = useRef(episode);
  episodeRef.current = episode;

  // Start
  const start = useCallback(() => {
    setState({ phase: "INTRO", dialogueIndex: -1 });
    onPhaseChangeRef.current?.("INTRO");
  }, []);

  // Advance to next step
  const next = useCallback(() => {
    setState((prev) => {
      const ep = episodeRef.current;

      if (prev.phase === "INTRO") {
        onPhaseChangeRef.current?.("COLD_OPEN");
        return { ...prev, phase: "COLD_OPEN" as Phase };
      }

      if (prev.phase === "COLD_OPEN") {
        onPhaseChangeRef.current?.("DIALOGUE");
        return { phase: "DIALOGUE" as Phase, dialogueIndex: 0 };
      }

      if (prev.phase === "DIALOGUE") {
        const nextIndex = prev.dialogueIndex + 1;
        if (nextIndex >= ep.length) {
          onPhaseChangeRef.current?.("SCORES");
          return { ...prev, phase: "SCORES" as Phase };
        }
        return { ...prev, dialogueIndex: nextIndex };
      }

      if (prev.phase === "SCORES") {
        onPhaseChangeRef.current?.("VERDICT");
        return { ...prev, phase: "VERDICT" as Phase };
      }

      if (prev.phase === "VERDICT") {
        onPhaseChangeRef.current?.("DONE");
        return { ...prev, phase: "DONE" as Phase };
      }

      return prev;
    });
  }, []);

  // Go back one step
  const prev = useCallback(() => {
    setState((prev) => {
      if (prev.phase === "COLD_OPEN") {
        onPhaseChangeRef.current?.("INTRO");
        return { ...prev, phase: "INTRO" as Phase };
      }

      if (prev.phase === "DIALOGUE") {
        if (prev.dialogueIndex <= 0) {
          onPhaseChangeRef.current?.("COLD_OPEN");
          return { ...prev, phase: "COLD_OPEN" as Phase, dialogueIndex: -1 };
        }
        return { ...prev, dialogueIndex: prev.dialogueIndex - 1 };
      }

      if (prev.phase === "SCORES") {
        const ep = episodeRef.current;
        onPhaseChangeRef.current?.("DIALOGUE");
        return { phase: "DIALOGUE" as Phase, dialogueIndex: ep.length - 1 };
      }

      if (prev.phase === "VERDICT") {
        onPhaseChangeRef.current?.("SCORES");
        return { ...prev, phase: "SCORES" as Phase };
      }

      return prev;
    });
  }, []);

  // Skip to scores
  const skipToScores = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: "SCORES" as Phase,
      dialogueIndex: episodeRef.current.length - 1,
    }));
    onPhaseChangeRef.current?.("SCORES");
  }, []);

  // Move to verdict
  const goToVerdict = useCallback(() => {
    setState((s) => ({ ...s, phase: "VERDICT" as Phase }));
    onPhaseChangeRef.current?.("VERDICT");
  }, []);

  // Finish
  const finish = useCallback(() => {
    setState((s) => ({ ...s, phase: "DONE" as Phase }));
    onPhaseChangeRef.current?.("DONE");
  }, []);

  // Get act break info
  const getActBreak = useCallback(
    (index: number): string | null => {
      const len = episodeRef.current.length;
      const q1 = Math.floor(len * 0.25);
      const q3 = Math.floor(len * 0.75);
      if (index === q1) return "ACT II -- THE GRILLING";
      if (index === q3) return "ACT III -- THE VERDICT";
      return null;
    },
    []
  );

  // Progress info for dialogue
  const dialogueProgress = state.phase === "DIALOGUE"
    ? { current: state.dialogueIndex + 1, total: episode.length }
    : null;

  return {
    state,
    start,
    next,
    prev,
    skipToScores,
    goToVerdict,
    finish,
    getActBreak,
    dialogueProgress,
  };
}
