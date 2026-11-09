import config from '../payload.config'
import { getPayload } from 'payload'

async function main() {
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
if (!email || !password || password.length < 16) throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 16 characters.')
const payload = await getPayload({ config })
try {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  if (existing.docs.length) throw new Error(`A manager account already exists for ${email}. No account was changed.`)
  const users = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
  if (users.docs.length) throw new Error('A manager account already exists. Create additional accounts only while authenticated in /admin.')
  await payload.create({ collection: 'users', data: { email, password }, overrideAccess: true })
  console.log(`Created manager account: ${email}`)
} finally { await payload.destroy() }
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
