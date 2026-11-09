import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClientArgs } from 'payload'
import { importMap } from './admin/importMap.js'

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  async function serverFunction(args: ServerFunctionClientArgs) {
    'use server'
    return handleServerFunctions({ ...args, config, importMap })
  }

  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>
}
