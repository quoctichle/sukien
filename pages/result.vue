<template>
  <Fireworks />
  <div class="result-page">
    <!-- title removed as requested -->

    <!-- Green card with info -->
    <div class="card">
      <div v-if="success" class="success-container">
        <div class="info-section">
          <div class="info-row"><strong>{{ t('fbNameLabel') }}:</strong> {{ name }}</div>
          <div class="info-row"><strong>{{ t('customerIdLabel') }}:</strong> {{ customerId }}</div>
          <div class="info-row"><strong>{{ t('promoCodeLabel') }}:</strong> {{ code }}</div>
        </div>

        <!-- Share Guide Section -->
        <div class="share-guide-section">
          <h3 class="share-title">{{ t('shareGuideTitle') }}</h3>
          <p class="share-subtitle">{{ t('shareGuideSubtitle') }}</p>

          <div class="steps-container">
            <!-- Step 1 -->
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <p class="step-text">{{ t('shareStep1') }}</p>
                <div class="share-frame">
                  <a :href="facebookLink" target="_blank" class="share-frame-link" aria-label="Open share post">
                    <img :src="shareImage" alt="Share" class="share-frame-image" />
                    <div class="share-overlay">
                      <span class="overlay-text">{{ t('shareStep1Action') }}</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <p class="step-text">{{ t('shareStep2Action') }}</p>
                <div class="fb-modal">
                  <div class="fb-row highlight">
                    <div class="fb-icon">🌐</div>
                    <div class="fb-text">
                      <div class="fb-title">{{ t('public') }}</div>
                      <div class="fb-desc">{{ t('publicDesc') }}</div>
                    </div>
                    <div class="fb-radio">●</div>
                  </div>

                  <div class="fb-row">
                    <div class="fb-icon">👥</div>
                    <div class="fb-text">
                      <div class="fb-title">{{ t('friends') }}</div>
                      <div class="fb-desc">{{ t('friendsDesc') }}</div>
                    </div>
                    <div class="fb-radio">○</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="error-container">
        <div class="error-icon">✗</div>
        <h2>{{ t('predictionError') }}</h2>
        <p class="error-message">{{ errorMsg }}</p>
      </div>
    </div>

    <!-- footer removed as requested -->
  </div>
</template>

<script setup lang="ts">
import Fireworks from '~/components/Fireworks.vue'
import { useTranslate } from '~/composables/useTranslate'
import { ref, onMounted, computed } from 'vue'

const { t, setLocale, locale } = useTranslate()
const route = useRoute()

const name = route.query.name || ''
const customerId = route.query.customerId || ''
const code = route.query.code || ''
const success = ref(true)
const errorMsg = ref('')
const facebookLink = computed(() => {
  return locale.value === 'vi'
    ? 'https://www.facebook.com/share/p/1Cu46HgP8o/'
    : 'https://www.facebook.com/share/p/1Wa8skVokp/'
})

const shareImage = computed(() => {
  return locale.value === 'vi' ? '/imgviet.png' : '/imganh.png'
})

onMounted(() => {
  const lang = (route.params as any)?.lang || route.query.lang
  if (lang === 'vi' || lang === 'en') {
    setLocale(lang as 'vi' | 'en')
  }
})
</script>

<style scoped>
/* language buttons are conditionally hidden in `app.vue` for this page */

/* Overall page: red festive background like design */
.result-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px;
  position: relative;
  width: 100%;
  overflow-x: hidden;
  background: radial-gradient(circle at 10% 20%, rgba(255,200,80,0.03), transparent 8%),
              radial-gradient(circle at 90% 80%, rgba(255,200,80,0.02), transparent 8%),
              linear-gradient(180deg, #6b0f0f 0%, #3e0505 100%);
  color: #fff;
  gap: 20px;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Gold title, big and decorative */
.page-title {
  color: #f2c04a;
  font-size: 46px;
  font-weight: 900;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 0 6px 18px rgba(0,0,0,0.6), 0 2px 0 rgba(0,0,0,0.25);
  order: -2;
  line-height: 1;
}

/* Center card: green with white rounded inner area like the mockup */
.card {
  background: linear-gradient(90deg, #2e7b2a 0%, #53b33a 50%, #8bd84f 100%);
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.38);
  width: min(760px, calc(100% - 80px));
  border: 6px solid rgba(255,255,255,0.12);
}

/* Make the info rows look like the white input boxes in the mockup */
.info-section {
  background: rgba(255,255,255,0.98);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 12px;
  text-align: left;
}

.info-row {
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  margin: 8px 0;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  font-size: 15px;
  color: #222;
}

.info-row strong { color: #222; font-weight: 800; margin-right: 8px; }

/* Share guide area: subtle white-transparent panel inside green card */
.share-guide-section {
  background: rgba(255,255,255,0.06);
  padding: 22px;
  border-radius: 12px;
}

.share-title { color: #fff; font-size: 22px; font-weight: 900; margin-bottom: 6px; }
.share-subtitle { color: rgba(255,255,255,0.92); font-size: 14px; margin-bottom: 14px; }

.steps-container { display:flex; flex-direction:column; gap:16px; }
.step { display:flex; gap:14px; align-items:flex-start; }
.step-number { background:#ffd05a; color:#7b3b00; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; }
.step-content { flex:1; display:flex; flex-direction:column; height:100%; }
.step-text { color: rgba(255,255,255,0.95); font-weight:800; font-size:15px; margin:0 0 8px 0; }

  /* Share frame - large left image with centered overlay; uses flex so it stretches to match right column */
  .share-frame { border-radius:14px; overflow:hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.18); width:100%; max-width:100%; background:#fff; display:flex; flex-direction:column; position:relative; height:100%; }
  .share-frame-link { display:block; flex:1 1 auto; }
  .share-frame-image { width:100%; height:100%; object-fit:cover; display:block; }
  .share-overlay { position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); pointer-events:none; display:flex; justify-content:center; }
  .overlay-text { display:inline-block; background: rgba(8,37,12,0.45); color: #fff; padding: 12px 28px; font-size:36px; font-weight:900; border-radius:10px; text-shadow: 0 6px 18px rgba(0,0,0,0.6); -webkit-text-stroke: 0.5px rgba(0,0,0,0.25); }

/* Facebook mock modal */
  /* Right-side share box styling: white card with yellow outline and rounded corners */
  .fb-modal { margin-top:6px; background: #fff; padding:14px; border-radius:12px; border: 4px solid #ffd05a; box-shadow: 0 10px 20px rgba(0,0,0,0.10); display:flex; flex-direction:column; height:100%; }
  .fb-row.highlight { border:2px solid #ffd05a; background:#fff; box-shadow:none; }
.fb-row { display:flex; align-items:center; gap:10px; padding:8px; border-radius:6px; }
.fb-row.highlight { border:2px solid #ffd05a; background:#fff; }
.fb-icon { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#f1f1f1; }
.fb-title { font-weight:900; color:#111; }
.fb-desc { color:#555; font-size:12px; }

/* Footer gold text */
.footer-text { color:#f2c04a; font-weight:900; font-size:36px; margin-top:20px; text-shadow: 0 6px 12px rgba(0,0,0,0.45); }

@media (min-width: 1000px) {
  .page-title { font-size: 56px; }
  .info-row { font-size: 18px; padding:14px 16px; }
  .footer-text { font-size: 44px; }
  .steps-container { flex-direction:row; gap:28px; align-items:flex-start; }
  .step { flex-direction:column; }
  /* Make step 1 (image) and step 2 (share box) appear as two columns */
  .step:nth-child(1) { flex:0 0 48%; }
  .step:nth-child(2) { flex:0 0 52%; }
  .share-frame { height:100%; }
  .fb-modal { height:100%; }
}

@media (max-width: 700px) {
  .page-title { font-size: 26px; }
  .card { padding:18px; width: calc(100% - 36px); }
  .info-row { font-size:16px; padding:12px; }
  .footer-text { font-size:20px; }
  .steps-container { gap:10px; }
  /* Make the big overlay smaller on mobile so the text fits one line */
  .overlay-text {
    font-size: 18px !important;
    padding: 8px 14px !important;
    white-space: nowrap;
    -webkit-text-stroke: 0.4px rgba(0,0,0,0.2) !important;
  }
}
</style>

