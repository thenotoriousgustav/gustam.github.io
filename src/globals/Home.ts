import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home', access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'introTitle', type: 'text', required: true }, { name: 'introDescription', type: 'textarea', required: true },
    { name: 'studyCaption', type: 'textarea' }, { name: 'selectedWorkTitle', type: 'text', required: true },
    { name: 'experienceTitle', type: 'text', required: true }, { name: 'contactText', type: 'text', required: true },
  ],
}
