import { connectDB } from '~/server/utils/db'
import User from '~/server/models/user'
import { generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()

    const body = await readBody(event)
    const { email, password, language = 'vi' } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError({
        statusCode: 403,
        statusMessage: 'User account is inactive'
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Update user language if provided
    if (language && ['vi', 'en'].includes(language)) {
      user.language = language
      await user.save()
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      language: user.language
    })

    return {
      success: true,
      message: 'Login successful',
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
    throw error
  }
})
