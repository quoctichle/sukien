import { connectDB } from '~/server/utils/db'
import User from '~/server/models/user'
import { requireAdmin } from '~/server/utils/protect'

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event)
    await connectDB()

    const users = await User.find().select('-password')

    return {
      success: true,
      count: users.length,
      users
    }
  } catch (error) {
    throw error
  }
})
