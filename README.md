# Deal Tank

A Claude Code plugin that evaluates your project as if you're pitching it on Deal Tank. Get brutally honest, entertaining feedback from a panel of virtual investors — **Victor Chen**, **Sterling Cross**, **Nina Pascale**, **Gloria Vance**, **Sasha Petrov**, and **Malik Thompson**.

## What It Does

When invoked, the skill analyzes your entire project — code, docs, git history, team size, tech stack — and delivers a full Deal Tank episode complete with:

- A dramatic narrator intro
- A founder pitch (written in-character using your git author name)
- Investor reactions and dialogue with distinct personalities
- A detailed scorecard across 7 dimensions (scored out of 70)
- Honest pros, concerns, and hard questions
- A final verdict from each Investor — deal or no deal

## Installation

### From the plugin directory

```bash
git clone https://github.com/jaelee/deal-tank.git
claude --plugin-dir ./deal-tank
```

### Manual installation

Copy the skill into your Claude Code skills directory:

```bash
# User-level (available in all projects)
mkdir -p ~/.claude/skills/deal-tank
cp skills/deal-tank/SKILL.md ~/.claude/skills/deal-tank/

# Project-level (shared via version control)
mkdir -p .claude/skills/deal-tank
cp skills/deal-tank/SKILL.md .claude/skills/deal-tank/
```

## Usage

In Claude Code, on any project:

```
/deal-tank
```

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

## License

MIT
