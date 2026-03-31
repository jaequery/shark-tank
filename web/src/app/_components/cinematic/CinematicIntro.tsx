const PANEL_PHOTOS = [
  { name: "Victor Chen", src: "/investors/victor-chen.svg" },
  { name: "Sterling Cross", src: "/investors/sterling-cross.svg" },
  { name: "Nina Pascale", src: "/investors/nina-pascale.svg" },
  { name: "Gloria Vance", src: "/investors/gloria-vance.svg" },
  { name: "Sasha Petrov", src: "/investors/sasha-petrov.svg" },
  { name: "Malik Thompson", src: "/investors/malik-thompson.svg" },
];

interface CinematicIntroProps {
  projectName: string;
}

export default function CinematicIntro({ projectName }: CinematicIntroProps) {
  return (
    <div className="cine-intro">
      <p className="cine-intro-label">DEAL TANK</p>
      <h1 className="cine-intro-title">{projectName}</h1>
      <div className="cine-panel-row">
        {PANEL_PHOTOS.map((investor) => (
          <img
            key={investor.name}
            src={investor.src}
            alt={investor.name}
            className="cine-panel-photo"
          />
        ))}
      </div>
    </div>
  );
}
