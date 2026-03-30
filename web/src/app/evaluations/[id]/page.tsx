"use client";

import { use, useState, lazy, Suspense } from "react";
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

const SHARK_STYLES: Record<string, { className: string; label: string }> = {
  "Mark Cuban": { className: "shark-mark", label: "MARK" },
  "Kevin O'Leary": { className: "shark-kevin", label: "KEVIN" },
  "Lori Greiner": { className: "shark-lori", label: "LORI" },
  "Barbara Corcoran": { className: "shark-barbara", label: "BARBARA" },
  "Robert Herjavec": { className: "shark-robert", label: "ROBERT" },
  "Daymond John": { className: "shark-daymond", label: "DAYMOND" },
};

function scoreColor(score: number): string {
  if (score >= 7) return "var(--green)";
  if (score >= 4) return "var(--accent)";
  return "var(--red)";
}

function ScoreBadge({ score }: { score: number }) {
  const pct = score / 10;
  const cls = pct >= 0.7 ? "score-high" : pct >= 0.4 ? "score-mid" : "score-low";
  return <span className={`score-badge ${cls}`}>{score}</span>;
}

function EpisodeLine({ line }: { line: EpisodeLine }) {
  const shark = SHARK_STYLES[line.speaker];

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
          <span className="shark-tag" style={{ background: "rgba(255,255,255,0.08)", color: "var(--text)" }}>
            FOUNDER
          </span>
          {line.direction && <span className="stage-direction">[{line.direction}]</span>}
        </div>
        <div className="episode-text">{line.text}</div>
      </div>
    );
  }

  return (
    <div className="episode-line">
      <div className="episode-speaker">
        <span className={`shark-tag ${shark?.className ?? ""}`}>
          {shark?.label ?? line.speaker.toUpperCase()}
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
      {/* Cinematic overlay */}
      {showCinematic && hasEpisode && (
        <Suspense fallback={null}>
          <CinematicPlayer
            episode={episode}
            narration={ev.narration}
            projectName={ev.projectName}
            scores={ev.scores}
            overallScore={ev.overallScore}
            deal={ev.deal}
            onClose={() => setShowCinematic(false)}
          />
        </Suspense>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          &larr; Back
        </Link>
      </div>

      {/* Title card */}
      <div className="episode-title-card">
        <div className="episode-title-inner">
          <h1>{ev.projectName}</h1>
          <div className="episode-overall">
            <span className="episode-score-num" style={{ color: scoreColor(ev.overallScore / 7) }}>
              {ev.overallScore}
            </span>
            <span className="episode-score-total">/70</span>
          </div>
        </div>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "center" }}>
          {ev.deal && (
            <div className="episode-deal-banner">DEAL</div>
          )}
          {hasEpisode && (
            <button className="btn-cinematic" onClick={() => setShowCinematic(true)}>
              <span className="btn-cinematic-icon">&#9654;</span>
              Watch Episode
            </button>
          )}
        </div>
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
        /* Legacy fallback for old evaluations */
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

      {/* Scorecard — post-show analysis */}
      <div className="episode-postgame">
        <div className="section-title">Post-Show Scorecard</div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
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
                  <td style={{ fontWeight: 600 }}>{s.category}</td>
                  <td><ScoreBadge score={s.score} /></td>
                  <td style={{ color: "var(--text-muted)" }}>{s.oneLiner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete */}
      <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
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
      </div>
    </div>
  );
}
