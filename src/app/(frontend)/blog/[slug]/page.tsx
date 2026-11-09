import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import ContentUnavailable from '@/components/content-unavailable'
import { findPost } from '@/lib/payload/server'
import { cn } from '@/lib/utils'
import { articleBody, shell, textLink } from '@/lib/styles'

type Args = { params: Promise<{ slug: string }> }

// Posts render on first visit and are then cached (refreshed on CMS changes).
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await findPost(slug)
  return post ? {
    title: `${post.title} | Gustam Rheza`, description: post.excerpt,
    openGraph: { type: 'article', title: post.title, description: post.excerpt, publishedTime: post.publishedAt },
  } : { title: 'Post unavailable | Gustam Rheza', robots: { index: false } }
}

export default async function PostPage({ params }: Args) {
  const { slug } = await params
  const post = await findPost(slug)
  if (post === null) return <ContentUnavailable />
  if (!post) notFound()

  return <article className={cn(shell, 'max-w-[848px] pt-6 pb-12')}>
    <Link className={textLink} href="/blog">Back to blog</Link>
    <header className="py-10">
      <h1 className="text-[clamp(32px,4vw,52px)] wrap-anywhere">{post.title}</h1>
      <p className="mt-6 text-xl">{post.excerpt}</p>
      <p className="mt-6 text-base text-soft">Gustam Rheza<span aria-hidden="true"> · </span>
        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time>
      </p>
    </header>
    <div className={articleBody}><RichText data={post.content} /></div>
    <footer className="mt-[100px] flex flex-wrap items-center justify-between gap-6"><p>Thanks for reading.</p><Link className={textLink} href="/blog">All posts</Link></footer>
  </article>
}
