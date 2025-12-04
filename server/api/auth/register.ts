import { connectDB } from '~/server/utils/db'
import User from '~/server/models/user'
import { generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()

    const body = await readBody(event)
    const { email, password, name, language = 'vi' } = body

    if (!email || !password || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password and name are required'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already registered'
      })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      language,
      role: 'user'
    })

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      language: user.language
    })

    return {
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already exists'
      })
    }
    throw error
  }
})
