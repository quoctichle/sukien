import { connectDB } from '~/server/utils/db'
import Code from '~/server/models/code'
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

    // Get all codes
    const codes = await Code.find({}).lean()

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Mã tham dự')

    // Add headers
    worksheet.columns = [
      { header: 'Mã', key: 'code', width: 15 },
      { header: 'Loại', key: 'type', width: 10 },
      { header: 'Đã sử dụng', key: 'used', width: 12 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 }
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
    codes.forEach((code: any) => {
      worksheet.addRow({
        code: code.code,
        type: code.type === 'X' ? 'Khác' : code.type,
        used: code.used ? 'Có' : 'Chưa',
        createdAt: new Date(code.createdAt).toLocaleString('vi-VN')
      })
    })

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer()

    // Set response headers
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    setHeader(event, 'Content-Disposition', `attachment; filename=codes-${new Date().toISOString().split('T')[0]}.xlsx`)

    return buffer
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Có lỗi xảy ra'
    })
  }
})
