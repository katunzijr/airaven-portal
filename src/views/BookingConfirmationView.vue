<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import type { Booking } from '@/types'
import { fetchBooking } from '@/api/catalog'
import { CheckCircle, Calendar, Users, MapPin, XCircle, Clock } from 'lucide-vue-next'
import { usePreferences } from '@/composables/usePreferences'

const route = useRoute()
const { formatMoney } = usePreferences()

const booking = ref<Booking | null>(null)
const loading = ref(true)
const loadError = ref('')

const paymentResult = computed(() => (route.query.payment as string) || '')

const isSuccess = computed(
  () => booking.value?.paymentStatus === 'paid' || booking.value?.status === 'confirmed',
)

const isFailed = computed(
  () =>
    booking.value?.paymentStatus === 'failed' ||
    booking.value?.paymentStatus === 'cancelled' ||
    paymentResult.value === 'failed' ||
    paymentResult.value === 'cancelled',
)

async function loadBooking(id: string): Promise<void> {
  loading.value = true
  loadError.value = ''
  try {
    booking.value = await fetchBooking(id)
  } catch (err) {
    booking.value = null
    loadError.value = err instanceof Error ? err.message : 'Failed to load booking'
  } finally {
    loading.value = false
  }
}

watch(
  () => route.query.bookingId,
  (id) => {
    if (typeof id === 'string' && id) void loadBooking(id)
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="loading" class="max-w-2xl mx-auto px-6 py-20 text-center text-gray-400">
    Loading confirmation…
  </div>

  <div v-else-if="!booking" class="max-w-2xl mx-auto px-6 py-20 text-center">
    <h1 class="text-2xl font-bold mb-2">Booking not found</h1>
    <p v-if="loadError" class="text-error text-sm mb-4">{{ loadError }}</p>
    <RouterLink to="/bookings" class="text-primary hover:underline">View my bookings</RouterLink>
  </div>

  <div v-else class="max-w-2xl mx-auto px-6 py-12 text-center">
    <div class="flex justify-center mb-6">
      <div
        class="w-20 h-20 rounded-full flex items-center justify-center"
        :class="
          isSuccess
            ? 'bg-success/10'
            : isFailed
              ? 'bg-error/10'
              : 'bg-accent/10'
        "
      >
        <CheckCircle v-if="isSuccess" class="w-12 h-12 text-success" />
        <XCircle v-else-if="isFailed" class="w-12 h-12 text-error" />
        <Clock v-else class="w-12 h-12 text-accent" />
      </div>
    </div>

    <h1 class="text-3xl font-bold mb-3">
      {{
        isSuccess
          ? 'Booking confirmed!'
          : isFailed
            ? 'Payment unsuccessful'
            : 'Payment pending'
      }}
    </h1>
    <p class="text-gray-400 max-w-md mx-auto mb-8">
      {{
        isSuccess
          ? `Your reservation at ${booking.property.title} has been confirmed.`
          : isFailed
            ? 'Your payment was not completed. You can try booking again from the listing page.'
            : 'We are confirming your payment. This may take a moment.'
      }}
    </p>

    <div class="bg-white border border-gray-200 rounded-lg p-6 text-left shadow-sm mb-8">
      <div class="flex gap-4 pb-6 border-b border-gray-200">
        <img
          :src="booking.property.images[0]"
          :alt="booking.property.title"
          class="w-28 h-20 object-cover rounded-lg"
          width="112"
          height="80"
        />
        <div>
          <p class="font-semibold">{{ booking.property.title }}</p>
          <p class="text-sm text-gray-400 flex items-center gap-1 mt-1">
            <MapPin class="w-3.5 h-3.5" />
            {{ booking.property.location.city }}, {{ booking.property.location.country }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 py-6 border-b border-gray-200">
        <div class="text-center">
          <Calendar class="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <p class="text-xs text-gray-400">Check-in</p>
          <p class="font-medium text-sm">{{ booking.checkIn }}</p>
        </div>
        <div class="text-center">
          <Calendar class="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <p class="text-xs text-gray-400">Check-out</p>
          <p class="font-medium text-sm">{{ booking.checkOut }}</p>
        </div>
        <div class="text-center">
          <Users class="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <p class="text-xs text-gray-400">Guests</p>
          <p class="font-medium text-sm">{{ booking.guests }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center pt-6">
        <span class="font-semibold text-lg">{{ isSuccess ? 'Total paid' : 'Total' }}</span>
        <span class="font-bold text-2xl">{{ formatMoney(booking.totalPrice) }}</span>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <RouterLink
        to="/bookings"
        class="bg-secondary hover:bg-secondary-light text-white font-bold px-8 py-3 rounded-lg transition-colors"
      >
        View my bookings
      </RouterLink>
      <RouterLink
        to="/"
        class="border border-gray-200 hover:bg-gray-50 font-bold px-8 py-3 rounded-lg transition-colors"
      >
        Back to home
      </RouterLink>
    </div>

    <div class="mt-8 bg-primary/5 rounded-lg p-4 border border-primary/10">
      <p class="text-xs text-gray-400">Booking reference</p>
      <p class="font-mono font-bold text-lg tracking-wider">{{ booking.id.toUpperCase() }}</p>
    </div>
  </div>
</template>
