import { connectDB } from '~/server/utils/db'
import Prediction from '~/server/models/prediction'
import { verifyToken } from '~/server/utils/auth'
import ExcelJS from 'exceljs'

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

    // Get all predictions
    const predictions = await Prediction.find({}).sort({ createdAt: -1 }).lean()

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Khách hàng')

    // Add headers
    worksheet.columns = [
      { header: 'Tên Facebook', key: 'name', width: 20 },
      { header: 'ID khách hàng', key: 'customerId', width: 15 },
      { header: 'Mã tham dự', key: 'code', width: 12 },
      { header: 'Số dự đoán', key: 'predictionsCount', width: 12 },
      { header: 'Dự đoán', key: 'predictions', width: 40 },
      { header: 'Ngày tham gia', key: 'createdAt', width: 20 }
    ]

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    }
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

    // Add data rows
    predictions.forEach((pred: any) => {
      worksheet.addRow({
        name: pred.name,
        customerId: pred.customerId,
        code: pred.code,
        predictionsCount: pred.predictionsCount,
        predictions: pred.predictions.join('; '),
        createdAt: new Date(pred.createdAt).toLocaleString('vi-VN')
      })
    })

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer()

    // Set response headers
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    setHeader(event, 'Content-Disposition', `attachment; filename=customers-${new Date().toISOString().split('T')[0]}.xlsx`)

    return buffer
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Có lỗi xảy ra'
    })
  }
})
