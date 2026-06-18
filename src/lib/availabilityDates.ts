import type { AvailabilityRange } from '@/types/host'

export function todayStr(): string {
  const d = new Date()
  return formatDateParts(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

function formatDateParts(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDateStr(dateStr)
  d.setDate(d.getDate() + days)
  return formatDateParts(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export function isDateInRange(dateStr: string, start: string, end?: string): boolean {
  if (dateStr < start) return false
  if (end && dateStr > end) return false
  return true
}

export function isDateBookable(dateStr: string, availability: AvailabilityRange[]): boolean {
  if (!dateStr || dateStr < todayStr()) return false

  const available = availability.filter((r) => r.status === 'available')
  const blocked = availability.filter((r) => r.status === 'blocked')

  if (available.length === 0) return false

  const inAvailable = available.some((r) => isDateInRange(dateStr, r.startDate, r.endDate))
  if (!inAvailable) return false

  return !blocked.some((r) => isDateInRange(dateStr, r.startDate, r.endDate))
}

export function isStayAvailable(
  checkIn: string,
  checkOut: string,
  availability: AvailabilityRange[],
): boolean {
  if (!checkIn || !checkOut || checkOut <= checkIn) return false

  let cursor = checkIn
  while (cursor < checkOut) {
    if (!isDateBookable(cursor, availability)) return false
    cursor = addDays(cursor, 1)
  }
  return true
}

export function canSelectCheckOut(
  checkIn: string,
  checkOut: string,
  availability: AvailabilityRange[],
): boolean {
  return isStayAvailable(checkIn, checkOut, availability)
}

export function getMonthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const cells: (string | null)[] = []

  for (let i = 0; i < first.getDay(); i++) cells.push(null)

  for (let day = 1; day <= last.getDate(); day++) {
    cells.push(formatDateParts(year, month + 1, day))
  }

  return cells
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return ''
  return parseDateStr(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
