import { useEffect } from "react";

interface CinematicVerdictProps {
  deal: string | null;
  playDealFanfare: () => void;
}

export default function CinematicVerdict({
  deal,
  playDealFanfare,
}: CinematicVerdictProps) {
  useEffect(() => {
    if (deal) playDealFanfare();
  }, [deal, playDealFanfare]);

  return (
    <div className="cine-verdict">
      <div className="cine-verdict-deal">
        {deal ? (
          <>
            <div className="cine-verdict-deal-title">DEAL</div>
            <div className="cine-verdict-deal-text">{deal}</div>
          </>
        ) : (
          <>
            <div className="cine-verdict-nodeal-title">NO DEAL</div>
            <div className="cine-verdict-deal-text">
              The Investors have spoken.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
