<script setup lang="ts">
import { ref } from 'vue'
import type { PropertyType } from '@/types'
import { AMENITY_OPTIONS } from '@/lib/amenities'
import { PROPERTY_TYPE_OPTIONS } from '@/lib/propertyTypes'
import LocationMapPicker, { type LocationValue } from '@/components/host/LocationMapPicker.vue'
import { Minus, Plus } from 'lucide-vue-next'

export interface PropertyStepPayload {
  type: PropertyType
  location: LocationValue
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
}

defineProps<{
  loading?: boolean
  error?: string
  active?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: PropertyStepPayload]
}>()

const propertyType = ref<PropertyType>('house')
const selectedAmenities = ref<string[]>(['wifi', 'kitchen'])
const location = ref<LocationValue>({
  city: '',
  country: 'Tanzania',
  address: '',
  lat: -6.7924,
  lng: 39.2083,
})

const counters = ref({
  maxGuests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
})

function toggleAmenity(id: string): void {
  if (selectedAmenities.value.includes(id)) {
    selectedAmenities.value = selectedAmenities.value.filter((a) => a !== id)
  } else {
    selectedAmenities.value = [...selectedAmenities.value, id]
  }
}

function adjustCounter(key: keyof typeof counters.value, delta: number): void {
  counters.value[key] = Math.max(key === 'maxGuests' ? 1 : 0, counters.value[key] + delta)
}

function handleSubmit(): void {
  if (!location.value.address.trim()) return
  emit('submit', {
    type: propertyType.value,
    location: location.value,
    maxGuests: counters.value.maxGuests,
    bedrooms: counters.value.bedrooms,
    beds: counters.value.beds,
    bathrooms: counters.value.bathrooms,
    amenities: selectedAmenities.value,
  })
}

defineExpose({ handleSubmit })
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-bold mb-2">Which of these best describes your place?</h2>
        <p class="text-gray-500 text-sm mb-4">Choose the property type guests will book.</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            v-for="option in PROPERTY_TYPE_OPTIONS"
            :key="option.id"
            type="button"
            class="rounded-xl border-2 p-4 text-left transition-all hover:border-secondary/50"
            :class="propertyType === option.id ? 'border-secondary bg-secondary/5' : 'border-gray-200'"
            @click="propertyType = option.id"
          >
            <component :is="option.icon" class="w-6 h-6 mb-2" :class="propertyType === option.id ? 'text-secondary' : 'text-gray-400'" />
            <p class="font-medium text-sm">{{ option.label }}</p>
          </button>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-bold mb-4">Share some basics about your place</h2>
        <div class="rounded-2xl border border-gray-200 divide-y divide-gray-100">
          <div
            v-for="item in [
              { key: 'maxGuests', label: 'Guests' },
              { key: 'bedrooms', label: 'Bedrooms' },
              { key: 'beds', label: 'Beds' },
              { key: 'bathrooms', label: 'Bathrooms' },
            ]"
            :key="item.key"
            class="flex items-center justify-between px-5 py-4"
          >
            <span class="font-medium">{{ item.label }}</span>
            <div class="flex items-center gap-4">
              <button
                type="button"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500"
                @click="adjustCounter(item.key as keyof typeof counters, -1)"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span class="w-6 text-center font-medium">{{ counters[item.key as keyof typeof counters] }}</span>
              <button
                type="button"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500"
                @click="adjustCounter(item.key as keyof typeof counters, 1)"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-bold mb-2">Tell guests what your place offers</h2>
        <p class="text-gray-500 text-sm mb-4">Select amenities available at your property.</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            v-for="amenity in AMENITY_OPTIONS"
            :key="amenity.id"
            type="button"
            class="rounded-xl border-2 p-4 text-left transition-all"
            :class="selectedAmenities.includes(amenity.id) ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300'"
            @click="toggleAmenity(amenity.id)"
          >
            <component
              :is="amenity.icon"
              class="w-5 h-5 mb-2"
              :class="selectedAmenities.includes(amenity.id) ? 'text-secondary' : 'text-gray-400'"
            />
            <p class="text-sm font-medium">{{ amenity.label }}</p>
          </button>
        </div>
      </section>
    </div>

    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-bold mb-2">Where's your place located?</h2>
        <p class="text-gray-500 text-sm">Search on the map, then drag the pin to confirm the exact spot.</p>
      </div>
      <LocationMapPicker v-model="location" :active="active" />
    </div>
  </div>
</template>
