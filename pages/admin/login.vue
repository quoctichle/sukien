<template>
  <div class="admin-login-page">
    <div class="login-box">
      <h1>Đăng nhập Admin</h1>
      <form @submit.prevent="handleAdminLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div class="form-group">
          <label>Mật khẩu</label>
          <input v-model="form.password" type="password" required />
        </div>
        <button class="login-btn">Đăng nhập</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const form = reactive({ email: '', password: '' })
const error = ref('')

const handleAdminLogin = async () => {
  error.value = ''
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: form.email, password: form.password, language: 'vi' }
    })

    useCookie('auth_token').value = res.token

    if (res.user.role !== 'admin') {
      error.value = 'Tài khoản không có quyền quản trị'
      return
    }

    await router.push('/admin')
  } catch (e: any) {
    error.value = e?.data?.message || 'Đăng nhập thất bại'
  }
}
</script>

<style scoped>
.admin-login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f2f6f2}
.login-box{width:100%;max-width:420px;background:white;padding:28px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.12)}
.login-box h1{text-align:center;margin:0 0 18px;color:#2e7d32}
.form-group{margin-bottom:12px}
.form-group label{display:block;margin-bottom:6px;font-weight:600}
.form-group input{width:100%;padding:10px;border-radius:6px;border:1px solid #ddd}
.login-btn{width:100%;padding:12px;background:#2e7d32;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700}
.error{margin-top:12px;color:#c62828;font-weight:700;text-align:center}
@media(max-width:480px){.login-box{padding:18px;margin:0 12px}}
</style>