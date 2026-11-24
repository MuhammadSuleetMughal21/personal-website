# personal-website

Animated portfolio for a mobile app developer: Next.js 16, GSAP (ScrollTrigger + SplitText),
Motion, Lenis smooth scroll, Tailwind v4.

Content is edited from the separate admin app in `../personal-website-admin`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

`.env.local` needs `ADMIN_API_KEY`, a shared secret the admin app sends with each request.

## Data

| What | File |
| --- | --- |
| Site content | `data/content.json` (local, and the seed) / `site_content` table (Vercel) |
| Contact messages | `data/messages.json` (local) / `messages` table (Vercel) |
| Images | `public/media/` (shipped + local uploads) / Vercel Blob (uploads on Vercel) |

The site owns this data. The admin reads and writes it through `/api/admin/*`, which requires
`Authorization: Bearer <ADMIN_API_KEY>`. The site re-validates everything it receives (`lib/schema.ts`).

## Deploy (Vercel)

Both apps run on Vercel as separate projects. On Vercel the site stores content and contact
messages in Postgres (Neon) and admin image uploads in Vercel Blob:

- `DATABASE_URL`: set by Vercel's Neon integration (Storage → Neon). An empty database is seeded
  from `data/content.json` on first use; tables are created automatically.
- `BLOB_READ_WRITE_TOKEN`: set by connecting a Blob store (Storage → Blob).
- `ADMIN_API_KEY`: same value as in the admin project.

Without `DATABASE_URL` (local), everything uses the files in `data/` and uploads go to `public/media/`.
Images that ship with the site live in `public/media/` (served at `/media/<file>`).

## Code map

- `app/(site)/page.tsx`: the page; sections in `components/site/`
- `app/actions.ts`: contact form (saves to the admin inbox)
- `app/api/admin/`: content, messages and upload API for the admin app
- `lib/content.ts`: store (Postgres or files; `getContent()` is cached and tagged `content`)
