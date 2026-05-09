/**
 * Vue + Vite (SPA) production via PM2:
 * 1. On deploy: `npm ci && npm run build` — produces `dist/` and bakes `VITE_*` env at build time.
 * 2. `npm start` runs `vite preview`, which serves `dist/` (not the dev server).
 * Prefer nginx serving `dist/` directly when you can; PM2 + preview is fine behind your existing proxy.
 */
module.exports = {
  apps: [
    {
      name: "airaven-portal",
      script: "npm",
      args: "start",
      cwd: "/var/apps/airaven-portal",
      instances: 1,
      exec_mode: "fork",
      interpreter: "none",

      // Logging
      output: "/var/apps/airaven-portal/logs/out.log",
      error: "/var/apps/airaven-portal/logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      env: {
        NODE_ENV: "production",
        TZ: "Africa/Dar_es_Salaam",
      },
      max_restarts: 10, // prevents infinite restart loops if the app crashes quickly in a short time

      // Memory management
      max_memory_restart: '1G', // protecting against memory leaks
      
      // Monitoring
      watch: false, // Set to true for development
      ignore_watch: [
        'node_modules',
        'logs',
        '*.log'
      ],
      
      // Advanced process management
      kill_timeout: 5000, // Time to wait before forcefully killing the app
      listen_timeout: 3000, // Time to wait for the app to start listening on a port
      
      // Environment variables from file
      env_file: '.env'
    }
  ]
}
