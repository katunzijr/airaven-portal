<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { properties, reviews } from '@/data'
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Zap,
  Shield,
  Award,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Images,
  X,
} from 'lucide-vue-next'
import { formatTZS } from '@/lib/format'

const route = useRoute()
const router = useRouter()

const property = computed(() => properties.find((p) => p.id === route.params.id))

const isFav = ref(false)
const checkIn = ref('')
const checkOut = ref('')
const guests = ref(1)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

watch(
  property,
  (p) => {
    isFav.value = p?.isFavorite ?? false
    checkIn.value = ''
    checkOut.value = ''
    guests.value = 1
    lightboxOpen.value = false
    lightboxIndex.value = 0
  },
  { immediate: true },
)

const nights = computed(() => {
  const ci = checkIn.value
  const co = checkOut.value
  const p = property.value
  if (!p || !ci || !co) return 0
  return Math.max(
    1,
    Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / (1000 * 60 * 60 * 24)),
  )
})

const totalPrice = computed(() => (property.value ? nights.value * property.value.price : 0))
const serviceFee = computed(() => Math.round(totalPrice.value * 0.12))

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function prevPhoto(e?: Event) {
  e?.stopPropagation()
  const p = property.value
  if (!p) return
  lightboxIndex.value = (lightboxIndex.value - 1 + p.images.length) % p.images.length
}

function nextPhoto(e?: Event) {
  e?.stopPropagation()
  const p = property.value
  if (!p) return
  lightboxIndex.value = (lightboxIndex.value + 1) % p.images.length
}

function capType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function reserve() {
  const p = property.value
  if (!p || !checkIn.value || !checkOut.value) return
  router.push({
    path: `/booking/${p.id}`,
    query: {
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      guests: String(guests.value),
    },
  })
}
</script>

<template>
  <div v-if="!property" class="max-w-4xl mx-auto px-6 py-20 text-center">
    <div class="text-6xl mb-4">🏠</div>
    <h1 class="text-2xl font-bold mb-2">Property not found</h1>
    <p class="text-gray-400 mb-6">The property you're looking for doesn't exist or has been removed.</p>
    <RouterLink to="/" class="text-primary font-medium hover:underline">Back to home</RouterLink>
  </div>

  <div v-else class="max-w-[1120px] mx-auto px-6 py-6">
    <div class="mb-4">
      <h1 class="text-2xl md:text-3xl font-bold">{{ property.title }}</h1>
      <div class="flex flex-wrap items-center gap-3 mt-2 text-sm">
        <span class="flex items-center gap-1 font-medium">
          <Star class="w-4 h-4 fill-foreground" />
          {{ property.rating }}
        </span>
        <span class="text-gray-400"> · {{ property.reviewCount }} reviews </span>
        <span v-if="property.host.superhost" class="flex items-center gap-1 text-gray-400">
          · <Award class="w-4 h-4" /> Superhost
        </span>
        <span class="flex items-center gap-1 text-gray-400">
          · <MapPin class="w-4 h-4" />
          {{ property.location.city }}, {{ property.location.country }}
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
    </div>

    <div class="relative mb-8 rounded-xl overflow-hidden">
      <div class="md:hidden relative h-72 w-full">
        <img :src="property.images[0]" :alt="property.title" class="absolute inset-0 w-full h-full object-cover" />
        <button
          type="button"
          class="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-primary font-semibold text-sm px-3 py-2 rounded-lg shadow border border-white/50 hover:bg-white transition-colors"
          @click="openLightbox(0)"
        >
          <Images class="w-4 h-4" />
          {{ property.images.length }} photos
        </button>
      </div>

      <div class="hidden md:flex gap-2 h-[460px]">
        <button type="button" class="relative flex-[3] group overflow-hidden min-h-0" @click="openLightbox(0)">
          <img
            :src="property.images[0]"
            :alt="property.title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>
        <div class="flex-[2] grid grid-cols-2 grid-rows-2 gap-2 min-h-0">
          <button
            v-for="(img, i) in property.images.slice(1, 5)"
            :key="i"
            type="button"
            class="relative group overflow-hidden min-h-0"
            @click="openLightbox(i + 1)"
          >
            <img
              :src="img"
              :alt="`${property.title} ${i + 2}`"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
            <div
              v-if="i === 3 && property.images.length > 5"
              class="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"
            >
              <span class="text-white font-semibold text-sm">+{{ property.images.length - 5 }} more</span>
            </div>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="absolute bottom-4 right-4 hidden md:flex items-center gap-2 bg-white text-primary font-semibold text-sm px-4 py-2.5 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors z-10"
        @click="openLightbox(0)"
      >
        <Images class="w-4 h-4" />
        All {{ property.images.length }} photos
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 bg-purple/95 flex items-center justify-center p-4"
        @click="lightboxOpen = false"
      >
        <button
          type="button"
          class="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white rounded-lg p-2.5 transition-colors"
          @click="lightboxOpen = false"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="absolute top-5 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full">
          {{ lightboxIndex + 1 }} / {{ property.images.length }}
        </div>

        <button
          type="button"
          class="absolute left-4 md:left-8 bg-white/10 hover:bg-white/25 text-white rounded-lg p-3 transition-colors z-10"
          @click="prevPhoto($event)"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        <button
          type="button"
          class="absolute right-4 md:right-8 bg-white/10 hover:bg-white/25 text-white rounded-lg p-3 transition-colors z-10"
          @click="nextPhoto($event)"
        >
          <ChevronRight class="w-6 h-6" />
        </button>

        <div class="relative max-w-4xl w-full max-h-[80vh] aspect-[4/3] flex items-center justify-center" @click.stop>
          <img
            :src="property.images[lightboxIndex]"
            :alt="`${property.title} ${lightboxIndex + 1}`"
            class="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        </div>

        <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2 z-10" @click.stop>
          <button
            v-for="(img, i) in property.images"
            :key="i"
            type="button"
            class="relative shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-colors"
            :class="i === lightboxIndex ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'"
            @click="lightboxIndex = i"
          >
            <img :src="img" :alt="`thumb ${i + 1}`" class="absolute inset-0 w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </Teleport>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h2 class="text-xl font-semibold">
              {{ capType(property.type) }} hosted by {{ property.host.name }}
            </h2>
            <p class="text-gray-400 text-sm mt-1">
              {{ property.maxGuests }} guests · {{ property.bedrooms }} bedroom{{ property.bedrooms !== 1 ? 's' : '' }} ·
              {{ property.beds }} bed{{ property.beds !== 1 ? 's' : '' }} · {{ property.bathrooms }} bathroom{{
                property.bathrooms !== 1 ? 's' : ''
              }}
            </p>
          </div>
          <img :src="property.host.avatar" :alt="property.host.name" class="w-14 h-14 rounded-full shrink-0" width="56" height="56" />
        </div>

        <div class="py-6 border-b border-gray-200 space-y-4">
          <div v-if="property.host.superhost" class="flex gap-4">
            <Award class="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">{{ property.host.name }} is a Superhost</p>
              <p class="text-sm text-gray-400">
                Superhosts are experienced, highly rated hosts who are committed to providing great stays.
              </p>
            </div>
          </div>
          <div v-if="property.instantBook" class="flex gap-4">
            <Zap class="w-6 h-6 shrink-0 mt-0.5 text-secondary" />
            <div>
              <p class="font-medium">Instant Book</p>
              <p class="text-sm text-gray-400">Book without waiting for the host to respond.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <Shield class="w-6 h-6 shrink-0 mt-0.5 text-primary" />
            <div>
              <p class="font-medium">{{ property.cancellationPolicy }}</p>
              <p class="text-sm text-gray-400">
                Check-in: {{ property.checkIn }} · Check-out: {{ property.checkOut }}
              </p>
            </div>
          </div>
        </div>

        <div class="py-6 border-b border-gray-200">
          <p class="text-gray-500 leading-relaxed">{{ property.description }}</p>
        </div>

        <div class="py-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold mb-4">What this place offers</h3>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="amenity in property.amenities" :key="amenity" class="flex items-center gap-3 text-sm">
              <Check class="w-5 h-5 text-accent-dark shrink-0" />
              {{ amenity }}
            </div>
          </div>
        </div>

        <div class="py-6">
          <div class="flex items-center gap-2 mb-6">
            <Star class="w-5 h-5 fill-foreground" />
            <span class="text-lg font-semibold">{{ property.rating }} · {{ property.reviewCount }} reviews</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="review in reviews" :key="review.id" class="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div class="flex items-center gap-3 mb-3">
                <img :src="review.userAvatar" :alt="review.userName" width="40" height="40" class="w-10 h-10 rounded-lg" />
                <div>
                  <p class="text-sm font-medium">{{ review.userName }}</p>
                  <p class="text-xs text-gray-400">{{ review.date }}</p>
                </div>
                <div class="ml-auto flex items-center gap-1 bg-primary/5 px-1.5 py-0.5 rounded">
                  <Star class="w-3 h-3 fill-primary text-primary" />
                  <span class="text-xs font-bold text-primary">{{ review.rating }}</span>
                </div>
              </div>
              <p class="text-sm text-gray-500">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="sticky top-24 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <div class="flex items-baseline justify-between mb-4 gap-2">
            <div>
              <span class="text-2xl font-bold">{{ formatTZS(property.price) }}</span>
              <span class="text-gray-400"> night</span>
            </div>
            <span class="flex items-center gap-1 text-sm shrink-0">
              <Star class="w-3.5 h-3.5 fill-foreground" />
              {{ property.rating }}
              <span class="text-gray-400">({{ property.reviewCount }})</span>
            </span>
          </div>

          <div class="border border-gray-300 rounded-lg overflow-hidden mb-4">
            <div class="grid grid-cols-2">
              <div class="p-3 border-r border-b border-gray-300">
                <label class="block text-[10px] font-bold uppercase">Check-in</label>
                <input v-model="checkIn" type="date" class="w-full text-sm outline-none mt-0.5 bg-transparent" />
              </div>
              <div class="p-3 border-b border-gray-300">
                <label class="block text-[10px] font-bold uppercase">Checkout</label>
                <input v-model="checkOut" type="date" class="w-full text-sm outline-none mt-0.5 bg-transparent" />
              </div>
            </div>
            <div class="p-3 flex items-center justify-between">
              <div>
                <label class="block text-[10px] font-bold uppercase">Guests</label>
                <span class="text-sm">{{ guests }} guest{{ guests !== 1 ? 's' : '' }}</span>
              </div>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-foreground transition-colors"
                  @click="guests = Math.max(1, guests - 1)"
                >
                  <Minus class="w-4 h-4" />
                </button>
                <span class="font-medium w-4 text-center">{{ guests }}</span>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-foreground transition-colors"
                  @click="guests = Math.min(property.maxGuests, guests + 1)"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-3 rounded-lg transition-colors text-lg"
            @click="reserve"
          >
            {{ property.instantBook ? 'Reserve' : 'Request to book' }}
          </button>

          <p v-if="!checkIn || !checkOut" class="text-center text-xs text-gray-400 mt-3">Select dates to see total price</p>
          <div v-else class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400 underline">
                {{ formatTZS(property.price) }} x {{ nights }} night{{ nights !== 1 ? 's' : '' }}
              </span>
              <span>{{ formatTZS(totalPrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 underline">Service fee</span>
              <span>{{ formatTZS(serviceFee) }}</span>
            </div>
            <hr class="border-gray-200 my-2" />
            <div class="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{{ formatTZS(totalPrice + serviceFee) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
