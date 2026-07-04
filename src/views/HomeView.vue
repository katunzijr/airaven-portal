<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { Property } from '@/types'
import { fetchProperties } from '@/api/catalog'
import { useIsHost } from '@/composables/useIsHost'
import { usePreferences } from '@/composables/usePreferences'
import CategoryBar from '@/components/home/CategoryBar.vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import { MapPin, Shield, Star, Clock } from 'lucide-vue-next'

const { isHost, hostChecked } = useIsHost()
const { t, tc } = usePreferences()
const activeCategory = ref('all')
const properties = ref<Property[]>([])
const loadingProperties = ref(true)
const propertiesError = ref('')

onMounted(async () => {
  try {
    properties.value = await fetchProperties()
  } catch (err) {
    propertiesError.value = err instanceof Error ? err.message : t('home.loadError')
  } finally {
    loadingProperties.value = false
  }
})

const filteredProperties = computed(() => {
  const cat = activeCategory.value
  if (cat === 'all') return properties.value

  return properties.value.filter((p) => p.type === cat)
})

const sectionTitle = computed(() => {
  const cat = activeCategory.value
  if (cat === 'all') return t('home.popularStays')
  return `${tc(cat)} ${t('home.staysSuffix')}`
})

const destinations = [
  { city: 'Dar es Salaam', country: 'Tanzania', img: 'https://altezzatravel.com/upload/medialib/27f/b0qz1nq6npa9cybt68bj490mkhzgwz1e.webp', flag: '🇹🇿' },
  { city: 'Zanzibar', country: 'Tanzania', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRU08gp4037xfX-NgjGf9iUU2b62Mc6LRuJWQRAcUGv-uoj3MO6u-SZWM&s=10', flag: '🇹🇿' },
  { city: 'Arusha', country: 'Tanzania', img: 'https://i2.wp.com/foreverlostintravel.com/wp-content/uploads/2024/01/Arusha-Tanzania-Art-Gallery-scaled.jpg?fit=688%2C516&ssl=1', flag: '🇹🇿' },
  { city: 'Mwanza', country: 'Tanzania', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpPoQkatw8yZoaE0ILXSXpQF1xe-ijdRU5eF2yHiTD97m994HC5oO0lI7a&s=10', flag: '🇹🇿' },
  { city: 'Nairobi', country: 'Kenya', img: 'https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blta6e0de21a01faae4/686e5f5b6cdcee1f9dc379dc/kenny-murgor-E_0kbeQbyV0-unsplash-HEADERMOBILE.jpg?fit=crop&auto=webp&quality=60&crop=smart&format=avif', flag: '🇰🇪' },
]
</script>

<template>
  <section class="relative bg-primary py-16 md:py-24 overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary rounded-full -translate-y-1/2 translate-x-1/3"
      />
      <div
        class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent rounded-full translate-y-1/2 -translate-x-1/3"
      />
    </div>
    <div class="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span class="inline-block bg-accent text-primary text-xs font-bold px-3 py-1.5 rounded-md mb-4">
            {{ t('home.badge') }}
          </span>
          <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-white leading-tight">
            {{ t('home.heroTitle') }} <span class="text-accent">{{ t('home.heroTitleAccent') }}</span>
          </h1>
          <p class="text-white/60 text-lg max-w-lg mb-8">
            {{ t('home.heroSubtitle') }}
          </p>
          <SearchBar variant="hero" />
        </div>
        <div class="hidden lg:grid grid-cols-2 gap-3">
          <div class="space-y-3">
            <div class="rounded-lg overflow-hidden h-40">
              <img src="https://swahilitimes.co.tz/wp-content/uploads/2022/02/images-16.jpeg" alt="" class="w-full h-full object-cover" width="400" height="300" />
            </div>
            <div class="rounded-lg overflow-hidden h-56">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1pEv5OVu0QBOjaFG5A7vch6zmkkZGMV-zfbgY7jpjFurseEAh3nni3ts&s=10" alt="" class="w-full h-full object-cover" width="400" height="500" />
            </div>
          </div>
          <div class="space-y-3 pt-8">
            <div class="rounded-lg overflow-hidden h-56">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8hZCzVvN0D2RxmT4k3eO1kzmD7qd-Csf7reG9n5SczZa5Q3JflDzV1x4&s=10" alt="" class="w-full h-full object-cover" width="400" height="500" />
            </div>
            <div class="rounded-lg overflow-hidden h-40">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjn_34k0W6r2tZe8kvfUQJaZUqutr3f9vJRN29Qyr9btSzfO2oHi1cOTc&s=10" alt="" class="w-full h-full object-cover" width="400" height="300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <CategoryBar :active-category="activeCategory" @category-change="activeCategory = $event" />

  <section class="max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <Shield class="w-7 h-7 text-primary shrink-0" />
        <div>
          <p class="text-sm font-bold">{{ t('home.aircover') }}</p>
          <p class="text-xs text-gray-400">{{ t('home.aircoverDesc') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/10">
        <Star class="w-7 h-7 text-secondary shrink-0" />
        <div>
          <p class="text-sm font-bold">{{ t('home.verifiedReviews') }}</p>
          <p class="text-xs text-gray-400">{{ t('home.verifiedReviewsDesc') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-4 rounded-lg bg-accent/20 border border-accent/30">
        <MapPin class="w-7 h-7 text-primary shrink-0" />
        <div>
          <p class="text-sm font-bold">{{ t('home.countries') }}</p>
          <p class="text-xs text-gray-400">{{ t('home.countriesDesc') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-4 rounded-lg bg-highlight/30 border border-highlight/50">
        <Clock class="w-7 h-7 text-purple shrink-0" />
        <div>
          <p class="text-sm font-bold">{{ t('home.support') }}</p>
          <p class="text-xs text-gray-400">{{ t('home.supportDesc') }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-[1440px] mx-auto px-6 lg:px-10 pb-8">
    <h2 class="text-2xl font-bold mb-6">{{ sectionTitle }}</h2>
    <p v-if="loadingProperties" class="text-gray-400 py-8">{{ t('home.loadingStays') }}</p>
    <p v-else-if="propertiesError" class="text-error py-8">{{ propertiesError }}</p>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PropertyCard v-for="property in filteredProperties" :key="property.id" :property="property" />
    </div>
    <div v-if="!loadingProperties && !propertiesError && filteredProperties.length === 0" class="text-center py-16">
      <p class="text-gray-400 text-lg">{{ t('home.noStays') }}</p>
    </div>
  </section>

  <section class="max-w-[1440px] mx-auto px-6 lg:px-10 pb-12">
    <h2 class="text-2xl font-bold mb-6">{{ t('home.trending') }}</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <RouterLink
        v-for="dest in destinations"
        :key="dest.city"
        :to="{ path: '/search', query: { location: dest.city } }"
        class="group relative rounded-lg overflow-hidden aspect-[4/3] card-lift"
      >
        <img :src="dest.img" :alt="dest.city" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" width="400" height="300" />
        <div class="absolute inset-0 bg-gradient-to-t from-purple/80 to-transparent" />
        <div class="absolute bottom-3 left-3 text-white">
          <p class="font-bold text-lg">{{ dest.flag }} {{ dest.city }}</p>
          <p class="text-sm text-white/80">{{ dest.country }}</p>
        </div>
      </RouterLink>
    </div>
  </section>

  <section v-if="!hostChecked || !isHost" class="max-w-[1440px] mx-auto px-6 lg:px-10 pb-12">
    <div class="bg-gradient-to-br from-primary via-primary-dark to-purple rounded-lg p-8 md:p-12 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-2">{{ t('home.hostTitle') }}</h2>
          <p class="text-white/60 max-w-lg">{{ t('home.hostDesc') }}</p>
        </div>
        <RouterLink to="/host" class="bg-accent text-primary font-bold px-8 py-3 rounded-lg hover:bg-accent-dark transition-colors shrink-0">
          {{ t('home.startHosting') }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
