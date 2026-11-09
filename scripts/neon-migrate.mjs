import nextEnv from '@next/env'
import { spawnSync } from 'node:child_process'

nextEnv.loadEnvConfig(process.cwd())
if (!process.env.DATABASE_URL_UNPOOLED) {
  throw new Error('DATABASE_URL_UNPOOLED is required for Payload schema migrations.')
}

// Neon pooled URLs are for app traffic; Payload schema migrations require the direct endpoint.
process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED
const command = process.argv[2]
if (!['migrate', 'migrate:create'].includes(command)) throw new Error('Expected migrate or migrate:create.')
const result = spawnSync('pnpm', ['exec', 'payload', '--use-swc', command], { stdio: 'inherit', env: process.env })
if (result.error) throw result.error
process.exitCode = result.status ?? 1
