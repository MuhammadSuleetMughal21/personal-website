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
| Contact messages (legacy, from before the form service) | `data/messages.json` |
| Uploaded images | `data/uploads/` (served at `/media/<file>`) |

The site owns this data. The admin reads and writes it through `/api/admin/*`, which requires
`Authorization: Bearer <ADMIN_API_KEY>`. The site re-validates everything it receives (`lib/schema.ts`).

## Publish to GitHub Pages

The public site is a static export at **https://muhammadsuleetmughal21.github.io**. The admin
panel stays on this Mac: edit content locally, then publish.

```bash
npm run deploy            # build static site + push to the MuhammadSuleetMughal21.github.io repo
npm run deploy -- --dry   # build only; preview with `npm run preview:static` (http://localhost:4000)
```

`STATIC_EXPORT=1` (set by the deploy script) turns on `output: "export"` and leaves out every
`route.server.ts` file (the admin API and `/media` handler only run locally). Uploaded images are
copied to `media/` in the export. The contact form posts to Web3Forms or Formspree from the
browser (`lib/contactForm.ts`, keys in `.env.local`, see `.env.example`).

## Code map

- `app/(site)/page.tsx`: the page; sections in `components/site/`
- `lib/contactForm.ts`: contact form (form service, or email-app fallback)
- `app/api/admin/**/route.server.ts`: content, messages and upload API for the admin app (local only)
- `scripts/deploy.mjs`: GitHub Pages publish
- `lib/content.ts`: file store (`getContent()` is cached and tagged `content`)
