import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Airaven – Book Unique Stays & Experiences' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: 'Search Stays – Airaven' },
    },
    {
      path: '/host',
      name: 'host',
      component: () => import('@/views/HostView.vue'),
      meta: { title: 'Become a Host - Airaven' },
    },
    {
      path: '/trips',
      name: 'trips',
      component: () => import('@/views/TripsView.vue'),
      meta: { title: 'Trips & Experiences – Airaven' },
    },
    {
      path: '/trips/:id',
      name: 'trip-detail',
      component: () => import('@/views/TripDetailView.vue'),
      meta: { title: 'Experience – Airaven' },
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: () => import('@/views/BookingsView.vue'),
      meta: { title: 'My Bookings - Airaven' },
    },
    {
      path: '/booking/:id/confirmation',
      name: 'booking-confirmation',
      component: () => import('@/views/BookingConfirmationView.vue'),
      meta: { title: 'Booking Confirmed – Airaven' },
    },
    {
      path: '/booking/:id',
      name: 'booking',
      component: () => import('@/views/BookingView.vue'),
      meta: { title: 'Complete Your Booking – Airaven' },
    },
    {
      path: '/property/:id',
      name: 'property',
      component: () => import('@/views/PropertyDetailView.vue'),
      meta: { title: 'Property – Airaven' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: 'Profile - Airaven' },
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('@/views/WishlistView.vue'),
      meta: { title: 'Wishlists – Airaven' },
    },
  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) document.title = title
})

export default router
