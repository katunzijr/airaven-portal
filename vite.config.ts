import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Required when nginx (or any proxy) forwards Host: airaven.co.tz to `vite preview`.
  preview: {
    allowedHosts: ['airaven.co.tz'],
  },

  // Same guard on `vite dev` if you open the site via that hostname through a proxy.
  server: {
    allowedHosts: ['airaven.co.tz'],
  },
})
