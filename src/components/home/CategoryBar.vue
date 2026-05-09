<script setup lang="ts">
import { ref, onMounted, type Component } from 'vue'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-vue-next'
import {
  Grid3x3,
  Home,
  Building,
  DoorOpen,
  Warehouse,
  Triangle,
  Castle,
  TreePine,
  Fence,
  Waves,
  Mountain,
  Flame,
  Compass,
} from 'lucide-vue-next'
import { categories } from '@/data'

defineProps<{
  activeCategory: string
}>()

const emit = defineEmits<{
  categoryChange: [slug: string]
}>()

const iconMap: Record<string, Component> = {
  grid: Grid3x3,
  home: Home,
  building: Building,
  'door-open': DoorOpen,
  warehouse: Warehouse,
  triangle: Triangle,
  castle: Castle,
  trees: TreePine,
  fence: Fence,
  waves: Waves,
  mountain: Mountain,
  flame: Flame,
  compass: Compass,
}

const scrollRef = ref<HTMLElement | null>(null)
const showLeft = ref(false)
const showRight = ref(true)

function handleScroll() {
  const el = scrollRef.value
  if (!el) return
  const { scrollLeft, scrollWidth, clientWidth } = el
  showLeft.value = scrollLeft > 0
  showRight.value = scrollLeft + clientWidth < scrollWidth - 10
}

function scroll(dir: 'left' | 'right') {
  scrollRef.value?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
}

onMounted(handleScroll)
</script>

<template>
  <div class="sticky top-16 z-40 bg-white border-b border-gray-100">
    <div class="max-w-[1760px] mx-auto px-6 lg:px-10">
      <div class="flex items-center gap-4 py-3">
        <div class="relative flex-1 overflow-hidden">
          <button
            v-if="showLeft"
            type="button"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-lg p-1.5 shadow-md hover:scale-105 transition-transform"
            @click="scroll('left')"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <div
            ref="scrollRef"
            class="flex items-center gap-2 overflow-x-auto scrollbar-hide px-2"
            @scroll="handleScroll"
          >
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="flex items-center gap-2 min-w-fit px-4 py-2 rounded-lg text-sm font-medium transition-all"
              :class="
                activeCategory === cat.slug
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-foreground'
              "
              @click="emit('categoryChange', cat.slug)"
            >
              <component :is="iconMap[cat.icon] || Grid3x3" class="w-4 h-4" />
              <span class="whitespace-nowrap">{{ cat.name }}</span>
            </button>
          </div>

          <button
            v-if="showRight"
            type="button"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-lg p-1.5 shadow-md hover:scale-105 transition-transform"
            @click="scroll('right')"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          class="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors shrink-0"
        >
          <SlidersHorizontal class="w-4 h-4" />
          <span class="text-sm font-medium">Filters</span>
        </button>
      </div>
    </div>
  </div>
</template>
