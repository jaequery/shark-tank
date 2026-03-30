"use client";

import { use, useState, useRef, lazy, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";

const CinematicPlayer = lazy(
  () => import("../../_components/cinematic/CinematicPlayer")
);

interface EpisodeLine {
  speaker: string;
  text: string;
  direction?: string;
}

const INVESTOR_LABELS: Record<string, string> = {
  "Marc Havens": "MARC",
  "Keith O'Reilly": "KEITH",
  "Lana Gold": "LANA",
  "Brenda Callahan": "BRENDA",
  "Roman Hart": "ROMAN",
  "Devon James": "DEVON",
};

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 7 ? "score-high" : score >= 4 ? "score-mid" : "score-low";
  return <span className={`score-badge ${cls}`}>{score}</span>;
}

function EpisodeLine({ line }: { line: EpisodeLine }) {
  const label = INVESTOR_LABELS[line.speaker];

  if (line.speaker === "Narrator") {
    return (
      <div className="episode-narrator">
        {line.direction && <span className="stage-direction">[{line.direction}]</span>}
        <em>{line.text}</em>
      </div>
    );
  }

  if (line.speaker === "Founder") {
    return (
      <div className="episode-line episode-founder">
        <div className="episode-speaker">
          <span className="shark-tag">YOU</span>
          {line.direction && <span className="stage-direction">[{line.direction}]</span>}
        </div>
        <div className="episode-text">{line.text}</div>
      </div>
    );
  }

  return (
    <div className="episode-line">
      <div className="episode-speaker">
        <span className="shark-tag">
          {label ?? line.speaker.toUpperCase()}
        </span>
        {line.direction && <span className="stage-direction">[{line.direction}]</span>}
      </div>
      <div className="episode-text">{line.text}</div>
    </div>
  );
}

export default function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: ev, isLoading } = trpc.evaluation.getById.useQuery({ id });
  const utils = trpc.useUtils();
  const deleteMutation = trpc.evaluation.delete.useMutation({
    onSuccess: () => {
      utils.evaluation.list.invalidate();
      router.push("/");
    },
  });
  const [showCinematic, setShowCinematic] = useState(false);
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "4rem" }}>
        <span className="spinner" />
      </div>
    );
  }

  if (!ev) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Evaluation not found</h2>
          <Link href="/">Back to home</Link>
        </div>
      </div>
    );
  }

  let episode: EpisodeLine[] = [];
  try {
    episode = JSON.parse(ev.sharkDialog);
  } catch {
    // legacy format fallback
  }

  const hasEpisode = episode.length > 0;

  return (
    <div className="container">
      {showCinematic && hasEpisode && (
        <Suspense fallback={null}>
          <CinematicPlayer
            episode={episode}
            narration={ev.narration}
            projectName={ev.projectName}
            scores={ev.scores}
            overallScore={ev.overallScore}
            deal={ev.deal}
            themeAudio={themeAudioRef.current}
            onClose={() => {
              if (themeAudioRef.current) {
                themeAudioRef.current.pause();
                themeAudioRef.current = null;
              }
              setShowCinematic(false);
            }}
          />
        </Suspense>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
          &larr; Back
        </Link>
      </div>

      {/* Title card */}
      <div className="episode-title-card">
        <div className="episode-title-inner">
          <h1>{ev.projectName}</h1>
          <div className="episode-overall">
            <span className="episode-score-num">
              {ev.overallScore}
            </span>
            <span className="episode-score-total">/10</span>
          </div>
        </div>
        {ev.deal && (
          <div className="episode-deal-banner">DEAL</div>
        )}
        {hasEpisode && (
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
            <button className="btn-cinematic" onClick={() => {
              const audio = new Audio("/theme.mp3");
              audio.volume = 0.7;
              audio.play().catch(() => {});
              themeAudioRef.current = audio;
              setShowCinematic(true);
            }}>
              Watch Episode
            </button>
          </div>
        )}
      </div>

      {/* Narrator cold open */}
      <div className="episode-cold-open">
        <em>{ev.narration}</em>
      </div>

      {/* The episode */}
      {hasEpisode ? (
        <div className="episode-script">
          {episode.map((line, i) => (
            <EpisodeLine key={i} line={line} />
          ))}
        </div>
      ) : (
        <div className="card">
          <p style={{ color: "var(--text-muted)" }}>
            This evaluation was created before the episode format was added.
          </p>
        </div>
      )}

      {/* Deal result */}
      {ev.deal && (
        <div className="episode-deal-card">
          <h3>THE DEAL</h3>
          <p>{ev.deal}</p>
        </div>
      )}

      {/* Scorecard */}
      <div className="episode-postgame">
        <div className="section-title">Post-Show Scorecard</div>
        <div style={{ overflow: "hidden" }}>
          <table className="scorecard">
            <thead>
              <tr>
                <th>Category</th>
                <th>Score</th>
                <th>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {ev.scores.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.category}</td>
                  <td><ScoreBadge score={s.score} /></td>
                  <td style={{ color: "var(--text-muted)" }}>{s.oneLiner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete */}
      <div style={{ marginTop: "3rem" }}>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (confirm("Delete this evaluation?")) {
                deleteMutation.mutate({ id: ev.id });
              }
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Evaluation"}
          </button>
          {deleteMutation.error && (
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.8125rem" }}>
              {deleteMutation.error.message}
            </p>
          )}
        </div>
    </div>
  );
}
