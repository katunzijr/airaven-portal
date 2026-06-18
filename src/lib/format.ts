import { currency as activeCurrency, locale as activeLocale, type AppCurrency, type AppLocale } from '@/lib/preferences'

/** Stored listing prices are always in TZS. */
const TZS_PER_UNIT: Record<AppCurrency, number> = {
  TZS: 1,
  USD: 2500,
  KES: 18,
  UGX: 0.65,
}

function intlLocale(loc: AppLocale): string {
  return loc === 'sw' ? 'sw-TZ' : 'en-TZ'
}

export function convertFromTzs(amountTzs: number, target: AppCurrency): number {
  return amountTzs / TZS_PER_UNIT[target]
}

export function formatPrice(
  amountTzs: number,
  targetCurrency: AppCurrency = activeCurrency.value,
  loc: AppLocale = activeLocale.value,
): string {
  const value = convertFromTzs(amountTzs, targetCurrency)
  const intl = intlLocale(loc)

  switch (targetCurrency) {
    case 'USD':
      return `$${value.toLocaleString(intl, { maximumFractionDigits: 0 })}`
    case 'KES':
      return `KES ${Math.round(value).toLocaleString(intl)}`
    case 'UGX':
      return `UGX ${Math.round(value).toLocaleString(intl)}`
    default:
      return `TZS ${Math.round(value).toLocaleString(intl)}`
  }
}

/** @deprecated Use formatPrice — kept for gradual migration */
export function formatTZS(amount: number): string {
  return formatPrice(amount)
}
