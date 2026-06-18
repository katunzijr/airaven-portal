import { computed } from 'vue'
import { t as translate, tCategory, tPropertyType, type MessageKey } from '@/lib/i18n'
import { formatPrice } from '@/lib/format'
import {
  currency,
  locale,
  setCurrency,
  setLocale,
  type AppCurrency,
  type AppLocale,
} from '@/lib/preferences'

export function usePreferences() {
  const t = (key: MessageKey) => translate(key, locale.value)

  const tc = (slug: string) => tCategory(slug, locale.value)

  const tp = (type: string) => tPropertyType(type, locale.value)

  const formatMoney = (amountTzs: number) => formatPrice(amountTzs, currency.value, locale.value)

  const localeLabel = computed(() => (locale.value === 'sw' ? 'Kiswahili' : 'English'))

  return {
    locale,
    currency,
    localeLabel,
    setLocale: (value: AppLocale) => setLocale(value),
    setCurrency: (value: AppCurrency) => setCurrency(value),
    t,
    tc,
    tp,
    formatMoney,
  }
}
