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
    investor: "STERLING",
    quote:
      "Hold on. You\u2019re telling me restaurants are paying you to tell them they ordered too much lettuce? That\u2019s the most beautiful business model I\u2019ve ever heard. You\u2019re selling common sense as a service. I want equity.",
    deal: true,
  },
  {
    name: "ParkingPal",
    score: 4,
    scoreClass: "score-mid",
    investor: "VICTOR",
    quote:
      "So your entire competitive advantage is\u2026 a push notification? My phone already gives me parking notifications. It\u2019s called my wife texting me \u2018you got a ticket again.\u2019",
    deal: false,
  },
  {
    name: "BlockchainPets",
    score: 2,
    scoreClass: "score-low",
    investor: "GLORIA",
    quote:
      "You know what, I actually love animals. I have three dogs. I once invested in a dog grooming company and tripled my money. So I really came into this one excited. But you want to put puppies on the blockchain, and I\u2019m pretty sure my dogs would rather eat the blockchain than live on it. I genuinely think you\u2019re a lovely person\u2026 and for that reason, I\u2019m out.",
    deal: false,
  },
  {
    name: "VibeCodeHQ",
    score: 6,
    scoreClass: "score-mid",
    investor: "MALIK",
    quote:
      "I built my entire brand selling T-shirts out of a basement. You know what I didn\u2019t have? A \u2018vibe.\u2019 I had hustle. Your landing page says \u2018vibe-driven development\u2019 three times and I still don\u2019t know what you do.",
    deal: false,
  },
  {
    name: "FitBuddy",
    score: 7,
    scoreClass: "score-high",
    investor: "NINA",
    quote:
      "I\u2019m looking at this and thinking \u2014 you know what, this is actually delightful. The UX is clean, the onboarding took me thirty seconds. My only concern is that your \u2018AI personal trainer\u2019 told me to do 400 burpees and I\u2019m now emotionally damaged.",
    deal: true,
  },
];

const GLORIA_OUTS = [
  "You remind me of my first husband. Very confident, very wrong. And for that reason, I\u2019m out.",
  "I once turned down a deal that made someone a billionaire. I\u2019ll do it again right now. I\u2019m out.",
  "My gut says yes but my gut also said yes to that restaurant in 2008. I\u2019m out.",
  "This is the best pitch I\u2019ve heard all season. I\u2019m absolutely out.",
  "I love everything about this except the part where I give you money. I\u2019m out.",
  "You had me at hello. Lost me at \u2018blockchain.\u2019 I\u2019m out.",
];

const INVESTORS = [
  { name: "Victor Chen", src: "/investors/victor-chen.svg", focus: "Tech & Scalability", trait: "Will ask about your AWS bill" },
  { name: "Sterling Cross", src: "/investors/sterling-cross.svg", focus: "Unit Economics", trait: "Wants royalties on your dreams" },
  { name: "Nina Pascale", src: "/investors/nina-pascale.svg", focus: "Product-Market Fit", trait: "Tested your app before you pitched" },
  { name: "Gloria Vance", src: "/investors/gloria-vance.svg", focus: "Gut Instinct", trait: "Has never not been out" },
  { name: "Sasha Petrov", src: "/investors/sasha-petrov.svg", focus: "Security & Infra", trait: "Already found 3 vulnerabilities" },
  { name: "Malik Thompson", src: "/investors/malik-thompson.svg", focus: "Brand & Hustle", trait: "Will relate this to T-shirts" },
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
          The only pitch room where the feedback is real, the money isn&apos;t,
          and one investor will always be out.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <button className="btn-cta" onClick={() => signIn("google")}>
            Enter the Room
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
                <span className="investor-tag">{ev.investor}</span>
                {" "}&mdash; &ldquo;{ev.quote}&rdquo;
              </div>
              <div className={`teaser-verdict ${ev.deal ? "verdict-in" : "verdict-out"}`}>
                {ev.deal ? "Deal" : "No Deal"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gloria's Greatest Hits */}
      <div className="landing-section">
        <div className="landing-section-inner">
          <div className="section-title" style={{ textAlign: "center" }}>
            Gloria Vance&apos;s Greatest Hits
          </div>
          <div className="section-subtitle">
            In {GLORIA_OUTS.length} episodes, Gloria has invested in exactly 0 startups.
            Her record remains perfect.
          </div>
          <div className="gloria-quotes">
            {GLORIA_OUTS.map((quote, i) => (
              <div key={i} className="gloria-quote">
                &ldquo;{quote}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Panel */}
      <div className="landing-section landing-section-alt">
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
      <div className="landing-section">
        <div className="landing-section-inner">
          <div className="section-title">How It Works</div>
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <div>
                <div className="step-title">Write your pitch</div>
                <div className="step-desc">
                  Describe your startup in a few sentences. Be honest.
                  Sterling can smell inflated metrics through the screen.
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <div>
                <div className="step-title">Watch the episode unfold</div>
                <div className="step-desc">
                  Six AI investors debate your startup in a full cinematic episode.
                  Expect tough love. Gloria will find a creative way to say no.
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <div>
                <div className="step-title">Get your scorecard</div>
                <div className="step-desc">
                  Scored across 7 dimensions. No participation trophies.
                  Malik will somehow relate your SaaS product to streetwear.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="final-cta">
            <h2>Ready to face the panel?</h2>
            <p>
              Your pitch will be questioned. Your unit economics will be mocked.
              Malik will tell you about his T-shirt empire. Gloria will wish you well
              on your journey, and then leave.
            </p>
            <button className="btn-cta" onClick={() => signIn("google")}>
              Sign In to Pitch
            </button>
            <div className="final-cta-fine">
              Free. No credit card. Emotional damage not covered by insurance.
            </div>
          </div>
        </div>
      </div>

      {/* Footer easter egg */}
      <div className="landing-footer">
        Gloria Vance&apos;s participation does not constitute an endorsement, an investment,
        or any indication that she will not be out. She will be out.
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
