<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useIsHost } from '@/composables/useIsHost'
import { usePreferences } from '@/composables/usePreferences'
import { isClerkConfigured } from '@/lib/clerk'

const { isHost, hostChecked } = useIsHost()
const { t } = usePreferences()
const clerkEnabled = isClerkConfigured()
</script>

<template>
  <template v-if="clerkEnabled && hostChecked && !isHost">
    <RouterLink
      to="/host"
      class="hidden lg:block text-sm font-medium hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
    >
      {{ t('nav.becomeHost') }}
    </RouterLink>
  </template>
  <template v-else-if="clerkEnabled && hostChecked && isHost">
    <RouterLink
      to="/host/listings"
      class="hidden lg:block text-sm font-medium hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
    >
      {{ t('nav.myListings') }}
    </RouterLink>
    <RouterLink
      to="/host/onboarding"
      class="hidden lg:block text-sm font-medium hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
    >
      {{ t('nav.addListing') }}
    </RouterLink>
  </template>
</template>
