<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart, Star, Clock } from 'lucide-vue-next'
import ImageCarousel from '@/components/ui/ImageCarousel.vue'
import { formatTZS } from '@/lib/format'
import type { Trip } from '@/types'

const props = defineProps<{
  trip: Trip
}>()

const isFav = ref(props.trip.isFavorite)
</script>

<template>
  <RouterLink :to="`/trips/${trip.id}`" class="group block card-lift">
    <div class="relative rounded-lg overflow-hidden">
      <ImageCarousel :images="trip.images" :alt="trip.title" />
      <button
        type="button"
        class="absolute top-3 right-3 z-10"
        :aria-label="isFav ? 'Remove from wishlist' : 'Add to wishlist'"
        @click.prevent.stop="isFav = !isFav"
      >
        <Heart
          class="w-6 h-6 drop-shadow-md transition-colors"
          :class="
            isFav ? 'fill-secondary text-secondary' : 'fill-black/30 text-white hover:scale-110'
          "
        />
      </button>
      <span
        class="absolute bottom-3 left-3 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm capitalize"
      >
        {{ trip.type }}
      </span>
    </div>

    <div class="mt-3">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-sm truncate">
          {{ trip.location.city }}, {{ trip.location.country }}
        </h3>
        <div class="flex items-center gap-1 shrink-0 bg-primary/5 px-1.5 py-0.5 rounded">
          <Star class="w-3 h-3 fill-primary text-primary" />
          <span class="text-xs font-bold text-primary">{{ trip.rating }}</span>
        </div>
      </div>
      <p class="text-sm text-gray-400 truncate">{{ trip.title }}</p>
      <div class="flex items-center gap-1 text-sm text-gray-400">
        <Clock class="w-3.5 h-3.5" />
        <span>{{ trip.duration }}</span>
        <span>·</span>
        <span>Up to {{ trip.maxGroupSize }} people</span>
      </div>
      <p class="text-sm mt-1">
        <span class="font-bold text-primary">{{ formatTZS(trip.price) }}</span>
        <span class="text-gray-400"> / person</span>
      </p>
    </div>
  </RouterLink>
</template>
