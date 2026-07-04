<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { Property } from '@/types'
import type { PropertyListing } from '@/types/host'
import HostListingPhotosStep from '@/components/host/HostListingPhotosStep.vue'
import {
  getHostProperty,
  publishHostListing,
  setHostAvailability,
  updateHostListing,
  updateRoomListing,
} from '@/api/host'
import { usePreferences } from '@/composables/usePreferences'
import { formatPriceDisplay, parsePriceDisplay } from '@/lib/priceInput'
import { ArrowLeft, Check, ExternalLink, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const { t, formatMoney } = usePreferences()

const propertyId = computed(() => String(route.params.id))
const property = ref<Property | null>(null)
const loading = ref(true)
const saving = ref(false)
const publishing = ref(false)
const message = ref('')
const error = ref('')

const coverImages = ref<string[]>([])
const photosRef = ref<InstanceType<typeof HostListingPhotosStep> | null>(null)

const detailsForm = ref({
  title: '',
  description: '',
  checkIn: '15:00',
  checkOut: '11:00',
  cancellationPolicy: '',
})

const availabilityForm = ref({
  startDate: '',
  endDate: '',
})

const unitEdits = ref<Record<string, { priceDisplay: string }>>({})

onMounted(loadProperty)

async function loadProperty(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const data = await getHostProperty(propertyId.value)
    property.value = data
    detailsForm.value = {
      title: data.title,
      description: data.description,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      cancellationPolicy: data.cancellationPolicy,
    }
    coverImages.value = [...(data.coverImages?.length ? data.coverImages : data.images)]
    for (const unit of data.listings ?? []) {
      unitEdits.value[unit.id] = { priceDisplay: formatPriceDisplay(unit.price) }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load listing'
  } finally {
    loading.value = false
  }
}

function unitPrice(unit: PropertyListing): string {
  return unitEdits.value[unit.id]?.priceDisplay ?? formatPriceDisplay(unit.price)
}

function onUnitPriceInput(unitId: string, event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  const parsed = parsePriceDisplay(raw)
  unitEdits.value[unitId] = {
    priceDisplay: parsed ? formatPriceDisplay(parsed) : '',
  }
}

function unitPriceValue(unit: PropertyListing): number {
  const display = unitEdits.value[unit.id]?.priceDisplay
  if (display) return parsePriceDisplay(display)
  return unit.price
}

function validatePhotos(): { ok: boolean; message?: string } {
  if (coverImages.value.length > 0) return { ok: true }
  photosRef.value?.syncUrlImages()
  return photosRef.value?.validate() ?? { ok: false, message: 'Add at least one cover photo' }
}

async function saveAll(): Promise<void> {
  if (!property.value) return
  error.value = ''
  message.value = ''

  photosRef.value?.syncUrlImages()
  const photoValidation = validatePhotos()
  if (!photoValidation.ok) {
    error.value = photoValidation.message ?? 'Add at least one cover photo'
    return
  }

  if (!detailsForm.value.title.trim() || !detailsForm.value.description.trim()) {
    error.value = 'Title and description are required'
    return
  }

  saving.value = true
  try {
    await updateHostListing(propertyId.value, {
      title: detailsForm.value.title.trim(),
      description: detailsForm.value.description.trim(),
      images: coverImages.value,
      checkIn: detailsForm.value.checkIn,
      checkOut: detailsForm.value.checkOut,
      cancellationPolicy: detailsForm.value.cancellationPolicy,
    })

    for (const unit of property.value.listings ?? []) {
      const price = unitPriceValue(unit)
      if (price > 0 && price !== unit.price) {
        await updateRoomListing(propertyId.value, unit.id, { price })
      }
    }

    if (availabilityForm.value.startDate) {
      await setHostAvailability(propertyId.value, [
        {
          startDate: availabilityForm.value.startDate,
          endDate: availabilityForm.value.endDate || undefined,
          status: 'available',
        },
      ])
    }

    message.value = t('host.manage.saved')
    await loadProperty()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save'
  } finally {
    saving.value = false
  }
}

async function publish(): Promise<void> {
  if (!property.value) return
  error.value = ''
  message.value = ''
  publishing.value = true
  try {
    photosRef.value?.syncUrlImages()
    const photoValidation = validatePhotos()
    if (!photoValidation.ok) {
      throw new Error(photoValidation.message ?? 'Add at least one cover photo')
    }
    if (!detailsForm.value.title.trim() || !detailsForm.value.description.trim()) {
      throw new Error('Title and description are required')
    }

    await updateHostListing(propertyId.value, {
      title: detailsForm.value.title.trim(),
      description: detailsForm.value.description.trim(),
      images: coverImages.value,
      checkIn: detailsForm.value.checkIn,
      checkOut: detailsForm.value.checkOut,
      cancellationPolicy: detailsForm.value.cancellationPolicy,
    })

    if (availabilityForm.value.startDate) {
      await setHostAvailability(propertyId.value, [
        {
          startDate: availabilityForm.value.startDate,
          endDate: availabilityForm.value.endDate || undefined,
          status: 'available',
        },
      ])
    }

    property.value = await publishHostListing(propertyId.value)
    message.value = t('host.manage.published')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to publish'
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-8">
    <RouterLink
      to="/host/listings"
      class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6"
    >
      <ArrowLeft class="w-4 h-4" />
      {{ t('host.listings.title') }}
    </RouterLink>

    <div v-if="loading" class="text-gray-400 text-sm inline-flex items-center gap-2">
      <Loader2 class="w-4 h-4 animate-spin" />
      {{ t('host.listings.loading') }}
    </div>

    <template v-else-if="property">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span
              class="text-xs font-semibold uppercase px-2 py-0.5 rounded-md"
              :class="property.status === 'published' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent-dark'"
            >
              {{ property.status === 'published' ? t('host.listings.status.published') : t('host.listings.status.draft') }}
            </span>
          </div>
          <h1 class="text-3xl font-bold">{{ t('host.manage.title') }}</h1>
          <p class="text-gray-500 text-sm mt-1">{{ property.location.city }}, {{ property.location.country }}</p>
        </div>

        <RouterLink
          v-if="property.status === 'published'"
          :to="{ name: 'property', params: { id: property.id } }"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline shrink-0"
        >
          {{ t('host.manage.viewLive') }}
          <ExternalLink class="w-4 h-4" />
        </RouterLink>
      </div>

      <p v-if="message" class="mb-4 text-sm text-success bg-success/10 border border-success/20 rounded-lg px-4 py-3">
        {{ message }}
      </p>
      <p v-if="error" class="mb-4 text-sm text-error bg-error/10 border border-error/20 rounded-lg px-4 py-3">
        {{ error }}
      </p>

      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-4">{{ t('host.manage.details') }}</h2>
        <div class="space-y-4 rounded-xl border border-gray-200 p-6">
          <label class="block">
            <span class="text-sm font-medium">Property name</span>
            <input v-model="detailsForm.title" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Description</span>
            <textarea v-model="detailsForm.description" rows="4" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
          </label>
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm font-medium">Check-in</span>
              <input v-model="detailsForm.checkIn" type="time" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
            </label>
            <label class="block">
              <span class="text-sm font-medium">Check-out</span>
              <input v-model="detailsForm.checkOut" type="time" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
            </label>
          </div>
          <label class="block">
            <span class="text-sm font-medium">Cancellation policy</span>
            <textarea v-model="detailsForm.cancellationPolicy" rows="2" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
          </label>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-4">{{ t('host.manage.photos') }}</h2>
        <div class="rounded-xl border border-gray-200 p-6">
          <HostListingPhotosStep
            v-if="!loading"
            ref="photosRef"
            :key="propertyId"
            v-model="coverImages"
          />
        </div>
      </section>

      <section v-if="property.listings?.length" class="mb-10">
        <h2 class="text-lg font-semibold mb-4">{{ t('host.manage.units') }}</h2>
        <div class="space-y-3">
          <div
            v-for="unit in property.listings"
            :key="unit.id"
            class="rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div class="flex-1 min-w-0">
              <p class="font-medium">{{ unit.name }}</p>
              <p class="text-sm text-gray-500">{{ unit.maxGuests }} guests · {{ unit.bedrooms }} bed · {{ unit.bathrooms }} bath</p>
            </div>
            <label class="block sm:w-44 shrink-0">
              <span class="text-xs text-gray-500">Price/night (TZS)</span>
              <input
                :value="unitPrice(unit)"
                type="text"
                inputmode="numeric"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                @input="onUnitPriceInput(unit.id, $event)"
              />
            </label>
            <p class="text-sm text-gray-400 sm:w-28 shrink-0">
              Was {{ formatMoney(unit.price) }}
            </p>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-4">{{ t('host.manage.availability') }}</h2>
        <div class="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 p-6">
          <label class="block">
            <span class="text-sm font-medium">Available from</span>
            <input v-model="availabilityForm.startDate" type="date" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Available until</span>
            <input v-model="availabilityForm.endDate" type="date" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
          </label>
        </div>
      </section>

      <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          class="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-60"
          :disabled="saving || publishing"
          @click="saveAll"
        >
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          <Check v-else-if="message" class="w-4 h-4" />
          {{ t('host.manage.save') }}
        </button>
        <button
          v-if="property.status !== 'published'"
          type="button"
          class="inline-flex items-center gap-2 bg-accent text-primary font-bold px-6 py-3 rounded-lg disabled:opacity-60"
          :disabled="saving || publishing"
          @click="publish"
        >
          <Loader2 v-if="publishing" class="w-4 h-4 animate-spin" />
          {{ t('host.manage.publish') }}
        </button>
      </div>
    </template>
  </div>
</template>
