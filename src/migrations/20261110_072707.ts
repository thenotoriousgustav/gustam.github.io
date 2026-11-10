import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ALTER COLUMN "display_date" DROP NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "date" timestamp(3) with time zone;`)

  // Convert the old free-text dates ("10.2020", "05-25") to the 1st of that month, midnight in
  // Jakarta (what the admin's month picker stores). Descriptive labels stay text-only and get no date.
  const projects = await db.execute(sql`SELECT "id", "display_date" FROM "projects"`)
  for (const row of projects.rows as { id: number; display_date: string | null }[]) {
    const text = (row.display_date || '').trim()
    const match = text.match(/^(\d{2})\.(\d{4})$/) || text.match(/^(\d{2})-(\d{2})$/)
    if (!match) continue
    const month = Number(match[1])
    const year = match[2].length === 2 ? 2000 + Number(match[2]) : Number(match[2])
    if (month < 1 || month > 12) throw new Error(`Project ${row.id} has an invalid month in "${text}", migration stopped`)
    await db.execute(sql`UPDATE "projects" SET "date" = ${`${year}-${String(month).padStart(2, '0')}-01T00:00:00+07:00`}::timestamptz WHERE "id" = ${row.id}`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ALTER COLUMN "display_date" SET NOT NULL;
  ALTER TABLE "projects" DROP COLUMN "date";`)
}
