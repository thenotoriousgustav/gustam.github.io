import config from '../payload.config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
try {
  const [projects, experiences, gallery, settings] = await Promise.all([
    payload.find({ collection: 'projects', depth: 0, limit: 1, overrideAccess: false }),
    payload.find({ collection: 'experiences', depth: 0, limit: 1, overrideAccess: false }),
    payload.find({ collection: 'gallery-items', depth: 0, limit: 1, overrideAccess: false }),
    payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: false }),
  ])
  if (!settings) throw new Error('Site settings read failed.')
  console.log(`Neon Payload read check passed: projects=${projects.totalDocs}, experiences=${experiences.totalDocs}, gallery=${gallery.totalDocs}, settings=readable.`)
} finally {
  await payload.destroy()
}
