import { useState, useEffect, useRef } from "react";

interface Score {
  id: string;
  category: string;
  score: number;
  oneLiner: string;
}

function scoreBrightness(score: number): string {
  if (score >= 7) return "#c9a55a";
  if (score >= 4) return "#9e7e3e";
  return "#6b5a3a";
}

interface CinematicScoreRevealProps {
  scores: Score[];
  overallScore: number;
  playScoreTick: () => void;
}

export default function CinematicScoreReveal({
  scores,
  overallScore,
  playScoreTick,
}: CinematicScoreRevealProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [countUp, setCountUp] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (visibleCount >= scores.length) {
      const t = setTimeout(() => setShowTotal(true), 400);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setVisibleCount((c) => c + 1);
      playScoreTick();
    }, 300);
    return () => clearTimeout(t);
  }, [visibleCount, scores.length, playScoreTick]);

  useEffect(() => {
    if (!showTotal) return;

    const start = performance.now();
    const duration = 1000;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCountUp(Math.round(eased * overallScore));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [showTotal, overallScore]);

  return (
    <div className="cine-scores" style={{ opacity: 1, animation: "fade-in 0.6s ease-out" }}>
      <div className="cine-scores-title">Post-Show Scorecard</div>

      {scores.slice(0, visibleCount).map((s, i) => (
        <div
          key={s.id}
          className="cine-score-row"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <span className="cine-score-category">{s.category}</span>
          <span className="cine-score-num" style={{ color: scoreBrightness(s.score) }}>
            {s.score}
          </span>
          <span className="cine-score-liner">{s.oneLiner}</span>
        </div>
      ))}

      {showTotal && (
        <div className="cine-score-total">
          <span className="cine-score-total-num">{countUp}</span>
          <span className="cine-score-total-label">/70</span>
        </div>
      )}
    </div>
  );
}
