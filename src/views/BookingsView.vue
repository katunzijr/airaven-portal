<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Booking } from '@/types'
import { fetchBookings } from '@/api/catalog'
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { usePreferences } from '@/composables/usePreferences'

const { t, formatMoney } = usePreferences()

const bookings = ref<Booking[]>([])
const loading = ref(true)
const loadError = ref('')

const statusConfig = computed(() => ({
  confirmed: {
    icon: CheckCircle,
    label: t('bookings.status.confirmed'),
    color: 'text-success',
    bg: 'bg-success/10',
  },
  pending: {
    icon: Clock,
    label: t('bookings.status.pending'),
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  cancelled: {
    icon: XCircle,
    label: t('bookings.status.cancelled'),
    color: 'text-error',
    bg: 'bg-error/10',
  },
  completed: {
    icon: CheckCircle,
    label: t('bookings.status.completed'),
    color: 'text-gray-400',
    bg: 'bg-gray-100',
  },
}))

const upcomingBookings = computed(() =>
  bookings.value.filter((b) => b.status === 'confirmed' || b.status === 'pending'),
)
const pastBookings = computed(() =>
  bookings.value.filter((b) => b.status === 'completed' || b.status === 'cancelled'),
)

onMounted(async () => {
  loading.value = true
  loadError.value = ''
  try {
    bookings.value = await fetchBookings()
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load bookings'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ t('bookings.title') }}</h1>

    <p v-if="loading" class="text-gray-400 text-sm">{{ t('bookings.loading') }}</p>
    <p v-else-if="loadError" class="text-error text-sm mb-6">{{ loadError }}</p>

    <template v-else>
      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-4">
          {{ t('bookings.upcoming') }} ({{ upcomingBookings.length }})
        </h2>
        <div v-if="upcomingBookings.length > 0" class="space-y-4">
          <RouterLink
            v-for="booking in upcomingBookings"
            :key="booking.id"
            :to="`/property/${booking.propertyId}`"
            class="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
          >
            <img
              :src="booking.property.images[0]"
              :alt="booking.property.title"
              class="w-28 h-24 md:w-36 md:h-28 object-cover rounded-xl shrink-0"
              width="144"
              height="96"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="font-semibold truncate">{{ booking.property.title }}</h3>
                  <p class="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin class="w-3.5 h-3.5" />
                    {{ booking.property.location.city }}, {{ booking.property.location.country }}
                  </p>
                </div>
                <span
                  class="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0"
                  :class="[statusConfig[booking.status].color, statusConfig[booking.status].bg]"
                >
                  <component :is="statusConfig[booking.status].icon" class="w-3 h-3" />
                  {{ statusConfig[booking.status].label }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5" />
                  {{ booking.checkIn }} → {{ booking.checkOut }}
                </span>
                <span class="flex items-center gap-1">
                  <Users class="w-3.5 h-3.5" />
                  {{ booking.guests }}
                </span>
                <span class="font-semibold text-foreground ml-auto">{{ formatMoney(booking.totalPrice) }}</span>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-primary shrink-0 self-center" />
          </RouterLink>
        </div>
        <p v-else class="text-gray-400 text-sm">{{ t('bookings.noUpcoming') }}</p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-4">{{ t('bookings.past') }} ({{ pastBookings.length }})</h2>
        <div v-if="pastBookings.length > 0" class="space-y-4">
          <RouterLink
            v-for="booking in pastBookings"
            :key="booking.id"
            :to="`/property/${booking.propertyId}`"
            class="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group opacity-80"
          >
            <img
              :src="booking.property.images[0]"
              :alt="booking.property.title"
              class="w-28 h-24 md:w-36 md:h-28 object-cover rounded-xl shrink-0 grayscale"
              width="144"
              height="96"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="font-semibold truncate">{{ booking.property.title }}</h3>
                  <p class="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin class="w-3.5 h-3.5" />
                    {{ booking.property.location.city }}
                  </p>
                </div>
                <span
                  class="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0"
                  :class="[statusConfig[booking.status].color, statusConfig[booking.status].bg]"
                >
                  <component :is="statusConfig[booking.status].icon" class="w-3 h-3" />
                  {{ statusConfig[booking.status].label }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5" />
                  {{ booking.checkIn }} → {{ booking.checkOut }}
                </span>
                <span class="font-semibold text-foreground ml-auto">{{ formatMoney(booking.totalPrice) }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
        <p v-else class="text-gray-400 text-sm">{{ t('bookings.noPast') }}</p>
      </section>
    </template>
  </div>
</template>
