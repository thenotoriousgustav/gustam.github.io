import type { CollectionConfig } from 'payload'

const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/quicktime']

export const Media: CollectionConfig = {
  slug: 'media',
  upload: { mimeTypes: allowed, staticDir: 'media' },
  access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  hooks: {
    beforeChange: [({ data }) => {
      const values = data as Record<string, unknown>
      if (Number(values.filesize) > 50 * 1024 * 1024) throw new Error('Media must be 50 MB or smaller')
      return data
    }],
    beforeDelete: [async ({ id, req }) => {
      const references = await Promise.all([
        req.payload.find({ collection: 'projects', where: { 'screenshots.media': { equals: id } }, limit: 1, overrideAccess: true }),
        req.payload.find({ collection: 'gallery-items', where: { media: { equals: id } }, limit: 1, overrideAccess: true }),
        req.payload.find({ collection: 'gallery-items', where: { poster: { equals: id } }, limit: 1, overrideAccess: true }),
        req.payload.find({ collection: 'media', where: { poster: { equals: id } }, limit: 1, overrideAccess: true }),
      ])
      const about = await req.payload.findGlobal({ slug: 'about', depth: 0, overrideAccess: true })
      if (references.some((result) => result.docs.length) || about.portrait === id || (about.portrait && typeof about.portrait === 'object' && 'id' in about.portrait && about.portrait.id === id)) {
        throw new Error('This media is still used by portfolio content. Remove its references first.')
      }
      return id
    }],
  },
  fields: [
    { name: 'alt', type: 'text', required: true, maxLength: 300 },
    { name: 'kind', type: 'select', required: true, defaultValue: 'image', options: [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }] },
    { name: 'poster', type: 'relationship', relationTo: 'media', admin: { condition: (_, siblingData) => siblingData?.kind === 'video' } },
    { name: 'sourceKey', type: 'text', unique: true, admin: { hidden: true } },
  ],
  endpoints: [],
  admin: { description: 'Public portfolio files. Uploaded media is accessible to anyone with its URL.' },
}
