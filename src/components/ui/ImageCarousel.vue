<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  images: string[]
  alt: string
}>()

const current = ref(0)

function prev(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  const len = props.images.length
  current.value = current.value === 0 ? len - 1 : current.value - 1
}

function next(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  const len = props.images.length
  current.value = current.value === len - 1 ? 0 : current.value + 1
}
</script>

<template>
  <div class="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 group">
    <div
      class="flex transition-transform duration-300 ease-out h-full"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <img
        v-for="(img, i) in images"
        :key="i"
        :src="img"
        :alt="`${alt} ${i + 1}`"
        class="w-full h-full object-cover shrink-0"
        :loading="i === 0 ? 'eager' : 'lazy'"
      />
    </div>

    <template v-if="images.length > 1">
      <button
        type="button"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
        @click="prev"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
        @click="next"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        <div
          v-for="(_, i) in images"
          :key="i"
          class="w-1.5 h-1.5 rounded-full transition-colors"
          :class="i === current ? 'dot-active' : 'dot-inactive'"
        />
      </div>
    </template>
  </div>
</template>
