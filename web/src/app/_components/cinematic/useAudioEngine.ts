import { useRef, useCallback, useEffect } from "react";

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const droneRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // Theme sting: three ascending sawtooth notes (C4→E4→G4)
  const playThemeSting = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.0]; // C4, E4, G4

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.value = freq;

      filter.type = "lowpass";
      filter.frequency.value = 2000;
      filter.Q.value = 2;

      const start = now + i * 0.6;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.9);
    });

    // Sub bass hit on the last note
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.value = 65.41; // C2
    subGain.gain.setValueAtTime(0, now + 1.2);
    subGain.gain.linearRampToValueAtTime(0.2, now + 1.35);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 2.8);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now + 1.2);
    sub.stop(now + 3.0);
  }, [getCtx]);

  // Tension drone: subtle low sine with LFO
  const startDrone = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 55; // A1

    gain.gain.value = 0.04;

    lfo.type = "sine";
    lfo.frequency.value = 0.3; // slow pulse
    lfoGain.gain.value = 0.02;

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();

    droneRef.current = { osc, gain };
  }, [getCtx]);

  const stopDrone = useCallback(() => {
    if (droneRef.current) {
      const { osc, gain } = droneRef.current;
      const ctx = ctxRef.current;
      if (ctx) {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.stop(ctx.currentTime + 0.6);
      }
      droneRef.current = null;
    }
  }, []);

  // "I'm out" buzzer: descending square wave
  const playBuzzer = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.3);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }, [getCtx]);

  // Deal celebration: rising triangle arpeggio
  const playDealFanfare = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.value = freq;

      const start = now + i * 0.15;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  }, [getCtx]);

  // Score tick sound: quick blip
  const playScoreTick = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 880;

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }, [getCtx]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopDrone();
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, [stopDrone]);

  return {
    playThemeSting,
    startDrone,
    stopDrone,
    playBuzzer,
    playDealFanfare,
    playScoreTick,
  };
}
