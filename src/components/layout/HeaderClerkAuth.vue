<script setup lang="ts">
import { Show, SignInButton, SignUpButton } from '@clerk/vue'
import HeaderUserMenu from '@/components/layout/HeaderUserMenu.vue'
import { usePreferences } from '@/composables/usePreferences'

const { t } = usePreferences()
</script>

<template>
  <Show when="signed-out">
    <div class="hidden sm:flex items-center gap-2">
      <SignInButton mode="modal">
        <button
          type="button"
          class="text-sm font-medium hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
        >
          {{ t('nav.login') }}
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button
          type="button"
          class="text-sm font-medium bg-white text-primary px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
        >
          {{ t('nav.signup') }}
        </button>
      </SignUpButton>
    </div>
  </Show>

  <Show when="signed-in">
    <HeaderUserMenu />
  </Show>
</template>
