<template>
  <Fireworks />
  <Sakura />
  <div class="landing-root">
    <div class="overlay"></div>

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
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '~/composables/useTranslate'
const { t, locale, setLocale } = useTranslate()
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
.landing-root{min-height:100vh;background-image:url('/background.png');background-size:cover;background-position:center;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;padding:40px;font-family:'FS MAGISTRAL', Arial, Helvetica, sans-serif}
.overlay{position:absolute;inset:0;background:rgba(0,0,0,0.28);backdrop-filter: blur(1px);z-index:0}
.lang-wrap{position:absolute;top:26px;left:50%;transform:translateX(-50%);z-index:4;display:flex;gap:12px}
.lang-wrap button{padding:10px 22px;border-radius:28px;border:none;background:#fff;color:#333;cursor:pointer;box-shadow:0 10px 18px rgba(0,0,0,0.12);font-weight:700}
.lang-wrap button.active{background:#4caf50;color:#fff}
.landing-title{
  z-index: 3;
  font-weight: 900;
  text-align: center;
  font-family: 'FS MAGISTRAL', Arial, Helvetica, sans-serif;
  /* keep on one line but avoid clipping; allow font to scale down */
  white-space: nowrap;
  font-size: clamp(32px, 5.5vw, 56px);
  letter-spacing: 0.8px;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 24px auto;
  line-height: 1.4; /* allow descenders to show */
  background: linear-gradient(135deg, #f9ecae, #e8b35c, #f8eba8, #e8b35c, #f9ecae);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

}
.card-wrap{z-index:3;width:100%;display:flex;justify-content:center;max-width:100%;padding:0 4px}
.card{background:linear-gradient(180deg,#4aa25a,#3e8a42);padding:32px 50px;border-radius:var(--card-radius);-webkit-border-radius:var(--card-radius);-moz-border-radius:var(--card-radius);color:#fff;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 60px rgba(0,0,0,0.6);overflow:hidden;background-clip:padding-box;width:100%;max-width:760px}
.card{border-radius:18px !important}
.row{display:flex;flex-direction:row;gap:14px;align-items:center;background:rgba(255,255,255,0.98);padding:12px 16px;border-radius:24px}
.label{color:#1f6b2e;padding:0;border-radius:0;font-weight:700;background:transparent;text-align:left;line-height:1.2;font-size:16px;white-space:nowrap;flex-shrink:0}
.row input{flex:1;padding:10px 16px;border-radius:18px;border:0;background:transparent;color:#999;box-shadow:none;height:36px;font-size:15px;line-height:1.2}
.submit-btn{align-self:center;margin-top:10px;padding:10px 40px;border-radius:18px;border:none;background:#d6d6d6;color:#222;font-weight:900;cursor:pointer;letter-spacing:1px}
.submit-btn:hover{transform:translateY(-2px)}
 .error-box{margin-top:12px;background:#ffdede;color:#c62828;padding:10px;border-radius:8px;font-weight:700;text-align:center}

@media (max-width:900px){
  .landing-title{font-size:28px}
  .landing-root{padding:20px 0}
  .card-wrap{padding:0 8px;width:100%}
  .card{max-width:none;width:calc(100% - 16px);padding:22px 12px;border-radius:18px}
  .row{flex-direction:row;gap:12px;padding:12px 12px;align-items:center}
  .label{padding:0;font-size:15px;white-space:nowrap;flex-shrink:0}
  .row input{padding:12px 14px;height:40px;font-size:15px}
  .submit-btn{padding:12px 40px}
}
</style>
