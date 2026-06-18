<script setup lang="ts">
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/vue'
</script>

<template>
  <Show when="signed-out">
    <div class="hidden sm:flex items-center gap-2">
      <SignInButton mode="modal">
        <button
          type="button"
          class="text-sm font-medium hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
        >
          Log in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button
          type="button"
          class="text-sm font-medium bg-white text-primary px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
        >
          Sign up
        </button>
      </SignUpButton>
    </div>
  </Show>

  <Show when="signed-in">
    <div class="hidden sm:block">
      <UserButton
        :appearance="{
          elements: {
            avatarBox: 'w-9 h-9 rounded-lg',
          },
        }"
      />
    </div>
  </Show>
</template>
