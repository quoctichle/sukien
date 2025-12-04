<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h1>{{ t('login') }}</h1>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>{{ t('email') }}</label>
            <input 
              v-model="formData.email" 
              type="email" 
              :placeholder="t('email')"
              required
            />
          </div>

          <div class="form-group">
            <label>{{ t('password') }}</label>
            <input 
              v-model="formData.password" 
              type="password" 
              :placeholder="t('password')"
              required
            />
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? t('loading') : t('login') }}
          </button>
        </form>

        <div v-if="error" class="error-message">{{ error }}</div>

        <p class="register-link">
          {{ t('hello') }} 
          <a href="/register">{{ t('register') }}</a>
        </p>

        <div class="language-selector">
          <select @change="changeLanguage" :value="locale">
            <option value="vi">{{ t('vietnamese') }}</option>
            <option value="en">{{ t('english') }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { t, locale, setLocale } = useTranslate()
const token = useCookie('auth_token')

const formData = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: formData.email,
        password: formData.password,
        language: locale.value
      }
    })

    token.value = response.token
    
    // Redirect based on role
    if (response.user.role === 'admin') {
      await router.push('/admin')
    } else {
      await router.push(`/${locale.value}/user`)
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Login failed'
    loading.value = false
  }
}

const changeLanguage = (event: any) => {
  setLocale(event.target.value)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.login-box h1 {
  color: #667eea;
  text-align: center;
  margin: 0 0 30px 0;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: bold;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 12px;
  border-radius: 5px;
  margin: 20px 0;
  font-size: 14px;
  border-left: 4px solid #d32f2f;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

.language-selector {
  margin-top: 20px;
}

.language-selector select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  background: white;
}
</style>
