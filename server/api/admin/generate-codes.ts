import { connectDB } from '~/server/utils/db'
import Code from '~/server/models/code'
import { requireAdmin } from '~/server/utils/protect'

function randomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return chars.charAt(Math.floor(Math.random() * chars.length))
}

function generateCode(prefix: string) {
  // total length 6: prefix + 5 alnum
  let s = prefix
  while (s.length < 6) s += randomChar()
  return s
}

export default defineEventHandler(async (event) => {
  // Require admin auth
  requireAdmin(event)

  const body = await readBody(event)
  const { category, count = 50 } = body

  const allowed = ['V', 'B', 'D', 'X']
  if (!allowed.includes(category)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid category' })
  }

  await connectDB()

  const created: string[] = []
  const maxAttempts = count * 20

  let attempts = 0
  while (created.length < count && attempts < maxAttempts) {
    attempts++
    let prefix = category
    if (category === 'X') {
      // choose first char not V/B/D
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let c = chars.charAt(Math.floor(Math.random() * chars.length))
      while (['V', 'B', 'D'].includes(c)) c = chars.charAt(Math.floor(Math.random() * chars.length))
      prefix = c
    }

    const code = generateCode(prefix).toUpperCase()
    try {
      const doc = new Code({ code, type: category === 'X' ? 'X' : category })
      await doc.save()
      created.push(code)
    } catch (e: any) {
      // duplicate key or other error - skip and continue
      if (e && e.code === 11000) continue
      console.error('Error saving code', e)
    }
  }

  return { success: true, created }
})
