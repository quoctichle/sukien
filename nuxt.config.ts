// https://nuxt.com/docs/api/configuration/nuxt-config
import { config as loadEnv } from 'dotenv'
import { resolve } from 'path'

// Load .env.local if present so runtimeConfig picks up values during dev
loadEnv({ path: resolve(process.cwd(), '.env.local') })

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  },
  devServer: {
    port: 3000
  }
})
