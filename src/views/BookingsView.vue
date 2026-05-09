<script setup lang="ts">
import { sampleBookings } from '@/data'
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
import { formatTZS } from '@/lib/format'

const statusConfig = {
  confirmed: {
    icon: CheckCircle,
    label: 'Confirmed',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelled',
    color: 'text-error',
    bg: 'bg-error/10',
  },
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    color: 'text-gray-400',
    bg: 'bg-gray-100',
  },
}

const upcomingBookings = sampleBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending')
const pastBookings = sampleBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled')
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-8">My bookings</h1>

    <section class="mb-10">
      <h2 class="text-lg font-semibold mb-4">Upcoming ({{ upcomingBookings.length }})</h2>
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
                {{ booking.guests }} guests
              </span>
              <span class="font-semibold text-foreground ml-auto">{{ formatTZS(booking.totalPrice) }}</span>
            </div>
          </div>
          <ChevronRight class="w-5 h-5 text-gray-300 self-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </RouterLink>
      </div>
      <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
        <Calendar class="w-12 h-12 mx-auto mb-3 text-gray-200" />
        <p class="text-gray-400">No upcoming bookings</p>
        <RouterLink to="/" class="text-primary text-sm hover:underline mt-2 inline-block">Find your next stay</RouterLink>
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Past bookings ({{ pastBookings.length }})</h2>
      <div v-if="pastBookings.length > 0" class="space-y-4">
        <RouterLink
          v-for="booking in pastBookings"
          :key="booking.id"
          :to="`/property/${booking.propertyId}`"
          class="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group opacity-75 hover:opacity-100"
        >
          <img
            :src="booking.property.images[0]"
            :alt="booking.property.title"
            width="144"
            height="96"
            class="w-28 h-24 md:w-36 md:h-28 object-cover rounded-xl shrink-0"
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
              <span class="font-semibold text-foreground ml-auto">{{ formatTZS(booking.totalPrice) }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
      <p v-else class="text-gray-400 text-center py-8">No past bookings</p>
    </section>
  </div>
</template>
