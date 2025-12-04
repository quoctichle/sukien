import { requireAuth } from '~/server/utils/protect'

export default defineEventHandler((event) => {
  const auth = requireAuth(event)

  return {
    success: true,
    message: 'Authenticated',
    user: auth
  }
})
