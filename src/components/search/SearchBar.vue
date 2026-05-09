<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, MapPin, Calendar, Users, X } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    variant?: 'hero' | 'inline'
  }>(),
  { variant: 'hero' },
)

const router = useRouter()
const location = ref('')
const checkIn = ref('')
const checkOut = ref('')
const guests = ref(1)

function handleSearch() {
  const query: Record<string, string> = {}
  if (location.value) query.location = location.value
  if (checkIn.value) query.checkIn = checkIn.value
  if (checkOut.value) query.checkOut = checkOut.value
  if (guests.value > 1) query.guests = String(guests.value)
  router.push({ path: '/search', query })
}
</script>

<template>
  <div v-if="variant === 'hero'" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 w-full max-w-3xl">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="relative md:col-span-1">
        <label class="block text-xs font-bold mb-1 uppercase tracking-wide text-white/70">Where</label>
        <div class="relative">
          <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            v-model="location"
            type="text"
            placeholder="Search destinations"
            class="w-full pl-9 pr-8 py-3 bg-white/10 rounded-lg text-sm text-white placeholder-white/40 border border-white/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
          <button v-if="location" type="button" class="absolute right-2 top-1/2 -translate-y-1/2" @click="location = ''">
            <X class="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold mb-1 uppercase tracking-wide text-white/70">Check in</label>
        <div class="relative">
          <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            v-model="checkIn"
            type="date"
            class="w-full pl-9 py-3 bg-white/10 rounded-lg text-sm text-white border border-white/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold mb-1 uppercase tracking-wide text-white/70">Check out</label>
        <div class="relative">
          <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            v-model="checkOut"
            type="date"
            class="w-full pl-9 py-3 bg-white/10 rounded-lg text-sm text-white border border-white/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold mb-1 uppercase tracking-wide text-white/70">Guests</label>
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <Users class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              v-model.number="guests"
              class="w-full pl-9 py-3 bg-white/10 rounded-lg text-sm text-white border border-white/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none appearance-none"
            >
              <option v-for="n in 16" :key="n" :value="n" class="text-foreground">
                {{ n }} {{ n === 1 ? 'guest' : 'guests' }}
              </option>
            </select>
          </div>
          <button
            type="button"
            class="bg-accent hover:bg-accent-dark text-primary p-3 rounded-lg transition-colors font-bold"
            @click="handleSearch"
          >
            <Search class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-wrap items-end gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div class="flex-1 min-w-[180px]">
      <label class="block text-xs font-bold mb-1">Where</label>
      <div class="relative">
        <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          v-model="location"
          type="text"
          placeholder="Destination"
          class="w-full pl-9 py-2.5 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:border-secondary outline-none"
        />
      </div>
    </div>
    <div class="min-w-[140px]">
      <label class="block text-xs font-bold mb-1">Check in</label>
      <input
        v-model="checkIn"
        type="date"
        class="w-full py-2.5 px-3 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:border-secondary outline-none"
      />
    </div>
    <div class="min-w-[140px]">
      <label class="block text-xs font-bold mb-1">Check out</label>
      <input
        v-model="checkOut"
        type="date"
        class="w-full py-2.5 px-3 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:border-secondary outline-none"
      />
    </div>
    <div class="min-w-[100px]">
      <label class="block text-xs font-bold mb-1">Guests</label>
      <select
        v-model.number="guests"
        class="w-full py-2.5 px-3 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:border-secondary outline-none"
      >
        <option v-for="n in 16" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <button
      type="button"
      class="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      @click="handleSearch"
    >
      <Search class="w-4 h-4" />
      Search
    </button>
  </div>
</template>
