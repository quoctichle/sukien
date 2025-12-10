<template>
  <div>
    <div v-if="showLang" class="lang-wrap">
      <button :class="{ active: locale === 'vi' }" @click="switchLanguage('vi')">Tiếng Việt</button>
      <button :class="{ active: locale === 'en' }" @click="switchLanguage('en')">English</button>
    </div>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '~/composables/useTranslate'
const { locale, setLocale } = useTranslate()
const router = useRouter()
const route = useRoute()
import { computed } from 'vue'

// hide language buttons on certain pages (result and enter pages)
const showLang = computed(() => {
  const p = String(route.path || '')
  // hide on any route that includes '/result' or '/enter' (covers localized variants too)
  if (p.includes('/result') || p.includes('/enter')) return false
  return true
})

const switchLanguage = (lang: 'vi' | 'en') => {
  setLocale(lang)
  // Navigate to the language root (keeps behavior consistent)
  router.push(`/${lang}`)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.lang-wrap{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;gap:12px}
.lang-wrap button{padding:10px 22px;border-radius:28px;border:none;background:#fff;color:#333;cursor:pointer;box-shadow:0 10px 18px rgba(0,0,0,0.12);font-weight:700}
.lang-wrap button.active{background:#4caf50;color:#fff}

@media (max-width:600px){
  .lang-wrap{top:12px}
  .lang-wrap button{padding:8px 14px;font-size:14px}
}
</style>
