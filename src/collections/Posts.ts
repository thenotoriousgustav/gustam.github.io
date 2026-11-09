import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    description: 'Drafts are private. Set the status to Published when a post is ready to appear on the blog.',
  },
  access: {
    read: ({ req }) => req.user ? true : { status: { equals: 'published' } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 140 },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Generated from the title. Permanent after creation.' },
      hooks: {
        beforeValidate: [({ value, data, operation }) => operation === 'create' && !value
          ? data?.title?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : value],
        beforeChange: [({ value, operation, originalDoc }) => {
          if (operation === 'update' && value !== originalDoc?.slug) throw new Error('Post slugs cannot be changed after creation')
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error('Use lowercase letters, numbers and hyphens')
          return value
        }],
      },
    },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 320 },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'draft',
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', description: 'Display date, not a scheduled publish time. Posts appear when their status is Published.' },
    },
  ],
}
