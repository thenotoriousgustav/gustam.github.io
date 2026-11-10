import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_source_key_idx";
  DROP INDEX "projects_source_key_idx";
  DROP INDEX "experiences_source_key_idx";
  DROP INDEX "gallery_items_source_key_idx";
  ALTER TABLE "media" DROP COLUMN "source_key";
  ALTER TABLE "projects" DROP COLUMN "display_date";
  ALTER TABLE "projects" DROP COLUMN "order";
  ALTER TABLE "projects" DROP COLUMN "source_key";
  ALTER TABLE "experiences" DROP COLUMN "order";
  ALTER TABLE "experiences" DROP COLUMN "source_key";
  ALTER TABLE "gallery_items" DROP COLUMN "order";
  ALTER TABLE "gallery_items" DROP COLUMN "source_key";
  ALTER TABLE "about" DROP COLUMN "exploring";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "source_key" varchar;
  ALTER TABLE "projects" ADD COLUMN "display_date" varchar;
  ALTER TABLE "projects" ADD COLUMN "order" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "source_key" varchar;
  ALTER TABLE "experiences" ADD COLUMN "order" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "experiences" ADD COLUMN "source_key" varchar;
  ALTER TABLE "gallery_items" ADD COLUMN "order" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "gallery_items" ADD COLUMN "source_key" varchar;
  ALTER TABLE "about" ADD COLUMN "exploring" varchar;
  CREATE UNIQUE INDEX "media_source_key_idx" ON "media" USING btree ("source_key");
  CREATE UNIQUE INDEX "projects_source_key_idx" ON "projects" USING btree ("source_key");
  CREATE UNIQUE INDEX "experiences_source_key_idx" ON "experiences" USING btree ("source_key");
  CREATE UNIQUE INDEX "gallery_items_source_key_idx" ON "gallery_items" USING btree ("source_key");`)
}
