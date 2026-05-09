<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <div class="min-h-full flex flex-col flex-1 w-full">
    <Header />
    <main class="flex-1 w-full">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
