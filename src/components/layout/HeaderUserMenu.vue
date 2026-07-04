<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUser, SignOutButton } from '@clerk/vue'
import {
  Menu,
  Heart,
  CalendarDays,
  User,
  Home,
  LogOut,
  Plus,
} from 'lucide-vue-next'
import { useIsHost } from '@/composables/useIsHost'
import { usePreferences } from '@/composables/usePreferences'

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const { user } = useUser()
const { isHost, hostChecked } = useIsHost()
const { t } = usePreferences()

function close(): void {
  open.value = false
}

function toggle(): void {
  open.value = !open.value
}

function onDocumentClick(event: MouseEvent): void {
  if (!menuRef.value?.contains(event.target as Node)) close()
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="menuRef" class="relative hidden sm:block">
    <button
      type="button"
      class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full pl-3 pr-1.5 py-1.5 hover:bg-white/20 transition-colors"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click.stop="toggle"
    >
      <Menu class="w-4 h-4" />
      <img
        v-if="user?.imageUrl"
        :src="user.imageUrl"
        :alt="user.fullName ?? 'Profile'"
        class="w-8 h-8 rounded-full object-cover"
        width="32"
        height="32"
      />
      <div v-else class="w-8 h-8 rounded-full bg-white/20" />
    </button>

    <div
      v-if="open"
      role="menu"
      class="absolute right-0 top-full mt-2 w-72 bg-white text-foreground border border-gray-200 rounded-xl shadow-xl py-2 z-50"
    >
      <div class="px-4 py-3 border-b border-gray-100">
        <p class="font-semibold truncate">{{ user?.fullName ?? user?.firstName ?? 'Guest' }}</p>
        <p class="text-xs text-gray-400 truncate">
          {{ user?.primaryEmailAddress?.emailAddress }}
        </p>
      </div>

      <RouterLink
        to="/profile"
        role="menuitem"
        class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
        @click="close"
      >
        <User class="w-4 h-4 text-gray-500" />
        {{ t('nav.profile') }}
      </RouterLink>

      <RouterLink
        to="/bookings"
        role="menuitem"
        class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
        @click="close"
      >
        <CalendarDays class="w-4 h-4 text-gray-500" />
        {{ t('nav.bookings') }}
      </RouterLink>

      <RouterLink
        to="/wishlist"
        role="menuitem"
        class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
        @click="close"
      >
        <Heart class="w-4 h-4 text-gray-500" />
        {{ t('nav.wishlist') }}
      </RouterLink>

      <hr class="my-1 border-gray-100" />

      <RouterLink
        v-if="hostChecked && isHost"
        to="/host/listings"
        role="menuitem"
        class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
        @click="close"
      >
        <Home class="w-4 h-4 text-gray-500" />
        {{ t('nav.hostDashboard') }}
      </RouterLink>

      <RouterLink
        v-if="hostChecked && isHost"
        to="/host/onboarding"
        role="menuitem"
        class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
        @click="close"
      >
        <Plus class="w-4 h-4 text-gray-500" />
        {{ t('nav.addListing') }}
      </RouterLink>

      <RouterLink
        v-else-if="hostChecked"
        to="/host"
        role="menuitem"
        class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
        @click="close"
      >
        <Home class="w-4 h-4 text-gray-500" />
        {{ t('nav.becomeHost') }}
      </RouterLink>

      <hr class="my-1 border-gray-100" />

      <SignOutButton>
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 text-left"
          @click="close"
        >
          <LogOut class="w-4 h-4 text-gray-500" />
          {{ t('nav.signOut') }}
        </button>
      </SignOutButton>
    </div>
  </div>
</template>
