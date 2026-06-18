<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, Globe, Menu, Heart, CalendarDays } from 'lucide-vue-next'
import HeaderClerkAuth from '@/components/layout/HeaderClerkAuth.vue'
import HeaderHostLink from '@/components/layout/HeaderHostLink.vue'
import HeaderWishlistLink from '@/components/layout/HeaderWishlistLink.vue'
import LocaleCurrencyMenu from '@/components/layout/LocaleCurrencyMenu.vue'
import { usePreferences } from '@/composables/usePreferences'
import { useIsHost } from '@/composables/useIsHost'
import { isClerkConfigured } from '@/lib/clerk'

const mobileMenuOpen = ref(false)
const clerkEnabled = isClerkConfigured()
const { isHost, hostChecked } = useIsHost()
const { t } = usePreferences()
</script>

<template>
  <header class="sticky top-0 z-50 bg-primary text-white shadow-md">
    <div class="max-w-[1760px] mx-auto px-6 lg:px-10">
      <div class="flex items-center justify-between h-16">
        <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
          <div class="w-9 h-9 rounded-md flex items-center justify-center">
            <img src="/airaven-logo.png" alt="Airaven Logo" width="32" height="32" />
          </div>
          <span class="text-xl font-extrabold tracking-tight hidden sm:block"> airaven </span>
        </RouterLink>

        <div class="hidden md:flex flex-1 max-w-xl mx-8">
          <RouterLink
            to="/search"
            class="flex items-center w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 hover:bg-white/15 transition-colors"
          >
            <Search class="w-4 h-4 text-accent mr-3 shrink-0" />
            <span class="text-sm text-white/70">{{ t('nav.search') }}</span>
          </RouterLink>
        </div>

        <div class="flex items-center gap-2">
          <HeaderHostLink />
          <HeaderWishlistLink v-if="clerkEnabled" />
          <LocaleCurrencyMenu />

          <HeaderClerkAuth v-if="clerkEnabled" />

          <button
            type="button"
            class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors sm:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <Menu class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="md:hidden px-4 pb-3">
      <RouterLink
        to="/search"
        class="flex items-center gap-3 bg-white/10 border border-white/20 rounded-lg px-4 py-3"
      >
        <Search class="w-5 h-5 text-accent" />
        <div>
          <p class="text-sm font-medium">{{ t('nav.whereTo') }}</p>
          <p class="text-xs text-white/60">{{ t('nav.searchHint') }}</p>
        </div>
      </RouterLink>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="absolute right-6 top-16 bg-white text-foreground border border-gray-200 rounded-lg shadow-xl py-2 w-60 z-50"
    >
      <template v-if="clerkEnabled">
        <RouterLink
          to="/profile"
          class="block px-4 py-3 text-sm hover:bg-gray-50 font-medium"
          @click="mobileMenuOpen = false"
        >
          {{ t('nav.profile') }}
        </RouterLink>
        <RouterLink
          to="/wishlist"
          class="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50"
          @click="mobileMenuOpen = false"
        >
          <Heart class="w-4 h-4 text-secondary" /> {{ t('nav.wishlist') }}
        </RouterLink>
        <RouterLink
          to="/bookings"
          class="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50"
          @click="mobileMenuOpen = false"
        >
          <CalendarDays class="w-4 h-4 text-secondary" /> {{ t('nav.bookings') }}
        </RouterLink>
        <RouterLink
          to="/trips"
          class="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50"
          @click="mobileMenuOpen = false"
        >
          <Globe class="w-4 h-4 text-secondary" /> {{ t('nav.trips') }}
        </RouterLink>
        <hr class="my-2 border-gray-100" />
      </template>
      <RouterLink
        v-if="!clerkEnabled || (hostChecked && !isHost)"
        to="/host"
        class="block px-4 py-3 text-sm hover:bg-gray-50"
        @click="mobileMenuOpen = false"
      >
        {{ t('nav.becomeHost') }}
      </RouterLink>
      <RouterLink
        v-else-if="clerkEnabled && hostChecked && isHost"
        to="/host/onboarding"
        class="block px-4 py-3 text-sm hover:bg-gray-50"
        @click="mobileMenuOpen = false"
      >
        {{ t('nav.addListing') }}
      </RouterLink>
    </div>
  </header>
</template>
