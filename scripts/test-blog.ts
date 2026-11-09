import assert from 'node:assert/strict'
import { getPayload } from 'payload'

process.loadEnvFile('.env.local')
const testURL = process.env.TEST_DATABASE_URL
assert.ok(testURL, 'Set TEST_DATABASE_URL to an isolated Neon branch, never production.')
assert.notEqual(new URL(testURL).hostname.replace('-pooler', ''), new URL(process.env.DATABASE_URL!).hostname.replace('-pooler', ''), 'Refusing to run blog write tests against the configured production database.')
process.env.DATABASE_URL = testURL

async function main() {
  const { default: config } = await import('../payload.config.ts')
  const payload = await getPayload({ config })
  const ids: number[] = []
  const prefix = `blog-test-${Date.now()}`
  const body = { root: { type: 'root', version: 1, direction: null, format: '' as const, indent: 0, children: [
    { type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [
      { type: 'text', version: 1, text: 'Temporary blog integration test.', detail: 0, format: 0, mode: 'normal', style: '' },
    ] },
  ] } }
  try {
    for (let i = 0; i < 12; i++) {
      const post = await payload.create({ collection: 'posts', data: {
        title: `${prefix}-${i}`, slug: `${prefix}-${i}`, excerpt: 'Temporary test post.', content: body,
        status: i === 11 ? 'draft' : 'published', publishedAt: new Date(Date.UTC(2026, 0, i + 1)).toISOString(),
      } })
      ids.push(post.id)
    }
    const where = { slug: { contains: prefix } }
    const publicPosts = await payload.find({ collection: 'posts', overrideAccess: false, where, limit: 10, sort: ['-publishedAt', '-id'] })
    assert.equal(publicPosts.totalDocs, 11)
    assert.equal(publicPosts.totalPages, 2)
    assert.equal(publicPosts.docs.length, 10)
    assert.equal(publicPosts.docs[0].slug, `${prefix}-10`)
    const secondPage = await payload.find({ collection: 'posts', overrideAccess: false, where, limit: 10, page: 2, sort: ['-publishedAt', '-id'] })
    assert.equal(secondPage.docs.length, 1)
    const draft = await payload.find({ collection: 'posts', overrideAccess: false, where: { slug: { equals: `${prefix}-11` } } })
    assert.equal(draft.totalDocs, 0)
    await assert.rejects(payload.create({ collection: 'posts', overrideAccess: false, data: { title: 'Forbidden', slug: `${prefix}-forbidden`, excerpt: 'Forbidden', content: body, status: 'draft', publishedAt: new Date().toISOString() } }))
    await assert.rejects(payload.update({ collection: 'posts', id: ids[0], overrideAccess: false, data: { title: 'Forbidden' } }))
    await assert.rejects(payload.delete({ collection: 'posts', id: ids[0], overrideAccess: false }))
    await assert.rejects(payload.update({ collection: 'posts', id: ids[0], data: { slug: 'changed-permalink' } }))
    console.log('Blog integration passed: published-only reads, private drafts, pagination, stable slugs, and anonymous write protection.')
  } finally {
    for (const id of ids) await payload.delete({ collection: 'posts', id })
    await payload.destroy()
  }
}
main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1) })
