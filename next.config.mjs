import { withPayload } from '@payloadcms/next/withPayload'

const storeId = process.env.BLOB_READ_WRITE_TOKEN?.match(/^vercel_blob_rw_([a-z\d]+)_/i)?.[1]?.toLowerCase()
const nextConfig = {
  images: {
    localPatterns: [{ pathname: '/api/media/file/**', search: '?prefix=portfolio' }],
    remotePatterns: storeId ? [{ protocol: 'https', hostname: `${storeId}.public.blob.vercel-storage.com` }] : [],
  },
}

export default withPayload(nextConfig)
