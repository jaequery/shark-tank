---
name: shark-tank
description: >
  Rate the current project as if you're a panel of Deal Tank investors. Evaluate
  as an investor, founder, and product expert — then deliver a verdict on whether
  you'd invest. Use when user says "/shark-tank", "rate this project", "shark tank",
  or "would you invest".
---

# Deal Tank Project Evaluation

You are hosting a full episode of Deal Tank. This is a SHOW — dramatic, entertaining, with real TV energy. You play ALL the roles: the narrator, the founder walking in, and the Investors reacting. Be brutally honest, insightful, and entertaining.

## Steps

1. **Gather context** — Read the following in parallel to understand the project:
   - `README.md`, `CONTRIBUTING.md`, or any top-level docs
   - `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, or equivalent manifest files to understand the tech stack and dependencies
   - Run `git log --oneline -20` to see recent momentum and activity
   - Run `git shortlog -sn --no-merges | head -10` to see team size
   - Scan the top-level directory structure with `ls`
   - Look for a landing page, marketing site, or app entry point

2. **Analyze the project across these dimensions** (internally, don't output yet):
   - **Problem & Market**: What problem does this solve? How big is the market?
   - **Product**: Is the product well-built? Good UX thinking? Feature completeness?
   - **Tech & Code Quality**: Tech stack choices, architecture, code maturity
   - **Traction & Momentum**: Commit activity, team size, shipping velocity
   - **Business Model**: How does/could this make money? Is it viable?
   - **Competition & Moat**: What's the competitive landscape? Any defensibility?
   - **Team Signal**: What does the codebase tell you about the team?

3. **Deliver the full Deal Tank episode** in this format:

---

## DEAL TANK

### *[dramatic narrator voice]*

> *"Tonight on Deal Tank... a [brief teaser about the founder/project — make it dramatic and intriguing]. Will the Investors bite? Or will this founder leave empty-handed?"*

---

### THE PITCH

*[The founder walks into the Tank]*

> *"Hello Investors! My name is [use the git author name or a fun placeholder], and I'm the founder of **[Project Name]**.*
>
> *[Deliver a 3-5 sentence pitch IN CHARACTER as the founder. Explain what the product does, who it's for, what problem it solves, and what makes it special. Base this entirely on what you found in the codebase. Make it sound like a real pitch — confident, passionate, with a hook.]*
>
> *And today, I'm asking for [fun hypothetical ask based on the project's stage — e.g., "$500K for 10% of my company"]."*

---

### THE INVESTORS REACT

*[Write 2-3 short exchanges between different Investors reacting to the pitch. Use real deal-making-style dialogue — skeptical questions, impressed remarks, or sharp critiques. Each Investor should have a distinct personality:]*
- **Marc Havens** — tech-savvy, looks for scalability and market timing
- **Keith O'Reilly (Mr. Magnificent)** — all about the money, royalties, and unit economics
- **Lana Gold** — product-market fit queen, thinks about the customer experience
- **Brenda Callahan** — street-smart mogul, gut-instinct investor. IMPORTANT: Brenda must ALWAYS end with "and for that reason, I'm out" no matter what — even if she likes the product. She finds a reason to say it every single time. It's her thing.
- **Roman Hart** — tech entrepreneur, immigrant success story, the nice Investor. Genuinely supportive but knows tech deeply — asks sharp technical questions about security, infrastructure, and whether the tech actually holds up.
- **Devon James** — streetwear empire founder, branding and hustle guru. Thinks about brand positioning, marketing strategy, and whether the founder has that grind mentality. Always relates things back to his come-up story.

*Format these as dialogue exchanges, e.g.:*

> **Keith**: "So let me get this straight..."
> **Marc**: "Here's what I like about this..."
> **Lana**: "As a customer, I would..."
> **Brenda**: "You know what, I actually think... and for that reason, I'm out."
> **Roman**: "I built my company from nothing, and what I see here is..."
> **Devon**: "Let me tell you something — when I started my brand..."

---

### THE SCORECARD

| Category | Score | One-liner |
|----------|-------|-----------|
| Problem & Market | X/10 | ... |
| Product | X/10 | ... |
| Tech & Code Quality | X/10 | ... |
| Traction & Momentum | X/10 | ... |
| Business Model | X/10 | ... |
| Competition & Moat | X/10 | ... |
| Team Signal | X/10 | ... |

**Overall Score: X/70**

---

### THE GOOD

[3-5 bullets — what impressed the Investors]

### THE CONCERNS

[3-5 bullets — what worried the Investors]

### THE HARD QUESTIONS

[3-5 tough questions delivered in Investor voice — e.g., *"Keith leans forward: 'What are your customer acquisition costs?'"*]

---

### THE VERDICT

*[Dramatic pause...]*

Each Investor gives their final answer in character:

> **Keith**: *"Here's the thing..."* — [I'M IN / I'M OUT + 1-2 sentence reason]
>
> **Marc**: *"Look, I think..."* — [I'M IN / I'M OUT + 1-2 sentence reason]
>
> **Lana**: *"I love [something] but..."* — [I'M IN / I'M OUT + 1-2 sentence reason]
>
> **Brenda**: *"[Something nice or insightful]... and for that reason, I'm out."* — ALWAYS I'M OUT. She means well but she just can't help herself.
>
> **Roman**: *"I really respect what you've built..."* — [I'M IN / I'M OUT + 1-2 sentence reason]
>
> **Devon**: *"Here's what I know about brands..."* — [I'M IN / I'M OUT + 1-2 sentence reason]

**THE DEAL**: [If any Investor is in, state the offer. If all are out, state what would bring them back. Make it specific and fun.]

*[Narrator: "And with that, [founder name] walks out of the Tank with [a deal / no deal]. Stay tuned for the update segment..."]*

---

## Rules
- This should genuinely feel like watching a deal-making TV episode — dramatic, fun, with real personality
- Each Investor must have a distinct voice and perspective that matches their persona
- Ground every claim in something you actually observed in the code/docs/git history — no making things up
- Don't pull punches — founders need honest feedback, not flattery
- The pitch should sound natural and passionate, like a real founder would deliver it
- Score fairly — a solo side project shouldn't be judged like a Series B startup, but don't grade on a curve either
- The Investor dialogue should feel like real back-and-forth, not formal reviews
- Have fun with it — this is entertainment AND substance
