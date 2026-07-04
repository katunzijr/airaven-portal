<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProperties } from '@/api/catalog'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import { SlidersHorizontal, Zap, Award } from 'lucide-vue-next'
import type { Property, PropertyType } from '@/types'

const route = useRoute()
const router = useRouter()

const properties = ref<Property[]>([])
const loading = ref(true)
const error = ref('')

const locationQuery = computed(() => (route.query.location as string) || '')
const guestsQuery = computed(() => {
  const g = route.query.guests
  return g ? Number(g) : 1
})

const propertyTypes: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'All types', value: 'all' },
  { label: 'House', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Rooms', value: 'room' },
  { label: 'Hall', value: 'hall' },
  { label: 'A-Frame', value: 'frame' },
  { label: 'Villa', value: 'villa' },
  { label: 'Cabin', value: 'cabin' },
  { label: 'Cottage', value: 'cottage' },
  { label: 'Beachfront', value: 'beachfront' },
  { label: 'Business space', value: 'business' },
  { label: 'Plot', value: 'plot' },
]

const typeFilter = ref<PropertyType | 'all'>('all')
const priceMin = ref(0)
const priceMax = ref(5000000)
const instantBookOnly = ref(false)
const superhostOnly = ref(false)
const sortBy = ref<'relevant' | 'price-low' | 'price-high' | 'rating'>('relevant')
const showFilters = ref(false)

let syncingFromRoute = false

function queryString(q: typeof route.query): string {
  return JSON.stringify(
    Object.keys(q)
      .sort()
      .reduce<Record<string, string>>((acc, key) => {
        const val = q[key]
        if (typeof val === 'string') acc[key] = val
        return acc
      }, {}),
  )
}

function buildQuery(overrides: Record<string, string | undefined> = {}): Record<string, string> {
  const query: Record<string, string> = {}

  const location = overrides.location ?? locationQuery.value
  const checkIn = overrides.checkIn ?? ((route.query.checkIn as string) || '')
  const checkOut = overrides.checkOut ?? ((route.query.checkOut as string) || '')
  const guests = overrides.guests ?? (guestsQuery.value > 1 ? String(guestsQuery.value) : '')
  const type = overrides.type ?? (typeFilter.value !== 'all' ? typeFilter.value : '')
  const min = overrides.priceMin ?? (priceMin.value > 0 ? String(priceMin.value) : '')
  const max = overrides.priceMax ?? (priceMax.value < 5000000 ? String(priceMax.value) : '')
  const instantBook = overrides.instantBook ?? (instantBookOnly.value ? 'true' : '')
  const superhost = overrides.superhost ?? (superhostOnly.value ? 'true' : '')
  const sort = overrides.sortBy ?? (sortBy.value !== 'relevant' ? sortBy.value : '')

  if (location.trim()) query.location = location.trim()
  if (checkIn) query.checkIn = checkIn
  if (checkOut) query.checkOut = checkOut
  if (guests) query.guests = guests
  if (type) query.type = type
  if (min) query.priceMin = min
  if (max) query.priceMax = max
  if (instantBook) query.instantBook = instantBook
  if (superhost) query.superhost = superhost
  if (sort) query.sortBy = sort

  return query
}

function syncFiltersFromRoute() {
  syncingFromRoute = true
  typeFilter.value = ((route.query.type as PropertyType) || 'all') as PropertyType | 'all'
  priceMin.value = route.query.priceMin ? Number(route.query.priceMin) : 0
  priceMax.value = route.query.priceMax ? Number(route.query.priceMax) : 5000000
  instantBookOnly.value = route.query.instantBook === 'true'
  superhostOnly.value = route.query.superhost === 'true'
  sortBy.value = (route.query.sortBy as typeof sortBy.value) || 'relevant'
  syncingFromRoute = false
}

function updateFiltersInUrl() {
  if (syncingFromRoute) return
  const next = buildQuery()
  if (queryString(next) !== queryString(route.query)) {
    router.replace({ path: '/search', query: next })
  }
}

async function loadProperties() {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, string | number | boolean> = {}
    const q = route.query

    if (typeof q.location === 'string' && q.location.trim()) {
      params.location = q.location.trim()
    }
    if (typeof q.type === 'string' && q.type && q.type !== 'all') {
      params.type = q.type
    }
    if (q.priceMin != null && Number(q.priceMin) > 0) {
      params.priceMin = Number(q.priceMin)
    }
    if (q.priceMax != null && Number(q.priceMax) < 5000000) {
      params.priceMax = Number(q.priceMax)
    }
    if (q.instantBook === 'true') params.instantBook = true
    if (q.superhost === 'true') params.superhost = true

    properties.value = await fetchProperties(params)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load stays'
    properties.value = []
  } finally {
    loading.value = false
  }
}

const displayedProperties = computed(() => {
  let results = [...properties.value]
  const guests = guestsQuery.value

  if (guests > 1) {
    results = results.filter((p) => p.maxGuests >= guests)
  }

  switch (sortBy.value) {
    case 'price-low':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      results.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      results.sort((a, b) => b.rating - a.rating)
      break
  }

  return results
})

watch(
  () => route.query,
  () => {
    syncFiltersFromRoute()
    loadProperties()
  },
  { immediate: true, deep: true },
)

watch([typeFilter, priceMin, priceMax, instantBookOnly, superhostOnly], updateFiltersInUrl)
watch(sortBy, updateFiltersInUrl)

function clearFilters() {
  typeFilter.value = 'all'
  priceMin.value = 0
  priceMax.value = 5000000
  instantBookOnly.value = false
  superhostOnly.value = false
  sortBy.value = 'relevant'
  router.replace({
    path: '/search',
    query: buildQuery({
      type: undefined,
      priceMin: undefined,
      priceMax: undefined,
      instantBook: undefined,
      superhost: undefined,
      sortBy: undefined,
    }),
  })
}
</script>

<template>
  <div class="max-w-[1760px] mx-auto px-6 lg:px-10 py-6">
    <SearchBar variant="inline" />

    <div class="flex flex-wrap items-center justify-between gap-4 mt-6 mb-4">
      <div>
        <h1 class="text-xl font-bold">
          {{ locationQuery ? `Stays in "${locationQuery}"` : 'All available stays' }}
        </h1>
        <p v-if="loading" class="text-sm text-gray-400">Loading stays…</p>
        <p v-else-if="error" class="text-sm text-error">{{ error }}</p>
        <p v-else class="text-sm text-gray-400">{{ displayedProperties.length }} properties found</p>
      </div>
      <div class="flex items-center gap-2">
        <select
          v-model="sortBy"
          class="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-primary"
        >
          <option value="relevant">Most relevant</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest rated</option>
        </select>
        <button
          type="button"
          class="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="
            showFilters ? 'border-secondary text-secondary bg-secondary/5' : 'border-gray-200 hover:bg-gray-50'
          "
          @click="showFilters = !showFilters"
        >
          <SlidersHorizontal class="w-4 h-4" />
          Filters
        </button>
      </div>
    </div>

    <div v-if="showFilters" class="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label class="block text-sm font-semibold mb-2">Property type</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="pt in propertyTypes"
              :key="pt.value"
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              :class="
                typeFilter === pt.value
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 hover:border-gray-400'
              "
              @click="typeFilter = pt.value"
            >
              {{ pt.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Price range (per night)</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="priceMin"
              type="number"
              class="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Min"
              min="0"
            />
            <span class="text-gray-300">–</span>
            <input
              v-model.number="priceMax"
              type="number"
              class="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Max"
              min="0"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Quick filters</label>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input v-model="instantBookOnly" type="checkbox" class="rounded accent-primary" />
              <Zap class="w-4 h-4 text-secondary" />
              Instant Book
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input v-model="superhostOnly" type="checkbox" class="rounded accent-primary" />
              <Award class="w-4 h-4 text-accent" />
              Superhost only
            </label>
          </div>
        </div>

        <div class="flex items-end">
          <button type="button" class="text-sm font-medium text-secondary hover:underline" @click="clearFilters">
            Clear all filters
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Loading stays…</div>

    <div
      v-else-if="displayedProperties.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <PropertyCard v-for="property in displayedProperties" :key="property.id" :property="property" />
    </div>

    <div v-else-if="!error" class="text-center py-20">
      <div class="text-6xl mb-4">🔍</div>
      <h2 class="text-xl font-bold mb-2">No results found</h2>
      <p class="text-gray-400 max-w-md mx-auto">
        Try adjusting your search or filter criteria. You can also remove some filters to see more results.
      </p>
      <button type="button" class="mt-4 text-secondary font-medium hover:underline" @click="clearFilters">
        Clear all filters
      </button>
    </div>
  </div>
</template>
