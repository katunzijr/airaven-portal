<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Show } from '@clerk/vue'
import { Heart } from 'lucide-vue-next'
import { usePreferences } from '@/composables/usePreferences'

const { t } = usePreferences()
</script>

<template>
  <Show when="signed-in">
    <RouterLink
      to="/wishlist"
      class="hidden md:flex items-center gap-1.5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
    >
      <Heart class="w-4 h-4 text-secondary" />
      {{ t('nav.saved') }}
    </RouterLink>
  </Show>
</template>
