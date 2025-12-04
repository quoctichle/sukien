import { connectDB } from '~/server/utils/db'
import Code from '~/server/models/code'
import { requireAdmin } from '~/server/utils/protect'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  await connectDB()

  const codes = await Code.find().sort({ createdAt: -1 }).limit(1000)
  return { success: true, count: codes.length, codes }
})
