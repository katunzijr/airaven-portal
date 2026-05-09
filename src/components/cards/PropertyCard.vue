<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart, Star, Zap } from 'lucide-vue-next'
import ImageCarousel from '@/components/ui/ImageCarousel.vue'
import { formatTZS } from '@/lib/format'
import type { Property } from '@/types'

const props = defineProps<{
  property: Property
}>()

const isFav = ref(props.property.isFavorite)

function capType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1)
}
</script>

<template>
  <RouterLink :to="`/property/${property.id}`" class="group block card-lift">
    <div class="relative rounded-lg overflow-hidden">
      <ImageCarousel :images="property.images" :alt="property.title" />
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
        v-if="property.host.superhost"
        class="absolute top-3 left-3 bg-accent text-primary text-xs font-bold px-2.5 py-1 rounded-md shadow-sm"
      >
        Superhost
      </span>
      <span
        v-if="property.instantBook"
        class="absolute bottom-3 left-3 bg-highlight text-primary text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1"
      >
        <Zap class="w-3 h-3" /> Instant
      </span>
    </div>

    <div class="mt-3">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-sm truncate">
          {{ property.location.city }}, {{ property.location.country }}
        </h3>
        <div class="flex items-center gap-1 shrink-0 bg-primary/5 px-1.5 py-0.5 rounded">
          <Star class="w-3 h-3 fill-primary text-primary" />
          <span class="text-xs font-bold text-primary">{{ property.rating }}</span>
        </div>
      </div>
      <p class="text-sm text-gray-400 truncate">{{ property.title }}</p>
      <p class="text-sm text-gray-400">
        {{ capType(property.type) }} · {{ property.bedrooms }} bed{{ property.bedrooms !== 1 ? 's' : '' }} ·
        {{ property.bathrooms }} bath{{ property.bathrooms !== 1 ? 's' : '' }}
      </p>
      <p class="text-sm mt-1">
        <span class="font-bold text-primary">{{ formatTZS(property.price) }}</span>
        <span class="text-gray-400"> / night</span>
      </p>
    </div>
  </RouterLink>
</template>
