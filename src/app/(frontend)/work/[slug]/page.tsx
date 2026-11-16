import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { findDocs } from '@/lib/payload/server'
import ProjectScreenshot from '@/components/work/project-screenshot'
import ContentUnavailable from '@/components/content-unavailable'
import { formatMonth } from '@/lib/format'
import { cn } from '@/lib/utils'
import { richText, sectionTitle, shell, textLink } from '@/lib/styles'

type Project = { id: number; slug: string; title: string; date?: string | null; summary: string; role?: string | null; stack?: string | null; externalURL?: string; description: Parameters<typeof RichText>[0]['data']; screenshots?: { id?: string; media?: { url?: string; width?: number; height?: number; alt?: string } }[] }
async function getProjects(): Promise<Project[] | null> {
  return (await findDocs('projects')) as unknown as Project[] | null
}
async function getProject(slug: string): Promise<Project | null | undefined> {
  const projects = await getProjects()
  return projects && projects.find((project) => project.slug === slug)
}
// Prerender every project; new ones render on first visit and are then cached.
export async function generateStaticParams() {
  return ((await findDocs('projects')) || []).map((project) => ({ slug: project.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  return project ? { title: `${project.title} | Gustam Rheza`, description: project.summary } : project === null ? { title: 'Portfolio temporarily unavailable' } : {}
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projects = await getProjects()
  if (!projects) return <ContentUnavailable />
  const index = projects.findIndex((item) => item.slug === slug)
  if (index < 0) notFound()
  const project = projects[index]
  // Next in the same newest-first order as /work, wrapping round to the first.
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined
  const facts = [
    ['Role', project.role],
    ['Stack', project.stack?.split(',').map((item) => item.trim()).filter(Boolean).join(' · ')],
    ['Date', project.date && formatMonth(project.date)],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]))
  const images = (project.screenshots || []).flatMap(({ media }) => media?.url ? [media] : [])
  return <article className={cn(shell, 'pb-20')}>
    <Link className="inline-flex min-h-11 items-center gap-2 text-primary" href="/work"><ArrowLeft size={18} aria-hidden="true" /> All work</Link>
    <header className="grid grid-cols-1 items-end gap-x-[clamp(32px,6vw,96px)] gap-y-6 pt-6 pb-8 sm:pt-10 sm:pb-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <h1 className="text-[clamp(44px,6.4vw,104px)] leading-none tracking-[-0.05em]">{project.title}</h1>
      <div>
        <p className="text-[clamp(18px,1.5vw,21px)] leading-[1.55]">{project.summary}</p>
        {facts.length > 0 && <dl className="mt-5 grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-[15px] leading-[1.5]">
          {facts.map(([label, value]) => <div key={label} className="contents"><dt className="text-soft">{label}</dt><dd className="tabular-nums">{value}</dd></div>)}
        </dl>}
        {project.externalURL && <a className={cn(textLink, 'mt-2 gap-2')} href={project.externalURL} target="_blank" rel="noreferrer">View project <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
      </div>
    </header>
    {images.length ? <div className={cn('grid items-start gap-5 rounded-2xl bg-inset px-4 py-5 sm:gap-6 sm:rounded-3xl sm:p-8', images.length > 1 && 'sm:grid-cols-2')}>
      {images.map((image, index) => <ProjectScreenshot key={`${project.id}-${index}`} src={image.url!} alt={image.alt || `${project.title} — screen ${index + 1}`} width={image.width} height={image.height} sizes="(min-width: 900px) 44vw, 90vw" className="mx-auto block h-auto max-h-[900px] w-auto max-w-full rounded-xl object-contain" />)}
    </div> : null}
    <section className="grid grid-cols-1 gap-x-[clamp(32px,6vw,96px)] gap-y-6 pt-10 pb-6 sm:pt-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]" aria-labelledby="project-description-title">
      <h2 id="project-description-title" className={sectionTitle}>About the project</h2>
      <div className={cn(richText, 'max-w-[65ch] text-[17px] [&_h4]:text-lg [&_h4]:font-[650]')}><RichText data={project.description} /></div>
    </section>
    {next && <nav aria-label="Next project" className="mt-14 border-t border-inset pt-8 sm:mt-20">
      <Link href={`/work/${next.slug}`} className="group inline-flex flex-col gap-1">
        <span className="text-[15px] text-soft">Next project</span>
        <span className="inline-flex items-center gap-3 text-[clamp(28px,3.4vw,48px)] leading-[1.1] tracking-[-0.03em] transition-colors group-hover:text-primary">
          {next.title} <ArrowRight className="size-[0.7em] transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
        </span>
      </Link>
    </nav>}
  </article>
}
