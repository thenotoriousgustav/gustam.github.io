import type { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences', access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'position', 'startDate', 'endDate'] },
  fields: [
    { name: 'company', type: 'text', required: true }, { name: 'position', type: 'text', required: true },
    { name: 'startDate', type: 'text', required: true, maxLength: 30, validate: (value: unknown) => (typeof value === 'string' && /^(0[1-9]|1[0-2])\.\d{4}$/.test(value)) || 'Use MM.YYYY, e.g. 09.2025 (experiences are sorted by this)', admin: { placeholder: '09.2025', description: 'MM.YYYY. The site lists experiences newest start date first.' } }, { name: 'endDate', type: 'text', required: true, maxLength: 30 },
    { name: 'description', type: 'richText', required: true },
    { name: 'externalURL', type: 'text', validate: (value: unknown) => value == null || value === '' || (typeof value === 'string' && /^https?:\/\//i.test(value)) || 'Use an http or https URL' },
  ],
}
