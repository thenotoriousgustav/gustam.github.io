import Link from 'next/link'
import { cn } from '@/lib/utils'
import { shell, textLink } from '@/lib/styles'

export default function ContentUnavailable() {
  return <section className={cn(shell, 'py-16 sm:py-24')} role="alert" aria-labelledby="content-unavailable-title">
    <p className="mb-3 text-sm text-soft">Gustam Rheza · Portfolio</p>
    <h1 id="content-unavailable-title" className="mb-4 text-[clamp(32px,4vw,52px)]">Content is temporarily unavailable.</h1>
    <p>Please try again shortly. If this keeps happening, the site administrator should check the CMS database connection.</p>
    <Link className={cn(textLink, 'mt-4')} href="/">Try again</Link>
  </section>
}
