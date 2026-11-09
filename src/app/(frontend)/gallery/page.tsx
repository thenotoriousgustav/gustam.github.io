import GalleryMedia from '@/components/gallery-item'
import { findDocs, findGlobal } from '@/lib/payload/server'
import ContentUnavailable from '@/components/content-unavailable'
import { cn } from '@/lib/utils'
import { mediaFallback, pageTitle, shell } from '@/lib/styles'

export const dynamic = 'force-dynamic'
export default async function GalleryPage() {
  const [page, items] = await Promise.all([findGlobal('gallery-page'), findDocs('gallery-items')])
  if (!page || !items) return <ContentUnavailable />
  return <div className={cn(shell, 'pb-8')}>
    <div className="pt-4 pb-7 sm:pt-12 sm:pb-16"><h1 className={cn(pageTitle, 'mb-6')}>{page.title}</h1><p className="max-w-[65ch] text-base sm:text-lg">{page.introduction}</p></div>
    {items.length ? <div className="columns-2 gap-x-4 sm:columns-3 sm:gap-x-6 lg:columns-4">{items.map((item, index) => <GalleryMedia key={item.id} item={item as never} eager={index < 4} />)}</div> : <p className={mediaFallback}>Gallery items will appear here soon.</p>}
  </div>
}
