# Awka Youth Forum, Lagos Chapter — website

Next.js (App Router) + Prisma + Postgres, built against the AYF BRD. This is
a **scaffold**: the architecture, data model, auth, and one full vertical
slice (member registration → admin approval) are wired up end to end. Most
public pages read from the database and render correctly, but will show
empty states until content (executives, events, news, gallery) is added
through the admin dashboard — several sections of the dashboard itself
(events/news/gallery CRUD, dues, attendance) are still TODO stubs, following
the same pattern as `/admin/members`.

## Stack

- **Next.js 14** (App Router, Server Actions)
- **Prisma** + **Postgres** (built for Vercel Postgres / Neon)
- **Auth.js (NextAuth v5)** — admin login only, credentials + bcrypt, JWT sessions
- **Zod** — validation on every form/server action
- **Upstash Ratelimit** — throttles the public registration/contact forms

## Design system

White canvas, black for structure/text, one red accent (`#ED2727`, sampled from the
actual AYF logo) — no gradients, no pastel palette. Tokens live in `app/globals.css`:
`--ink`, `--red`, `--red-deep`, `--red-tint`, `--line`, `--radius` (10px). Reuse the
existing classes rather than inventing new inline styles:

- `.card` / `.card-grid` — general content cards
- `.hero`, `.motto-strip`, `.why-grid`, `.featured-event` — homepage sections
- `.event-card`, `.date-badge` — event listings
- `.numbered-list` — numbered content (use for genuine sequences only)
- `.field`, `form.card`, `.msg` — forms
- `.member-list`, `.member-row`, `.badge` — admin list views
- `.stat-card` — KPI tiles; **admin dashboard only**, never the public site
- `.empty`, `.todo-note` — empty states and build-status callouts

Navigation is one client component, `components/AppNav.tsx`: a pill-tab bar on
desktop, a fixed bottom icon bar (Home / Events / Join / Involved / More) on mobile,
and a shared bottom sheet for the rest of the links. `/public/logo.jpg` and
`/public/hero-photo.jpg` are the two images you originally uploaded, already sized
for the web.

## Local setup

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL / DIRECT_URL from your Vercel Postgres instance,
# and AUTH_SECRET (npx auth secret)

npx prisma migrate dev --name init
npm run prisma:seed        # loads the 140 legacy members from the spreadsheet
npm run dev
```

Create the first admin account directly against the database (there's no
public admin sign-up route, deliberately):

```ts
// one-off script, e.g. scripts/create-admin.ts
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

await prisma.adminUser.create({
  data: {
    name: "Your Name",
    email: "you@example.com",
    passwordHash: await bcrypt.hash("a-strong-password", 12),
    role: "SUPER_ADMIN",
  },
});
```

## Deploying to Vercel

This app is a Next.js 14 App Router project. Vercel should detect the framework
automatically. `npm run build` runs `prisma generate`, then `prisma migrate deploy`
(needs `DIRECT_URL`), then `next build`.

1. Push the repo to GitHub and import it into Vercel.
2. Storage → **Postgres**: copy into project env (Production **and** Preview):
   - `POSTGRES_PRISMA_URL` → `DATABASE_URL` (pooled, `sslmode=require`)
   - `POSTGRES_URL_NON_POOLING` → `DIRECT_URL` (migrations only)
3. Set `AUTH_SECRET` (`npx auth secret`) and `AUTH_TRUST_HOST=true` on Production
   and Preview. **Do not** set `AUTH_URL` / `NEXTAUTH_URL` to `localhost` — preview
   URLs change every deploy and login will throw `UntrustedHost`.
4. Before public traffic: Upstash Redis (`UPSTASH_REDIS_REST_*`) for Join/Contact
   rate limits, and Vercel Blob (`BLOB_READ_WRITE_TOKEN`) for gallery/exec photos.
5. After the first successful deploy, seed once (`vercel env pull && npm run prisma:seed`).
   Do not put seed in the build — it is not idempotent for every table.

Runtime map: middleware stays on **Edge** (JWT cookie only). Prisma, bcrypt, and
Server Actions stay on **Node**. Admin JWT sessions are the right model for
serverless — do not switch to database sessions. Member OTP (when built) is the
same: a second JWT cookie, still no always-on worker. SMS goes out from a Node
Server Action (Twilio/Termii), not an Edge function.

## What's flagged for your review before launch

- **8 members (4 pairs)** in `prisma/members-seed.json` share a phone number
  with another row from the original spreadsheet — imported as active
  members but marked `needsReview: true`, visible on `/admin/members`.
- **"Umuzocha" vs "Umuzuocha"** in the village list — kept as two separate
  villages since it wasn't clear whether that's a typo or two real Onuku.
- Every `[To be provided]` in the BRD (phone number, WhatsApp number, social
  links, executive names/photos/bios, dues amount, welfare benefit amounts)
  — the schema and pages are ready for this content, it just isn't in yet.

## Security notes

- Admin passwords are bcrypt-hashed, never logged; the credential surface is
  limited to the ~12 executive-office accounts, not members.
- Every approve/reject action writes to `AuditLog` with the acting admin's ID.
- Public forms are rate-limited by IP; Prisma parameterizes every query.
- Member registration deliberately collects birth **day + month only**, not
  a full date of birth, given the BRD's own note about handling under-18
  members' data carefully.
- `middleware.ts` blocks unauthenticated access to `/admin/*`, but every
  Server Action also re-checks the session independently — don't rely on
  middleware alone when adding new mutating actions.
