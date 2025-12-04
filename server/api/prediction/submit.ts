import { connectDB } from '~/server/utils/db'
import Code from '~/server/models/code'
import Prediction from '~/server/models/prediction'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, customerId, code, predictions } = body

  // Validate required fields
  if (!code || !predictions || !Array.isArray(predictions)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dữ liệu không hợp lệ'
    })
  }

  if (predictions.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vui lòng nhập ít nhất một dự đoán'
    })
  }

  await connectDB()

  try {
    const codeUpper = code.toString().toUpperCase().trim()

    // Verify code exists
    const codeDoc = await Code.findOne({ code: codeUpper })
    if (!codeDoc) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mã tham dự không hợp lệ'
      })
    }

    // Check if code has already been used
    const existingPrediction = await Prediction.findOne({ code: codeUpper })
    if (existingPrediction) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mã tham dự này đã được sử dụng'
      })
    }

    // Save prediction to database
    const newPrediction = new Prediction({
      code: codeUpper,
      name,
      customerId,
      predictions,
      predictionsCount: predictions.length
    })

    await newPrediction.save()

    // Mark code as used (optional, for legacy support)
    await Code.updateOne(
      { code: codeUpper },
      { used: true }
    )

    return {
      success: true,
      message: 'Dự đoán của bạn đã được ghi nhận',
      data: {
        id: newPrediction._id,
        name,
        customerId,
        code: codeUpper,
        predictionsCount: predictions.length
      }
    }
  } catch (e: any) {
    throw createError({
      statusCode: e.statusCode || 500,
      statusMessage: e.statusMessage || 'Có lỗi xảy ra'
    })
  }
})
