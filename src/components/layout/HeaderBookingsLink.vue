<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Show } from '@clerk/vue'
import { CalendarDays } from 'lucide-vue-next'
import { usePreferences } from '@/composables/usePreferences'

const { t } = usePreferences()
</script>

<template>
  <Show when="signed-in">
    <RouterLink
      to="/bookings"
      class="hidden sm:flex items-center gap-1.5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
    >
      <CalendarDays class="w-4 h-4 text-secondary" />
      {{ t('nav.bookings') }}
    </RouterLink>
  </Show>
</template>
