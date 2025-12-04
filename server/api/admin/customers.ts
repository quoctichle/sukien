import { connectDB } from '~/server/utils/db'
import Prediction from '~/server/models/prediction'
import { verifyToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    await connectDB()

    // Get all predictions with customer info
    const predictions = await Prediction.find({})
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      data: predictions,
      total: predictions.length
    }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Có lỗi xảy ra'
    })
  }
})
