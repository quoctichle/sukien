<template>
  <Fireworks />
  <Sakura />
  <div class="landing-root">
    <div class="lang-wrap">
      <button :class="{ active: locale === 'vi' }" @click="switchLanguage('vi')">Tiếng Việt</button>
      <button :class="{ active: locale === 'en' }" @click="switchLanguage('en')">English</button>
    </div>

    <h1 class="landing-title">{{ t('landingTitle') }}</h1>

    <div class="card-wrap">
      <form class="card" @submit.prevent="submitForm">
        <div class="row">
          <div class="label">{{ t('fbNameLabel') }}:</div>
          <input v-model="form.name" :placeholder="t('fbNamePlaceholder')" required />
        </div>

        <div class="row">
          <div class="label">{{ t('customerIdLabel') }}:</div>
          <input v-model="form.customerId" :placeholder="t('customerIdPlaceholder')" />
        </div>

        <div class="row">
          <div class="label">{{ t('promoCodeLabel') }}:</div>
          <input v-model="form.code" :placeholder="t('promoCodePlaceholder')" />
        </div>

        <button class="submit-btn">{{ t('continue') }}</button>
        <div v-if="errorMsg" class="error-box">{{ errorMsg }}</div>
      </form>
    </div>

    <div class="footer-text">GRAB YOUR GOLD NOW!</div>
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '~/composables/useTranslate'
const { t, setLocale, locale } = useTranslate()
const router = useRouter()
const form = reactive({ name: '', customerId: '', code: '' })

const errorMsg = ref('')

// Set language to English
onMounted(() => {
  setLocale('en')
})

const switchLanguage = (lang: 'vi' | 'en') => {
  setLocale(lang)
  router.push(`/${lang}`)
}

const submitForm = async () => {
  errorMsg.value = ''

  // Client-side required fields
  if (!form.name || !form.customerId || !form.code) {
    errorMsg.value = 'Please fill in all required fields'
    return
  }

  try {
    const result = await $fetch('/api/code/validate', {
      method: 'POST',
      body: { code: form.code }
    })

    // Check if code has already been used
    if (result.alreadyUsed && result.existingData) {
      // Redirect to result page with existing prediction data
      const predictions = result.existingData.predictions.join(',')
      await router.push({ 
        path: '/result', 
        query: { 
          name: result.existingData.name, 
          customerId: result.existingData.customerId, 
          code: result.existingData.code,
          predictions
        } 
      })
    } else {
      // Code not used yet, proceed to enter predictions page
      await router.push({ path: '/enter', query: { name: form.name, customerId: form.customerId, code: form.code.toUpperCase() } })
    }
  } catch (e: any) {
    console.error('Validation failed', e)
    errorMsg.value = e?.statusMessage || e?.data?.message || 'Invalid promo code'
  }
}
</script>

<style scoped>
@font-face{font-family:'FS MAGISTRAL';src:url('/font/FS_MAGISTRAL-BOLD.ttf') format('truetype');font-weight:700;font-style:normal;font-display:swap}
:root{--card-radius:18px}
*{box-sizing:border-box}

.landing-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px 20px;
  font-family: 'FS MAGISTRAL', Arial, Helvetica, sans-serif;
  background-image: url('/background.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  gap: 24px;
}

.landing-title {
  z-index: 3;
  font-weight: 900;
  text-align: center;
  font-family: 'FS MAGISTRAL', Arial, Helvetica, sans-serif;
  white-space: nowrap;
  font-size: clamp(40px, 6.5vw, 64px);
  letter-spacing: 0.8px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto 12px auto;
  line-height: 1.4;
  background: linear-gradient(135deg, #f9ecae 0%, #e8b35c 25%, #f8eba8 50%, #e8b35c 75%, #f9ecae 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3)) drop-shadow(0 4px 4px rgba(0,0,0,0.3)) drop-shadow(0 8px 8px rgba(0,0,0,0.4)) drop-shadow(0 12px 16px rgba(0,0,0,0.5));
}

.card-wrap {
  z-index: 3;
  width: 100%;
  display: flex;
  justify-content: center;
  max-width: 100%;
  padding: 0 4px;
}

.card {
  background: linear-gradient(90deg, #2e7b2a 0%, #53b33a 50%, #8bd84f 100%);
  padding: 36px 48px;
  border-radius: 28px;
  border: 6px solid rgba(255,255,255,0.12);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 26px 60px rgba(0,0,0,0.45);
  width: 100%;
  max-width: 900px;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 14px;
  align-items: center;
  background: rgba(255,255,255,0.98);
  padding: 14px 18px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

.label {
  color: #222;
  padding: 0;
  border-radius: 0;
  font-weight: 800;
  background: transparent;
  text-align: left;
  line-height: 1.2;
  font-size: 16px;
  white-space: nowrap;
  flex-shrink: 0;
}

.row input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 0;
  background: transparent;
  color: #333;
  box-shadow: none;
  height: 36px;
  font-size: 16px;
  line-height: 1.2;
}

.row input::placeholder {
  color: #999;
}

.submit-btn {
  align-self: center;
  margin-top: 8px;
  padding: 14px 48px;
  border-radius: 20px;
  border: 4px solid #f5a623;
  background: linear-gradient(135deg, #ff8c00 0%, #ff9e1a 100%);
  color: #fff;
  font-family: 'FS MAGISTRAL', Arial, Helvetica, sans-serif;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 10px 30px rgba(255,140,0,0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(255,140,0,0.45);
}

.error-box {
  margin-top: 12px;
  background: #ffdede;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  text-align: center;
}

.footer-text {
  font-weight: 900;
  font-size: 38px;
  letter-spacing: 1px;
  z-index: 3;
  margin-top: 12px;
  background: linear-gradient(135deg, #f9ecae 0%, #e8b35c 25%, #f8eba8 50%, #e8b35c 75%, #f9ecae 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3)) drop-shadow(0 4px 4px rgba(0,0,0,0.3)) drop-shadow(0 8px 8px rgba(0,0,0,0.4)) drop-shadow(0 12px 16px rgba(0,0,0,0.5));
}

@media (max-width: 900px) {
  .landing-title {
    font-size: 32px;
  }
  
  .landing-root {
    padding: 24px 16px;
  }
  
  .card-wrap {
    padding: 0;
    width: 100%;
  }
  
  .card {
    max-width: none;
    width: calc(100% - 16px);
    padding: 24px 20px;
    border-radius: 20px;
    gap: 14px;
  }
  
  .row {
    flex-direction: row;
    gap: 12px;
    padding: 12px 14px;
    align-items: center;
  }
  
  .label {
    font-size: 14px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .row input {
    padding: 10px 12px;
    height: 36px;
    font-size: 14px;
  }
  
  .submit-btn {
    padding: 12px 36px;
    font-size: 16px;
  }
  
  .footer-text {
    font-size: 28px;
  }
}

@media (max-width: 600px) {
  .landing-title {
    font-size: 24px;
  }
  
  .landing-root {
    padding: 20px 12px;
    gap: 18px;
  }
  
  .card {
    padding: 18px 14px;
    gap: 12px;
    border-radius: 16px;
  }
  
  .row {
    padding: 10px 12px;
    gap: 10px;
  }
  
  .label {
    font-size: 13px;
  }
  
  .row input {
    padding: 8px 10px;
    height: 32px;
    font-size: 13px;
  }
  
  .submit-btn {
    padding: 10px 28px;
    font-size: 14px;
  }
  
  .footer-text {
    font-size: 20px;
  }
}
</style>
