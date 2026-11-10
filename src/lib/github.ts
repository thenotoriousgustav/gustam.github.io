import 'server-only'
import type { ActivityDatum } from '@/components/ui/activity-heatmap'

/**
 * Daily contributions for the last year, from the public graph on a GitHub profile.
 * shortcut: parses GitHub's contribution-calendar HTML (no token needed); if GitHub changes
 * that markup this returns null and the section hides. Switch to the GraphQL API
 * (contributionsCollection, needs a token) if that happens.
 */
export async function getContributions(user: string): Promise<ActivityDatum[] | null> {
  try {
    const response = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
      next: { revalidate: 86400 },
    })
    if (!response.ok) return null
    const html = await response.text()
    // Each day cell carries its date; its <tool-tip> says "N contributions on …" or "No contributions on …".
    const dates = new Map([...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})" id="(contribution-day-component-[\d-]+)"/g)].map((m) => [m[2], m[1]]))
    const data = [...html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g)].flatMap((m) => {
      const date = dates.get(m[1])
      const count = m[2].match(/^([\d,]+) contribution/)?.[1]
      return date ? [{ date, value: count ? Number(count.replace(/,/g, '')) : 0 }] : []
    })
    return data.length ? data : null
  } catch (error) {
    console.error('GitHub contributions request failed', error)
    return null
  }
}
