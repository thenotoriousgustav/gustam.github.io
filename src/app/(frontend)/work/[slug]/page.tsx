import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { findDocs } from '@/lib/payload/server'
import ProjectScreenshot from '@/components/work/project-screenshot'
import ContentUnavailable from '@/components/content-unavailable'
import { formatMonth } from '@/lib/format'
import { cn } from '@/lib/utils'
import { richText, sectionTitle, shell, textLink } from '@/lib/styles'

type Project = { id: number; slug: string; title: string; date?: string | null; summary: string; externalURL?: string; description: Parameters<typeof RichText>[0]['data']; screenshots?: { id?: string; media?: { url?: string; width?: number; height?: number; alt?: string } }[] }
async function getProject(slug: string): Promise<Project | null | undefined> {
  const projects = await findDocs('projects')
  if (!projects) return null
  return (projects as unknown as Project[]).find((project) => project.slug === slug)
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
  const project = await getProject(slug)
  if (project === null) return <ContentUnavailable />
  if (!project) notFound()
  const images = (project.screenshots || []).flatMap(({ media }) => media?.url ? [media] : [])
  return <article className={cn(shell, 'pb-20')}>
    <Link className="inline-flex min-h-11 items-center gap-2 text-primary" href="/#selected-work"><ArrowLeft size={18} aria-hidden="true" /> Back to selected work</Link>
    <header className="grid grid-cols-1 items-end gap-x-[clamp(32px,6vw,96px)] gap-y-6 pt-6 pb-8 sm:pt-10 sm:pb-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <h1 className="text-[clamp(44px,6.4vw,104px)] leading-none tracking-[-0.05em]">{project.title}</h1>
      <div>
        <p className="text-[clamp(18px,1.5vw,21px)] leading-[1.55]">{project.summary}</p>
        {project.date && <p className="mt-3 text-soft tabular-nums">{formatMonth(project.date)}</p>}
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
  </article>
}
