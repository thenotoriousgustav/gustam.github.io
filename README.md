# Gustam Rheza Portfolio

Next.js portfolio with Payload CMS 3 at `/admin`, PostgreSQL on Neon and public media in Vercel Blob. Public pages read Payload at request time; saved changes appear on the next request/refresh without a rebuild. The existing portfolio layout, routes and legacy source data/assets are retained.

## Requirements

- Node.js `24.22.1` (24.x) and pnpm.
- Separate Neon database branches and Blob stores for local/preview and production.
- `DATABASE_URL`, `PAYLOAD_SECRET`, `APP_ORIGIN`, and `BLOB_READ_WRITE_TOKEN` (see `.env.example`). Never commit actual secrets.

## First setup

1. Provision a development Neon database and a development Vercel Blob store. Copy `.env.example` to `.env.local` and set their credentials, a random `PAYLOAD_SECRET` (32+ characters), and `APP_ORIGIN=http://localhost:3000`.
2. Install packages: `pnpm install`.
3. Apply the committed database schema: `pnpm migrate`.
4. Create the initial manager account once: set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (at least 16 characters) in the process environment, then run `pnpm bootstrap-admin`. Account creation through the public API is disabled. Remove the temporary credentials from the shell afterward.
5. Run `pnpm dev`, sign in at `/admin`, and update content.

Payload is the only content source: restore a lost database from a Neon backup branch and its files from the Vercel Blob store. Do not share production secrets or database dumps in chat.

## Schema and deployment commands

- `pnpm generate:types` — update `src/payload-types.ts` after schema changes.
- `pnpm generate:importmap` — regenerate the Payload admin import map.
- `pnpm migrate:create` — create a new migration after a schema change.
- `pnpm migrate` — apply committed migrations. Run as a controlled release step before deploying the code that uses a new schema; do not run migrations during every build/startup.
- `pnpm bootstrap-admin` — create the first manager only.

For Vercel, set production-only Neon/Blob credentials and `APP_ORIGIN` in project environment settings. Use separate preview credentials/stores. In the deployment release process, take a Neon backup/branch, run `pnpm migrate` against the target database, deploy, and verify `/admin` plus the public routes. Uploaded files are public by URL; do not store private or sensitive media in this collection. Large browser uploads use Payload's authenticated Vercel Blob client-upload flow rather than passing the file through a Vercel function.

## Content and security notes

- Collections: users, media, projects, experiences, gallery items. Globals: site settings, home, about, Gallery page.
- Portfolio data and media are publicly readable; writes require the manager account. User records are private and public user creation is disabled.
- Rich copy is stored as Lexical JSON and rendered through Payload's Lexical renderer, not raw HTML.
- Project slugs are immutable after creation. Keep a separate backup before migrations or bulk imports.
- Videos need a separate image poster. The supported uploads are JPEG, PNG, WebP, AVIF, MP4 and MOV, maximum 50 MB. MOV playback depends on the visitor's browser; the Gallery retains a poster and original-file link if playback fails.
- The generated media hostname allowlist is derived from the configured Blob token; it does not allow arbitrary remote image hosts.

See [`docs/payload-operations.md`](docs/payload-operations.md) for provisioning, backups, imports and recovery details.

## Verification

Run `pnpm test:access`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and `git diff --check`. Cloud migration, manager auth, Blob uploads and responsive browser review require owner-provided Neon/Blob credentials and are not simulated by a local build.
