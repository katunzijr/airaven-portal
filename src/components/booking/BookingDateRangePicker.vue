<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AvailabilityRange } from '@/types/host'
import {
  canSelectCheckOut,
  formatDisplayDate,
  getMonthGrid,
  isDateBookable,
  isStayAvailable,
  monthLabel,
  todayStr,
} from '@/lib/availabilityDates'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePreferences } from '@/composables/usePreferences'

const props = defineProps<{
  checkIn: string
  checkOut: string
  availability: AvailabilityRange[]
}>()

const emit = defineEmits<{
  'update:checkIn': [value: string]
  'update:checkOut': [value: string]
}>()

const { t } = usePreferences()
const rootEl = ref<HTMLElement | null>(null)
const open = ref(false)
const hoverDate = ref('')
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())

const secondMonth = computed(() => {
  if (viewMonth.value === 11) return { year: viewYear.value + 1, month: 0 }
  return { year: viewYear.value, month: viewMonth.value + 1 }
})

const months = computed(() => [
  { year: viewYear.value, month: viewMonth.value },
  secondMonth.value,
])

function shiftMonth(delta: number): void {
  let m = viewMonth.value + delta
  let y = viewYear.value
  while (m < 0) {
    m += 12
    y -= 1
  }
  while (m > 11) {
    m -= 12
    y += 1
  }
  viewMonth.value = m
  viewYear.value = y
}

function isPast(dateStr: string): boolean {
  return dateStr < todayStr()
}

function isDisabled(dateStr: string): boolean {
  if (isPast(dateStr)) return true
  if (!props.checkIn) return !isDateBookable(dateStr, props.availability)
  if (dateStr <= props.checkIn) return true
  return !canSelectCheckOut(props.checkIn, dateStr, props.availability)
}

function isInRange(dateStr: string): boolean {
  if (!props.checkIn) return false
  const end = props.checkOut || hoverDate.value
  if (!end || end <= props.checkIn) return dateStr === props.checkIn
  return dateStr >= props.checkIn && dateStr <= end
}

function isRangeStart(dateStr: string): boolean {
  return dateStr === props.checkIn
}

function isRangeEnd(dateStr: string): boolean {
  const end = props.checkOut || hoverDate.value
  return Boolean(end && dateStr === end)
}

function onDayClick(dateStr: string): void {
  if (isPast(dateStr)) return

  if (!props.checkIn || (props.checkIn && props.checkOut)) {
    if (!isDateBookable(dateStr, props.availability)) return
    emit('update:checkIn', dateStr)
    emit('update:checkOut', '')
    return
  }

  if (dateStr <= props.checkIn) return
  if (!canSelectCheckOut(props.checkIn, dateStr, props.availability)) return
  emit('update:checkOut', dateStr)
}

function onDayHover(dateStr: string): void {
  if (!props.checkIn || props.checkOut) {
    hoverDate.value = ''
    return
  }
  if (dateStr <= props.checkIn) {
    hoverDate.value = ''
    return
  }
  hoverDate.value = canSelectCheckOut(props.checkIn, dateStr, props.availability) ? dateStr : ''
}

function toggleOpen(): void {
  open.value = !open.value
}

function close(): void {
  open.value = false
  hoverDate.value = ''
}

watch(
  () => [props.checkIn, props.checkOut] as const,
  ([ci, co]) => {
    if (ci && co && !isStayAvailable(ci, co, props.availability)) {
      emit('update:checkOut', '')
    }
  },
)

function onDocumentClick(event: MouseEvent): void {
  if (!open.value || !rootEl.value) return
  if (!rootEl.value.contains(event.target as Node)) close()
}

onMounted(() => document.addEventListener('mousedown', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocumentClick))

defineExpose({ isStayAvailable: () => isStayAvailable(props.checkIn, props.checkOut, props.availability) })
</script>

<template>
  <div ref="rootEl" class="relative">
    <button
      type="button"
      class="w-full grid grid-cols-2 text-left border-b border-gray-300"
      @click="toggleOpen"
    >
      <div class="p-3 border-r border-gray-300">
        <span class="block text-[10px] font-bold uppercase">{{ t('calendar.checkIn') }}</span>
        <span class="block text-sm mt-0.5" :class="checkIn ? 'text-foreground' : 'text-gray-400'">
          {{ checkIn ? formatDisplayDate(checkIn) : t('calendar.addDate') }}
        </span>
      </div>
      <div class="p-3">
        <span class="block text-[10px] font-bold uppercase">{{ t('calendar.checkOut') }}</span>
        <span class="block text-sm mt-0.5" :class="checkOut ? 'text-foreground' : 'text-gray-400'">
          {{ checkOut ? formatDisplayDate(checkOut) : t('calendar.addDate') }}
        </span>
      </div>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full z-30 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-5 w-[min(100vw-2rem,22rem)] sm:w-[44rem]"
    >
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-gray-50"
          aria-label="Previous month"
          @click="shiftMonth(-1)"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-gray-50"
          aria-label="Next month"
          @click="shiftMonth(1)"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div v-for="({ year, month }, idx) in months" :key="`${year}-${month}`">
          <p class="text-sm font-semibold text-center mb-4">{{ monthLabel(year, month) }}</p>
          <div class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400 mb-2">
            <span v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="`${idx}-${d}`">{{ d }}</span>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <template v-for="(dateStr, cellIdx) in getMonthGrid(year, month)" :key="`${year}-${month}-${cellIdx}`">
              <span v-if="!dateStr" class="h-11" />
              <button
                v-else
                type="button"
                class="aspect-square w-full max-h-11 text-sm rounded-lg transition-colors relative flex items-center justify-center"
                :class="[
                  isDisabled(dateStr)
                    ? 'text-gray-300 cursor-not-allowed line-through decoration-gray-300'
                    : 'hover:bg-secondary/10 cursor-pointer',
                  isInRange(dateStr) && !isDisabled(dateStr) ? 'bg-secondary/15' : '',
                  (isRangeStart(dateStr) || isRangeEnd(dateStr)) && !isDisabled(dateStr)
                    ? 'bg-secondary text-white hover:bg-secondary font-semibold'
                    : '',
                ]"
                :disabled="isDisabled(dateStr)"
                @click="onDayClick(dateStr)"
                @mouseenter="onDayHover(dateStr)"
                @mouseleave="hoverDate = ''"
              >
                {{ parseInt(dateStr.slice(8), 10) }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <p class="text-xs text-gray-400 mt-4 text-center">
        <template v-if="!checkIn">{{ t('calendar.selectCheckIn') }}</template>
        <template v-else-if="!checkOut">{{ t('calendar.selectCheckOut') }}</template>
        <template v-else>{{ formatDisplayDate(checkIn) }} – {{ formatDisplayDate(checkOut) }}</template>
      </p>

      <button type="button" class="mt-3 w-full text-sm font-medium text-gray-500 hover:text-primary py-2" @click="close">
        {{ t('calendar.close') }}
      </button>
    </div>
  </div>
</template>
