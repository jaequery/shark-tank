import { useState, useEffect, useRef } from "react";

interface Score {
  id: string;
  category: string;
  score: number;
  oneLiner: string;
}

function scoreColor(score: number): string {
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
}

interface CinematicScoreRevealProps {
  scores: Score[];
  overallScore: number;
  onComplete: () => void;
  playScoreTick: () => void;
}

export default function CinematicScoreReveal({
  scores,
  overallScore,
  onComplete,
  playScoreTick,
}: CinematicScoreRevealProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [countUp, setCountUp] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Reveal scores one by one
  useEffect(() => {
    if (visibleCount >= scores.length) {
      // Show total after all scores
      const t = setTimeout(() => setShowTotal(true), 600);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setVisibleCount((c) => c + 1);
      playScoreTick();
    }, 500);
    return () => clearTimeout(t);
  }, [visibleCount, scores.length, playScoreTick]);

  // Count up total score
  useEffect(() => {
    if (!showTotal) return;

    const start = performance.now();
    const duration = 1200;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCountUp(Math.round(eased * overallScore));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Done, move to verdict after a pause
        setTimeout(onComplete, 1500);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [showTotal, overallScore, onComplete]);

  return (
    <div className="cine-scores cine-fade-enter">
      <div className="cine-scores-title">Post-Show Scorecard</div>

      {scores.slice(0, visibleCount).map((s, i) => (
        <div
          key={s.id}
          className="cine-score-row"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <span className="cine-score-category">{s.category}</span>
          <span className="cine-score-num" style={{ color: scoreColor(s.score) }}>
            {s.score}
          </span>
          <span className="cine-score-liner">{s.oneLiner}</span>
        </div>
      ))}

      {showTotal && (
        <div className="cine-score-total">
          <span className="cine-score-total-num" style={{ color: scoreColor(overallScore / 7) }}>
            {countUp}
          </span>
          <span className="cine-score-total-label">/70</span>
        </div>
      )}
    </div>
  );
}
