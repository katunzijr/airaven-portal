<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Search } from 'lucide-vue-next'
import { reverseGeocode, searchPlaces, type GeocodeResult } from '@/lib/geocoding'
import { clampToEastAfrica, EAST_AFRICA_NE, EAST_AFRICA_SW } from '@/lib/eastAfrica'

export interface LocationValue {
  city: string
  country: string
  address: string
  lat: number
  lng: number
}

const props = defineProps<{
  modelValue: LocationValue
  active?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LocationValue]
}>()

const searchQuery = ref('')
const searchResults = ref<GeocodeResult[]>([])
const searching = ref(false)
const showResults = ref(false)
const mapEl = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let marker: L.Marker | null = null
let searchTimer: ReturnType<typeof setTimeout> | null = null

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#7c3aed;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.25)"><div style="width:12px;height:12px;background:white;border-radius:50%;transform:rotate(45deg)"></div></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

function emitLocation(partial: Partial<LocationValue> & { lat: number; lng: number }): void {
  emit('update:modelValue', {
    city: partial.city ?? props.modelValue.city,
    country: partial.country ?? props.modelValue.country,
    address: partial.address ?? props.modelValue.address,
    lat: partial.lat,
    lng: partial.lng,
  })
}

const eastAfricaBounds = L.latLngBounds(
  [EAST_AFRICA_SW.lat, EAST_AFRICA_SW.lng],
  [EAST_AFRICA_NE.lat, EAST_AFRICA_NE.lng],
)

function setMarkerPosition(lat: number, lng: number, pan = true): void {
  if (!map) return
  const clamped = clampToEastAfrica(lat, lng)
  if (marker) marker.setLatLng([clamped.lat, clamped.lng])
  else marker = L.marker([clamped.lat, clamped.lng], { icon: pinIcon, draggable: true }).addTo(map)
  marker.off('dragend')
  marker.on('dragend', async () => {
    const pos = marker?.getLatLng()
    if (!pos) return
    const { lat: cLat, lng: cLng } = clampToEastAfrica(pos.lat, pos.lng)
    if (cLat !== pos.lat || cLng !== pos.lng) marker?.setLatLng([cLat, cLng])
    try {
      const result = await reverseGeocode(cLat, cLng)
      emitLocation({
        lat: cLat,
        lng: cLng,
        city: result.city,
        country: result.country,
        address: result.address,
      })
    } catch {
      emitLocation({ lat: cLat, lng: cLng })
    }
  })
  if (pan) map.setView([clamped.lat, clamped.lng], Math.max(map.getZoom(), 14))
}

async function selectResult(result: GeocodeResult): Promise<void> {
  showResults.value = false
  searchQuery.value = result.displayName
  emitLocation({
    lat: result.lat,
    lng: result.lng,
    city: result.city,
    country: result.country,
    address: result.address,
  })
  setMarkerPosition(result.lat, result.lng)
}

function onSearchInput(): void {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    const q = searchQuery.value.trim()
    if (q.length < 3) {
      searchResults.value = []
      return
    }
    searching.value = true
    try {
      searchResults.value = await searchPlaces(q)
      showResults.value = true
    } catch {
      searchResults.value = []
    } finally {
      searching.value = false
    }
  }, 350)
}

onMounted(() => {
  if (!mapEl.value) return
  map = L.map(mapEl.value, {
    zoomControl: false,
    maxBounds: eastAfricaBounds,
    maxBoundsViscosity: 1,
    minZoom: 5,
  }).setView([props.modelValue.lat, props.modelValue.lng], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  setMarkerPosition(props.modelValue.lat, props.modelValue.lng, false)
})

watch(
  () => [props.modelValue.lat, props.modelValue.lng] as const,
  ([lat, lng]) => {
    if (!map || !marker) return
    const pos = marker.getLatLng()
    if (Math.abs(pos.lat - lat) > 0.00001 || Math.abs(pos.lng - lng) > 0.00001) {
      setMarkerPosition(lat, lng, false)
    }
  },
)

watch(
  () => props.active,
  (isActive) => {
    if (!isActive || !map) return
    requestAnimationFrame(() => {
      map?.invalidateSize()
      map?.setView([props.modelValue.lat, props.modelValue.lng], map.getZoom())
    })
  },
)

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
  map?.remove()
  map = null
  marker = null
})
</script>

<template>
  <div class="space-y-4">
    <div class="relative z-[1000]">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for a city or address in East Africa"
        class="relative z-10 w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 bg-white"
        @input="onSearchInput"
        @focus="showResults = searchResults.length > 0"
      />
      <div
        v-if="showResults && searchResults.length"
        class="absolute z-[1001] left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
      >
        <button
          v-for="result in searchResults"
          :key="result.displayName"
          type="button"
          class="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
          @click="selectResult(result)"
        >
          {{ result.displayName }}
        </button>
      </div>
      <p v-if="searching" class="text-xs text-gray-400 mt-2">Searching…</p>
    </div>

    <div class="relative z-0 rounded-2xl overflow-hidden border border-gray-200 shadow-sm isolate">
      <div ref="mapEl" class="h-[320px] md:h-[420px] w-full relative z-0" />
      <div class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl px-4 py-3 text-sm shadow-md flex items-start gap-2">
        <MapPin class="w-4 h-4 text-secondary shrink-0 mt-0.5" />
        <div>
          <p class="font-medium">Drag the pin to confirm your exact location</p>
          <p class="text-gray-500 text-xs mt-0.5">
            {{ modelValue.address || 'Move the pin on the map' }}
            <span v-if="modelValue.city"> · {{ modelValue.city }}, {{ modelValue.country }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
