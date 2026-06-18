<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

defineProps<{
  step: number
  totalSteps?: number
  title: string
  showBack?: boolean
}>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[70] bg-white flex flex-col">
      <header class="shrink-0 border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4 min-w-0">
          <button
            v-if="showBack"
            type="button"
            class="inline-flex items-center gap-2 text-sm font-medium hover:bg-gray-50 px-3 py-2 rounded-lg shrink-0"
            @click="emit('back')"
          >
            <ArrowLeft class="w-4 h-4" /> Back
          </button>
          <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
            <img src="/airaven-logo.png" alt="Airaven" width="32" height="32" class="rounded-md" />
            <span class="text-lg font-extrabold tracking-tight hidden sm:block">airaven</span>
          </RouterLink>
        </div>
        <p class="text-sm text-gray-400 shrink-0">Step {{ step }} of {{ totalSteps ?? 4 }}</p>
      </header>

      <div class="shrink-0 px-6 pt-6 max-w-6xl w-full mx-auto">
        <h1 class="text-2xl md:text-3xl font-bold">{{ title }}</h1>
        <div class="flex gap-2 mt-4">
          <div
            v-for="n in totalSteps ?? 4"
            :key="n"
            class="h-1 flex-1 rounded-full"
            :class="n <= step ? 'bg-secondary' : 'bg-gray-200'"
          />
        </div>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-6xl mx-auto px-6 py-8 w-full">
          <slot />
        </div>
      </main>

      <footer v-if="$slots.footer" class="shrink-0 border-t border-gray-100 px-6 py-4 bg-white">
        <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <slot name="footer" />
        </div>
      </footer>
    </div>
  </Teleport>
</template>
