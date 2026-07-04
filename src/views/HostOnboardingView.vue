<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@clerk/vue'
import HostOnboardingShell from '@/components/host/HostOnboardingShell.vue'
import HostPropertyStep from '@/components/host/HostPropertyStep.vue'
import HostRoomTypesStep from '@/components/host/HostRoomTypesStep.vue'
import HostListingPhotosStep from '@/components/host/HostListingPhotosStep.vue'
import PhoneInput from '@/components/PhoneInput.vue'
import { amenityLabels } from '@/lib/amenities'
import { validatePhone } from '@/lib/phoneInput'
import {
  createHostProfile,
  createHostProperty,
  createRoomListing,
  getHostProfile,
  publishHostListing,
  setHostAvailability,
  updateHostListing,
  updateRoomListing,
} from '@/api/host'
import { refreshHostStatus } from '@/composables/useIsHost'
import { Check, ChevronRight, Loader2 } from 'lucide-vue-next'
import type { PropertyType } from '@/types'
import type { LocationValue } from '@/components/host/LocationMapPicker.vue'

const TOTAL_STEPS = 6

const router = useRouter()
const route = useRoute()
const { user } = useUser()

const forceNewListing = computed(() => route.query.new === '1')

const step = ref(1)
const loading = ref(false)
const error = ref('')
const propertyId = ref('')
const propertyType = ref<PropertyType>('house')
const roomListingIds = ref<string[]>([])
const photoListingIndex = ref(0)
const propertyStepRef = ref<InstanceType<typeof HostPropertyStep> | null>(null)
const roomTypesStepRef = ref<InstanceType<typeof HostRoomTypesStep> | null>(null)
const coverPhotosRef = ref<InstanceType<typeof HostListingPhotosStep> | null>(null)
const roomPhotosRef = ref<InstanceType<typeof HostListingPhotosStep> | null>(null)

const hostForm = ref({
  displayName: '',
  bio: '',
  phone: '',
})

const propertyForm = ref({
  title: '',
  description: '',
  checkIn: '15:00',
  checkOut: '11:00',
  cancellationPolicy: 'Free cancellation within 48 hours',
})

const coverImages = ref<string[]>([])
const roomImages = ref<string[]>([])

const availabilityForm = ref({
  startDate: '',
  endDate: '',
})

const steps = [
  { id: 1, label: 'Host profile' },
  { id: 2, label: 'Property location' },
  { id: 3, label: 'Property details' },
  { id: 4, label: 'Unit types' },
  { id: 5, label: 'Photos' },
  { id: 6, label: 'Availability' },
]

const stepTitle = computed(() => steps.find((s) => s.id === step.value)?.label ?? '')

onMounted(async () => {
  if (!hostForm.value.displayName) {
    hostForm.value.displayName = user.value?.fullName ?? user.value?.firstName ?? ''
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

async function submitProperty(payload: { type: PropertyType; location: LocationValue }): Promise<void> {
  await runStep(async () => {
    if (propertyId.value) {
      propertyType.value = payload.type
      step.value = 3
      return
    }

    const property = await createHostProperty({
      type: payload.type,
      location: payload.location,
      forceNew: forceNewListing.value,
    })
    propertyId.value = property.id
    propertyType.value = payload.type
    step.value = 3
  })
}

function triggerPropertySubmit(): void {
  propertyStepRef.value?.handleSubmit()
}

function submitPropertyDetails(): void {
  error.value = ''
  if (!propertyForm.value.title.trim() || !propertyForm.value.description.trim()) {
    error.value = 'Title and description are required'
    return
  }
  step.value = 4
}

async function submitRoomTypes(): Promise<void> {
  const validation = roomTypesStepRef.value?.validate()
  if (!validation?.ok) {
    error.value = validation?.message ?? 'Fix unit type details'
    return
  }

  await runStep(async () => {
    const drafts = roomTypesStepRef.value?.getPayload() ?? []
    const ids: string[] = []

    for (const room of drafts) {
      const listing = await createRoomListing(propertyId.value, {
        name: room.name,
        description: room.description,
        price: room.price,
        maxGuests: room.maxGuests,
        bedrooms: room.bedrooms,
        beds: room.beds,
        bathrooms: room.bathrooms,
        amenities: amenityLabels(room.amenities),
        instantBook: room.instantBook,
      })
      ids.push(listing.id)
    }

    await updateHostListing(propertyId.value, {
      title: propertyForm.value.title,
      description: propertyForm.value.description,
      images: [],
      checkIn: propertyForm.value.checkIn,
      checkOut: propertyForm.value.checkOut,
      cancellationPolicy: propertyForm.value.cancellationPolicy,
    })

    roomListingIds.value = ids
    photoListingIndex.value = 0
    roomImages.value = []
    step.value = 5
  })
}

async function submitCoverPhotos(): Promise<void> {
  coverPhotosRef.value?.syncUrlImages()
  const photoValidation = coverPhotosRef.value?.validate()
  if (!photoValidation?.ok) {
    error.value = photoValidation?.message ?? 'Add at least one cover photo'
    return
  }

  await runStep(async () => {
    await updateHostListing(propertyId.value, {
      title: propertyForm.value.title,
      description: propertyForm.value.description,
      images: coverImages.value,
      checkIn: propertyForm.value.checkIn,
      checkOut: propertyForm.value.checkOut,
      cancellationPolicy: propertyForm.value.cancellationPolicy,
    })
    photoListingIndex.value = 0
    roomImages.value = []
  })
}

async function submitRoomPhotos(): Promise<void> {
  roomPhotosRef.value?.syncUrlImages()
  const photoValidation = roomPhotosRef.value?.validate()
  if (!photoValidation?.ok) {
    error.value = photoValidation?.message ?? 'Add at least one photo for this unit type'
    return
  }

  const listingId = roomListingIds.value[photoListingIndex.value]
  await runStep(async () => {
    await updateRoomListing(propertyId.value, listingId, { images: roomImages.value })

    if (photoListingIndex.value < roomListingIds.value.length - 1) {
      photoListingIndex.value += 1
      roomImages.value = []
      return
    }

    step.value = 6
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
      :active="step === 2"
      @submit="submitProperty"
    />

    <form v-show="step === 3" id="host-property-form" class="max-w-2xl space-y-4" @submit.prevent="submitPropertyDetails">
      <label class="block">
        <span class="text-sm font-medium">Property name</span>
        <input v-model="propertyForm.title" required class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" placeholder="Nungwi Beach Resort" />
      </label>
      <label class="block">
        <span class="text-sm font-medium">Description</span>
        <textarea v-model="propertyForm.description" required rows="4" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="block">
          <span class="text-sm font-medium">Check-in time</span>
          <input v-model="propertyForm.checkIn" type="time" required class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
        </label>
        <label class="block">
          <span class="text-sm font-medium">Check-out time</span>
          <input v-model="propertyForm.checkOut" type="time" required class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
        </label>
      </div>
      <label class="block">
        <span class="text-sm font-medium">Cancellation policy</span>
        <textarea v-model="propertyForm.cancellationPolicy" rows="2" class="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3" />
      </label>
    </form>

    <HostRoomTypesStep v-show="step === 4" ref="roomTypesStepRef" :property-type="propertyType" />

    <div v-show="step === 5" class="max-w-2xl space-y-6">
      <div v-if="coverImages.length === 0">
        <h2 class="text-lg font-semibold mb-1">Cover photos</h2>
        <p class="text-sm text-gray-500 mb-4">Photos shown on search results and the top of your property page.</p>
        <HostListingPhotosStep ref="coverPhotosRef" v-model="coverImages" />
      </div>
      <div v-else>
        <h2 class="text-lg font-semibold mb-1">
          Unit photos ({{ photoListingIndex + 1 }} / {{ roomListingIds.length }})
        </h2>
        <p class="text-sm text-gray-500 mb-4">Add photos for this unit type.</p>
        <HostListingPhotosStep ref="roomPhotosRef" v-model="roomImages" />
      </div>
    </div>

    <div v-show="step === 6" class="max-w-2xl space-y-4">
      <p class="text-sm text-gray-500">
        Set when guests can book. This applies to all unit types. Leave "Available until" empty for open availability up to one year.
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
        <button type="submit" form="host-profile-form" :disabled="loading" class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <ChevronRight v-if="!loading" class="w-4 h-4" />
          Continue
        </button>
      </template>

      <template v-else-if="step === 2">
        <span />
        <button type="button" class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60" :disabled="loading" @click="triggerPropertySubmit">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          Continue
        </button>
      </template>

      <template v-else-if="step === 3">
        <span />
        <button type="submit" form="host-property-form" class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2">
          <ChevronRight class="w-4 h-4" />
          Continue
        </button>
      </template>

      <template v-else-if="step === 4">
        <span />
        <button type="button" class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60" :disabled="loading" @click="submitRoomTypes">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <ChevronRight v-if="!loading" class="w-4 h-4" />
          Continue
        </button>
      </template>

      <template v-else-if="step === 5">
        <span />
        <button
          v-if="coverImages.length === 0"
          type="button"
          class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
          :disabled="loading"
          @click="submitCoverPhotos"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <ChevronRight v-if="!loading" class="w-4 h-4" />
          Continue
        </button>
        <button
          v-else
          type="button"
          class="bg-primary text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60"
          :disabled="loading"
          @click="submitRoomPhotos"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <ChevronRight v-if="!loading" class="w-4 h-4" />
          {{ photoListingIndex < roomListingIds.length - 1 ? 'Next unit' : 'Continue' }}
        </button>
      </template>

      <template v-else-if="step === 6">
        <button type="button" class="text-sm font-medium text-gray-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-60" :disabled="loading" @click="saveDraft">
          Save draft
        </button>
        <button type="button" class="bg-accent text-primary font-bold px-8 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-60" :disabled="loading" @click="publishListing">
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Check v-if="!loading" class="w-4 h-4" />
          Publish
        </button>
      </template>
    </template>
  </HostOnboardingShell>
</template>
