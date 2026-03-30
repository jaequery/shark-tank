interface CinematicIntroProps {
  projectName: string;
}

export default function CinematicIntro({ projectName }: CinematicIntroProps) {
  return (
    <div className="cine-intro">
      <p className="cine-intro-label">DEAL TANK</p>
      <h1 className="cine-intro-title">{projectName}</h1>
    </div>
  );
}
