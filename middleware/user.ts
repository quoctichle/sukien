export default defineRouteMiddleware(async (to, from) => {
  const token = useCookie('auth_token')

  if (!token.value) {
    return navigateTo('/login')
  }

  try {
    const response = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (response.user.role === 'admin') {
      return navigateTo('/admin')
    }
  } catch (error) {
    return navigateTo('/login')
  }
})
