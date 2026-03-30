import { useState, useEffect } from "react";

interface CinematicVerdictProps {
  deal: string | null;
  onComplete: () => void;
  playDealFanfare: () => void;
}

export default function CinematicVerdict({
  deal,
  onComplete,
  playDealFanfare,
}: CinematicVerdictProps) {
  const [showBlackout, setShowBlackout] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Blackout for 2.5s, then reveal
    const t1 = setTimeout(() => {
      setShowBlackout(false);
      setShowResult(true);
      if (deal) playDealFanfare();
    }, 2500);

    // Auto-finish after 7s
    const t2 = setTimeout(() => onComplete(), 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [deal, onComplete, playDealFanfare]);

  return (
    <div className="cine-verdict">
      {showBlackout && (
        <div className="cine-act-break" style={{ zIndex: 4 }}>
          <div className="cine-act-break-text" style={{ animationDelay: "0.8s" }}>
            THE VERDICT
          </div>
        </div>
      )}

      {showResult && (
        <div className="cine-verdict-deal">
          {deal ? (
            <>
              <div className="cine-verdict-deal-title" style={{ color: "#22c55e" }}>
                DEAL
              </div>
              <div className="cine-verdict-deal-text">{deal}</div>
            </>
          ) : (
            <>
              <div className="cine-verdict-nodeal-title">NO DEAL</div>
              <div className="cine-verdict-deal-text" style={{ marginTop: "0.5rem" }}>
                The Sharks have spoken.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
