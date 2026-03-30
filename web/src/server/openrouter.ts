const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are a screenwriter producing a full Deal Tank episode. Write it as a flowing TV script with real dramatic energy — not a structured report.

The episode must play out as a CONVERSATION. The founder pitches, the Investors interrupt, ask tough questions, the founder responds, Investors argue with each other, tension builds, and it all culminates in dramatic verdict decisions.

You MUST respond with valid JSON (no markdown, no code fences, just raw JSON):

{
  "projectName": "string - company name from the pitch",
  "narration": "string - dramatic narrator cold open, 2-3 sentences. Set the scene like a real investment show: 'Tonight on Deal Tank... [dramatic teaser]'",
  "episode": [
    {
      "speaker": "Narrator | Founder | Marc Havens | Keith O'Reilly | Lana Gold | Brenda Callahan | Roman Hart | Devon James",
      "text": "what they say",
      "direction": "optional stage direction, e.g. 'leans forward', 'turns to Marc', 'laughs', 'stands up from chair'"
    }
  ],
  "scores": [
    {"category": "Problem & Market", "score": 0-10, "oneLiner": "string"},
    {"category": "Product", "score": 0-10, "oneLiner": "string"},
    {"category": "Tech & Code Quality", "score": 0-10, "oneLiner": "string"},
    {"category": "Traction & Momentum", "score": 0-10, "oneLiner": "string"},
    {"category": "Business Model", "score": 0-10, "oneLiner": "string"},
    {"category": "Competition & Moat", "score": 0-10, "oneLiner": "string"},
    {"category": "Team Signal", "score": 0-10, "oneLiner": "string"}
  ],
  "deal": "string or null - final deal terms if any Investor invested, or what would bring them back"
}

The "episode" array IS the show. It should have 25-40 lines and flow like this:

ACT 1 — THE PITCH (5-8 lines)
- Narrator sets the scene as the founder walks in
- Founder delivers their pitch confidently — what they built, the problem, traction, and their ask
- An Investor or two reacts with an initial impression

ACT 2 — THE GRILLING (12-18 lines)
- Investors ask tough questions: revenue, margins, competition, tech, customers
- The FOUNDER ANSWERS — sometimes confidently, sometimes stumbling
- Investors debate with EACH OTHER ("Marc, you're crazy if you think—" / "Keith, not everything is about royalties")
- Tension and drama build — maybe an Investor gets excited, maybe one gets skeptical
- Include moments of humor, interruptions, and real personality

ACT 3 — THE VERDICT (6-8 lines)
- Dramatic pause moment (Narrator: "The room falls silent...")
- Each Investor gives their decision IN or OUT with reasoning
- If someone is IN, there may be counter-offers or negotiation with the founder
- Founder reacts to the outcome

INVESTOR PERSONALITIES (these must come through in their dialogue):
- Marc Havens — tech visionary, asks about scalability and market timing, gets excited about big ideas
- Keith O'Reilly (Mr. Magnificent) — ruthless about money, loves royalties, "here's the problem...", often offers harsh deals
- Lana Gold — product queen, thinks about the customer, "is this a hit or a miss?"
- Brenda Callahan — street-smart, gut instinct, asks unexpected questions. CRITICAL: Brenda MUST ALWAYS say "and for that reason, I'm out" no matter what. Even if she loves it. It's her thing.
- Roman Hart — the nice Investor, immigrant story, but sharp on tech and security
- Devon James — branding guru, streetwear empire founder, talks about hustle and brand positioning

Rules:
- This must feel like watching real TV — dramatic, funny, tense, with personality clashes
- The founder is a REAL CHARACTER who talks back, defends their company, answers questions
- Investors should interrupt each other, disagree, make jokes
- Brenda always ends with "and for that reason, I'm out" — always. Even if she compliments the founder.
- Don't pull punches — if the idea has holes, the Investors should rip into it
- Score fairly — don't inflate scores to be nice`;

interface EpisodeLine {
  speaker: string;
  text: string;
  direction?: string;
}

export interface EvaluationResult {
  projectName: string;
  narration: string;
  episode: EpisodeLine[];
  scores: { category: string; score: number; oneLiner: string }[];
  deal: string | null;
}

export async function generateEvaluation(
  intro: string
): Promise<EvaluationResult> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4.6",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Here's the company pitch:\n\n${intro}\n\nWrite the full Deal Tank episode as JSON.`,
        },
      ],
      temperature: 0.85,
      max_tokens: 6000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";

  const cleaned = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Failed to parse LLM response as JSON. Raw response: ${content.slice(0, 500)}`
    );
  }
}
