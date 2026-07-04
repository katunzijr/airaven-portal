<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  PHONE_COUNTRIES,
  detectCountryFromInput,
  formatNationalAsYouType,
  parseStoredPhone,
  toInternationalDisplay,
  type CountryCode,
} from '@/lib/phoneInput'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const props = defineProps<{
  modelValue: string
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const parsed = parseStoredPhone(props.modelValue)
const selectedCountry = ref<CountryCode>(parsed.country)
const nationalDisplay = ref(
  parsed.nationalDigits ? formatNationalAsYouType(parsed.nationalDigits, parsed.country) : '',
)
const showCountryList = ref(false)
const countrySearch = ref('')

const selectedDialCode = computed(
  () => PHONE_COUNTRIES.find((c) => c.code === selectedCountry.value)?.dialCode ?? '+255',
)

const filteredCountries = computed(() => {
  const q = countrySearch.value.trim().toLowerCase()
  if (!q) return PHONE_COUNTRIES
  return PHONE_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q),
  )
})

function emitValue(): void {
  const international = toInternationalDisplay(nationalDisplay.value, selectedCountry.value)
  emit('update:modelValue', international)
}

function onNationalInput(event: Event): void {
  const raw = (event.target as HTMLInputElement).value

  if (raw.startsWith('+')) {
    const detected = detectCountryFromInput(raw)
    if (detected) selectedCountry.value = detected
    const parsed = parsePhoneNumberFromString(raw)
    if (parsed) {
      nationalDisplay.value = formatNationalAsYouType(
        parsed.nationalNumber,
        parsed.country ?? selectedCountry.value,
      )
    } else {
      nationalDisplay.value = raw
    }
  } else {
    nationalDisplay.value = formatNationalAsYouType(raw.replace(/\D/g, ''), selectedCountry.value)
  }

  emitValue()
}

function selectCountry(code: CountryCode): void {
  selectedCountry.value = code
  showCountryList.value = false
  countrySearch.value = ''
  if (nationalDisplay.value) {
    nationalDisplay.value = formatNationalAsYouType(
      nationalDisplay.value.replace(/\D/g, ''),
      code,
    )
    emitValue()
  }
}

watch(
  () => props.modelValue,
  (value) => {
    const next = parseStoredPhone(value, selectedCountry.value)
    if (next.display !== toInternationalDisplay(nationalDisplay.value, selectedCountry.value)) {
      selectedCountry.value = next.country
      nationalDisplay.value = next.nationalDigits
        ? formatNationalAsYouType(next.nationalDigits, next.country)
        : ''
    }
  },
)
</script>

<template>
  <div class="relative">
    <div class="flex gap-2">
      <div class="relative shrink-0">
        <button
          type="button"
          class="h-full min-h-[48px] border border-gray-200 rounded-lg px-3 text-sm font-medium bg-white hover:bg-gray-50 inline-flex items-center gap-1.5"
          @click="showCountryList = !showCountryList"
        >
          <span class="text-gray-500">{{ selectedCountry }}</span>
          <span>{{ selectedDialCode }}</span>
        </button>
        <div
          v-if="showCountryList"
          class="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        >
          <input
            v-model="countrySearch"
            type="text"
            placeholder="Search country"
            class="w-full border-b border-gray-100 px-3 py-2.5 text-sm focus:outline-none"
          />
          <ul class="max-h-56 overflow-y-auto">
            <li v-for="country in filteredCountries" :key="country.code">
              <button
                type="button"
                class="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between gap-2"
                :class="selectedCountry === country.code ? 'bg-secondary/5 text-secondary' : ''"
                @click="selectCountry(country.code)"
              >
                <span>{{ country.name }}</span>
                <span class="text-gray-400 shrink-0">{{ country.dialCode }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <input
        :value="nationalDisplay"
        type="tel"
        inputmode="tel"
        :required="required"
        placeholder="656 631 1XX"
        class="flex-1 border border-gray-200 rounded-lg px-4 py-3"
        @input="onNationalInput"
      />
    </div>
    <p v-if="modelValue" class="text-xs text-gray-400 mt-1.5">{{ modelValue }}</p>
  </div>
</template>
