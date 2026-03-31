"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";

function scoreClass(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.7) return "score-high";
  if (pct >= 0.4) return "score-mid";
  return "score-low";
}

export function EvaluationList() {
  const { data: evaluations, isLoading } = trpc.evaluation.list.useQuery();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <span className="spinner" />
      </div>
    );
  }

  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="empty-state">
        <h2>No evaluations yet</h2>
        <p>The room is empty. No founders have entered yet. Gloria is relieved.</p>
      </div>
    );
  }

  return (
    <div>
      {evaluations.map((ev) => (
        <Link key={ev.id} href={`/evaluations/${ev.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="eval-list-item">
            <div>
              <div className="eval-name">{ev.projectName}</div>
              <div className="eval-date">
                {new Date(ev.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="eval-meta">
              <div className={`score-badge ${scoreClass(ev.overallScore, 10)}`}>
                {ev.overallScore}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
