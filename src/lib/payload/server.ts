import 'server-only'
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { About, Experience, GalleryItem, GalleryPage, Home, Project, SiteSetting } from '@/payload-types'

let payloadPromise: ReturnType<typeof getPayload> | undefined
const client = () => {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config }).catch((error) => {
      payloadPromise = undefined
      throw error
    })
  }
  return payloadPromise
}

export function findDocs(collection: 'projects'): Promise<Project[] | null>
export function findDocs(collection: 'experiences'): Promise<Experience[] | null>
export function findDocs(collection: 'gallery-items'): Promise<GalleryItem[] | null>
export async function findDocs(collection: 'projects' | 'experiences' | 'gallery-items') {
  try {
    const payload = await client()
    // The gallery shows the newest upload first; projects and experiences keep their manual order.
    const sort = collection === 'gallery-items' ? ['-createdAt', '-id'] : ['order', 'id']
    const result = await payload.find({ collection, depth: 2, pagination: false, sort, overrideAccess: false })
    return result.docs
  } catch (error) {
    console.error(`Portfolio content request failed (${collection})`, error)
    return null
  }
}

export async function findPosts(page = 1) {
  try {
    const payload = await client()
    return await payload.find({
      collection: 'posts', page, limit: 10, depth: 0,
      sort: ['-publishedAt', '-id'], overrideAccess: false,
      where: { status: { equals: 'published' } },
      select: { title: true, slug: true, excerpt: true, publishedAt: true },
    })
  } catch (error) {
    console.error('Blog content request failed (posts)', error)
    return null
  }
}

export const findPost = cache(async (slug: string) => {
  try {
    const payload = await client()
    const result = await payload.find({
      collection: 'posts', depth: 1, limit: 1, overrideAccess: false,
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    })
    return result.docs[0]
  } catch (error) {
    console.error('Blog content request failed (post)', error)
    return null
  }
})

export function findGlobal(slug: 'home'): Promise<Home | null>
export function findGlobal(slug: 'about'): Promise<About | null>
export function findGlobal(slug: 'gallery-page'): Promise<GalleryPage | null>
export function findGlobal(slug: 'site-settings'): Promise<SiteSetting | null>
export async function findGlobal(slug: 'home' | 'about' | 'gallery-page' | 'site-settings') {
  try {
    const payload = await client()
    return await payload.findGlobal({ slug, depth: 2, overrideAccess: false })
  } catch (error) {
    console.error(`Portfolio content request failed (${slug})`, error)
    return null
  }
}
