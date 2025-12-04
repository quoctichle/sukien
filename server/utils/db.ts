import mongoose from 'mongoose'
import path from 'path'

// Ensure environment variables from .env.local are loaded when running Nuxt dev
if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
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
  if (maybeConfig?.mongodbUri) {
    mongodbUri = maybeConfig.mongodbUri || mongodbUri
  }
} catch (e) {
  // ignore if helper not available
}

// Fallback to localhost for development
mongodbUri = mongodbUri || 'mongodb://localhost:27017/nuxt-app'

// Log connection info (safe version without password)
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
    console.warn('⚠️  Warning: MONGODB_URI not set in environment; using localhost')
  }
}

// Safe log for checking connection
try {
  if (mongodbUri) {
    const safe = mongodbUri.includes('mongodb+srv') 
      ? mongodbUri.replace(/:[^:@]*@/, ':***@')
      : mongodbUri
    console.log('📦 MongoDB URI configured:', safe.substring(0, 50) + '...')
  }
} catch (e) {
  // ignore
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
    if (!mongodbUri) {
      throw new Error('MONGODB_URI is not configured. Please set MONGODB_URI environment variable.')
    }

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    }

    cached.mongoose.promise = mongoose
      .connect(mongodbUri, opts)
      .then(mongoose => {
        console.log('✅ MongoDB connected successfully')
        return mongoose
      })
      .catch(error => {
        console.error('❌ MongoDB connection error:', error.message)
        throw new Error(`MongoDB connection failed: ${error.message}`)
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
