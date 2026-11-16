import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/** Link-preview image size (Open Graph / X summary_large_image). */
export const ogSize = { width: 1200, height: 630 }

// Static fonts: next/og cannot use the variable Newsreader/Manrope that next/font loads.
const fonts = Promise.all([
  readFile(join(process.cwd(), 'assets/fonts/newsreader-latin-400-normal.woff')),
  readFile(join(process.cwd(), 'assets/fonts/manrope-latin-600-normal.woff')),
])

/** The site's look in a preview card: a large serif line, a short note under it, the domain at the foot. */
export async function ogImage({ title, note }: { title: string; note?: string | null }) {
  const [serif, sans] = await fonts
  const domain = (process.env.APP_ORIGIN ? new URL(process.env.APP_ORIGIN).host : 'gustam.digital').replace(/^www\./, '')
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: 72, background: '#f4f5f7', color: '#18202b' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontFamily: 'Newsreader', fontSize: title.length > 48 ? 64 : 84, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{title}</div>
          {note ? <div style={{ fontFamily: 'Manrope', fontSize: 28, lineHeight: 1.45, color: '#536174', maxWidth: 900 }}>{note.length > 140 ? `${note.slice(0, 137)}…` : note}</div> : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Manrope', fontSize: 26, color: '#18202b' }}>
          <span>Gustam Rheza</span>
          <span style={{ color: '#2257d6' }}>{domain}</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: 'Newsreader', data: serif, weight: 400, style: 'normal' }, { name: 'Manrope', data: sans, weight: 600, style: 'normal' }] },
  )
}
