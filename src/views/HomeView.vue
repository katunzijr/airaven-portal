<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { properties, trips } from '@/data'
import CategoryBar from '@/components/home/CategoryBar.vue'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import TripCard from '@/components/cards/TripCard.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import { MapPin, Shield, Star, Clock } from 'lucide-vue-next'

const activeCategory = ref('all')

const filteredProperties = computed(() => {
  const cat = activeCategory.value
  if (cat === 'all' || cat === 'trips') return properties
  if (['beachfront', 'countryside', 'trending'].includes(cat)) {
    return properties.filter((p) => p.tags.some((t) => t.toLowerCase() === cat))
  }
  return properties.filter((p) => p.type === cat)
})

const showTrips = computed(() => activeCategory.value === 'all' || activeCategory.value === 'trips')

const sectionTitle = computed(() => {
  const cat = activeCategory.value
  if (cat === 'all') return 'Popular stays'
  if (cat === 'trips') return 'Stays you might like'
  return `${cat.charAt(0).toUpperCase() + cat.slice(1)} stays`
})

const destinations = [
  { city: 'Paris', country: 'France', img: 'https://picsum.photos/seed/paris/400/300', flag: '🇫🇷' },
  { city: 'Tokyo', country: 'Japan', img: 'https://picsum.photos/seed/tokyo/400/300', flag: '🇯🇵' },
  { city: 'New York', country: 'United States', img: 'https://picsum.photos/seed/newyork/400/300', flag: '🇺🇸' },
  { city: 'Bali', country: 'Indonesia', img: 'https://picsum.photos/seed/bali/400/300', flag: '🇮🇩' },
  { city: 'Cape Town', country: 'South Africa', img: 'https://picsum.photos/seed/capetown/400/300', flag: '🇿🇦' },
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
    <div class="max-w-[1760px] mx-auto px-6 lg:px-10 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span class="inline-block bg-accent text-primary text-xs font-bold px-3 py-1.5 rounded-md mb-4">
            190+ countries worldwide
          </span>
          <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-white leading-tight">
            Discover stays that feel like <span class="text-accent">home</span>
          </h1>
          <p class="text-white/60 text-lg max-w-lg mb-8">
            Book unique homes, apartments, rooms, halls, A-frames, trips and experiences around the world.
          </p>
          <SearchBar variant="hero" />
        </div>
        <div class="hidden lg:grid grid-cols-2 gap-3">
          <div class="space-y-3">
            <div class="rounded-lg overflow-hidden h-40">
              <img
                src="https://picsum.photos/seed/hero1/400/300"
                alt=""
                class="w-full h-full object-cover"
                width="400"
                height="300"
              />
            </div>
            <div class="rounded-lg overflow-hidden h-56">
              <img
                src="https://picsum.photos/seed/hero2/400/500"
                alt=""
                class="w-full h-full object-cover"
                width="400"
                height="500"
              />
            </div>
          </div>
          <div class="space-y-3 pt-8">
            <div class="rounded-lg overflow-hidden h-56">
              <img
                src="https://picsum.photos/seed/hero3/400/500"
                alt=""
                class="w-full h-full object-cover"
                width="400"
                height="500"
              />
            </div>
            <div class="rounded-lg overflow-hidden h-40">
              <img
                src="https://picsum.photos/seed/hero4/400/300"
                alt=""
                class="w-full h-full object-cover"
                width="400"
                height="300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <CategoryBar :active-category="activeCategory" @category-change="activeCategory = $event" />

  <section class="max-w-[1760px] mx-auto px-6 lg:px-10 py-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <Shield class="w-7 h-7 text-primary shrink-0" />
        <div>
          <p class="text-sm font-bold">AirCover</p>
          <p class="text-xs text-gray-400">Free protection on every booking</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/10">
        <Star class="w-7 h-7 text-secondary shrink-0" />
        <div>
          <p class="text-sm font-bold">Verified Reviews</p>
          <p class="text-xs text-gray-400">Real reviews from real guests</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-4 rounded-lg bg-accent/20 border border-accent/30">
        <MapPin class="w-7 h-7 text-primary shrink-0" />
        <div>
          <p class="text-sm font-bold">190+ Countries</p>
          <p class="text-xs text-gray-400">Millions of listings worldwide</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-4 rounded-lg bg-highlight/30 border border-highlight/50">
        <Clock class="w-7 h-7 text-purple shrink-0" />
        <div>
          <p class="text-sm font-bold">24/7 Support</p>
          <p class="text-xs text-gray-400">Help whenever you need it</p>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-[1760px] mx-auto px-6 lg:px-10 pb-8">
    <h2 class="text-2xl font-bold mb-6">{{ sectionTitle }}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PropertyCard v-for="property in filteredProperties" :key="property.id" :property="property" />
    </div>
    <div v-if="filteredProperties.length === 0" class="text-center py-16">
      <p class="text-gray-400 text-lg">No stays found in this category. Try a different filter!</p>
    </div>
  </section>

  <section v-if="showTrips" class="max-w-[1760px] mx-auto px-6 lg:px-10 pb-12">
    <div class="flex items-end justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold">Experiences &amp; Trips</h2>
        <p class="text-gray-400 text-sm mt-1">Unique activities hosted by local experts</p>
      </div>
      <RouterLink to="/trips" class="text-sm font-medium text-primary hover:underline"> Show all </RouterLink>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" />
    </div>
  </section>

  <section class="max-w-[1760px] mx-auto px-6 lg:px-10 pb-12">
    <h2 class="text-2xl font-bold mb-6">Trending destinations</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <RouterLink
        v-for="dest in destinations"
        :key="dest.city"
        :to="{ path: '/search', query: { location: dest.city } }"
        class="group relative rounded-lg overflow-hidden aspect-[4/3] card-lift"
      >
        <img
          :src="dest.img"
          :alt="dest.city"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          width="400"
          height="300"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-purple/80 to-transparent" />
        <div class="absolute bottom-3 left-3 text-white">
          <p class="font-bold text-lg">{{ dest.flag }} {{ dest.city }}</p>
          <p class="text-sm text-white/80">{{ dest.country }}</p>
        </div>
      </RouterLink>
    </div>
  </section>

  <section class="max-w-[1760px] mx-auto px-6 lg:px-10 pb-12">
    <div class="bg-gradient-to-br from-primary via-primary-dark to-purple rounded-lg p-8 md:p-12 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-2">Become a Host on Airaven</h2>
          <p class="text-white/60 max-w-lg">
            Earn extra income and unlock new opportunities by sharing your space. List your property in minutes.
          </p>
        </div>
        <RouterLink
          to="/host"
          class="bg-accent text-primary font-bold px-8 py-3 rounded-lg hover:bg-accent-dark transition-colors shrink-0"
        >
          Start hosting
        </RouterLink>
      </div>
    </div>
  </section>
</template>
