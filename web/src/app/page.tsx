"use client";

import { useSession, signIn } from "next-auth/react";
import { UserNav } from "./_components/user-nav";
import { EvaluationForm } from "./_components/evaluation-form";
import { EvaluationList } from "./_components/evaluation-list";

const EXAMPLE_EVALUATIONS = [
  {
    name: "NomNom AI",
    score: 8,
    scoreClass: "score-high",
    investor: "LANA",
    quote:
      "This is the rare pitch where the product is already better than the pitch. That almost never happens in here.",
    deal: true,
  },
  {
    name: "ParkingPal",
    score: 5,
    scoreClass: "score-mid",
    investor: "KEITH",
    quote:
      "You're burning $40K a month to acquire users who pay you $3. That's not a business, that's a hobby with a credit card.",
    deal: false,
  },
  {
    name: "BlockchainPets",
    score: 3,
    scoreClass: "score-low",
    investor: "BRENDA",
    quote:
      "I actually think the idea is adorable. I genuinely wish you well... and for that reason, I'm out.",
    deal: false,
  },
];

const INVESTORS = [
  { name: "Marc Havens", src: "/sharks/mark-cuban.jpg", focus: "Tech & Scalability" },
  { name: "Keith O'Reilly", src: "/sharks/kevin-oleary.jpg", focus: "Unit Economics" },
  { name: "Lana Gold", src: "/sharks/lori-greiner.jpg", focus: "Product-Market Fit" },
  { name: "Brenda Callahan", src: "/sharks/barbara-corcoran.jpg", focus: "Gut Instinct", trait: "Always out." },
  { name: "Roman Hart", src: "/sharks/robert-herjavec.jpg", focus: "Security & Infra" },
  { name: "Devon James", src: "/sharks/daymond-john.jpg", focus: "Brand & Hustle" },
];

function LandingPage() {
  return (
    <>
      {/* Hero */}
      <header className="header">
        <div className="hero-eyebrow">
          As Seen on Deal Tank
          <span className="hero-eyebrow-sub">Season 1, Episode 1 of 1</span>
        </div>
        <h1>DEAL TANK</h1>
        <p className="hero-tagline">Six Investors. One Brutal Verdict.</p>
        <p className="hero-subtitle">
          The only pitch room where the feedback is real and the money isn't.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <button className="btn-cta" onClick={() => signIn("google")}>
            Enter the Tank
          </button>
        </div>
      </header>

      {/* Example Teasers */}
      <div className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="section-title">Episode Highlights</div>
          {EXAMPLE_EVALUATIONS.map((ev) => (
            <div key={ev.name} className="teaser-card">
              <div className="teaser-header">
                <span className="teaser-name">{ev.name}</span>
                <span className={`teaser-score ${ev.scoreClass}`}>
                  {ev.score}<span style={{ color: "var(--text-faint)", fontWeight: 300 }}>/10</span>
                </span>
              </div>
              <div className="teaser-quote">
                <span className="shark-tag">{ev.investor}</span>
                {" "}&mdash; &ldquo;{ev.quote}&rdquo;
              </div>
              <div className={`teaser-verdict ${ev.deal ? "verdict-in" : "verdict-out"}`}>
                {ev.deal ? "Deal" : "No Deal"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Panel */}
      <div className="landing-section">
        <div className="landing-section-inner">
          <div className="section-title" style={{ textAlign: "center" }}>The Investors</div>
          <div className="investor-grid">
            {INVESTORS.map((inv) => (
              <div key={inv.name} className="investor-card">
                <img
                  src={inv.src}
                  alt={inv.name}
                  className="investor-photo"
                />
                <div className="investor-name">{inv.name}</div>
                <div className="investor-focus">{inv.focus}</div>
                {inv.trait && <div className="investor-trait">{inv.trait}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="section-title">How It Works</div>
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <div>
                <div className="step-title">Write your pitch</div>
                <div className="step-desc">
                  Describe your startup in a few sentences. What you&apos;re building, who it&apos;s for, and why it matters.
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <div>
                <div className="step-title">Watch the episode unfold</div>
                <div className="step-desc">
                  Six AI investors analyze your pitch, debate its merits, and deliver their verdicts in a full cinematic episode.
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <div>
                <div className="step-title">Get your scorecard</div>
                <div className="step-desc">
                  Scored across 7 dimensions with a final verdict. Brutally honest, occasionally flattering.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="landing-section">
        <div className="landing-section-inner">
          <div className="final-cta">
            <h2>Ready to face the tank?</h2>
            <p>
              Your pitch will be questioned. Your model will be challenged.
              Brenda will still be out.
            </p>
            <button className="btn-cta" onClick={() => signIn("google")}>
              Sign In to Pitch
            </button>
            <div className="final-cta-fine">Free. No credit card. Just courage.</div>
          </div>
        </div>
      </div>

      {/* Footer easter egg */}
      <div className="landing-footer">
        Brenda Callahan&apos;s participation does not constitute an endorsement.
      </div>
    </>
  );
}

export default function HomePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="container">
        <div className="header-top">
          <UserNav />
        </div>
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-top">
          <UserNav />
        </div>
        <h1>DEAL TANK</h1>
        <p>Pitch your company. Face the Investors.</p>
      </header>

      <div style={{ marginBottom: "2rem" }}>
        <EvaluationForm />
      </div>

      <div className="section">
        <div className="section-title">Your Evaluations</div>
        <EvaluationList />
      </div>
    </div>
  );
}
