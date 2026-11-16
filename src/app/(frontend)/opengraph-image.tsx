import { findGlobal } from '@/lib/payload/server'
import { ogImage, ogSize } from '@/lib/og'

// Link preview for the home page; pages without their own (gallery, blog) inherit it.
export const alt = 'Gustam Rheza, software engineer'
export const size = ogSize
export const contentType = 'image/png'

export default async function Image() {
  const home = await findGlobal('home')
  return ogImage({ title: home?.introTitle || 'Gustam Rheza, software engineer' })
}
