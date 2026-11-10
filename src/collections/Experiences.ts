import type { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences', access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'position', 'startDate', 'endDate'] },
  defaultSort: '-startDate',
  fields: [
    { name: 'company', type: 'text', required: true }, { name: 'position', type: 'text', required: true },
    { name: 'startDate', type: 'date', required: true, admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MM.yyyy' }, description: 'The site lists experiences newest start date first.' } },
    { name: 'endDate', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MM.yyyy' }, description: 'Leave empty while you still work here (shown as Present).' } },
    { name: 'description', type: 'richText', required: true },
    { name: 'externalURL', type: 'text', validate: (value: unknown) => value == null || value === '' || (typeof value === 'string' && /^https?:\/\//i.test(value)) || 'Use an http or https URL' },
  ],
}
