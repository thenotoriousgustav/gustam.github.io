/** Format a count for display, e.g. 1234 -> "1,234". */
export function formatNumber(value: number): string {
  return Number.isFinite(value) ? new Intl.NumberFormat("en-US").format(value) : "—";
}

/**
 * A project month as "MM.YYYY". The admin's month picker stores the 1st at midnight in the
 * editor's time zone, so read it in Jakarta's (UTC would show the previous month).
 */
export function formatMonth(iso?: string | null): string | null {
  if (!iso) return null
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", month: "2-digit", year: "numeric" }).formatToParts(new Date(iso))
  const part = (type: string) => parts.find((p) => p.type === type)?.value
  return `${part("month")}.${part("year")}`
}
