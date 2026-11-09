import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ContentUnavailable from '@/components/content-unavailable'
import { findPosts } from '@/lib/payload/server'
import { cn } from '@/lib/utils'
import { pageTitle, shell, textLink } from '@/lib/styles'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Blog | Gustam Rheza',
  description: 'Notes on software, building for the web, and things I’m learning along the way.',
}

export default async function BlogPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const { page: value } = await searchParams
  if (value !== undefined && (typeof value !== 'string' || !/^[1-9]\d{0,5}$/.test(value))) notFound()
  const page = Number(value || 1)
  const posts = await findPosts(page)
  if (!posts) return <ContentUnavailable />
  if (page > Math.max(1, posts.totalPages)) notFound()

  return <div className={cn(shell, 'pb-8')}>
    <header className="grid grid-cols-1 items-end gap-6 pt-4 pb-14 sm:grid-cols-2 sm:gap-8 sm:pt-12 sm:pb-20">
      <h1 className={pageTitle}>Blog</h1>
      <p className="max-w-[42ch] text-lg sm:text-xl">Notes on software, building for the web, and things I’m learning along the way.</p>
    </header>
    {posts.docs.length ? <section aria-labelledby="blog-posts-title">
      <h2 className="mb-10 text-[28px]" id="blog-posts-title">Writing</h2>
      <div className="grid gap-12">
        {posts.docs.map((post) => <article className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(160px,1fr)_minmax(0,3fr)] sm:gap-8" key={post.id}>
          <time className="pt-1.5 text-soft tabular-nums" dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time>
          <div>
            <h3 className="max-w-[36ch] text-[clamp(24px,2.5vw,36px)] wrap-anywhere"><Link className="hover:text-primary" href={`/blog/${post.slug}`}>{post.title}</Link></h3>
            <p className="mt-3 max-w-[60ch]">{post.excerpt}</p>
          </div>
        </article>)}
      </div>
      {posts.totalPages > 1 && <nav className="mt-16 flex flex-wrap items-center justify-between gap-6" aria-label="Blog pages">
        {posts.hasPrevPage ? <Link className={textLink} href={page === 2 ? '/blog' : `/blog?page=${page - 1}`}>Newer posts</Link> : <span />}
        <span>Page {page} of {posts.totalPages}</span>
        {posts.hasNextPage ? <Link className={textLink} href={`/blog?page=${page + 1}`}>Older posts</Link> : <span />}
      </nav>}
    </section> : <section className="grid grid-cols-1 gap-8 rounded-3xl bg-surface p-[clamp(28px,5vw,64px)] sm:grid-cols-2" aria-labelledby="blog-empty-title">
      <h2 id="blog-empty-title" className="max-w-[18ch] text-[clamp(28px,3vw,40px)]">Writing is on its way.</h2>
      <div><p className="max-w-[42ch]">No posts published yet. In the meantime, take a look at what I’ve been building.</p>
        <Link className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-5 py-2.5 font-semibold text-canvas hover:bg-primary hover:text-primary-foreground active:scale-98 motion-reduce:active:scale-100" href="/#selected-work">Explore selected work</Link>
      </div>
    </section>}
    <footer className="mt-[100px] flex flex-wrap items-center justify-between gap-6"><p>Gustam Rheza</p><Link className={textLink} href="/#about">More about me</Link></footer>
  </div>
}
