<script setup lang="ts">
import { watchEffect } from 'vue'
import { useAuth } from '@clerk/vue'
import { setAuthTokenGetter } from '@/api/client'
import { refreshHostStatus } from '@/composables/useIsHost'
import { useWishlist } from '@/composables/useWishlist'

const { getToken, isLoaded, isSignedIn } = useAuth()
const { refreshWishlist } = useWishlist()

watchEffect(() => {
  if (isLoaded.value) {
    setAuthTokenGetter(() => getToken.value())
    if (isSignedIn.value) {
      void refreshHostStatus()
      void refreshWishlist()
    }
  }
})
</script>

<template>
  <slot />
</template>
