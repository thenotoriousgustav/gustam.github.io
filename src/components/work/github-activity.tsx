import { ArrowUpRight } from 'lucide-react'
import { ActivityHeatmap } from '@/components/ui/activity-heatmap'
import { getContributions } from '@/lib/github'
import { cn } from '@/lib/utils'
import { sectionTitle, textLink } from '@/lib/styles'

// Empty, then four steps of the site's blue.
const LEVELS = ['var(--inset)', ...[30, 55, 80].map((pct) => `color-mix(in oklab, var(--blue) ${pct}%, var(--inset))`), 'var(--blue)']

/** GitHub contribution heatmap for the GitHub profile in Site Settings; hidden if it can't be loaded. */
export default async function GithubActivity({ profileURL }: { profileURL: string }) {
  const user = new URL(profileURL).pathname.split('/').filter(Boolean)[0]
  const data = user ? await getContributions(user) : null
  if (!data) return null
  const total = data.reduce((sum, day) => sum + day.value, 0)
  const last = data.reduce((latest, day) => (day.date > latest ? day.date : latest), data[0].date)
  const [year, month, day] = last.split('-').map(Number)
  return <section className="mt-20 sm:mt-[140px]" aria-labelledby="github-title">
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mb-9">
      <h2 id="github-title" className={sectionTitle}>GitHub</h2>
      <a href={profileURL} target="_blank" rel="noreferrer" className={cn(textLink, 'gap-1.5')}>
        {total.toLocaleString('en-US')} contributions in the last year <ArrowUpRight size={18} aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
    {/* Noon, so the last day stays the same date in every visitor's time zone. */}
    <ActivityHeatmap data={data} endDate={new Date(year, month - 1, day, 12)} unit="contributions" colors={LEVELS} cellSize={20} gap={4} weekdayLabels="none" />
  </section>
}
