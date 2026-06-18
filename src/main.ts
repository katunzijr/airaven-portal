import { createApp } from 'vue'
import { clerkPlugin } from '@clerk/vue'
import '@fontsource-variable/geist/index.css'
import './assets/main.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim() ?? ''

if (publishableKey) {
  app.use(clerkPlugin, { publishableKey })
} else {
  console.warn(
    'VITE_CLERK_PUBLISHABLE_KEY is not set — the app will run without authentication.',
  )
}

app.use(router)
app.mount('#app')
