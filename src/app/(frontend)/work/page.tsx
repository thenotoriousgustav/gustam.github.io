import type { Metadata } from 'next'
import SelectedWork from '@/components/work/selected-work'
import ContentUnavailable from '@/components/content-unavailable'
import { findDocs } from '@/lib/payload/server'
import { cn } from '@/lib/utils'
import { pageTitle, shell } from '@/lib/styles'

const description = 'Government, enterprise and personal projects: web apps, internal tools, AI products and iOS apps, newest first.'

export const metadata: Metadata = { title: 'Work | Gustam Rheza', description }

export default async function WorkPage() {
  const projects = await findDocs('projects')
  if (!projects) return <ContentUnavailable />
  return <div className={cn(shell, 'pb-8')}>
    <div className="pt-4 pb-7 sm:pt-12 sm:pb-16">
      <h1 className={cn(pageTitle, 'mb-6')}>Work</h1>
      <p className="max-w-[65ch] text-[17px] sm:text-lg">{description} <span className="text-soft tabular-nums">{projects.length} projects.</span></p>
    </div>
    <SelectedWork projects={projects as unknown as Parameters<typeof SelectedWork>[0]['projects']} showHeading={false} />
  </div>
}
