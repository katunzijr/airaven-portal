<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@clerk/vue'
import { Heart, Star, Zap } from 'lucide-vue-next'
import ImageCarousel from '@/components/ui/ImageCarousel.vue'
import { usePreferences } from '@/composables/usePreferences'
import { useWishlist } from '@/composables/useWishlist'
import type { Property } from '@/types'

const props = defineProps<{
  property: Property
}>()

const router = useRouter()
const { isSignedIn } = useAuth()
const { isSaved, toggle } = useWishlist()
const { formatMoney, tp, t } = usePreferences()

const isFav = computed(() => isSaved(props.property.id) || props.property.isFavorite)

async function handleSave(event: Event): Promise<void> {
  event.preventDefault()
  event.stopPropagation()

  if (!isSignedIn.value) {
    router.push({ path: '/sign-in', query: { redirect: `/property/${props.property.id}` } })
    return
  }

  try {
    await toggle(props.property.id)
  } catch {
    // ignore
  }
}
</script>

<template>
  <RouterLink :to="`/property/${property.id}`" class="group block card-lift">
    <div class="relative rounded-lg overflow-hidden">
      <ImageCarousel :images="property.images" :alt="property.title" />
      <button
        type="button"
        class="absolute top-3 right-3 z-10"
        :aria-label="isFav ? t('property.saved') : t('property.save')"
        @click="handleSave"
      >
        <Heart
          class="w-6 h-6 drop-shadow-md transition-colors"
          :class="isFav ? 'fill-secondary text-secondary' : 'fill-black/30 text-white hover:scale-110'"
        />
      </button>
      <span v-if="property.host.superhost" class="absolute top-3 left-3 bg-accent text-primary text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
        {{ t('property.superhost') }}
      </span>
      <span v-if="property.instantBook" class="absolute bottom-3 left-3 bg-highlight text-primary text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
        <Zap class="w-3 h-3" /> {{ t('common.instant') }}
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
        {{ tp(property.type) }} · {{ property.bedrooms }} {{ property.bedrooms !== 1 ? t('property.beds') : t('property.bed') }} ·
        {{ property.bathrooms }} {{ property.bathrooms !== 1 ? t('property.bathrooms') : t('property.bathroom') }}
      </p>
      <p class="text-sm mt-1">
        <span v-if="(property.listingCount ?? property.listings?.length ?? 0) > 1" class="text-gray-400">From </span>
        <span class="font-bold text-primary">{{ formatMoney(property.fromPrice ?? property.price) }}</span>
        <span class="text-gray-400">{{ t('common.perNight') }}</span>
      </p>
    </div>
  </RouterLink>
</template>
