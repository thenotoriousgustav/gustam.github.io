import { randomBytes } from 'node:crypto'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"school" varchar NOT NULL,
  	"programme" varchar NOT NULL,
  	"period" varchar NOT NULL
  );
  
  ALTER TABLE "about_education" ADD CONSTRAINT "about_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_education_order_idx" ON "about_education" USING btree ("_order");
  CREATE INDEX "about_education_parent_id_idx" ON "about_education" USING btree ("_parent_id");`)

  // Copy the old free-text Education ("School — Place" / "Programme, 2021–2025. …", blank line
  // between schools) into the new rows. The old text column is left untouched.
  const about = await db.execute(sql`SELECT "id", "exploring" FROM "about"`)
  for (const row of about.rows as { id: number; exploring: string | null }[]) {
    const blocks = (row.exploring || '').split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean)
    for (const [index, block] of blocks.entries()) {
      const [first = '', second = ''] = block.split('\n')
      const years = second.match(/(\d{4})\s*[–-]\s*(\d{4})/)
      const school = first.split(' — ')[0].trim()
      const programme = second.split(/,\s*\d{4}/)[0].trim()
      if (!years || !school || !programme) throw new Error(`Education block ${index + 1} could not be read, migration stopped: ${block}`)
      await db.execute(sql`INSERT INTO "about_education" ("_order", "_parent_id", "id", "school", "programme", "period")
        VALUES (${index + 1}, ${row.id}, ${randomBytes(12).toString('hex')}, ${school}, ${programme}, ${`${years[1]}–${years[2]}`})`)
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_education" CASCADE;`)
}
