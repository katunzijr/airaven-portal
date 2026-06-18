import { ref } from 'vue'

export type AppLocale = 'en' | 'sw'
export type AppCurrency = 'TZS' | 'USD' | 'KES' | 'UGX'

const LOCALE_KEY = 'airaven-locale'
const CURRENCY_KEY = 'airaven-currency'

function readLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    return saved === 'sw' ? 'sw' : 'en'
  } catch {
    return 'en'
  }
}

function readCurrency(): AppCurrency {
  try {
    const saved = localStorage.getItem(CURRENCY_KEY)
    if (saved === 'USD' || saved === 'KES' || saved === 'UGX' || saved === 'TZS') return saved
  } catch {
    // ignore
  }
  return 'TZS'
}

export const locale = ref<AppLocale>(readLocale())
export const currency = ref<AppCurrency>(readCurrency())

export function setLocale(next: AppLocale): void {
  locale.value = next
  localStorage.setItem(LOCALE_KEY, next)
}

export function setCurrency(next: AppCurrency): void {
  currency.value = next
  localStorage.setItem(CURRENCY_KEY, next)
}
