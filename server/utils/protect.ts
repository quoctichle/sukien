import { H3Event } from 'h3'

export function requireAuth(event: H3Event) {
  if (!event.context.auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login'
    })
  }
  return event.context.auth
}

export function requireAdmin(event: H3Event) {
  const auth = requireAuth(event)
  if (auth.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required'
    })
  }
  return auth
}

export function requireUser(event: H3Event) {
  const auth = requireAuth(event)
  if (auth.role !== 'user') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - User access required'
    })
  }
  return auth
}
