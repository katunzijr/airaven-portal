<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@clerk/vue'
import HostOnboardingShell from '@/components/host/HostOnboardingShell.vue'
import HostPropertyStep, { type PropertyStepPayload } from '@/components/host/HostPropertyStep.vue'
import HostListingPhotosStep from '@/components/host/HostListingPhotosStep.vue'
import PhoneInput from '@/components/PhoneInput.vue'
import { amenityLabels } from '@/lib/amenities'
import { formatPriceDisplay, parsePriceDisplay } from '@/lib/priceInput'
import { validatePhone } from '@/lib/phoneInput'
import {
  createHostProfile,
  createHostProperty,
  getHostProfile,
  publishHostListing,
  setHostAvailability,
  updateHostListing,
} from '@/api/host'
import { refreshHostStatus } from '@/composables/useIsHost'
import { Check, ChevronRight, Loader2 } from 'lucide-vue-next'

const TOTAL_STEPS = 5

const router = useRouter()
const { user } = useUser()

const step = ref(1)
const loading = ref(false)
const error = ref('')
const propertyId = ref('')
const propertyStepRef = ref<InstanceType<typeof HostPropertyStep> | null>(null)
const photosStepRef = ref<InstanceType<typeof HostListingPhotosStep> | null>(null)

const hostForm = ref({
  displayName: '',
  bio: '',
  phone: '',
})

const listingForm = ref({
  title: '',
  description: '',
  price: 500000,
  checkIn: '15:00',
  checkOut: '11:00',
  cancellationPolicy: 'Free cancellation within 48 hours',
  instantBook: true,
})

const listingImages = ref<string[]>([])
const priceDisplay = ref(formatPriceDisplay(500000))

const availabilityForm = ref({
  startDate: '',
  endDate: '',
})

const steps = [
  { id: 1, label: 'Host profile' },
  { id: 2, label: 'Add property' },
  { id: 3, label: 'Create listing' },
  { id: 4, label: 'Add photos' },
  { id: 5, label: 'Set availability' },
]

const stepTitle = computed(() => steps.find((s) => s.id === step.value)?.label ?? '')

onMounted(async () => {
  if (!hostForm.value.displayName) {
    hostForm.value.displayName =
      user.value?.fullName ?? user.value?.firstName ?? ''
  }
  try {
    const profile = await getHostProfile()
    if (profile) {
      hostForm.value.displayName = profile.displayName || hostForm.value.displayName
      hostForm.value.bio = profile.bio || hostForm.value.bio
      hostForm.value.phone = profile.phone || hostForm.value.phone
      step.value = 2
    }
  } catch {
    // first-time host
  }
})

function onPriceInput(event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  const parsed = parsePriceDisplay(raw)
  listingForm.value.price = parsed
  priceDisplay.value = parsed ? formatPriceDisplay(parsed) : ''
}

async function runStep(action: () => Promise<void>): Promise<void> {
  error.value = ''
  loading.value = true
  try {
    await action()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong'
  } finally {
    loading.value = false
  }
}

function goBack(): void {
  if (step.value > 1) step.value -= 1
  else router.push('/host')
}

async function submitHostProfile(): Promise<void> {
  const phoneCheck = validatePhone(hostForm.value.phone)
  if (!phoneCheck.valid) {
    error.value = phoneCheck.message ?? 'Invalid phone number'
    return
  }

  await runStep(async () => {
    await createHostProfile({
      displayName: hostForm.value.displayName,
      bio: hostForm.value.bio,
      phone: hostForm.value.phone || undefined,
    })
    await refreshHostStatus()
    step.value = 2
  })
}

async function submitProperty(payload: PropertyStepPayload): Promise<void> {
  await runStep(async () => {
    const property = await createHostProperty({
      type: payload.type,
      location: payload.location,
      maxGuests: payload.maxGuests,
      bedrooms: payload.bedrooms,
      beds: payload.beds,
      bathrooms: payload.bathrooms,
      amenities: amenityLabels(payload.amenities),
    })
    propertyId.value = property.id
    step.value = 3
  })
}

function triggerPropertySubmit(): void {
  propertyStepRef.value?.handleSubmit()
}

function submitListingDetails(): void {
  error.value = ''
  if (!listingForm.value.title.trim() || !listingForm.value.description.trim()) {
    error.value = 'Title and description are required'
    return
  }
  if (listingForm.value.price <= 0) {
    error.value = 'Enter a valid price'
    return
  }
  step.value = 4
}

async function submitPhotos(): Promise<void> {
  photosStepRef.value?.syncUrlImages()
  const photoValidation = photosStepRef.value?.validate()
  if (!photoValidation?.ok) {
    error.value = photoValidation?.message ?? 'Add at least one photo'
    return
  }

  await runStep(async () => {
    await updateHostListing(propertyId.value, {
      title: listingForm.value.title,
      description: listingForm.value.description,
      images: listingImages.value,
      price: listingForm.value.price,
      checkIn: listingForm.value.checkIn,
      checkOut: listingForm.value.checkOut,
      cancellationPolicy: listingForm.value.cancellationPolicy,
      instantBook: listingForm.value.instantBook,
    })
    step.value = 5
  })
}

async function saveAvailabilityRanges(publish: boolean): Promise<void> {
  const { startDate, endDate } = availabilityForm.value

  if (publish && !startDate) {
    throw new Error('Choose an available-from date before publishing')
  }

  if (startDate) {
    await setHostAvailability(propertyId.value, [
      {
        startDate,
        endDate: endDate || undefined,
        status: 'available',
      },
    ])
  }

  if (publish) {
    await publishHostListing(propertyId.value)
    router.push({ name: 'property', params: { id: propertyId.value } })
  } else {
    router.push('/host')
  }
}

async function saveDraft(): Promise<void> {
  await runStep(async () => {
    await saveAvailabilityRanges(false)
  })
}

async function publishListing(): Promise<void> {
  await runStep(async () => {
    await saveAvailabilityRanges(true)
  })
}
</script>

<template>
  <HostOnboardingShell
    :step="step"
    :total-steps="TOTAL_STEPS"
    :title="stepTitle"
    :show-back="true"
    @back="goBack"
  >
    <p v-if="error" class="mb-6 text-sm text-error bg-error/10 border border-error/20 rounded-lg px-4 py-3">
      {{ error }}
    </p>

    <form v-show="step === 1" id="host-profile-form" class="max-w-xl space-y-4" @submit.prevent="submitHostProfile">
      <label class="block">
        <span class="text-sm font-medium">Display name</span>
        <input v-model="hostForm.displayName" required class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
      </label>
      <label class="block">
        <span class="text-sm font-medium">Bio</span>
        <textarea v-model="hostForm.bio" rows="3" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" placeholder="Tell guests about yourself" />
      </label>
      <label class="block">
        <span class="text-sm font-medium">Phone (optional)</span>
        <PhoneInput v-model="hostForm.phone" class="mt-1" />
      </label>
    </form>

    <HostPropertyStep
      v-show="step === 2"
      ref="propertyStepRef"
      :loading="loading"
      :error="error"
      :active="step === 2"
      @submit="submitProperty"
    />

    <form v-show="step === 3" id="host-listing-form" class="max-w-2xl space-y-4" @submit.prevent="submitListingDetails">
      <label class="block">
        <span class="text-sm font-medium">Listing title</span>
        <input v-model="listingForm.title" required class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
      </label>
      <label class="block">
        <span class="text-sm font-medium">Description</span>
        <textarea v-model="listingForm.description" required rows="4" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
      </label>
      <label class="block">
        <span class="text-sm font-medium">Price per night (TZS)</span>
        <input
          :value="priceDisplay"
          type="text"
          inputmode="numeric"
          required
          class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3"
          placeholder="500,000"
          @input="onPriceInput"
        />
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="block">
          <span class="text-sm font-medium">Check-in time</span>
          <input v-model="listingForm.checkIn" type="time" required class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
        </label>
        <label class="block">
          <span class="text-sm font-medium">Check-out time</span>
          <input v-model="listingForm.checkOut" type="time" required class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
        </label>
      </div>
      <label class="block">
        <span class="text-sm font-medium">House rules / cancellation policy</span>
        <textarea v-model="listingForm.cancellationPolicy" rows="2" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
      </label>
      <label class="inline-flex items-center gap-2 text-sm">
        <input v-model="listingForm.instantBook" type="checkbox" class="rounded" />
        Enable instant book
      </label>
    </form>

    <HostListingPhotosStep
      v-show="step === 4"
      ref="photosStepRef"
      v-model="listingImages"
    />

    <div v-show="step === 5" class="max-w-2xl space-y-4">
      <p class="text-sm text-gray-500">
        Set when guests can book. Leave "Available until" empty to save a draft — we'll assume open availability for one year.
      </p>
      <div class="grid grid-cols-2 gap-4">
        <label class="block">
          <span class="text-sm font-medium">Available from</span>
          <input v-model="availabilityForm.startDate" type="date" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
        </label>
        <label class="block">
          <span class="text-sm font-medium">Available until <span class="text-gray-400 font-normal">(optional)</span></span>
          <input v-model="availabilityForm.endDate" type="date" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
        </label>
      </div>
    </div>

    <template #footer>
      <template v-if="step === 1">
        <span />
        <button
          type="submit"
          form="host-profile-form"
          :disabled="loading"
          class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <ChevronRight v-if="!loading" class="w-4 h-4" />
          Continue
        </button>
      </template>

      <template v-else-if="step === 2">
        <span />
        <button
          type="button"
          class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
          :disabled="loading"
          @click="triggerPropertySubmit"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          Continue
        </button>
      </template>

      <template v-else-if="step === 3">
        <span />
        <button
          type="submit"
          form="host-listing-form"
          class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
        >
          <ChevronRight class="w-4 h-4" />
          Continue
        </button>
      </template>

      <template v-else-if="step === 4">
        <span />
        <button
          type="button"
          class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
          :disabled="loading"
          @click="submitPhotos"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <ChevronRight v-if="!loading" class="w-4 h-4" />
          Continue
        </button>
      </template>

      <template v-else-if="step === 5">
        <button
          type="button"
          class="text-sm font-medium text-gray-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-60"
          :disabled="loading"
          @click="saveDraft"
        >
          Save draft
        </button>
        <button
          type="button"
          class="bg-accent text-primary font-bold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
          :disabled="loading"
          @click="publishListing"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Check v-if="!loading" class="w-4 h-4" />
          Publish listing
        </button>
      </template>
    </template>
  </HostOnboardingShell>
</template>
