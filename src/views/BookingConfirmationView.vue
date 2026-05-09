<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { properties } from '@/data'
import { CheckCircle, Calendar, Users, MapPin } from 'lucide-vue-next'
import { formatTZS } from '@/lib/format'

const route = useRoute()

const property = properties.find((p) => p.id === route.params.id)

const checkIn = (route.query.checkIn as string) || ''
const checkOut = (route.query.checkOut as string) || ''
const guests = (route.query.guests as string) || '1'
const totalRaw = Number((route.query.total as string) || '0')

const bookingRef = ref('')

onMounted(() => {
  bookingRef.value = Math.random().toString(36).substring(2, 8).toUpperCase()
})
</script>

<template>
  <div v-if="!property" class="max-w-4xl mx-auto px-6 py-20 text-center">
    <h1 class="text-2xl font-bold mb-2">Booking not found</h1>
    <RouterLink to="/" class="text-primary hover:underline">Back to home</RouterLink>
  </div>

  <div v-else class="max-w-2xl mx-auto px-6 py-12 text-center">
    <div class="flex justify-center mb-6">
      <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
        <CheckCircle class="w-12 h-12 text-success" />
      </div>
    </div>

    <h1 class="text-3xl font-bold mb-3">Booking confirmed!</h1>
    <p class="text-gray-400 max-w-md mx-auto mb-8">
      Your reservation at {{ property.title }} has been confirmed. You'll receive a confirmation email shortly.
    </p>

    <div class="bg-white border border-gray-200 rounded-lg p-6 text-left shadow-sm mb-8">
      <div class="flex gap-4 pb-6 border-b border-gray-200">
        <img
          :src="property.images[0]"
          :alt="property.title"
          class="w-28 h-20 object-cover rounded-lg"
          width="112"
          height="80"
        />
        <div>
          <p class="font-semibold">{{ property.title }}</p>
          <p class="text-sm text-gray-400 flex items-center gap-1 mt-1">
            <MapPin class="w-3.5 h-3.5" />
            {{ property.location.city }}, {{ property.location.country }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 py-6 border-b border-gray-200">
        <div class="text-center">
          <Calendar class="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <p class="text-xs text-gray-400">Check-in</p>
          <p class="font-medium text-sm">{{ checkIn }}</p>
        </div>
        <div class="text-center">
          <Calendar class="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <p class="text-xs text-gray-400">Check-out</p>
          <p class="font-medium text-sm">{{ checkOut }}</p>
        </div>
        <div class="text-center">
          <Users class="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <p class="text-xs text-gray-400">Guests</p>
          <p class="font-medium text-sm">{{ guests }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center pt-6">
        <span class="font-semibold text-lg">Total paid</span>
        <span class="font-bold text-2xl">{{ formatTZS(totalRaw) }}</span>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <RouterLink
        to="/bookings"
        class="bg-secondary hover:bg-secondary-light text-white font-bold px-8 py-3 rounded-lg transition-colors"
      >
        View my bookings
      </RouterLink>
      <RouterLink to="/" class="border border-gray-200 hover:bg-gray-50 font-bold px-8 py-3 rounded-lg transition-colors">
        Back to home
      </RouterLink>
    </div>

    <div class="mt-8 bg-primary/5 rounded-lg p-4 border border-primary/10">
      <p class="text-xs text-gray-400">Booking reference</p>
      <p class="font-mono font-bold text-lg tracking-wider">AVN-{{ bookingRef }}</p>
    </div>
  </div>
</template>
