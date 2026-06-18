<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import ClerkBootstrap from '@/components/ClerkBootstrap.vue'
import { isClerkConfigured } from '@/lib/clerk'
import { locale } from '@/lib/preferences'

const clerkEnabled = isClerkConfigured()
</script>

<template>
  <ClerkBootstrap v-if="clerkEnabled">
    <div class="min-h-full flex flex-col flex-1 w-full">
      <Header />
      <main class="flex-1 w-full">
        <RouterView :key="locale" />
      </main>
      <Footer />
    </div>
  </ClerkBootstrap>
  <div v-else class="min-h-full flex flex-col flex-1 w-full">
    <Header />
    <main class="flex-1 w-full">
      <RouterView :key="locale" />
    </main>
    <Footer />
  </div>
</template>
