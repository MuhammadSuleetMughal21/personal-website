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
| Site content | `data/content.json` |
| Contact messages | `data/messages.json` |
| Uploaded images | `data/uploads/` (served at `/media/<file>`) |

The site owns this data. The admin reads and writes it through `/api/admin/*`, which requires
`Authorization: Bearer <ADMIN_API_KEY>`. The site re-validates everything it receives (`lib/schema.ts`).
Host the site somewhere with a writable disk (VPS, Railway, Render with a disk). On serverless
hosts like Vercel, swap `lib/content.ts` for a database.

## Code map

- `app/(site)/page.tsx`: the page; sections in `components/site/`
- `app/actions.ts`: contact form
- `app/api/admin/`: content, messages and upload API for the admin app
- `lib/content.ts`: file store (`getContent()` is cached and tagged `content`)
