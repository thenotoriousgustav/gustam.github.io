import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Experience dates go from "MM.YYYY" text to month dates (the 1st, midnight in Jakarta, which is what
// the admin's month picker stores). End date "Present" becomes empty. Any other text makes to_date fail,
// so the migration stops rather than guessing.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "experiences" ALTER COLUMN "end_date" DROP NOT NULL;
  ALTER TABLE "experiences" ALTER COLUMN "start_date" SET DATA TYPE timestamp(3) with time zone
    USING (to_date("start_date", 'MM.YYYY')::timestamp AT TIME ZONE 'Asia/Jakarta');
  ALTER TABLE "experiences" ALTER COLUMN "end_date" SET DATA TYPE timestamp(3) with time zone
    USING (CASE WHEN "end_date" ~* '^present$' THEN NULL ELSE to_date("end_date", 'MM.YYYY')::timestamp AT TIME ZONE 'Asia/Jakarta' END);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "experiences" ALTER COLUMN "start_date" SET DATA TYPE varchar
    USING to_char("start_date" AT TIME ZONE 'Asia/Jakarta', 'MM.YYYY');
  ALTER TABLE "experiences" ALTER COLUMN "end_date" SET DATA TYPE varchar
    USING COALESCE(to_char("end_date" AT TIME ZONE 'Asia/Jakarta', 'MM.YYYY'), 'Present');
  ALTER TABLE "experiences" ALTER COLUMN "end_date" SET NOT NULL;`)
}
