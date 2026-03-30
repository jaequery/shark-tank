"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";

export function EvaluationForm() {
  const [intro, setIntro] = useState("");
  const router = useRouter();
  const utils = trpc.useUtils();

  const generateMutation = trpc.evaluation.generate.useMutation({
    onSuccess: (data) => {
      utils.evaluation.list.invalidate();
      setIntro("");
      router.push(`/evaluations/${data.id}`);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!intro.trim()) return;
    generateMutation.mutate({ intro: intro.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Enter the Tank</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.95rem" }}>
        Pitch your company in a few sentences. The Sharks will take it from there.
      </p>

      <div className="form-group">
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          required
          placeholder="We're building an AI-powered platform that helps small restaurants manage their inventory and reduce food waste by 40%. We launched 3 months ago, have 50 paying restaurants, and are doing $12K MRR..."
          style={{ minHeight: "140px" }}
          disabled={generateMutation.isPending}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={generateMutation.isPending || !intro.trim()}
      >
        {generateMutation.isPending ? (
          <>
            <span className="spinner" />
            The Sharks are deliberating...
          </>
        ) : (
          "Face the Sharks"
        )}
      </button>

      {generateMutation.error && (
        <p style={{ color: "var(--red)", marginTop: "0.75rem", fontSize: "0.9rem" }}>
          {generateMutation.error.message}
        </p>
      )}
    </form>
  );
}
