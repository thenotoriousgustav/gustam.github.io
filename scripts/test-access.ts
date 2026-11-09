import assert from 'node:assert/strict'
import { Users } from '../src/collections/Users.ts'
import { Media } from '../src/collections/Media.ts'
import { Projects } from '../src/collections/Projects.ts'
import { Posts } from '../src/collections/Posts.ts'
import { Experiences } from '../src/collections/Experiences.ts'
import { GalleryItems } from '../src/collections/GalleryItems.ts'
import { SiteSettings } from '../src/globals/SiteSettings.ts'
import { Home } from '../src/globals/Home.ts'
import { About } from '../src/globals/About.ts'
import { GalleryPage } from '../src/globals/GalleryPage.ts'

const publicUser = null
const manager = { id: 1, email: 'manager@example.com' }
const check = async (policy: unknown, user: unknown, expected: boolean) => {
  assert.equal(typeof policy, 'function')
  assert.equal(await (policy as (args: never) => unknown)({ req: { user } } as never), expected)
}

for (const collection of [Media, Projects, Experiences, GalleryItems]) {
  await check(collection.access?.read, publicUser, true)
  for (const action of ['create', 'update', 'delete'] as const) {
    await check(collection.access?.[action], publicUser, false)
    await check(collection.access?.[action], manager, true)
  }
}
for (const action of ['create', 'update', 'delete'] as const) {
  await check(Posts.access?.[action], publicUser, false)
  await check(Posts.access?.[action], manager, true)
}
assert.deepEqual(await (Posts.access!.read as (args: never) => unknown)({ req: { user: null } } as never), { status: { equals: 'published' } })
await check(Posts.access?.read, manager, true)
const postSlug = Posts.fields.find((field) => 'name' in field && field.name === 'slug') as unknown as { hooks: { beforeValidate: ((args: never) => unknown)[]; beforeChange: ((args: never) => unknown)[] } }
assert.equal(postSlug.hooks.beforeValidate[0]({ operation: 'create', data: { title: 'Building for the web!' } } as never), 'building-for-the-web')
assert.throws(() => postSlug.hooks.beforeChange[0]({ value: 'new-url', operation: 'update', originalDoc: { slug: 'old-url' } } as never), /cannot be changed/)
assert.throws(() => postSlug.hooks.beforeChange[0]({ value: '../private', operation: 'create' } as never), /lowercase/)
await check(Users.access?.read, publicUser, false)
await check(Users.access?.read, manager, true)
await check(Users.access?.create, manager, false)
const slugField = Projects.fields.find((field) => 'name' in field && field.name === 'slug') as unknown as { hooks?: { beforeValidate?: unknown[] } } | undefined
assert.ok(slugField)
const createSlug = slugField.hooks?.beforeValidate?.[0] as (args: never) => unknown
assert.equal(createSlug({ value: undefined, data: { title: 'New Project!' }, operation: 'create' } as never), 'new-project')
for (const global of [SiteSettings, Home, About, GalleryPage]) {
  await check(global.access?.update, publicUser, false)
  await check(global.access?.update, manager, true)
}
console.log('Access policy checks passed.')
