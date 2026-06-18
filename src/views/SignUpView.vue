<script setup lang="ts">
import { SignUp } from '@clerk/vue'
</script>

<template>
  <div class="flex justify-center px-6 py-12">
    <SignUp routing="path" path="/sign-up" sign-in-url="/sign-in" />
  </div>
</template>
