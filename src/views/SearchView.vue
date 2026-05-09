<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { properties } from '@/data'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import { SlidersHorizontal, Zap, Award } from 'lucide-vue-next'
import type { PropertyType } from '@/types'

const route = useRoute()

const locationQuery = computed(() => (route.query.location as string) || '')

const propertyTypes: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'All types', value: 'all' },
  { label: 'House', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Room', value: 'room' },
  { label: 'Hall', value: 'hall' },
  { label: 'A-Frame', value: 'frame' },
  { label: 'Villa', value: 'villa' },
  { label: 'Cabin', value: 'cabin' },
  { label: 'Cottage', value: 'cottage' },
]

const typeFilter = ref<PropertyType | 'all'>('all')
const priceMin = ref(0)
const priceMax = ref(5000000)
const instantBookOnly = ref(false)
const superhostOnly = ref(false)
const sortBy = ref<'relevant' | 'price-low' | 'price-high' | 'rating'>('relevant')
const showFilters = ref(false)

const filteredProperties = computed(() => {
  let results = [...properties]

  const loc = locationQuery.value
  if (loc) {
    const q = loc.toLowerCase()
    results = results.filter(
      (p) =>
        p.location.city.toLowerCase().includes(q) ||
        p.location.country.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q),
    )
  }

  if (typeFilter.value !== 'all') {
    results = results.filter((p) => p.type === typeFilter.value)
  }

  results = results.filter((p) => p.price >= priceMin.value && p.price <= priceMax.value)

  if (instantBookOnly.value) {
    results = results.filter((p) => p.instantBook)
  }

  if (superhostOnly.value) {
    results = results.filter((p) => p.host.superhost)
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

function clearFilters() {
  typeFilter.value = 'all'
  priceMin.value = 0
  priceMax.value = 5000000
  instantBookOnly.value = false
  superhostOnly.value = false
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
        <p class="text-sm text-gray-400">{{ filteredProperties.length }} properties found</p>
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

    <div v-if="filteredProperties.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PropertyCard v-for="property in filteredProperties" :key="property.id" :property="property" />
    </div>

    <div v-else class="text-center py-20">
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
