import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './src/collections/Users.ts'
import { Media } from './src/collections/Media.ts'
import { Projects } from './src/collections/Projects.ts'
import { Posts } from './src/collections/Posts.ts'
import { Experiences } from './src/collections/Experiences.ts'
import { GalleryItems } from './src/collections/GalleryItems.ts'
import { SiteSettings } from './src/globals/SiteSettings.ts'
import { Home } from './src/globals/Home.ts'
import { About } from './src/globals/About.ts'
import { GalleryPage } from './src/globals/GalleryPage.ts'

const localEnvFile = path.resolve(process.cwd(), '.env.local')
if (existsSync(localEnvFile)) process.loadEnvFile(localEnvFile)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const appOrigin = process.env.APP_ORIGIN
const normalizedOrigin = appOrigin ? new URL(appOrigin).origin : undefined
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required in production.')
  if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) throw new Error('Set a production PAYLOAD_SECRET of at least 32 characters.')
  if (!appOrigin || normalizedOrigin !== appOrigin.replace(/\/$/, '') || !appOrigin.startsWith('https://')) throw new Error('Set APP_ORIGIN to the production HTTPS origin without a path.')
  if (!blobToken) throw new Error('BLOB_READ_WRITE_TOKEN is required in production.')
}

// Origins the admin may be used from (CORS + CSRF): APP_ORIGIN, any extra
// domains in APP_EXTRA_ORIGINS (comma-separated, e.g. the *.vercel.app URL),
// and localhost outside production.
const extraOrigins = (process.env.APP_EXTRA_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean)
for (const origin of extraOrigins) {
  if (new URL(origin).origin !== origin.replace(/\/$/, '')) throw new Error(`APP_EXTRA_ORIGINS entry "${origin}" must be an origin without a path.`)
}
const allowedOrigins = [...new Set([
  appOrigin,
  ...extraOrigins,
  ...(process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000', 'http://127.0.0.1:3000']),
].filter((origin): origin is string => Boolean(origin)).map((origin) => new URL(origin).origin))]

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'development-only-secret-replace-with-a-long-random-value',
  // No serverURL: the admin then calls the API on whichever allowed origin it
  // is opened from, instead of always on APP_ORIGIN (which breaks the cookie).
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    autoLogin: process.env.NODE_ENV === 'development' && process.env.PAYLOAD_DEV_EMAIL ? { email: process.env.PAYLOAD_DEV_EMAIL, password: process.env.PAYLOAD_DEV_PASSWORD || '', prefillOnly: true } : false,
  },
  routes: { admin: '/admin', api: '/api' },
  graphQL: { disable: true },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  collections: [Users, Media, Projects, Experiences, GalleryItems, Posts],
  globals: [SiteSettings, Home, About, GalleryPage],
  editor: lexicalEditor(),
  db: postgresAdapter({ push: false, pool: { connectionString: process.env.DATABASE_URL || 'postgres://placeholder:placeholder@localhost:5432/portfolio' }, migrationDir: path.resolve(dirname, 'src/migrations') }),
  plugins: [vercelBlobStorage({ enabled: Boolean(blobToken), token: blobToken || '', collections: { media: { prefix: 'portfolio', disablePayloadAccessControl: true } }, clientUploads: true, alwaysInsertFields: true })],
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  sharp,
})
