import { connectDB } from '~/server/utils/db'
import Code from '~/server/models/code'
import Prediction from '~/server/models/prediction'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = (body.code || '').toString().toUpperCase().trim()
  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Mã tham dự không được để trống' })
  }

  await connectDB()

  const doc = await Code.findOne({ code })
  if (!doc) {
    throw createError({ statusCode: 400, statusMessage: 'Sai mã tham dự' })
  }

  // Check if code has been used - if yes, return the existing prediction data
  const existingPrediction = await Prediction.findOne({ code })
  
  return { 
    success: true, 
    code: doc,
    alreadyUsed: !!existingPrediction,
    existingData: existingPrediction || null
  }
})
