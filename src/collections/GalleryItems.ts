import type { CollectionConfig } from 'payload'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items', access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  admin: { useAsTitle: 'caption', defaultColumns: ['caption', 'kind', 'createdAt'] },
  defaultSort: '-createdAt',
  hooks: { beforeChange: [async ({ data, req }) => {
    const mediaId = typeof data.media === 'object' ? data.media.id : data.media
    const media = await req.payload.findByID({ collection: 'media', id: mediaId, overrideAccess: true })
    if (data.kind === 'image' && media.kind !== 'image') throw new Error('Gallery photos must use image media.')
    if (data.kind === 'video') {
      if (!data.poster) throw new Error('Choose a poster image for every video')
      const posterId = typeof data.poster === 'object' ? data.poster.id : data.poster
      const poster = await req.payload.findByID({ collection: 'media', id: posterId, overrideAccess: true })
      if (media.kind !== 'video' || poster.kind !== 'image') throw new Error('Videos require video media and an image poster.')
    }
    return data
  }] },
  fields: [
    { name: 'caption', type: 'text', required: true },
    { name: 'alt', type: 'text', required: true, maxLength: 300 },
    { name: 'media', type: 'relationship', relationTo: 'media', required: true },
    { name: 'kind', type: 'select', required: true, options: [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }] },
    { name: 'poster', type: 'relationship', relationTo: 'media', admin: { condition: (_, data) => data?.kind === 'video' } },
    // Unused since the gallery sorts by upload date; kept (hidden) so no migration is needed to drop the column.
    { name: 'order', type: 'number', required: true, defaultValue: 0, admin: { hidden: true } }, { name: 'sourceKey', type: 'text', unique: true, admin: { readOnly: true } },
  ],
}
