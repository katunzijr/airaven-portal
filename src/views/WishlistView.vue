<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@clerk/vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import { useWishlist } from '@/composables/useWishlist'
import { fetchWishlist } from '@/api/wishlist'
import type { Property } from '@/types'
import { Heart } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { usePreferences } from '@/composables/usePreferences'

const router = useRouter()
const { isSignedIn, isLoaded } = useAuth()
const { refreshWishlist } = useWishlist()
const { t } = usePreferences()

const properties = ref<Property[]>([])
const loading = ref(true)
const error = ref('')

const countLabel = computed(() => {
  const n = properties.value.length
  const unit = n === 1 ? t('wishlist.countOne') : t('wishlist.countMany')
  return `${n} ${t('wishlist.count')} ${unit}`
})

watch(
  [isLoaded, isSignedIn],
  async ([loaded, signedIn]) => {
    if (!loaded) return

    if (!signedIn) {
      router.replace({ path: '/sign-in', query: { redirect: '/wishlist' } })
      return
    }

    loading.value = true
    error.value = ''
    try {
      properties.value = await fetchWishlist()
      await refreshWishlist()
    } catch (err) {
      error.value = err instanceof Error ? err.message : t('home.loadError')
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="max-w-[1760px] mx-auto px-6 lg:px-10 py-8">
    <h1 class="text-3xl font-bold mb-2">{{ t('wishlist.title') }}</h1>
    <p class="text-gray-400 mb-8">{{ countLabel }}</p>

    <p v-if="loading" class="text-gray-400">{{ t('wishlist.loading') }}</p>
    <p v-else-if="error" class="text-error text-sm">{{ error }}</p>

    <div v-else-if="properties.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PropertyCard v-for="property in properties" :key="property.id" :property="{ ...property, isFavorite: true }" />
    </div>

    <div v-else class="text-center py-20">
      <Heart class="w-16 h-16 mx-auto mb-4 text-gray-200" />
      <h2 class="text-xl font-bold mb-2">{{ t('wishlist.empty') }}</h2>
      <p class="text-gray-400 max-w-md mx-auto mb-6">{{ t('wishlist.hint') }}</p>
      <RouterLink to="/" class="text-primary font-medium hover:underline">{{ t('wishlist.explore') }}</RouterLink>
    </div>
  </div>
</template>
