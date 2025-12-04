import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    return {
      status: 'success',
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
})
