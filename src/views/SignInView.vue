<script setup lang="ts">
import { SignIn } from '@clerk/vue'
</script>

<template>
  <div class="flex justify-center px-6 py-12">
    <SignIn routing="path" path="/sign-in" sign-up-url="/sign-up" />
  </div>
</template>
