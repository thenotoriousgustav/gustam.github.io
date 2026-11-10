import type { CollectionConfig } from 'payload'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items', access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  admin: { useAsTitle: 'caption', defaultColumns: ['caption', 'media', 'createdAt'] },
  defaultSort: '-createdAt',
  hooks: {
    // Alt text, kind and the video poster live on the Media item; copy them so editors only pick the media.
    beforeValidate: [async ({ data, req, originalDoc }) => {
      if (!data) return data
      const selected = data.media ?? originalDoc?.media
      const mediaId = typeof selected === 'object' && selected ? selected.id : selected
      if (!mediaId) return data
      const media = await req.payload.findByID({ collection: 'media', id: mediaId, depth: 0, overrideAccess: true, req })
      data.alt = media.alt
      data.kind = media.kind
      data.poster = media.kind === 'video' ? media.poster ?? null : null
      return data
    }],
    beforeChange: [async ({ data }) => {
      if (data.kind === 'video' && !data.poster) throw new Error('This video has no poster. Open it in Media and choose a poster image first.')
      return data
    }],
  },
  fields: [
    { name: 'caption', type: 'text', required: true },
    { name: 'media', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Alt text, image/video and the video poster come from this media item.' } },
    // Copied from the media item by the beforeValidate hook; hidden so they are edited in one place.
    { name: 'alt', type: 'text', required: true, maxLength: 300, admin: { hidden: true } },
    { name: 'kind', type: 'select', required: true, options: [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }], admin: { hidden: true } },
    { name: 'poster', type: 'relationship', relationTo: 'media', admin: { hidden: true } },
  ],
}
