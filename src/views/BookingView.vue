<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import type { Property, PropertyListing } from '@/types'
import type { AvailabilityRange } from '@/types/host'
import { fetchProperty, fetchPropertyAvailability, startBookingCheckout } from '@/api/catalog'
import { isStayAvailable } from '@/lib/availabilityDates'
import { Star, Shield, ChevronLeft } from 'lucide-vue-next'
import { usePreferences } from '@/composables/usePreferences'

const route = useRoute()
const router = useRouter()
const { formatMoney } = usePreferences()

const property = ref<Property | null>(null)
const availability = ref<AvailabilityRange[]>([])
const loading = ref(true)
const loadError = ref('')
const paying = ref(false)
const payError = ref('')
const agreed = ref(false)

const checkIn = computed(() => (route.query.checkIn as string) || '')
const checkOut = computed(() => (route.query.checkOut as string) || '')
const guests = computed(() => Number(route.query.guests) || 1)
const cancelled = computed(() => route.query.cancelled === '1')

const listingId = computed(() => (route.query.listingId as string) || '')

const selectedListing = computed((): PropertyListing | null => {
  const p = property.value
  if (!p?.listings?.length) return null
  if (listingId.value) {
    return p.listings.find((l) => l.id === listingId.value) ?? p.listings[0]
  }
  return p.listings[0]
})

async function loadProperty(id: string): Promise<void> {
  loading.value = true
  loadError.value = ''
  try {
    const prop = await fetchProperty(id)
    property.value = prop
    const lid = listingId.value || prop.listings?.[0]?.id
    availability.value = lid ? await fetchPropertyAvailability(id, lid) : []
  } catch (err) {
    property.value = null
    loadError.value = err instanceof Error ? err.message : 'Failed to load property'
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string' && id) void loadProperty(id)
  },
  { immediate: true },
)

const datesValid = computed(() =>
  isStayAvailable(checkIn.value, checkOut.value, availability.value),
)

const nights = computed(() => {
  const ci = checkIn.value
  const co = checkOut.value
  if (!ci || !co || !datesValid.value) return 1
  return Math.max(
    1,
    Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / (1000 * 60 * 60 * 24)),
  )
})

const subtotal = computed(() => (selectedListing.value ? nights.value * selectedListing.value.price : 0))
const serviceFee = computed(() => Math.round(subtotal.value * 0.12))
const total = computed(() => subtotal.value + serviceFee.value)

const canPay = computed(
  () =>
    selectedListing.value &&
    checkIn.value &&
    checkOut.value &&
    datesValid.value &&
    guests.value >= 1 &&
    guests.value <= (selectedListing.value?.maxGuests ?? 1) &&
    agreed.value &&
    !paying.value,
)

async function handlePayWithPesapal() {
  const p = property.value
  const listing = selectedListing.value
  if (!p || !listing || !canPay.value) return

  paying.value = true
  payError.value = ''
  try {
    const result = await startBookingCheckout({
      propertyId: p.id,
      listingId: listing.id,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      guests: guests.value,
    })
    window.location.href = result.redirectUrl
  } catch (err) {
    payError.value = err instanceof Error ? err.message : 'Payment could not be started'
    paying.value = false
  }
}
</script>

<template>
  <div v-if="loading" class="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
    Loading booking…
  </div>

  <div v-else-if="!property" class="max-w-4xl mx-auto px-6 py-20 text-center">
    <h1 class="text-2xl font-bold mb-2">Property not found</h1>
    <p v-if="loadError" class="text-error text-sm mb-4">{{ loadError }}</p>
    <RouterLink to="/" class="text-primary hover:underline">Back to home</RouterLink>
  </div>

  <div v-else class="max-w-[1120px] mx-auto px-6 py-6">
    <button type="button" class="flex items-center gap-1 text-sm mb-6 hover:underline" @click="router.back()">
      <ChevronLeft class="w-4 h-4" /> Back
    </button>

    <div
      v-if="cancelled"
      class="mb-6 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent"
    >
      Payment was cancelled. You can try again when ready.
    </div>

    <div
      v-if="!datesValid && checkIn && checkOut"
      class="mb-6 rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
    >
      Selected dates are no longer available. Go back and choose different dates.
    </div>

    <h1 class="text-2xl md:text-3xl font-bold mb-8">Confirm and pay</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div class="space-y-8">
        <div>
          <h2 class="text-lg font-semibold mb-4">Your trip</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <div>
                <p class="font-medium">Dates</p>
                <p class="text-sm text-gray-400">{{ checkIn }} → {{ checkOut }}</p>
              </div>
              <RouterLink
                :to="{ path: `/property/${property.id}`, query: { listingId: listingId || selectedListing?.id, checkIn, checkOut, guests } }"
                class="text-sm font-medium underline"
              >
                Edit
              </RouterLink>
            </div>
            <div class="flex justify-between">
              <div>
                <p class="font-medium">Guests</p>
                <p class="text-sm text-gray-400">{{ guests }} guest{{ guests !== 1 ? 's' : '' }}</p>
              </div>
              <RouterLink
                :to="{ path: `/property/${property.id}`, query: { listingId: listingId || selectedListing?.id, checkIn, checkOut, guests } }"
                class="text-sm font-medium underline"
              >
                Edit
              </RouterLink>
            </div>
          </div>
        </div>

        <hr class="border-gray-200" />

        <div>
          <h2 class="text-lg font-semibold mb-2">Payment</h2>
          <p class="text-sm text-gray-500 mb-4">
            You will be redirected to Pesapal to pay securely with card, M-Pesa, or mobile money.
          </p>
          <div class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Powered by Pesapal — East Africa's trusted payment gateway.
          </div>
        </div>

        <hr class="border-gray-200" />

        <div>
          <h2 class="text-lg font-semibold mb-2">Cancellation policy</h2>
          <p class="text-sm text-gray-400">{{ property.cancellationPolicy }}</p>
        </div>

        <hr class="border-gray-200" />

        <div>
          <h2 class="text-lg font-semibold mb-2">Ground rules</h2>
          <ul class="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Follow the house rules</li>
            <li>Treat your Host's home like your own</li>
          </ul>
        </div>

        <div>
          <label class="flex items-start gap-3 cursor-pointer mb-4">
            <input v-model="agreed" type="checkbox" class="mt-1 accent-secondary" />
            <span class="text-sm text-gray-500">
              I agree to the
              <RouterLink to="/terms" class="underline">House Rules</RouterLink>,
              <RouterLink to="/terms" class="underline">Cancellation Policy</RouterLink>, and the
              <RouterLink to="/terms" class="underline">Guest Refund Policy</RouterLink>.
            </span>
          </label>
          <p v-if="payError" class="text-error text-sm mb-3">{{ payError }}</p>
          <button
            type="button"
            :disabled="!canPay"
            class="w-full bg-secondary hover:bg-secondary-light disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-lg transition-colors text-lg"
            @click="handlePayWithPesapal"
          >
            {{ paying ? 'Redirecting to Pesapal…' : `Pay with Pesapal · ${formatMoney(total)}` }}
          </button>
        </div>
      </div>

      <div>
        <div class="sticky top-24 border border-gray-200 rounded-lg p-6 shadow-sm">
          <div class="flex gap-4 pb-4 border-b border-gray-200">
            <img
              :src="property.images[0]"
              :alt="property.title"
              class="w-32 h-24 object-cover rounded-lg"
              width="128"
              height="96"
            />
            <div class="flex-1">
              <p class="text-sm text-gray-400 capitalize">{{ property.type }}</p>
              <p class="font-medium text-sm">{{ property.title }}</p>
              <p v-if="selectedListing" class="text-xs text-gray-500 mt-0.5">{{ selectedListing.name }}</p>
              <div class="flex items-center gap-1 mt-1">
                <Star class="w-3.5 h-3.5 fill-foreground" />
                <span class="text-sm">{{ property.rating }}</span>
                <span class="text-xs text-gray-400">({{ property.reviewCount }} reviews)</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 py-4 border-b border-gray-200">
            <Shield class="w-5 h-5 text-primary" />
            <span class="text-sm font-medium">
              Your booking is protected by <span class="text-primary">AirCover</span>
            </span>
          </div>

          <div class="py-4 space-y-3 text-sm">
            <h3 class="font-semibold text-base">Price details</h3>
            <div class="flex justify-between">
              <span class="text-gray-400">
                {{ formatMoney(selectedListing?.price ?? property.price) }} x {{ nights }} night{{ nights !== 1 ? 's' : '' }}
              </span>
              <span>{{ formatMoney(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Service fee</span>
              <span>{{ formatMoney(serviceFee) }}</span>
            </div>
            <hr class="border-gray-200" />
            <div class="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{{ formatMoney(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
