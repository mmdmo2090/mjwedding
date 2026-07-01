# mjwedding

Our wedding website — built with Next.js (App Router), Tailwind, and Prisma/Postgres (Neon, via Vercel's Storage integration).

## What's here

- **Static pages**: Home, Our Story, Details, Gallery, Registry (`src/app/*/page.tsx`). Content is placeholder text in brackets (e.g. `[Partner 1]`) — edit directly in those files.
- **Gallery**: drop image files into `public/images/gallery/` and they show up automatically — no code changes needed.
- **RSVP flow**: guests enter a household's invite code at `/rsvp`, land on `/rsvp/[code]`, and submit attendance/meal/dietary info per guest plus one shared notes field. Open "plus-one" slots (up to that household's `maxGuests`) appear as blank name fields that create new guests on submit.
- **Database**: Postgres (Neon), accessed via Prisma. Schema lives in `prisma/schema.prisma` — two models, `Household` and `Guest`.

## Setting up your guest list (CSV import)

The guest list is imported once via a CSV file, which also generates each household's unique invite code.

1. Copy the example file and fill it in:
   ```bash
   cp data/guests.example.csv data/guests.csv
   ```
2. Edit `data/guests.csv` — one row per guest, grouped by household:
   ```csv
   household,maxGuests,firstName,lastName,isChild
   Smith Family,4,John,Smith,false
   Smith Family,4,Jane,Smith,false
   Doe Family,2,Alex,Doe,false
   ```
   - `household` — groups rows into one household (all rows with the same name become one invite).
   - `maxGuests` — the total number of people that household is allowed to bring (repeat the same number on every row for that household). Any gap between the number of listed guests and `maxGuests` becomes an open "plus-one" slot on the RSVP form.
   - `isChild` — `true`/`false`, informational only right now (doesn't change form behavior yet).
3. Run the seed script:
   ```bash
   npm run db:seed
   ```
   This prints each household's generated invite code (e.g. `SMITHFAM-7K2`) — that's what goes on the invitation/email.
4. `data/guests.csv` is gitignored (it has real guest names), so it only exists on your machine. `data/guests.example.csv` is the tracked template.

You can re-run `npm run db:seed` with a different file by passing a path: `npm run db:seed -- path/to/other.csv`. Note it only *creates* new households — running it twice with the same CSV creates duplicates, so only use it for the initial import (or clear the household/guest tables first — see below).

## Local development

Requires Node.js (LTS) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database connection

This project reads `MJWEDDING_DATABASE_URL` (pooled, for the app) and `MJWEDDING_POSTGRES_URL_NON_POOLING` (direct, for migrations) — these are the names Vercel's Neon integration actually injects, prefixed with the storage integration's name. To get real values locally:

```bash
npx vercel link      # one-time, links this folder to the Vercel project
npx vercel env pull .env.local
```

If `vercel env pull` comes back with empty values (a known glitch with the Neon marketplace integration), copy the connection strings shown on the database's page in the Vercel dashboard (Storage tab) directly into `.env` and `.env.local`, using the `MJWEDDING_DATABASE_URL` / `MJWEDDING_POSTGRES_URL_NON_POOLING` names.

### Useful commands

```bash
npx prisma studio       # browse/edit the database in a local web UI
npx prisma db push      # sync prisma/schema.prisma to the database (no migration files)
npm run db:seed         # import data/guests.csv (see above)
npm run build            # production build (also type-checks)
```

### Clearing test data

There's no dedicated script for this since it's rarely needed — run this once if you want to wipe all households/guests (e.g. after testing):

```bash
npx tsx -e '
import "dotenv/config";
import { prisma } from "@/lib/prisma";
prisma.guest.deleteMany().then(() => prisma.household.deleteMany()).then(() => process.exit(0));
'
```

## RSVP deadline

`src/lib/rsvp.ts` has an `RSVP_DEADLINE` constant (currently a placeholder). After that date, the RSVP form switches to a read-only "deadline passed" message. Update it once your real date is set.

## Deployment

Connected to Vercel — pushes to `main` auto-deploy. The Postgres database (Neon) is provisioned through Vercel's Storage tab and its connection strings are injected as env vars automatically (see above for the `MJWEDDING_` prefix quirk).

Notes for the couple:
- Vercel login: see Dashlane.
