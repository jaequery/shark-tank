# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Claude Code skill** — not a traditional software project. The entire product is a single `SKILL.md` file that turns Claude Code into a Deal Tank episode, evaluating any project the user runs it on.

There is no build system, no tests, no dependencies, and no runtime code. The skill is invoked via `/shark-tank` in Claude Code.

## Repository Structure

- `.claude-plugin/plugin.json` — Plugin manifest (name, version, metadata).
- `skills/shark-tank/SKILL.md` — The skill definition (YAML frontmatter + prompt). This is the product.
- `README.md` — Documentation and installation instructions.
- `LICENSE` — MIT license.

## How the Skill Works

`SKILL.md` contains structured instructions that Claude Code follows when `/shark-tank` is invoked:

1. **Gather context** — Reads project docs, manifest files, git history, and directory structure in parallel
2. **Analyze** — Evaluates across 7 dimensions (Problem & Market, Product, Tech & Code Quality, Traction & Momentum, Business Model, Competition & Moat, Team Signal)
3. **Deliver** — Outputs a full Deal Tank episode with narrator, founder pitch, Investor dialogue, scorecard (X/70), and verdict

## Investor Panel

Six Investors with distinct personalities: Marc Havens (tech/scalability), Keith O'Reilly (money/unit economics), Lana Gold (product-market fit/UX), Brenda Callahan (gut instinct — **always says "I'm out"**), Roman Hart (tech depth/security), Devon James (branding/hustle).

## Key Constraint

Brenda Callahan must **always** end with "and for that reason, I'm out" — even if she likes the product. This is an intentional running gag baked into the skill.

## Installation

This repo follows the Claude Code plugin structure. Users can install via `claude --plugin-dir ./shark-tank` or manually copy `skills/shark-tank/SKILL.md` into their `~/.claude/skills/shark-tank/` or `<project>/.claude/skills/shark-tank/` directory.
