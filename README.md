# Shark Tank

A Claude Code skill that evaluates your project as if you're pitching it on Shark Tank. Get brutally honest, entertaining feedback from virtual versions of Mark Cuban, Kevin O'Leary, Lori Greiner, and Barbara Corcoran.

## What It Does

When invoked, the skill analyzes your entire project — code, docs, git history, team size, tech stack — and delivers a full Shark Tank episode complete with:

- A dramatic narrator intro
- A founder pitch (written in-character using your git author name)
- Shark reactions and dialogue with distinct personalities
- A detailed scorecard across 7 dimensions (scored out of 70)
- Honest pros, concerns, and hard questions
- A final verdict from each Shark — deal or no deal

## Usage

In Claude Code, on any of your working project, run:

```
/shark-tank
```

Or say any of: `"rate this project"`, `"shark tank"`, `"would you invest"`

## Installation

Place the `SKILL.md` file in your project root or Claude Code skills directory. The skill will be automatically detected.

## Example Output

Here's what you get when you run `/shark-tank` (this was run on this very repo):

---

### SHARK TANK

#### *[dramatic narrator voice]*

> *"Tonight on Shark Tank... a developer walks in with no app, no code, no backend — just a single markdown file that turns an AI into a reality TV show. It's meta. It's absurd. And it might just be brilliant. Will the Sharks bite? Or will this founder leave empty-handed?"*

---

#### THE PITCH

*[The founder walks into the Tank]*

> *"Hello Sharks! My name is Jae Lee, and I'm the founder of **Shark Tank**.*
>
> *Every developer ships code and wonders — is this actually good? Is this something people would pay for? Right now, the only way to get that feedback is to ask a friend who'll say 'looks great,' or post on Reddit and get roasted. My product turns Claude Code into a full panel of Shark Tank investors that rip apart your project — evaluating your code, your market, your business model — and delivers it as a full dramatic episode. It's code review meets entertainment. It's honest feedback that developers actually want to read.*
>
> *And today, I'm asking for $50,000 for 20% of my company."*

---

#### THE SHARKS REACT

> **Kevin**: "Okay, so let me get this straight. You walked into the Shark Tank... to pitch a Shark Tank. You have no revenue, no users, no app — you have a *prompt*. You're telling me this entire company is two markdown files?"
>
> **Jae**: "Kevin, it's a skill for Claude Code. Anyone can install it and —"
>
> **Kevin**: "You're valuing a markdown file at $250,000. I want you to hear yourself say that."

> **Mark**: "Hold on Kevin, I actually think this is kind of clever. The Claude Code skills ecosystem is brand new. This is like being the first app in an app store. The question is — is this a product or is this a feature? Because if Anthropic just builds this into Claude Code tomorrow, you're dead."
>
> **Jae**: "That's a fair point, but —"
>
> **Mark**: "It's not a point, it's a *fact*."

> **Lori**: "I want to go back to the user experience for a second. I actually love the format — the narrator, the dialogue, the scorecard. As a developer, I would genuinely enjoy reading this. It makes feedback *fun*. But Jae, you launched today. Two commits. This is an idea, not a business."

> **Barbara**: "You know what, Jae? I gotta hand it to you — you walked into the actual Shark Tank to pitch a virtual Shark Tank. That takes guts. I respect the hustle. You clearly understand branding and entertainment value... and for that reason, I'm out."

---

#### THE SCORECARD

| Category | Score | One-liner |
|----------|-------|-----------|
| Problem & Market | 5/10 | Real pain point (developer feedback), but extremely niche market |
| Product | 6/10 | The prompt is well-crafted and entertaining, but it's a single file |
| Tech & Code Quality | 4/10 | There's no tech — it's a markdown prompt. Well-written, but no code to evaluate |
| Traction & Momentum | 1/10 | Two commits, one contributor, launched today |
| Business Model | 1/10 | No revenue model, no monetization path, it's a free open-source skill |
| Competition & Moat | 2/10 | Anyone can copy a markdown file — zero defensibility |
| Team Signal | 4/10 | Solo founder shipping fast, clear creative vision, but no evidence of a team |

**Overall Score: 23/70**

---

#### THE GOOD

- The SKILL.md prompt is genuinely well-engineered — structured, entertaining, with clear personality differentiation between Sharks
- Solves a real emotional need: developers crave honest, structured feedback on their projects
- The entertainment wrapper makes harsh feedback palatable — that's a real UX insight
- Early mover in the Claude Code skills ecosystem
- Clean repo structure, good README, shipped fast

#### THE CONCERNS

- The entire "product" is two markdown files — there's no software, no moat, no barrier to entry
- Zero traction: 2 commits, 1 contributor, created today
- No monetization strategy whatsoever — this is a fun open-source tool, not a business
- Trivially copyable — anyone can fork this in 5 seconds
- If Claude Code ever builds evaluation features natively, this is instantly obsolete

#### THE HARD QUESTIONS

- *Kevin leans forward: "What's stopping me from copying your SKILL.md right now and making my own version? What do you actually own here?"*
- *Mark crosses his arms: "You say this is a product. Walk me through how this makes a single dollar. Ever."*
- *Lori tilts her head: "How many people have actually used this? And I don't mean you testing it — I mean real users, giving you real feedback."*
- *Barbara squints: "Jae, be honest with me — did you build this today? Like, literally today?"*

---

#### THE VERDICT

*[Dramatic pause...]*

> **Kevin**: *"Here's the thing, Jae. I love the creativity, I really do. But you're asking me to invest in a markdown file. I need revenue, I need customers, I need a royalty. You have none of those things."* — **I'M OUT.**
>
> **Mark**: *"Look, I think the Claude Code skills space is interesting, and you're clearly a creative thinker. But this isn't a business yet — it's a weekend project. Come back when you've got a platform, a community, and some distribution."* — **I'M OUT.**
>
> **Lori**: *"I love the user experience and the entertainment angle — that's genuinely clever. But I invest in products I can put on shelves, and this... isn't a product yet."* — **I'M OUT.**
>
> **Barbara**: *"Jae, I think you're onto something real. Developers are starving for honest feedback, and you found a way to make it fun. You've got instincts, you've got creativity, and honestly I think you could build this into something bigger... and for that reason, I'm out."*

**THE DEAL**: No deal today. But the Sharks agree — if Jae came back with a platform of curated Claude Code skills, a community of developers using them, and maybe a premium tier with deeper analysis... that's a different conversation. The seed of an idea is here. It just needs to grow.

*[Narrator: "And with that, Jae Lee walks out of the Tank with no deal — but with a smile. Sometimes the best thing the Sharks can give you isn't money... it's a reality check. Stay tuned for the update segment..."]*

---

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
