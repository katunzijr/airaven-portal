<script setup lang="ts">
import { currentUser } from '@/data'
import { User as UserIcon, Mail, Phone, Shield, Settings, CreditCard, Bell, ChevronRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const user = currentUser

const menuItems = [
  {
    icon: UserIcon,
    label: 'Personal info',
    description: 'Provide personal details and how we can reach you',
    href: '#',
  },
  {
    icon: Shield,
    label: 'Login & security',
    description: 'Update your password and secure your account',
    href: '#',
  },
  {
    icon: CreditCard,
    label: 'Payments & payouts',
    description: 'Review payments, payouts, coupons, and gift cards',
    href: '#',
  },
  {
    icon: Bell,
    label: 'Notifications',
    description: 'Choose notification preferences and how you want to be contacted',
    href: '#',
  },
  {
    icon: Settings,
    label: 'Global preferences',
    description: 'Set your default language, currency, and timezone',
    href: '#',
  },
]

const joined = new Date(user.joinedDate).toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric',
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
      <div class="relative">
        <img :src="user.avatar" :alt="user.name" class="w-28 h-28 rounded-lg border-4 border-white shadow-lg" width="112" height="112" />
        <div class="absolute -bottom-1 -right-1 bg-secondary text-white w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold shadow-md">
          ✓
        </div>
      </div>
      <div class="text-center sm:text-left">
        <h1 class="text-3xl font-bold">{{ user.name }}</h1>
        <p class="text-gray-400 text-sm mt-1">Guest · Member since {{ joined }}</p>
        <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 justify-center sm:justify-start">
          <span class="flex items-center gap-1">
            <Mail class="w-4 h-4" /> {{ user.email }}
          </span>
          <span class="flex items-center gap-1">
            <Phone class="w-4 h-4" /> {{ user.phone }}
          </span>
        </div>
        <div class="flex gap-6 mt-4 justify-center sm:justify-start">
          <div class="text-center">
            <p class="text-xl font-bold">{{ user.wishlist.length }}</p>
            <p class="text-xs text-gray-400">Wishlists</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold">3</p>
            <p class="text-xs text-gray-400">Bookings</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold">5.0</p>
            <p class="text-xs text-gray-400">Rating</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mb-10 justify-center sm:justify-start">
      <RouterLink
        to="/bookings"
        class="bg-secondary/10 text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/20 transition-colors"
      >
        My bookings
      </RouterLink>
      <RouterLink
        to="/wishlist"
        class="bg-secondary/10 text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/20 transition-colors"
      >
        Wishlists
      </RouterLink>
      <RouterLink
        to="/trips"
        class="bg-secondary/10 text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/20 transition-colors"
      >
        Trips
      </RouterLink>
    </div>

    <h2 class="text-xl font-bold mb-4">Account settings</h2>
    <div class="space-y-2">
      <a
        v-for="item in menuItems"
        :key="item.label"
        :href="item.href"
        class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
      >
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
          <component :is="item.icon" class="w-5 h-5 text-gray-500" />
        </div>
        <div class="flex-1">
          <p class="font-medium">{{ item.label }}</p>
          <p class="text-sm text-gray-400">{{ item.description }}</p>
        </div>
        <ChevronRight class="w-5 h-5 text-gray-300" />
      </a>
    </div>
  </div>
</template>
