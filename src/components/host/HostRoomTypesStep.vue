<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PropertyType } from '@/types'
import { getAmenitiesForPropertyType } from '@/lib/amenities'
import { getPropertyTypeConfig } from '@/lib/propertyTypes'
import { formatPriceDisplay, parsePriceDisplay } from '@/lib/priceInput'
import { Minus, Plus, Trash2 } from 'lucide-vue-next'

export interface RoomTypeDraft {
  name: string
  description: string
  price: number
  priceDisplay: string
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
  images: string[]
  instantBook: boolean
}

const props = defineProps<{
  propertyType: PropertyType
}>()

const typeConfig = computed(() => getPropertyTypeConfig(props.propertyType))
const amenityOptions = computed(() => getAmenitiesForPropertyType(props.propertyType))
const allowsMultipleUnits = computed(() => typeConfig.value.allowsMultipleUnits)

const counterFields = computed(() =>
  typeConfig.value.counterFields.map((key) => ({
    key,
    label:
      key === 'maxGuests'
        ? props.propertyType === 'hall' || props.propertyType === 'business'
          ? 'Capacity'
          : 'Guests'
        : key.charAt(0).toUpperCase() + key.slice(1),
  })),
)

function emptyUnit(name?: string): RoomTypeDraft {
  const allowed = new Set(typeConfig.value.amenityIds)
  const defaultAmenities = ['wifi'].filter((id) => allowed.has(id))
  return {
    name: name ?? typeConfig.value.defaultUnitName,
    description: '',
    price: 0,
    priceDisplay: '',
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: defaultAmenities.length ? defaultAmenities : [],
    images: [],
    instantBook: true,
  }
}

const rooms = ref<RoomTypeDraft[]>([emptyUnit()])

watch(
  () => props.propertyType,
  () => {
    rooms.value = [emptyUnit()]
  },
)

function addUnit(): void {
  if (!allowsMultipleUnits.value) return
  rooms.value.push(emptyUnit(`${typeConfig.value.defaultUnitName} ${rooms.value.length + 1}`))
}

function removeUnit(index: number): void {
  if (rooms.value.length <= 1) return
  rooms.value.splice(index, 1)
}

function onPriceInput(index: number, event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  const parsed = parsePriceDisplay(raw)
  rooms.value[index].price = parsed
  rooms.value[index].priceDisplay = parsed ? formatPriceDisplay(parsed) : ''
}

function toggleAmenity(roomIndex: number, id: string): void {
  const room = rooms.value[roomIndex]
  if (room.amenities.includes(id)) {
    room.amenities = room.amenities.filter((a) => a !== id)
  } else {
    room.amenities = [...room.amenities, id]
  }
}

function adjustCounter(
  roomIndex: number,
  key: 'maxGuests' | 'bedrooms' | 'beds' | 'bathrooms',
  delta: number,
): void {
  const room = rooms.value[roomIndex]
  const min = key === 'maxGuests' ? 1 : 0
  room[key] = Math.max(min, room[key] + delta)
}

function validate(): { ok: boolean; message?: string } {
  for (const room of rooms.value) {
    if (!room.name.trim()) return { ok: false, message: 'Each unit type needs a name' }
    if (room.price <= 0) return { ok: false, message: `Set a price for "${room.name}"` }
    if (room.maxGuests < 1) return { ok: false, message: `Set capacity for "${room.name}"` }
  }
  return { ok: true }
}

function getPayload(): Omit<RoomTypeDraft, 'priceDisplay'>[] {
  return rooms.value.map(({ priceDisplay: _, ...room }) => room)
}

defineExpose({ validate, getPayload })
</script>

<template>
  <div class="max-w-3xl space-y-8">
    <div>
      <h2 class="text-xl font-bold mb-1">Unit types</h2>
      <p class="text-gray-500 text-sm">
        <template v-if="allowsMultipleUnits">
          Add the unit types guests can book — e.g. Standard Room, Deluxe Suite, or Office A.
        </template>
        <template v-else>
          Describe the single unit guests will book at your {{ typeConfig.label.toLowerCase() }}.
        </template>
      </p>
    </div>

    <div
      v-for="(room, index) in rooms"
      :key="index"
      class="rounded-xl border border-gray-200 p-6 space-y-4 bg-white"
    >
      <div v-if="allowsMultipleUnits" class="flex items-center justify-between gap-4">
        <h3 class="font-semibold">Unit type {{ index + 1 }}</h3>
        <button
          v-if="rooms.length > 1"
          type="button"
          class="text-gray-400 hover:text-error p-1"
          @click="removeUnit(index)"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <label class="block">
        <span class="text-sm font-medium">Name</span>
        <input
          v-model="room.name"
          required
          class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3"
          :placeholder="typeConfig.unitNamePlaceholder"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium">Description</span>
        <textarea
          v-model="room.description"
          rows="2"
          class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3"
          placeholder="What's included in this unit type?"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium">Price per night (TZS)</span>
        <input
          :value="room.priceDisplay"
          type="text"
          inputmode="numeric"
          class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3"
          placeholder="500,000"
          @input="onPriceInput(index, $event)"
        />
      </label>

      <div class="rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div
          v-for="item in counterFields"
          :key="item.key"
          class="flex items-center justify-between px-5 py-3"
        >
          <span class="text-sm font-medium">{{ item.label }}</span>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              @click="adjustCounter(index, item.key, -1)"
            >
              <Minus class="w-4 h-4" />
            </button>
            <span class="w-6 text-center text-sm">{{ room[item.key] }}</span>
            <button
              type="button"
              class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              @click="adjustCounter(index, item.key, 1)"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <span class="text-sm font-medium block mb-2">Amenities</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="amenity in amenityOptions"
            :key="amenity.id"
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors"
            :class="
              room.amenities.includes(amenity.id)
                ? 'border-secondary bg-secondary/10 text-secondary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            "
            @click="toggleAmenity(index, amenity.id)"
          >
            <component :is="amenity.icon" class="w-4 h-4 shrink-0" />
            {{ amenity.label }}
          </button>
        </div>
      </div>

      <label class="inline-flex items-center gap-2 text-sm">
        <input v-model="room.instantBook" type="checkbox" class="rounded" />
        Instant book for this unit type
      </label>
    </div>

    <button
      v-if="allowsMultipleUnits"
      type="button"
      class="text-sm font-medium text-secondary hover:underline"
      @click="addUnit"
    >
      + Add another unit type
    </button>
  </div>
</template>
