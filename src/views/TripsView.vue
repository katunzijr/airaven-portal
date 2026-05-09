<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { trips } from '@/data'
import TripCard from '@/components/cards/TripCard.vue'
import type { TripType } from '@/types'

const route = useRoute()

const tripTypes: { label: string; value: TripType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Food & Drink', value: 'food' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Nature', value: 'nature' },
  { label: 'City', value: 'city' },
  { label: 'Wellness', value: 'wellness' },
]

const filteredTrips = computed(() => {
  const t = route.query.type as string | undefined
  if (!t || t === 'all') return trips
  return trips.filter((trip) => trip.type === t)
})
</script>

<template>
  <div class="max-w-[1760px] mx-auto px-6 lg:px-10 py-8">
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Experiences &amp; Trips</h1>
      <p class="text-gray-400 text-lg max-w-2xl">
        Unique activities hosted by local experts. From food tours to sunrise hikes, find something extraordinary.
      </p>
    </div>

    <div class="flex flex-wrap gap-2 mb-8">
      <RouterLink
        v-for="type in tripTypes"
        :key="type.value"
        :to="type.value === 'all' ? '/trips' : { path: '/trips', query: { type: type.value } }"
        class="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-colors"
          :class="
            (!route.query.type && type.value === 'all') || route.query.type === type.value
              ? 'bg-primary text-white border-primary'
              : 'border-gray-200'
          "
      >
        {{ type.label }}
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <TripCard v-for="trip in filteredTrips" :key="trip.id" :trip="trip" />
    </div>
  </div>
</template>
