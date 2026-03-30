# Abuse Protection Plan for Deal Tank Web App

## Context

The web app at `/web/` calls OpenRouter (Claude Sonnet 4.6) using your API key — every evaluation costs ~7-8K tokens of your money. Currently there is **zero protection**: no rate limiting, no auth, no CORS, and the delete endpoint lets anyone delete any record. A single `curl` loop could drain your entire OpenRouter budget in minutes.

**Urgent:** Your API key (`sk-or-v1-4ee12ee...`) is in `.env` which may be committed to git. Rotate it immediately regardless of this plan.

---

## Implementation Plan

### Step 0: Rotate API Key + Secure `.env`
- Rotate the OpenRouter API key on the OpenRouter dashboard
- Ensure `/web/.env` is in `.gitignore` (it's already in root `.gitignore` — verify for `/web/`)
- Set a **monthly spending cap** on OpenRouter (e.g. $20/month) + alerts at 50%/80%

### Step 1: IP-Based Rate Limiting on `generate` (Highest Impact)

**New file:** `web/src/server/rate-limit.ts`
- In-memory sliding window rate limiter using `Map<string, number[]>`
- `checkRateLimit(key, limit, windowMs)` — throws `TRPCError('TOO_MANY_REQUESTS')` if exceeded
- Periodic cleanup every 10 min to prevent memory leak
- Limits: **5 evaluations per IP per hour**

**Modify:** `web/src/app/api/trpc/[trpc]/route.ts`
- Extract IP from `x-forwarded-for` / `x-real-ip` headers
- Pass into tRPC context: `createContext: () => ({ ip })`

**Modify:** `web/src/server/trpc.ts`
- Define `Context` type with `ip: string | null`
- Create `rateLimitedProcedure` using a tRPC middleware that calls `checkRateLimit`

**Modify:** `web/src/server/routers/evaluation.ts`
- Switch `generate` from `publicProcedure` → `rateLimitedProcedure`

### Step 2: Delete Token for Ownership

**Modify:** `web/prisma/schema.prisma`
- Add `deleteToken String` column to `Evaluation`

**Modify:** `web/src/server/routers/evaluation.ts`
- `generate`: create `deleteToken` via `crypto.randomUUID()`, store in DB, return to client
- `delete`: require `deleteToken` input, verify it matches before deleting
- `list` / `getById`: exclude `deleteToken` from returned data

**Modify:** `web/src/app/_components/evaluation-form.tsx`
- Store returned `deleteToken` in `localStorage` keyed by evaluation ID

**Modify:** evaluation detail page
- Only show delete button if `localStorage` has a token for that ID

### Step 3: Honeypot + Minimum Submit Time (Bot Protection)

**Modify:** `web/src/app/_components/evaluation-form.tsx`
- Add hidden honeypot input (`name="website"`, off-screen via CSS)
- Record `Date.now()` on mount, submit it as a hidden field
- Minimum 3 seconds between page load and submit

**Modify:** `web/src/server/routers/evaluation.ts`
- Add optional `honeypot` and `timestamp` to input schema
- If honeypot is filled or submit < 3s, reject silently (don't call OpenRouter)

### Step 4: CORS + Security Headers

**New file:** `web/src/middleware.ts`
- Restrict `Access-Control-Allow-Origin` to production domain
- Add `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- Return 403 for API requests from unknown origins

### Step 5: Tighten Input Validation

**Modify:** `web/src/server/routers/evaluation.ts`
- Change Zod schema from `.min(1).max(5000)` → `.trim().min(20).max(5000)`
- Prevents whitespace-only or trivially short submissions from burning tokens

---

## Files to Modify

| File | Changes |
|------|---------|
| `web/src/server/rate-limit.ts` | **NEW** — in-memory rate limiter |
| `web/src/middleware.ts` | **NEW** — CORS + security headers |
| `web/src/server/trpc.ts` | Add Context type, rateLimitedProcedure |
| `web/src/app/api/trpc/[trpc]/route.ts` | Extract IP into context |
| `web/src/server/routers/evaluation.ts` | Rate limit, delete token, honeypot, stricter Zod |
| `web/prisma/schema.prisma` | Add `deleteToken` column |
| `web/src/app/_components/evaluation-form.tsx` | Honeypot, timestamp, store delete token |
| Evaluation detail page | Conditional delete button |
| `web/.gitignore` | Ensure `.env` is listed |

## What We're NOT Doing (Intentionally)

- **No user auth / login** — stays free and frictionless
- **No Redis / Upstash** — in-memory is fine for single-process low-traffic app
- **No CAPTCHA** — honeypot + timing + rate limit is sufficient for now
- **No WAF / Cloudflare** — can add later if abuse materializes

## Verification

1. Run `npx prisma migrate dev` to apply schema change
2. Start dev server, submit an evaluation — confirm rate limit headers appear
3. Submit 6 evaluations rapidly — confirm 6th is rejected with rate limit error
4. Verify delete requires correct token (try wrong token → should fail)
5. Submit form with honeypot filled → should be silently rejected
6. Submit form in < 3s → should be rejected
7. Check OpenRouter dashboard for spending cap confirmation
