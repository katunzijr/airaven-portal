<script setup lang="ts">
import { ref } from 'vue'
import type { PropertyType } from '@/types'
import { PROPERTY_TYPE_OPTIONS } from '@/lib/propertyTypes'
import LocationMapPicker, { type LocationValue } from '@/components/host/LocationMapPicker.vue'

export interface PropertyStepPayload {
  type: PropertyType
  location: LocationValue
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
const location = ref<LocationValue>({
  city: '',
  country: 'Tanzania',
  address: '',
  lat: -6.7924,
  lng: 39.2083,
})

function handleSubmit(): void {
  if (!location.value.address.trim()) return
  emit('submit', {
    type: propertyType.value,
    location: location.value,
  })
}

defineExpose({ handleSubmit })
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <section>
      <h2 class="text-xl font-bold mb-2">Which of these best describes your place?</h2>
      <p class="text-gray-500 text-sm mb-4">Choose the property type guests will see.</p>
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

    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-bold mb-2">Where's your place located?</h2>
        <p class="text-gray-500 text-sm">Search on the map, then drag the pin to confirm the exact spot.</p>
      </div>
      <LocationMapPicker v-model="location" :active="active" />
    </div>
  </div>
</template>
