#!/usr/bin/env node
/**
 * Publish the portfolio to GitHub Pages.
 *
 *   npm run deploy            build + push to https://muhammadsuleetmughal21.github.io
 *   npm run deploy -- --dry   build + prepare only, no push (preview with `npm run preview:static`)
 *
 * Flow: static export (STATIC_EXPORT=1 → .next-export/), copy data/uploads → media/,
 * add .nojekyll, then commit the result into a clone of the Pages repo (.deploy/) and push.
 * Override the target with DEPLOY_REPO=<git url> and DEPLOY_BRANCH=<branch>.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, ".next-export");
const DEPLOY = path.join(ROOT, ".deploy");
const UPLOADS = path.join(ROOT, "data", "uploads");
const REPO = process.env.DEPLOY_REPO ?? "https://github.com/MuhammadSuleetMughal21/MuhammadSuleetMughal21.github.io.git";
const BRANCH = process.env.DEPLOY_BRANCH ?? "main";
const DRY = process.argv.includes("--dry");

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: "inherit", cwd: ROOT, ...opts });
const git = (args, opts = {}) => execFileSync("git", ["-C", DEPLOY, ...args], { encoding: "utf-8", ...opts });
const step = (msg) => console.log(`\n▸ ${msg}`);

step("Building static site");
rmSync(OUT, { recursive: true, force: true });
run("npx", ["next", "build"], { env: { ...process.env, STATIC_EXPORT: "1" } });

step("Copying uploaded images to media/");
mkdirSync(path.join(OUT, "media"), { recursive: true });
let count = 0;
for (const f of readdirSync(UPLOADS)) {
  if (f.startsWith(".")) continue;
  cpSync(path.join(UPLOADS, f), path.join(OUT, "media", f));
  count++;
}
console.log(`  ${count} images`);
// Without this, GitHub Pages runs Jekyll, which drops the `_next/` folder.
writeFileSync(path.join(OUT, ".nojekyll"), "");

if (DRY) {
  console.log(`\n✓ Dry run: site ready in .next-export/ (not pushed). Preview: npm run preview:static → http://localhost:4000`);
  process.exit(0);
}

step(`Preparing ${REPO} (${BRANCH})`);
if (!existsSync(path.join(DEPLOY, ".git"))) {
  rmSync(DEPLOY, { recursive: true, force: true });
  try {
    run("git", ["clone", "--quiet", REPO, DEPLOY]);
  } catch {
    console.error(
      `\n✗ Couldn't clone ${REPO}.\n  Create the repository on GitHub first (public, named MuhammadSuleetMughal21.github.io),\n  and make sure this Mac is signed in to GitHub as MuhammadSuleetMughal21.`,
    );
    process.exit(1);
  }
}
const hasRemoteBranch = git(["ls-remote", "--heads", "origin", BRANCH]).trim() !== "";
if (hasRemoteBranch) {
  git(["fetch", "--quiet", "origin", BRANCH]);
  git(["checkout", "--quiet", "-B", BRANCH, `origin/${BRANCH}`]);
} else {
  git(["checkout", "--quiet", "--orphan", BRANCH]);
}

// Replace everything except .git with the fresh build.
for (const f of readdirSync(DEPLOY)) if (f !== ".git") rmSync(path.join(DEPLOY, f), { recursive: true, force: true });
cpSync(OUT, DEPLOY, { recursive: true });

git(["add", "-A"]);
if (git(["status", "--porcelain"]).trim() === "") {
  console.log("\n✓ Nothing changed since the last publish.");
  process.exit(0);
}
git(["commit", "--quiet", "-m", `Publish site ${new Date().toISOString().slice(0, 16).replace("T", " ")}`]);

step("Pushing");
try {
  git(["push", "--quiet", "origin", `HEAD:${BRANCH}`], { stdio: "inherit" });
} catch {
  console.error(
    `\n✗ Push failed. This Mac's GitHub login probably isn't MuhammadSuleetMughal21 (or lacks access).\n  Fix the login, then run \`npm run deploy\` again; the commit is kept in .deploy/.`,
  );
  process.exit(1);
}
console.log("\n✓ Published. Live in about a minute at https://muhammadsuleetmughal21.github.io");
