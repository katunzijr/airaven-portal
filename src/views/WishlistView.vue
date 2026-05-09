<script setup lang="ts">
import { properties, currentUser } from '@/data'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import { Heart } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const wishlistProperties = properties.filter((p) => currentUser.wishlist.includes(p.id))
</script>

<template>
  <div class="max-w-[1760px] mx-auto px-6 lg:px-10 py-8">
    <h1 class="text-3xl font-bold mb-2">Wishlists</h1>
    <p class="text-gray-400 mb-8">
      {{ wishlistProperties.length }} saved {{ wishlistProperties.length === 1 ? 'property' : 'properties' }}
    </p>

    <div v-if="wishlistProperties.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PropertyCard v-for="property in wishlistProperties" :key="property.id" :property="{ ...property, isFavorite: true }" />
    </div>

    <div v-else class="text-center py-20">
      <Heart class="w-16 h-16 mx-auto mb-4 text-gray-200" />
      <h2 class="text-xl font-bold mb-2">No wishlists yet</h2>
      <p class="text-gray-400 max-w-md mx-auto mb-6">
        When you find places you love, save them here by tapping the heart icon.
      </p>
      <RouterLink to="/" class="text-primary font-medium hover:underline">Start exploring</RouterLink>
    </div>
  </div>
</template>
