<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { trips, reviews } from '@/data'
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Clock,
  Users,
  Globe,
  Check,
  Shield,
  Minus,
  Plus,
} from 'lucide-vue-next'
import { formatTZS } from '@/lib/format'

const route = useRoute()
const trip = computed(() => trips.find((t) => t.id === route.params.id))

const isFav = ref(false)
const groupSize = ref(1)
const selectedDate = ref('')

const total = computed(() => (trip.value ? groupSize.value * trip.value.price : 0))

watch(
  trip,
  (t) => {
    isFav.value = t?.isFavorite ?? false
    groupSize.value = 1
    selectedDate.value = ''
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="!trip" class="max-w-4xl mx-auto px-6 py-20 text-center">
    <div class="text-6xl mb-4">🧭</div>
    <h1 class="text-2xl font-bold mb-2">Experience not found</h1>
    <RouterLink to="/trips" class="text-primary hover:underline">Browse all experiences</RouterLink>
  </div>

  <div v-else class="max-w-[1120px] mx-auto px-6 py-6">
    <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ trip.title }}</h1>
    <div class="flex flex-wrap items-center gap-3 text-sm mb-6">
      <span class="flex items-center gap-1 font-medium">
        <Star class="w-4 h-4 fill-foreground" /> {{ trip.rating }}
      </span>
      <span class="text-gray-400">· {{ trip.reviewCount }} reviews</span>
      <span class="flex items-center gap-1 text-gray-400">
        · <MapPin class="w-4 h-4" /> {{ trip.location.city }}, {{ trip.location.country }}
      </span>
      <div class="ml-auto flex items-center gap-3">
        <button type="button" class="flex items-center gap-1 text-sm font-medium hover:bg-gray-50 px-3 py-1 rounded-lg">
          <Share2 class="w-4 h-4" /> Share
        </button>
        <button
          type="button"
          class="flex items-center gap-1 text-sm font-medium hover:bg-gray-50 px-3 py-1 rounded-lg"
          @click="isFav = !isFav"
        >
          <Heart class="w-4 h-4" :class="isFav ? 'fill-secondary text-secondary' : ''" />
          {{ isFav ? 'Saved' : 'Save' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 rounded-lg overflow-hidden mb-8 h-[300px] md:h-[400px]">
      <div class="col-span-2">
        <img :src="trip.images[0]" :alt="trip.title" class="w-full h-full object-cover" width="800" height="400" />
      </div>
      <div class="flex flex-col gap-2">
        <img
          v-for="(img, i) in trip.images.slice(1, 3)"
          :key="i"
          :src="img"
          :alt="`${trip.title} ${i + 2}`"
          class="w-full h-1/2 object-cover flex-1 min-h-0"
          width="400"
          height="200"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <span class="inline-block bg-secondary text-white text-xs font-bold px-3 py-1 rounded-md capitalize mb-2">
              {{ trip.type }}
            </span>
            <h2 class="text-xl font-semibold">Hosted by {{ trip.host.name }}</h2>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-400 flex-wrap">
              <span class="flex items-center gap-1">
                <Clock class="w-4 h-4" /> {{ trip.duration }}
              </span>
              <span class="flex items-center gap-1">
                <Users class="w-4 h-4" /> Up to {{ trip.maxGroupSize }} people
              </span>
              <span class="flex items-center gap-1">
                <Globe class="w-4 h-4" /> {{ trip.languages.join(', ') }}
              </span>
            </div>
          </div>
          <img :src="trip.host.avatar" :alt="trip.host.name" class="w-14 h-14 rounded-full shrink-0" width="56" height="56" />
        </div>

        <div class="py-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold mb-3">What you'll do</h3>
          <p class="text-gray-500 leading-relaxed">{{ trip.description }}</p>
        </div>

        <div class="py-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold mb-4">What's included</h3>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="item in trip.includes" :key="item" class="flex items-center gap-3 text-sm">
              <Check class="w-5 h-5 text-accent-dark shrink-0" />
              {{ item }}
            </div>
          </div>
        </div>

        <div class="py-6">
          <div class="flex items-center gap-2 mb-6">
            <Star class="w-5 h-5 fill-foreground" />
            <span class="text-lg font-semibold">{{ trip.rating }} · {{ trip.reviewCount }} reviews</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="review in reviews.slice(0, 4)"
              :key="review.id"
              class="bg-gray-50 rounded-lg p-4 border border-gray-100"
            >
              <div class="flex items-center gap-3 mb-3">
                <img
                  :src="review.userAvatar"
                  :alt="review.userName"
                  class="w-10 h-10 rounded-lg"
                  width="40"
                  height="40"
                />
                <div>
                  <p class="text-sm font-medium">{{ review.userName }}</p>
                  <p class="text-xs text-gray-400">{{ review.date }}</p>
                </div>
              </div>
              <p class="text-sm text-gray-500">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="sticky top-24 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <div class="flex items-baseline gap-1 mb-4">
            <span class="text-2xl font-bold">{{ formatTZS(trip.price) }}</span>
            <span class="text-gray-400">/ person</span>
          </div>

          <div class="border border-gray-300 rounded-lg overflow-hidden mb-4">
            <div class="p-3 border-b border-gray-300">
              <label class="block text-[10px] font-bold uppercase">Date</label>
              <input v-model="selectedDate" type="date" class="w-full text-sm outline-none mt-0.5 bg-transparent" />
            </div>
            <div class="p-3 flex items-center justify-between">
              <div>
                <label class="block text-[10px] font-bold uppercase">Group size</label>
                <span class="text-sm">
                  {{ groupSize }} {{ groupSize === 1 ? 'person' : 'people' }}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-foreground"
                  @click="groupSize = Math.max(1, groupSize - 1)"
                >
                  <Minus class="w-4 h-4" />
                </button>
                <span class="font-medium w-4 text-center">{{ groupSize }}</span>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-foreground"
                  @click="groupSize = Math.min(trip.maxGroupSize, groupSize + 1)"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-3 rounded-lg transition-colors text-lg">
            Book experience
          </button>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">
                {{ formatTZS(trip.price) }} x {{ groupSize }} {{ groupSize === 1 ? 'person' : 'people' }}
              </span>
              <span>{{ formatTZS(total) }}</span>
            </div>
            <hr class="border-gray-200" />
            <div class="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{{ formatTZS(total) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 mt-4 text-sm text-gray-400">
            <Shield class="w-4 h-4 text-primary" />
            Protected by AirCover
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
