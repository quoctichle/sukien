import { connectDB } from '~/server/utils/db'
import User from '~/server/models/user'

export default defineEventHandler(async (event) => {
  // Security: Only allow this in development or with a secret key
  const query = getQuery(event)
  const secret = query.secret
  if (secret !== 'seed-admin-secret-key') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  try {
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sunshine.com' })
    if (existingAdmin) {
      return {
        success: false,
        message: 'Admin account already exists'
      }
    }

    // Create admin account
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@sunshine.com',
      password: 'sunshinetelecom',
      role: 'admin',
      language: 'vi',
      isActive: true
    })

    await adminUser.save()

    return {
      success: true,
      message: 'Admin account created successfully',
      user: {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role
      }
    }
  } catch (error: any) {
    console.error('Seed error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create admin account'
    })
  }
})
