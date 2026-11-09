import type { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences', access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'position', 'startDate', 'order'] },
  fields: [
    { name: 'company', type: 'text', required: true }, { name: 'position', type: 'text', required: true },
    { name: 'startDate', type: 'text', required: true, maxLength: 30 }, { name: 'endDate', type: 'text', required: true, maxLength: 30 },
    { name: 'description', type: 'richText', required: true },
    { name: 'externalURL', type: 'text', validate: (value: unknown) => value == null || value === '' || (typeof value === 'string' && /^https?:\/\//i.test(value)) || 'Use an http or https URL' },
    { name: 'order', type: 'number', required: true, defaultValue: 0 }, { name: 'sourceKey', type: 'text', unique: true, admin: { hidden: true } },
  ],
}
