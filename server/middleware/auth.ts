import { verifyToken, extractToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = extractToken(authHeader)

  if (!token) {
    event.context.auth = null
    return
  }

  const payload = verifyToken(token)
  event.context.auth = payload
})
