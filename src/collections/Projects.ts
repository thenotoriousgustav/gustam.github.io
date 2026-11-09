import type { CollectionConfig } from 'payload'

const safeURL = (value: string | null | undefined) => !value || /^https?:\/\//i.test(value)

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'displayDate', 'order'], description: 'Project URLs are permanent once created.' },
  hooks: { beforeChange: [async ({ data, req }) => {
    for (const screenshot of data.screenshots || []) {
      const mediaId = typeof screenshot.media === 'object' ? screenshot.media.id : screenshot.media
      const media = await req.payload.findByID({ collection: 'media', id: mediaId, overrideAccess: true })
      if (media.kind !== 'image') throw new Error('Project screenshots must be images.')
    }
    return data
  }] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar', readOnly: true, description: 'Generated from the title and permanent after creation.' }, hooks: {
      beforeValidate: [({ value, data, operation }) => operation === 'create' && !value ? data?.title?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : value],
      beforeChange: [({ value, operation, originalDoc }) => { if (operation === 'update' && value !== originalDoc?.slug) throw new Error('Project slugs cannot be changed after creation'); if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error('Use lowercase letters, numbers and hyphens'); return value }],
    } },
    { name: 'summary', type: 'textarea', required: true, maxLength: 400 },
    { name: 'displayDate', type: 'text', required: true, maxLength: 30 },
    { name: 'description', type: 'richText', required: true },
    { name: 'screenshots', type: 'array', fields: [{ name: 'media', type: 'relationship', relationTo: 'media', required: true }] },
    { name: 'externalURL', type: 'text', validate: (value: unknown) => value == null || (typeof value === 'string' && safeURL(value)) || 'Use an http or https URL' },
    { name: 'order', type: 'number', required: true, defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'sourceKey', type: 'text', unique: true, admin: { hidden: true } },
  ],
}
