# Payload operations

## Provisioning and environment isolation

Create at least two independent environments: local/preview and production. Use separate Neon branches/databases, separate Vercel Blob stores/tokens, separate `PAYLOAD_SECRET` values and distinct `APP_ORIGIN` values. Never point a preview deployment at production credentials. `.env.example` lists the variables; local secrets belong in ignored `.env.local`, and production values belong in Vercel's encrypted environment settings.

`APP_ORIGIN` is the canonical application origin including scheme, for example `https://portfolio.example.com` (no path). It is used for Payload's CORS and CSRF origin allowlists. `APP_EXTRA_ORIGINS` (comma-separated origins, no paths) adds more domains the admin may be used from, for example the `*.vercel.app` URL next to the custom domain; `http://localhost:3000` is allowed automatically outside production. Payload's `serverURL` is left unset so the admin calls the API on whichever allowed origin it was opened from. Set preview and production origins independently. Blob stores are public because this portfolio's media is public by design. Do not upload confidential files.

## Database and schema changes

1. Before a production migration, create/verify a Neon backup or branch and record the target database/environment.
2. Change a Payload collection/global, then run `pnpm generate:types`, `pnpm generate:importmap`, and `pnpm migrate:create`.
3. Review and commit the generated `src/migrations/*` files and updated `src/payload-types.ts` / admin import map. This initial migration creates the Payload tables; future migrations should remain additive where possible.
4. Test the migration and rollback against a disposable preview branch. Do not use schema push in production.
5. Run `pnpm migrate` as a controlled pre-release step on the intended target, then deploy the compatible application version. Never run schema migrations from `build`, server startup, or each Vercel function.

If migration fails, stop the release, preserve the database state/logs, and restore or branch from the pre-migration backup before retrying. Do not hand-edit production schema to bypass the committed migration history.

## Initial content import

The initial import is complete. All 41 original photo/video files were verified in the public Vercel Blob store before the local copies were removed from `public/`. Of these, 36 are referenced by CMS Media records; five previously unused originals are archived under `portfolio/` in the same store.

`pnpm seed` retains the source text in `src/data` and reuses existing Media records by stable `sourceKey`. It requires `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`, skips existing content, and does not overwrite editor changes. A fresh database needs the Media records and files restored from a database backup and Vercel Blob first; the seed cannot recreate missing originals from the repository. Do not delete the Blob store when cleaning up local assets.

The legacy inventory project has no available screenshots and keeps its existing fallback. The seed does not manufacture missing images or restore the dead Spotify deployment link. Frontend routes read CMS content, never the retained source arrays.

## CV content refresh

`src/data/profile.ts`, `src/data/experience.ts`, and `src/data/work.ts` retain the approved CV content. `pnpm exec tsx scripts/update-portfolio.ts --apply` deliberately updates the matching profile globals and CV entries using stable project slugs and experience source keys. Test it against an isolated branch and create a production backup before running it: unlike the initial seed, it intentionally replaces approved text and ordering.

The update is transactional, keeps existing project URLs, screenshots, gallery, portrait, and social links, and does not publish the CV’s phone number. Older projects and the GSTM Studio role remain rather than being deleted because they were absent from the CV. Silamar and Evaluation CAT have no supplied screenshots; upload real ones through Payload Admin. Silamar has no supplied public URL. New project dates use descriptive labels rather than invented dates.

The blog uses the Posts collection: drafts are private, and setting `status` to Published exposes a post immediately. `publishedAt` is a display/sort date, not scheduling. Public pages are `/blog` and `/blog/[slug]`. `TEST_DATABASE_URL=... pnpm exec tsx scripts/test-blog.ts` runs write/read/access tests only against an isolated database; it refuses the currently configured production endpoint. Schema push is disabled in all environments. Existing `dev` migration history must be reconciled before running the full migration chain on this production database; do not approve Payload’s development-data reset prompt.

## Manager account and recovery

The first manager is created out-of-band: set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (minimum 16 characters) in a protected shell/secret manager and run `pnpm bootstrap-admin` after the database migration. The script refuses to overwrite an existing account and refuses to create a second account once one exists. Public registration/create is disabled. Remove bootstrap credentials from the shell/temporary environment after use. For a lost password, follow an owner-controlled server procedure: securely run a one-off authenticated Payload password reset/update against the correct database, then remove the temporary script/secret. Password email recovery is not configured.

## Blob uploads and content deletion

The Media collection accepts JPEG, PNG, WebP, AVIF, MP4 and MOV (50 MB maximum). Payload's Vercel Blob client upload uses authenticated, short-lived upload authorization so large files bypass Vercel's request-body limit. A Blob token must exist in the corresponding environment; the storage is public. Videos need a still image poster selected by the editor. No transcoding or automatic poster extraction is configured.

The Media delete hook prevents deleting assets referenced by projects, Gallery entries/posters, another media poster, or the About portrait. Remove the relevant relationship first, save the document, and then delete the unused asset. Verify that a failed upload has not left an unreferenced Blob before retrying.

## Operational checks

After a release, confirm `/admin` authentication, an existing project detail URL, About and Gallery, and a small edit followed by a page refresh. Confirm that preview and production are using the expected origin/database/store. Review server logs for database errors; visitors receive a generic temporary-unavailability message, not credentials or stack traces. Do not add a silent static-content fallback: the old files are recovery/import sources only.
