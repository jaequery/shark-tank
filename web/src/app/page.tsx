"use client";

import { EvaluationForm } from "./_components/evaluation-form";
import { EvaluationList } from "./_components/evaluation-list";

export default function HomePage() {
  return (
    <div className="container">
      <header className="header">
        <h1>DEAL TANK</h1>
        <p>Pitch your company. Face the Investors.</p>
      </header>

      <div style={{ marginBottom: "2rem" }}>
        <EvaluationForm />
      </div>

      <div className="section">
        <div className="section-title">Past Evaluations</div>
        <EvaluationList />
      </div>
    </div>
  );
}
