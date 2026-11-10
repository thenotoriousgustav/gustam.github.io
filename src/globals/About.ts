import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about', access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { beforeChange: [async ({ data, req }) => {
    if (data.portrait) {
      const portraitId = typeof data.portrait === 'object' ? data.portrait.id : data.portrait
      const portrait = await req.payload.findByID({ collection: 'media', id: portraitId, overrideAccess: true })
      if (portrait.kind !== 'image') throw new Error('About portrait must be an image.')
    }
    return data
  }] },
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'portrait', type: 'relationship', relationTo: 'media' },
    { name: 'introduction', type: 'richText', required: true },
    { name: 'exploringTitle', label: 'Education heading', type: 'text', required: true },
    { name: 'education', label: 'Education', labels: { singular: 'School', plural: 'Schools' }, type: 'array', admin: { description: 'Newest school first.' }, fields: [
      { name: 'school', type: 'text', required: true, admin: { placeholder: 'Universitas Gunadarma' } },
      { name: 'programme', type: 'text', required: true, admin: { placeholder: 'Bachelor of Information Systems' } },
      { name: 'period', type: 'text', required: true, admin: { placeholder: '2021–2025' } },
    ] },
    { name: 'learningTitle', label: 'Certifications heading', type: 'text', required: true }, { name: 'learning', label: 'Certifications & training', type: 'textarea', required: true },
    { name: 'interestsTitle', label: 'Languages heading', type: 'text', required: true }, { name: 'interests', label: 'Languages', type: 'textarea', required: true },
    { name: 'favoritesTitle', label: 'Skills heading', type: 'text', required: true },
    { name: 'favorites', label: 'Technical skills', type: 'array', fields: [{ name: 'category', type: 'text', required: true }, { name: 'items', type: 'textarea', required: true }] },
  ],
}
