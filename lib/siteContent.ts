/**
 * Where the public page gets its content. Locally this is the cached reader that
 * the admin panel revalidates; the GitHub Pages export swaps this module for
 * `siteContent.static.ts` (see `turbopack.resolveAlias` in next.config.ts).
 */
export { getContent } from "./content";
