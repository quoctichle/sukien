<template>
  <Fireworks />
  <div class="result-page">
    <!-- Title on top -->
    <div class="page-title">{{ t('landingTitle') }}</div>

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
                    <img src="/share.png" alt="Share" class="share-frame-image" />
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

    <!-- Footer text -->
    <div class="footer-text">CHƠI LÀ CÓ QUÀ!</div>
  </div>
</template>

<script setup lang="ts">
import { useTranslate } from '~/composables/useTranslate'

const { t, locale, setLocale } = useTranslate()
const route = useRoute()
const router = useRouter()

const name = route.query.name || ''
const customerId = route.query.customerId || ''
const code = route.query.code || ''
const success = ref(true)
const errorMsg = ref('')
const facebookLink = 'https://www.facebook.com/share/p/1acZ1tTtwg/'

onMounted(() => {
  const lang = route.params.lang as string
  if (lang === 'vi' || lang === 'en') {
    setLocale(lang)
  }
})
</script>

<style scoped>
.result-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f7f8fb 0%, #fff 100%);
  background-size: 100% 100%;
  background-attachment: fixed;
  background-repeat: no-repeat;
  padding: 20px;
  position: relative;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 20px;
}

.page-title {
  color: #d4af37;
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  order: -2;
}

.card {
  background: linear-gradient(135deg, #3d9d2a 0%, #5ac34c 50%, #a5d62d 100%);
  padding: 40px;
  border-radius: 28px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  max-width: 100%;
  width: calc(100% - 80px);
  min-height: auto;
  order: -1;
}

.success-container {
  text-align: center;
}

.error-container {
  text-align: center;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 20px;
  font-weight: bold;
}

h2 {
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
}

h3 {
  color: #fff;
  font-size: 18px;
  margin-bottom: 12px;
  text-align: left;
}

.info-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: left;
}

.info-row {
  margin: 10px 0;
  font-size: 15px;
  color: #333;
}

.info-row strong {
  color: #333;
  font-weight: 700;
}

/* Share Guide Styles */
.share-guide-section {
  background: rgba(255, 255, 255, 0.15);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 0;
  text-align: center;
  backdrop-filter: blur(5px);
}

.share-title {
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
  text-align: center;
  letter-spacing: 0.5px;
}

.share-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step {
  display: flex;
  gap: 12px;
  text-align: left;
  align-items: flex-start;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 0;
}

.share-frame {
  margin-top: 8px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.share-frame-link { display:block; position:relative; }
.share-frame-image {
  width:100%;
  height:auto;
  display:block;
  filter: saturate(0.95) contrast(0.95);
}

.share-overlay {
  position:absolute;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  pointer-events:none;
}

.overlay-text {
  pointer-events:auto;
  background: rgba(255,255,255,0.92);
  color: #1b5e20;
  font-weight: 900;
  font-size: 24px;
  padding: 10px 24px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  text-transform: capitalize;
}

/* Facebook modal mockup */
.fb-modal {
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 8px;
  border: 2px solid #e6f4ea;
  position:relative;
}

.fb-row { display:flex; align-items:center; gap:10px; padding:8px; border-radius:6px; }
.fb-row + .fb-row { margin-top:4px; }
.fb-row.highlight { border: 2px solid #f44336; background: linear-gradient(90deg,#fff,#fff); }
.fb-icon { width:32px; height:32px; border-radius:50%; background:#f1f1f1; display:flex; align-items:center; justify-content:center; font-size:16px }
.fb-text { flex:1; }
.fb-title { font-weight:800; color:#111; font-size:13px }
.fb-desc { color:#666; font-size:11px; margin-top:2px }
.fb-radio { font-size:16px; color:#2e7d32; width:24px; text-align:center }
.fb-row.highlight .fb-radio { color:#2e7d32 }

.error-message {
  color: #c62828;
  font-size: 16px;
  margin-bottom: 20px;
}

.footer-text {
  color: #d4af37;
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  order: 1;
}

@media (max-width: 600px) {
  .result-page {
    padding: 16px;
    gap: 16px;
  }

  .page-title {
    font-size: 22px;
    margin-bottom: 0;
  }

  .card {
    padding: 20px;
    width: calc(100% - 40px);
  }

  .info-section {
    padding: 12px;
  }

  .info-row {
    font-size: 13px;
    margin: 8px 0;
  }

  .share-guide-section {
    padding: 14px;
  }

  .share-title {
    font-size: 16px;
  }

  .share-subtitle {
    font-size: 12px;
    margin-bottom: 12px;
  }

  .step-number {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .step-text {
    font-size: 12px;
  }

  .footer-text {
    font-size: 20px;
  }
}

/* Desktop: show steps side-by-side */
@media (min-width: 900px) {
  .result-page { padding: 40px 20px; }
  .page-title { font-size: 36px; }
  .card { max-width: 100%; width: calc(100% - 40px); padding: 48px; }
  .share-guide-section { padding: 36px 36px; }
  .steps-container { flex-direction: row; gap: 48px; align-items: flex-start; justify-content: space-between; }
  .step { display: flex; flex-direction: column; }
  .step:nth-child(1) { flex: 0 0 35%; }
  .step:nth-child(2) { flex: 0 0 65%; }
  .step-number { width: 44px; height: 44px; font-size: 18px; }
  .share-frame { max-width: 100%; width: 100%; }
  .share-frame-image { height: 480px; width: 100%; object-fit: cover; display:block; }
  .fb-modal { width: 100%; height: 480px; display: flex; flex-direction: column; justify-content: center; }
  .share-subtitle { font-size: 15px; }
  .footer-text { font-size: 32px; }
}
</style>
