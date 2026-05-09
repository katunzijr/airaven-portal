<script setup lang="ts">
import { RouterLink } from 'vue-router'

const footerLinks = {
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'AirCover', href: '/aircover' },
    { label: 'Anti-discrimination', href: '/anti-discrimination' },
    { label: 'Disability support', href: '/accessibility' },
    { label: 'Cancellation options', href: '/cancellation' },
    { label: 'Report concern', href: '/report' },
  ],
  hosting: [
    { label: 'Become a Host', href: '/host' },
    { label: 'AirCover for Hosts', href: '/aircover-host' },
    { label: 'Hosting resources', href: '/resources' },
    { label: 'Community forum', href: '/community' },
    { label: 'Hosting responsibly', href: '/responsible-hosting' },
  ],
  company: [
    { label: 'Newsroom', href: '/newsroom' },
    { label: 'New features', href: '/features' },
    { label: 'Careers', href: '/careers' },
    { label: 'Investors', href: '/investors' },
    { label: 'Gift cards', href: '/gift-cards' },
  ],
}
</script>

<template>
  <footer class="bg-purple text-white mt-auto">
    <div class="max-w-[1760px] mx-auto px-6 lg:px-10 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
        <div>
          <RouterLink to="/" class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-md flex items-center justify-center">
              <img src="/airaven-logo.png" alt="Airaven Logo" width="32" height="32" />
            </div>
            <span class="text-lg font-extrabold">airaven</span>
          </RouterLink>
          <p class="text-sm text-white/50 leading-relaxed">
            Book unique homes, apartments, rooms, and experiences around the world.
          </p>
        </div>
        <div>
          <h3 class="text-sm font-bold mb-4 text-accent">Support</h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.support" :key="link.href">
              <RouterLink :to="link.href" class="text-sm text-white/50 hover:text-white transition-colors">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-bold mb-4 text-accent">Hosting</h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.hosting" :key="link.href">
              <RouterLink :to="link.href" class="text-sm text-white/50 hover:text-white transition-colors">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-bold mb-4 text-accent">Airaven</h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.company" :key="link.href">
              <RouterLink :to="link.href" class="text-sm text-white/50 hover:text-white transition-colors">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-between pt-6 gap-4">
        <div class="flex items-center gap-2 text-sm text-white/40">
          <span>&copy; {{ new Date().getFullYear() }} Airaven, Inc.</span>
          <span>·</span>
          <RouterLink to="/privacy" class="hover:text-white transition-colors">Privacy</RouterLink>
          <span>·</span>
          <RouterLink to="/terms" class="hover:text-white transition-colors">Terms</RouterLink>
          <span>·</span>
          <RouterLink to="/sitemap" class="hover:text-white transition-colors">Sitemap</RouterLink>
        </div>
        <div class="flex items-center gap-4 text-sm text-white/40">
          <span>English (US)</span>
          <span>TZS</span>
        </div>
      </div>
    </div>
  </footer>
</template>
