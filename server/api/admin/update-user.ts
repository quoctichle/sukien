import { connectDB } from '~/server/utils/db'
import User from '~/server/models/user'
import { requireAdmin } from '~/server/utils/protect'

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event)
    await connectDB()

    const body = await readBody(event)
    const { userId, role, isActive } = body

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    if (role && ['user', 'admin'].includes(role)) {
      user.role = role
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive
    }

    await user.save()

    return {
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    }
  } catch (error) {
    throw error
  }
})
