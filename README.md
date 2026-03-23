# Shark Tank

A Claude Code skill that evaluates your project as if you're pitching it on Shark Tank. Get brutally honest, entertaining feedback from virtual versions of Mark Cuban, Kevin O'Leary, and Lori Greiner.

## What It Does

When invoked, the skill analyzes your entire project — code, docs, git history, team size, tech stack — and delivers a full Shark Tank episode complete with:

- A dramatic narrator intro
- A founder pitch (written in-character using your git author name)
- Shark reactions and dialogue with distinct personalities
- A detailed scorecard across 7 dimensions (scored out of 70)
- Honest pros, concerns, and hard questions
- A final verdict from each Shark — deal or no deal

## Usage

In Claude Code, run:

```
/shark-tank
```

Or say any of: `"rate this project"`, `"shark tank"`, `"would you invest"`

## Evaluation Criteria

| Category | What It Looks At |
|----------|-----------------|
| Problem & Market | What problem does this solve? Market size? |
| Product | UX thinking, feature completeness |
| Tech & Code Quality | Stack choices, architecture, code maturity |
| Traction & Momentum | Commit activity, team size, shipping velocity |
| Business Model | Revenue potential, viability |
| Competition & Moat | Competitive landscape, defensibility |
| Team Signal | What the codebase reveals about the team |

## Installation

Place the `SKILL.md` file in your project root or Claude Code skills directory. The skill will be automatically detected.

## License

MIT
