interface CinematicIntroProps {
  projectName: string;
}

export default function CinematicIntro({ projectName }: CinematicIntroProps) {
  return (
    <div className="cine-intro cine-fade-enter">
      <div className="cine-spotlight" style={{ top: "30%", left: "40%" }} />
      <div className="cine-spotlight" style={{ top: "45%", left: "55%" }} />
      <h1 className="cine-intro-title">SHARK TANK</h1>
      <p className="cine-intro-subtitle">{projectName}</p>
    </div>
  );
}
