import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import config from '../payload.config'
import WORK from '../src/data/work'
import EXPERIENCE from '../src/data/experience'
import GALLERY from '../src/data/gallery'
import { PROFILE } from '../src/data/profile'
import { getPayload } from 'payload'

async function main() {
const root = process.cwd()
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is required; media must not be stored on local disk.')
const payload = await getPayload({ config })
const mediaByPath = new Map<string, number>()

async function fileExists(filename: string) {
  try { await access(filename); return true } catch { return false }
}

function lexical(value: string): never {
  const paragraphs = value.split(/<\/p>|<br\s*\/?\s*>/i).map((part) => part.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim()).filter(Boolean)
  return { root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: paragraphs.map((text) => ({ type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }] })) } } as never
}
async function upload(relative: string, sourceKey: string, alt: string, kind: 'image' | 'video' = 'image', poster?: number): Promise<number> {
  const normalized = relative.replaceAll('\\', '/')
  if (mediaByPath.has(normalized)) return mediaByPath.get(normalized)!
  const existing = await payload.find({ collection: 'media', where: { sourceKey: { equals: sourceKey } }, limit: 1, overrideAccess: true })
  if (existing.docs[0]) { const id = existing.docs[0].id as number; mediaByPath.set(normalized, id); return id }
  if (!await fileExists(path.join(root, 'public', normalized))) {
    throw new Error(`Media ${sourceKey} is missing from the CMS. Local originals have been removed; restore it from Vercel Blob before seeding.`)
  }
  const data = await readFile(path.join(root, 'public', normalized))
  const ext = path.extname(normalized).toLowerCase()
  const mimetype = ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.mov': 'video/quicktime', '.mp4': 'video/mp4' } as Record<string, string>)[ext]
  if (!mimetype) throw new Error(`Unsupported media type: ${normalized}`)
  if (data.byteLength > 50 * 1024 * 1024) throw new Error(`Media exceeds 50 MB: ${normalized}`)
  const doc = await payload.create({ collection: 'media', data: { alt, kind, sourceKey, poster }, file: { data, mimetype, name: path.basename(normalized), size: data.byteLength }, overrideAccess: true })
  const id = doc.id as number
  mediaByPath.set(normalized, id)
  return id
}
async function exists(collection: 'projects' | 'experiences' | 'gallery-items', sourceKey: string) {
  return (await payload.find({ collection, where: { sourceKey: { equals: sourceKey } }, limit: 1, overrideAccess: true })).docs[0]
}

const projectMedia = new Map<string, number[]>()
for (const project of WORK) {
  const screenshots: string[] = []
  for (const filename of project.images) {
    const existing = await payload.find({ collection: 'media', where: { sourceKey: { equals: `project:${project.slug}:${filename}` } }, limit: 1, overrideAccess: true })
    if (existing.docs.length || await fileExists(path.join(root, 'public/work', filename))) screenshots.push(filename)
  }
  projectMedia.set(project.slug, await Promise.all(screenshots.map((filename) => upload(`work/${filename}`, `project:${project.slug}:${filename}`, `${project.name} screenshot`))))
}
const portrait = await upload('me.jpeg', 'portrait:gustam-rheza', 'Portrait of Gustam Rheza')
const galleryMedia = new Map<string, { media: number; poster?: number }>()
for (let i = 0; i < GALLERY.length; i++) {
  const item = GALLERY[i]
  const video = /\.(mov|mp4)$/i.test(item.img)
  const posterPath = `gallery/${item.img.replace(/\.(mov|mp4)$/i, '-poster.jpg')}`
  let poster: number | undefined
  if (video) poster = await upload(posterPath, `poster:${item.img}`, `${item.alt} poster`)
  const media = await upload(`gallery/${item.img}`, `gallery:${item.img}`, item.alt, video ? 'video' : 'image', poster)
  galleryMedia.set(item.img, { media, poster })
}

for (let index = 0; index < WORK.length; index++) {
  const project = WORK[index]
  const sourceKey = `legacy-project:${project.slug}`
  if (await exists('projects', sourceKey)) continue
  await payload.create({ collection: 'projects', overrideAccess: true, data: {
    title: project.name, slug: project.slug, summary: project.summary, displayDate: project.date,
    description: lexical(project.description), screenshots: (projectMedia.get(project.slug) || []).map((media) => ({ media })),
    externalURL: project.link || undefined, order: index, sourceKey,
  } })
}
for (let index = 0; index < EXPERIENCE.length; index++) {
  const item = EXPERIENCE[index]
  const sourceKey = item.sourceKey
  if (await exists('experiences', sourceKey)) continue
  await payload.create({ collection: 'experiences', overrideAccess: true, data: {
    company: item.name, position: item.position, startDate: item.dates.start, endDate: item.dates.end,
    description: lexical(item.description), externalURL: item.link || undefined, order: index, sourceKey,
  } })
}
for (let index = 0; index < GALLERY.length; index++) {
  const item = GALLERY[index]
  const sourceKey = `legacy-gallery:${item.img}`
  if (await exists('gallery-items', sourceKey)) continue
  const media = galleryMedia.get(item.img)!
  await payload.create({ collection: 'gallery-items', overrideAccess: true, data: {
    caption: item.alt, alt: item.alt, media: media.media, kind: media.poster ? 'video' : 'image', poster: media.poster, order: index, sourceKey,
  } })
}

const [site, home, about, galleryPage] = await Promise.all([
  payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true }),
  payload.findGlobal({ slug: 'home', depth: 0, overrideAccess: true }),
  payload.findGlobal({ slug: 'about', depth: 0, overrideAccess: true }),
  payload.findGlobal({ slug: 'gallery-page', depth: 0, overrideAccess: true }),
])
if (!site.updatedAt) await payload.updateGlobal({ slug: 'site-settings', overrideAccess: true, data: {
  wordmark: 'Gustam Rheza.', seoTitle: 'Gustam Rheza | Portfolio', seoDescription: 'This is my personal website portfolio.',
  socialLinks: [{ label: 'Email', url: 'mailto:rhezagustam@gmail.com' }, { label: 'GitHub', url: 'https://github.com/thenotoriousgustav' }, { label: 'LinkedIn', url: 'https://www.linkedin.com/in/gustamrheza/' }, { label: 'Instagram', url: 'https://www.instagram.com/gustamahendr/' }],
} })
if (!home.updatedAt) await payload.updateGlobal({ slug: 'home', overrideAccess: true, data: {
  ...PROFILE.home, selectedWorkTitle: 'Selected work', experienceTitle: 'Experience', contactText: 'Let’s connect.',
} })
if (!about.updatedAt) await payload.updateGlobal({ slug: 'about', overrideAccess: true, data: {
  title: 'Gustam Rheza Mahendra', portrait, introduction: lexical(PROFILE.introduction.join('</p>')),
  exploringTitle: 'Education', exploring: PROFILE.education,
  learningTitle: 'Certifications & training', learning: PROFILE.certifications,
  interestsTitle: 'Languages', interests: PROFILE.languages,
  favoritesTitle: 'Technical skills', favorites: PROFILE.skills,
} })
if (!galleryPage.updatedAt) await payload.updateGlobal({ slug: 'gallery-page', overrideAccess: true, data: { title: 'Gallery', introduction: 'A growing collection of personal sketches, explorations, and snapshots of people and images that make me happy. I wouldn’t call myself an artist or photographer, but documenting my life through pencil, pen, paint, and film is something that grounds me.' } })

console.log(`Seed complete: ${WORK.length} projects, ${EXPERIENCE.length} experiences, ${GALLERY.length} gallery items.`)
await payload.destroy()
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1) })
