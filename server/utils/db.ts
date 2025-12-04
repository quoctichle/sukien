import mongoose from 'mongoose'
import path from 'path'

// Ensure environment variables from .env.local are loaded when running Nuxt dev
if (!process.env.MONGODB_URI) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv')
    const envPath = path.resolve(process.cwd(), '.env.local')
    dotenv.config({ path: envPath })
  } catch (e) {
    // ignore if dotenv not available
  }
}

let mongodbUri = process.env.MONGODB_URI || process.env.DATABASE_URL || ''

// If Nuxt runtime config is available, prefer that value
try {
  // useRuntimeConfig is available in Nuxt server runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maybeConfig: any = typeof useRuntimeConfig !== 'undefined' ? useRuntimeConfig() : null
  if (maybeConfig && maybeConfig.mongodbUri) {
    mongodbUri = mongodbUri || maybeConfig.mongodbUri
  }
} catch (e) {
  // ignore if helper not available
}

mongodbUri = mongodbUri || 'mongodb://localhost:27017/nuxt-app'

if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
  console.warn('Warning: MONGODB_URI not set in environment; using', mongodbUri)
} else {
  try {
    const safe = mongodbUri.startsWith('mongodb+srv') ? 'mongodb+srv://<cluster>' : mongodbUri
    console.log('Using MongoDB URI:', safe)
  } catch (e) {
    // ignore
  }
}

let cached = global as any

if (!cached.mongoose) {
  cached.mongoose = {
    conn: null,
    promise: null
  }
}

export async function connectDB() {
  if (cached.mongoose.conn) {
    return cached.mongoose.conn
  }

  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.mongoose.promise = mongoose
      .connect(mongodbUri, opts)
      .then(mongoose => {
        console.log('MongoDB connected successfully')
        return mongoose
      })
      .catch(error => {
        console.error('MongoDB connection error:', error)
        throw error
      })
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise
  } catch (e) {
    cached.mongoose.promise = null
    throw e
  }

  return cached.mongoose.conn
}
