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

The one-time import scripts (`pnpm seed`, `scripts/update-portfolio.ts`) and their `src/data` source files were removed on 2026-11-10 together with the `sourceKey` fields they used; Payload is now the only content source. They remain in git history.

## Manager account and recovery

The first manager is created out-of-band: set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (minimum 16 characters) in a protected shell/secret manager and run `pnpm bootstrap-admin` after the database migration. The script refuses to overwrite an existing account and refuses to create a second account once one exists. Public registration/create is disabled. Remove bootstrap credentials from the shell/temporary environment after use. For a lost password, follow an owner-controlled server procedure: securely run a one-off authenticated Payload password reset/update against the correct database, then remove the temporary script/secret. Password email recovery is not configured.

## Blob uploads and content deletion

The Media collection accepts JPEG, PNG, WebP, AVIF, MP4 and MOV (50 MB maximum). Payload's Vercel Blob client upload uses authenticated, short-lived upload authorization so large files bypass Vercel's request-body limit. A Blob token must exist in the corresponding environment; the storage is public. Videos need a still image poster selected by the editor. No transcoding or automatic poster extraction is configured.

The Media delete hook prevents deleting assets referenced by projects, Gallery entries/posters, another media poster, or the About portrait. Remove the relevant relationship first, save the document, and then delete the unused asset. Verify that a failed upload has not left an unreferenced Blob before retrying.

## Operational checks

After a release, confirm `/admin` authentication, an existing project detail URL, About and Gallery, and a small edit followed by a page refresh. Confirm that preview and production are using the expected origin/database/store. Review server logs for database errors; visitors receive a generic temporary-unavailability message, not credentials or stack traces. Do not add a silent static-content fallback: the old files are recovery/import sources only.
