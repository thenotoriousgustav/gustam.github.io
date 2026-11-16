import Link from 'next/link'
import { Download } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Experience as Role } from '@/payload-types'
import { cn } from '@/lib/utils'
import { richText, sectionTitle, textLink } from '@/lib/styles'

export const CV_URL = '/cv/gustam-rheza-mahendra-cv.pdf'

const month = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
const period = (role: Role) => `${month.format(new Date(role.startDate))} – ${role.endDate ? month.format(new Date(role.endDate)) : 'Present'}`
// "Middle Front End Developer · Contract" → title and the kind of engagement.
const split = (position: string) => {
  const [title, ...rest] = position.split(' · ')
  return { title, kind: rest.join(' · ') }
}

/**
 * Work history for interviews: the newest `featured` roles (the three latest) with what was done and the projects built there,
 * older roles as one line each. Newest first (sorted by start date in the query).
 */
export default function Experience({ roles, featured = 3 }: { roles: Role[]; featured?: number }) {
  return <section id="experience" className="mt-20 scroll-mt-8 sm:mt-[140px]" aria-labelledby="experience-title">
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mb-9">
      <h2 id="experience-title" className={sectionTitle}>Experience</h2>
      <a className={cn(textLink, 'gap-2')} href={CV_URL} download>
        <Download size={18} aria-hidden="true" /> Download CV
      </a>
    </div>
    <ol className="border-b border-inset">
      {roles.map((role, index) => {
        const { title, kind } = split(role.position)
        const projects = (role.projects || []).filter((project) => typeof project === 'object')
        const full = index < featured
        return <li key={role.id} className={cn('grid grid-cols-1 gap-1 border-t border-inset sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-12', full ? 'py-6 sm:py-8' : 'py-4')}>
          <p className="text-[15px] leading-[1.6] text-soft tabular-nums lg:col-span-3 sm:pt-0.5">{period(role)}</p>
          <div className="lg:col-span-9">
            <h3 className={cn('font-[550] tracking-[-0.01em]', full ? 'text-[20px] leading-[1.35]' : 'text-[17px] leading-[1.5]')}>
              {title}<span className="block font-normal text-soft sm:inline"><span className="sr-only">, </span><span aria-hidden="true" className="hidden sm:inline"> · </span>{role.company}</span>
            </h3>
            {full && kind && <p className="text-[15px] text-soft">{kind}</p>}
            {full && <div className={cn(richText, 'mt-3 max-w-[68ch] text-[17px] leading-[1.6]')}><RichText data={role.description} /></div>}
            {full && projects.length > 0 && <p className="mt-3 flex flex-wrap items-center gap-x-3 text-[15px] text-soft">
              Projects:
              {projects.map((project) => <Link key={project.id} className={cn(textLink, 'min-h-0 py-2')} href={`/work/${project.slug}`}>{project.title}</Link>)}
            </p>}
          </div>
        </li>
      })}
    </ol>
  </section>
}
