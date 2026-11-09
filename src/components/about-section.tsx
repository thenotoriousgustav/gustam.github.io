import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { About } from '@/payload-types'
import { cn } from '@/lib/utils'
import { richText, sectionTitle } from '@/lib/styles'

type Entry = { key: string; title: string; detail?: string }

/** "Indonesian — Native" per line. Returns null if a line has no " — ". */
function parsePairs(text: string): Entry[] | null {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  const pairs = lines.map((line) => {
    const [key, title] = line.split(' — ')
    return key && title ? { key, title } : null
  })
  return pairs.length && pairs.every(Boolean) ? (pairs as Entry[]) : null
}

/**
 * One group: an ink label, then rows on a shared key | content grid, so years,
 * skill categories and languages all line up on the same two edges (stacked on phones).
 */
function Group({ label, entries, fallback }: { label: string; entries: Entry[] | null; fallback?: string }) {
  return <div>
    <h3 className="mb-4 text-[17px] font-[550] tracking-normal">{label}</h3>
    {entries
      ? <dl className="grid gap-4 sm:gap-3.5">{entries.map((entry) => <div key={entry.key + entry.title} className="grid grid-cols-1 gap-0.5 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-6">
          <dt className="text-soft tabular-nums">{entry.key}</dt>
          <dd>{entry.title}{entry.detail && <span className="block text-soft">{entry.detail}</span>}</dd>
        </div>)}</dl>
      : <p className="max-w-[60ch] whitespace-pre-line">{fallback}</p>}
  </div>
}

/** The About content (Payload global "about"), shown on the home page at #about. */
export default function AboutSection({ about }: { about: About }) {
  const portrait = about.portrait && typeof about.portrait === 'object' ? about.portrait : undefined
  const skills = (about.favorites || []).map((group) => ({ key: group.category, title: group.items }))
  return <section id="about" className="mt-20 scroll-mt-8 sm:mt-[140px]" aria-labelledby="about-title">
    <h2 id="about-title" className={cn(sectionTitle, 'mb-6 sm:mb-9')}>About</h2>

    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-6">
      {/* The portrait stays in view while the right column scrolls past it. */}
      {portrait?.url && <div className="lg:sticky lg:top-8 lg:col-span-4">
        <Image src={portrait.url} alt={portrait.alt || about.title} className="aspect-[4/5] h-auto w-full rounded-2xl object-cover" width={portrait.width || 900} height={portrait.height || 1200} sizes="(min-width: 1024px) 32vw, 100vw" />
      </div>}

      <div className="text-[17px] leading-[1.6] lg:col-span-7 lg:col-start-6">
        <div className={cn(richText, 'max-w-[40ch] text-[clamp(20px,1.7vw,24px)] leading-[1.45] tracking-[-0.01em]')}>
          <RichText data={about.introduction} />
        </div>
        <div className="mt-14 grid gap-12 sm:mt-16">
          {about.education?.length ? <Group label={about.exploringTitle} entries={about.education.map((school) => ({ key: school.period, title: school.school, detail: school.programme }))} /> : null}
          {skills.length > 0 && <Group label={about.favoritesTitle} entries={skills} />}
          <Group label={about.interestsTitle} entries={parsePairs(about.interests)} fallback={about.interests} />
        </div>
      </div>
    </div>
  </section>
}
