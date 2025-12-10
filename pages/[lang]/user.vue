<template>
  <Fireworks />
  <Sakura />
  <div class="user-page">
    <div class="overlay"></div>
    <div class="lang-toggle">
      <button :class="{ active: locale.value === 'vi' }" @click="setLocale('vi')">Tiếng Việt</button>
      <button :class="{ active: locale.value === 'en' }" @click="setLocale('en')">English</button>
    </div>

    <main class="form-wrap">
      <form class="entry-card" @submit.prevent="submitForm">
        <h2 class="title">{{ t('landingTitle') }}</h2>

        <label> <span> Tên Facebook:</span>
          <input v-model="form.name" placeholder="Nhập tên Facebook của bạn" required />
        </label>

        <label> <span> ID khách hàng:</span>
          <input v-model="form.customerId" placeholder="Nhập ID khách hàng" />
        </label>

        <label> <span> Email:</span>
          <input v-model="form.email" type="email" placeholder="Nhập email của bạn" />
        </label>

        <label> <span> Mã tham dự:</span>
          <input v-model="form.code" placeholder="Nhập mã tham dự" />
        </label>

        <button class="submit-btn">TIẾP TỤC</button>
        <div v-if="errorMsg" class="error-box">{{ errorMsg }}</div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'user'
})

const router = useRouter()
const route = useRoute()
const { locale, setLocale, t } = useTranslate()
const form = reactive({ name: '', customerId: '', email: '', code: '' })
const errorMsg = ref('')

onMounted(() => {
  const lang = route.params.lang as string
  if (lang === 'vi' || lang === 'en') {
    setLocale(lang)
  }
})

const submitForm = async () => {
  errorMsg.value = ''
  if (!form.name || !form.customerId || !form.code) {
    errorMsg.value = 'Vui lòng điền đầy đủ Tên Facebook, ID khách hàng và Mã tham dự'
    return
  }

  try {
    await $fetch('/api/code/validate', { method: 'POST', body: { code: form.code } })
    await router.push({ path: '/enter', query: { name: form.name, customerId: form.customerId, code: form.code.toUpperCase() } })
  } catch (e: any) {
    errorMsg.value = e?.statusMessage || e?.data?.message || 'Sai mã tham dự'
  }
}
</script>

<style scoped>
:root{--card-bg: rgba(46,117,55,0.95);}
.user-page{min-height:100vh;background-image:url('/background.png');background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center;position:relative;padding:24px}
.overlay{position:absolute;inset:0;background:rgba(0,0,0,0.35)}
.lang-toggle{position:absolute;top:18px;left:50%;transform:translateX(-50%);z-index:3;display:flex;gap:10px}
.lang-toggle button{padding:8px 14px;border-radius:20px;border:none;background:#fff;color:#333;cursor:pointer}
.lang-toggle button.active{background:#4caf50;color:#fff}
.form-wrap{z-index:2;width:100%;max-width:640px;padding:20px;display:flex;justify-content:center}
.entry-card{width:100%;background:var(--card-bg);padding:26px;border-radius:16px;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,0.4);display:flex;flex-direction:column;gap:12px}
.title{
  text-align:center;
  margin:0 0 6px;
  font-size:28px;
  font-weight:700;
  background: linear-gradient(90deg, #f9ecae, #e8b35c, #f8eba8, #e8b35c, #f9ecae);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

}
.entry-card label{display:flex;flex-direction:column;gap:6px;color:#fff}
.entry-card span{font-weight:600;background:transparent;padding-bottom:4px}
.entry-card input{padding:12px;border-radius:8px;border:0;background:rgba(255,255,255,0.95);color:#333}
.submit-btn{margin-top:8px;padding:12px;background:#cfcfcf;color:#333;border-radius:8px;border:none;cursor:pointer;font-weight:700}
.error-box{margin-top:12px;background:#ffdede;color:#c62828;padding:10px;border-radius:8px;font-weight:700;text-align:center}

@media(max-width:600px){
  .entry-card{padding:18px;border-radius:12px}
  .title{font-size:18px}
  .form-wrap{padding:10px}
}
</style>
