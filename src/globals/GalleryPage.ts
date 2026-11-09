import type { GlobalConfig } from 'payload'

export const GalleryPage: GlobalConfig = {
  slug: 'gallery-page', access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [{ name: 'title', type: 'text', required: true }, { name: 'introduction', type: 'textarea', required: true }],
}
