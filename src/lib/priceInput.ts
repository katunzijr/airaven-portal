export function formatPriceDisplay(value: number): string {
  if (!value) return ''
  return value.toLocaleString('en-US')
}

export function parsePriceDisplay(value: string): number {
  const digits = value.replace(/[^\d]/g, '')
  return digits ? Number(digits) : 0
}

export function addYearsToDate(dateStr: string, years: number): string {
  const d = new Date(dateStr)
  d.setFullYear(d.getFullYear() + years)
  return d.toISOString().slice(0, 10)
}
