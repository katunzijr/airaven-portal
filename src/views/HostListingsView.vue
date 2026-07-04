<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import type { Property } from '@/types'
import { fetchHostProperties } from '@/api/host'
import { useIsHost } from '@/composables/useIsHost'
import { usePreferences } from '@/composables/usePreferences'
import { MapPin, Plus, ArrowRight, Loader2, Home } from 'lucide-vue-next'

const router = useRouter()
const { t, tp, formatMoney } = usePreferences()
const { isHost, hostChecked } = useIsHost()

const properties = ref<Property[]>([])
const loading = ref(true)
const loadError = ref('')

async function loadListings(): Promise<void> {
  loading.value = true
  loadError.value = ''
  try {
    properties.value = await fetchHostProperties()
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load listings'
  } finally {
    loading.value = false
  }
}

watch(
  hostChecked,
  (checked) => {
    if (!checked) return
    if (!isHost.value) {
      router.replace('/host')
      return
    }
    void loadListings()
  },
  { immediate: true },
)

function coverImage(property: Property): string {
  return property.coverImages?.[0] ?? property.images[0] ?? 'https://picsum.photos/seed/placeholder/400/300'
}

function statusLabel(status?: string): string {
  return status === 'published' ? t('host.listings.status.published') : t('host.listings.status.draft')
}

function unitCount(property: Property): number {
  return property.listings?.length ?? property.listingCount ?? 0
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-1">{{ t('host.listings.title') }}</h1>
        <p class="text-gray-500 text-sm">{{ t('host.listings.subtitle') }}</p>
      </div>
      <RouterLink
        to="/host/onboarding?new=1"
        class="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-3 rounded-lg hover:bg-primary-dark transition-colors shrink-0"
      >
        <Plus class="w-4 h-4" />
        {{ t('host.listings.addListing') }}
      </RouterLink>
    </div>

    <p v-if="loading" class="text-gray-400 text-sm inline-flex items-center gap-2">
      <Loader2 class="w-4 h-4 animate-spin" />
      {{ t('host.listings.loading') }}
    </p>
    <p v-else-if="loadError" class="text-error text-sm">{{ loadError }}</p>

    <div v-else-if="properties.length === 0" class="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
      <Home class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-bold mb-2">{{ t('host.listings.empty') }}</h2>
      <p class="text-gray-400 max-w-md mx-auto mb-6">{{ t('host.listings.emptyHint') }}</p>
      <RouterLink
        to="/host/onboarding?new=1"
        class="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg"
      >
        <Plus class="w-4 h-4" />
        {{ t('host.listings.addListing') }}
      </RouterLink>
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="property in properties"
        :key="property.id"
        class="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
      >
        <div class="sm:w-44 h-36 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img :src="coverImage(property)" :alt="property.title" class="w-full h-full object-cover" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span
              class="text-xs font-semibold uppercase px-2 py-0.5 rounded-md"
              :class="property.status === 'published' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent-dark'"
            >
              {{ statusLabel(property.status) }}
            </span>
            <span class="text-xs text-gray-400">{{ tp(property.type) }}</span>
          </div>

          <h2 class="font-semibold text-lg truncate">{{ property.title || 'Untitled property' }}</h2>

          <p class="text-sm text-gray-500 flex items-center gap-1 mt-1 truncate">
            <MapPin class="w-3.5 h-3.5 shrink-0" />
            {{ property.location.city }}, {{ property.location.country }}
          </p>

          <p class="text-sm text-gray-500 mt-2">
            {{ unitCount(property) }} {{ t('host.listings.units') }}
            <span v-if="property.fromPrice || property.price">
              · From {{ formatMoney(property.fromPrice ?? property.price) }}/night
            </span>
          </p>
        </div>

        <div class="flex sm:flex-col gap-2 sm:justify-center shrink-0">
          <RouterLink
            :to="{ name: 'host-listing-manage', params: { id: property.id } }"
            class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            {{ property.status === 'published' ? t('host.listings.manage') : t('host.listings.continue') }}
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
          <RouterLink
            v-if="property.status === 'published'"
            :to="{ name: 'property', params: { id: property.id } }"
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {{ t('host.listings.view') }}
          </RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>
