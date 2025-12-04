<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-box">
        <h1>{{ t('register') }}</h1>
        
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>{{ t('name') }}</label>
            <input 
              v-model="formData.name" 
              type="text" 
              :placeholder="t('name')"
              required
            />
          </div>

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

          <div class="form-group">
            <label>{{ t('confirmPassword') }}</label>
            <input 
              v-model="formData.confirmPassword" 
              type="password" 
              :placeholder="t('confirmPassword')"
              required
            />
          </div>

          <button type="submit" class="register-btn" :disabled="loading">
            {{ loading ? t('loading') : t('register') }}
          </button>
        </form>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>

        <p class="login-link">
          {{ t('hello') }} 
          <a href="/login">{{ t('login') }}</a>
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

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  if (formData.password !== formData.confirmPassword) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  if (formData.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    loading.value = false
    return
  }

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        language: locale.value
      }
    })

    success.value = 'Registration successful! Redirecting to login...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err.data?.message || 'Registration failed'
    loading.value = false
  }
}

const changeLanguage = (event: any) => {
  setLocale(event.target.value)
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.register-box h1 {
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.register-btn:disabled {
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

.success-message {
  color: #388e3c;
  background: #e8f5e9;
  padding: 12px;
  border-radius: 5px;
  margin: 20px 0;
  font-size: 14px;
  border-left: 4px solid #388e3c;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.login-link a:hover {
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
