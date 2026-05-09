<script setup lang="ts">
import { Shield, DollarSign, Users, ArrowRight, Headphones } from 'lucide-vue-next'

const benefits = [
  {
    icon: DollarSign,
    title: 'Earn extra income',
    description:
      "Set your own prices, availability, and house rules. You're always in control.",
  },
  {
    icon: Shield,
    title: 'Host with confidence',
    description:
      'AirCover for Hosts provides TZS 2.6B damage protection and TZS 2.6B liability insurance.',
  },
  {
    icon: Users,
    title: 'Meet travelers',
    description: 'Connect with guests from around the world and share your local knowledge.',
  },
  {
    icon: Headphones,
    title: '24/7 support',
    description: 'Our dedicated support team is always available to help you and your guests.',
  },
]

const steps = [
  {
    step: '1',
    title: 'Tell us about your place',
    description:
      'Share basic info like location, how many guests can stay, and what makes your space special.',
  },
  {
    step: '2',
    title: 'Make it stand out',
    description:
      "Add photos, a title, and a description. We'll help you get set up from start to finish.",
  },
  {
    step: '3',
    title: 'Publish and earn',
    description:
      "Set a starting price, choose your settings, and publish your listing. You're ready to welcome guests.",
  },
]
</script>

<template>
  <div>
    <section class="relative bg-gradient-to-br from-primary via-primary-dark to-purple py-20 md:py-32 text-white overflow-hidden">
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Open your door to hosting</h1>
        <p class="text-xl text-white/60 max-w-2xl mx-auto mb-8">
          Join millions of hosts on Airaven and start earning by sharing your home, apartment, room, or unique space.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button type="button" class="bg-accent text-primary font-bold px-8 py-4 rounded-lg text-lg hover:bg-accent-dark transition-colors">
            Get started
          </button>
          <button
            type="button"
            class="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/10 transition-colors"
          >
            Learn more
          </button>
        </div>
      </div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/3" />
    </section>

    <section class="max-w-4xl mx-auto px-6 -mt-12 relative z-20 mb-16">
      <div class="bg-white rounded-lg shadow-xl border border-gray-100 p-8 text-center">
        <h2 class="text-2xl font-bold mb-2">See how much you could earn</h2>
        <p class="text-gray-400 mb-6">Estimated earnings for a property in your area</p>
        <div class="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          <div>
            <p class="text-3xl font-bold text-primary">TZS 3,120,000</p>
            <p class="text-sm text-gray-400">per month</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-secondary">7</p>
            <p class="text-sm text-gray-400">nights avg.</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-accent-dark">TZS 37,440,000</p>
            <p class="text-sm text-gray-400">per year</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-[1760px] mx-auto px-6 lg:px-10 mb-16">
      <h2 class="text-2xl font-bold text-center mb-10">Why host on Airaven?</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="benefit in benefits"
          :key="benefit.title"
          class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
            <component :is="benefit.icon" class="w-6 h-6 text-secondary" />
          </div>
          <h3 class="font-semibold text-lg mb-2">{{ benefit.title }}</h3>
          <p class="text-sm text-gray-400">{{ benefit.description }}</p>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-16 mb-16">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-center mb-10">List your space in 3 easy steps</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="s in steps" :key="s.step" class="text-center">
            <div class="w-14 h-14 bg-primary text-white rounded-lg flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {{ s.step }}
            </div>
            <h3 class="font-semibold text-lg mb-2">{{ s.title }}</h3>
            <p class="text-sm text-gray-400">{{ s.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-6 mb-16 text-center">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p class="text-4xl font-bold text-primary">4M+</p>
          <p class="text-sm text-gray-400 mt-1">Active hosts</p>
        </div>
        <div>
          <p class="text-4xl font-bold text-primary">190+</p>
          <p class="text-sm text-gray-400 mt-1">Countries</p>
        </div>
        <div>
          <p class="text-4xl font-bold text-primary">1.5B+</p>
          <p class="text-sm text-gray-400 mt-1">Guest arrivals</p>
        </div>
        <div>
          <p class="text-4xl font-bold text-primary">TZS 470T+</p>
          <p class="text-sm text-gray-400 mt-1">Host earnings</p>
        </div>
      </div>
    </section>

    <section class="max-w-[1760px] mx-auto px-6 lg:px-10 pb-16">
      <div class="bg-primary text-white rounded-lg p-10 md:p-16 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Airaven it?</h2>
        <p class="text-white/60 max-w-xl mx-auto mb-8">
          Start your hosting journey today and join a global community of hosts.
        </p>
        <button
          type="button"
          class="bg-accent text-primary hover:bg-accent-dark font-bold px-10 py-4 rounded-lg text-lg transition-colors inline-flex items-center gap-2"
        >
          Start hosting <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </section>
  </div>
</template>
