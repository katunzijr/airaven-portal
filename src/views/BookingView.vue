<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { properties } from '@/data'
import { Star, Shield, ChevronLeft, CreditCard, Smartphone, Building2 } from 'lucide-vue-next'
import { formatTZS } from '@/lib/format'

const route = useRoute()
const router = useRouter()

const property = computed(() => properties.find((p) => p.id === route.params.id))

const checkIn = computed(() => (route.query.checkIn as string) || '')
const checkOut = computed(() => (route.query.checkOut as string) || '')
const guests = computed(() => Number(route.query.guests) || 1)

const paymentMethod = ref<'card' | 'mobile' | 'bank'>('card')
const agreed = ref(false)

const nights = computed(() => {
  const ci = checkIn.value
  const co = checkOut.value
  if (!ci || !co) return 1
  return Math.max(
    1,
    Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / (1000 * 60 * 60 * 24)),
  )
})

const subtotal = computed(() => (property.value ? nights.value * property.value.price : 0))
const serviceFee = computed(() => Math.round(subtotal.value * 0.12))
const total = computed(() => subtotal.value + serviceFee.value)

function handleConfirmBooking() {
  const p = property.value
  if (!p || !agreed.value) return
  router.push({
    path: `/booking/${p.id}/confirmation`,
    query: {
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      guests: String(guests.value),
      total: String(total.value),
    },
  })
}
</script>

<template>
  <div v-if="!property" class="max-w-4xl mx-auto px-6 py-20 text-center">
    <h1 class="text-2xl font-bold mb-2">Property not found</h1>
    <RouterLink to="/" class="text-primary hover:underline">Back to home</RouterLink>
  </div>

  <div v-else class="max-w-[1120px] mx-auto px-6 py-6">
    <button type="button" class="flex items-center gap-1 text-sm mb-6 hover:underline" @click="router.back()">
      <ChevronLeft class="w-4 h-4" /> Back
    </button>

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
              <button type="button" class="text-sm font-medium underline">Edit</button>
            </div>
            <div class="flex justify-between">
              <div>
                <p class="font-medium">Guests</p>
                <p class="text-sm text-gray-400">{{ guests }} guest{{ guests !== 1 ? 's' : '' }}</p>
              </div>
              <button type="button" class="text-sm font-medium underline">Edit</button>
            </div>
          </div>
        </div>

        <hr class="border-gray-200" />

        <div>
          <h2 class="text-lg font-semibold mb-4">Pay with</h2>
          <div class="space-y-3">
            <label
              class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
              :class="
                paymentMethod === 'card' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-400'
              "
            >
              <input v-model="paymentMethod" type="radio" name="payment" value="card" class="accent-secondary" />
              <CreditCard class="w-5 h-5" />
              <span class="font-medium">Credit or debit card</span>
            </label>
            <label
              class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
              :class="
                paymentMethod === 'mobile' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-400'
              "
            >
              <input v-model="paymentMethod" type="radio" name="payment" value="mobile" class="accent-secondary" />
              <Smartphone class="w-5 h-5" />
              <span class="font-medium">Mobile payment</span>
            </label>
            <label
              class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
              :class="
                paymentMethod === 'bank' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-400'
              "
            >
              <input v-model="paymentMethod" type="radio" name="payment" value="bank" class="accent-secondary" />
              <Building2 class="w-5 h-5" />
              <span class="font-medium">Bank transfer</span>
            </label>
          </div>

          <div v-if="paymentMethod === 'card'" class="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Card number"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
            />
            <div class="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                class="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
              <input
                type="text"
                placeholder="CVV"
                class="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Name on card"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
            />
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
          <p class="text-sm text-gray-400 mb-3">
            We ask every guest to remember a few simple things about what makes a great guest.
          </p>
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
          <button
            type="button"
            :disabled="!agreed"
            class="w-full bg-secondary hover:bg-secondary-light disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-lg transition-colors text-lg"
            @click="handleConfirmBooking"
          >
            Confirm and pay {{ formatTZS(total) }}
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
              <p class="text-sm text-gray-400">
                {{ property.type.charAt(0).toUpperCase() + property.type.slice(1) }}
              </p>
              <p class="font-medium text-sm">{{ property.title }}</p>
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
                {{ formatTZS(property.price) }} x {{ nights }} night{{ nights !== 1 ? 's' : '' }}
              </span>
              <span>{{ formatTZS(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Service fee</span>
              <span>{{ formatTZS(serviceFee) }}</span>
            </div>
            <hr class="border-gray-200" />
            <div class="flex justify-between font-bold text-base">
              <span>Total (TZS)</span>
              <span>{{ formatTZS(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
