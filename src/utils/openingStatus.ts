export type OpenStatus = 'open' | 'closed' | 'unknown'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getOpenStatus(
  hours: string | null,
  now: Date = new Date(),
): OpenStatus {
  if (hours === null) return 'unknown'

  const match = hours.match(
    /^(Daily|[A-Z][a-z]{2}(?:-[A-Z][a-z]{2})?) (\d{2}):(\d{2})-(\d{2}):(\d{2})$/,
  )
  if (!match) return 'unknown'

  const [, days, h1, m1, h2, m2] = match
  const start = Number(h1) * 60 + Number(m1)
  const end = Number(h2) * 60 + Number(m2)
  if (end <= start) return 'unknown'

  const today = now.getDay()
  let dayIsOpen = false
  if (days === 'Daily') {
    dayIsOpen = true
  } else {
    const [from, to] = days.split('-')
    const fromIndex = DAYS.indexOf(from)
    const toIndex = DAYS.indexOf(to ?? from)
    if (fromIndex === -1 || toIndex === -1 || toIndex < fromIndex) {
      return 'unknown'
    }
    dayIsOpen = today >= fromIndex && today <= toIndex
  }

  const minutes = now.getHours() * 60 + now.getMinutes()
  return dayIsOpen && minutes >= start && minutes < end ? 'open' : 'closed'
}