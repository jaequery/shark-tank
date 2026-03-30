const PANEL_PHOTOS = [
  { name: "Marc Havens", src: "/sharks/mark-cuban.jpg" },
  { name: "Keith O'Reilly", src: "/sharks/kevin-oleary.jpg" },
  { name: "Lana Gold", src: "/sharks/lori-greiner.jpg" },
  { name: "Brenda Callahan", src: "/sharks/barbara-corcoran.jpg" },
  { name: "Roman Hart", src: "/sharks/robert-herjavec.jpg" },
  { name: "Devon James", src: "/sharks/daymond-john.jpg" },
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
