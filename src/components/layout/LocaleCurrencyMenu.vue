<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Globe } from 'lucide-vue-next'
import { usePreferences } from '@/composables/usePreferences'
import type { AppCurrency, AppLocale } from '@/lib/preferences'

const rootEl = ref<HTMLElement | null>(null)
const open = ref(false)
const { locale, currency, setLocale, setCurrency, t } = usePreferences()

const languages: { id: AppLocale; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'sw', label: 'Kiswahili' },
]

const currencies: { id: AppCurrency; label: string }[] = [
  { id: 'TZS', label: 'TZS — Tanzanian Shilling' },
  { id: 'USD', label: 'USD — US Dollar' },
  { id: 'KES', label: 'KES — Kenyan Shilling' },
  { id: 'UGX', label: 'UGX — Ugandan Shilling' },
]

function pickLocale(value: AppLocale): void {
  setLocale(value)
}

function pickCurrency(value: AppCurrency): void {
  setCurrency(value)
}

function onDocumentClick(event: MouseEvent): void {
  if (!open.value || !rootEl.value) return
  if (!rootEl.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocumentClick))
</script>

<template>
  <div ref="rootEl" class="relative">
    <button
      type="button"
      class="hidden lg:flex items-center gap-1.5 hover:bg-white/10 px-2.5 py-2 rounded-lg transition-colors text-sm"
      @click="open = !open"
    >
      <Globe class="w-4 h-4" />
      <span>{{ locale.toUpperCase() }} · {{ currency }}</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full mt-2 w-72 bg-white text-foreground border border-gray-200 rounded-xl shadow-xl p-4 z-50"
    >
      <div class="space-y-4">
        <div>
          <p class="text-xs font-bold uppercase text-gray-400 mb-2">{{ t('nav.language') }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="lang in languages"
              :key="lang.id"
              type="button"
              class="px-3 py-2 rounded-lg text-sm border transition-colors"
              :class="locale === lang.id ? 'border-secondary bg-secondary/5 text-secondary font-medium' : 'border-gray-200 hover:border-gray-300'"
              @click="pickLocale(lang.id)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>

        <div>
          <p class="text-xs font-bold uppercase text-gray-400 mb-2">{{ t('nav.currency') }}</p>
          <div class="space-y-1.5">
            <button
              v-for="item in currencies"
              :key="item.id"
              type="button"
              class="w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors"
              :class="currency === item.id ? 'border-secondary bg-secondary/5 text-secondary font-medium' : 'border-gray-200 hover:border-gray-300'"
              @click="pickCurrency(item.id)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
