import { findDocs } from '@/lib/payload/server'
import { ogImage, ogSize } from '@/lib/og'

// Link preview for a project: its title and summary.
export const alt = 'Project by Gustam Rheza'
export const size = ogSize
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = (await findDocs('projects'))?.find((doc) => doc.slug === slug)
  return ogImage({ title: project?.title || 'Project', note: project?.summary })
}
