export default defineNuxtRouteMiddleware(async (to, from) => {
  // Allow accessing the admin login page without redirecting
  if (to.path === '/admin/login') return

  const token = useCookie('auth_token')

  if (!token.value) {
    return navigateTo('/admin/login')
  }

  try {
    const response = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (response.user.role !== 'admin') {
      return navigateTo(`/${response.user.language}/user`)
    }
  } catch (error) {
    return navigateTo('/admin/login')
  }
})
