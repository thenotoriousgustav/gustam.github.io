import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings', access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'wordmark', type: 'text', required: true, defaultValue: 'Gustam Rheza' },
    { name: 'seoTitle', type: 'text', required: true, defaultValue: 'Gustam Rheza | Portfolio' },
    { name: 'seoDescription', type: 'textarea', required: true, defaultValue: 'This is my personal website portfolio.' },
    { name: 'socialLinks', type: 'array', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'url', type: 'text', required: true, validate: (value: unknown) => value == null || (typeof value === 'string' && /^(https:\/\/|mailto:)/i.test(value)) || 'Use https or mailto links only' },
    ] },
  ],
}
