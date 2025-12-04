<template>
  <div class="result-page">
    <div class="lang-wrap">
      <button :class="{ active: locale === 'vi' }" @click="setLocale('vi')">Tiếng Việt</button>
      <button :class="{ active: locale === 'en' }" @click="setLocale('en')">English</button>
    </div>

    <div class="card">
      <div v-if="success" class="success-container">
        <div class="success-icon">✓</div>
        <h2>{{ t('thanksForParticipate') }}</h2>
        <div class="info-section">
          <div class="info-row"><strong>{{ t('fbNameLabel') }}:</strong> {{ name }}</div>
          <div class="info-row"><strong>{{ t('customerIdLabel') }}:</strong> {{ customerId }}</div>
          <div class="info-row"><strong>{{ t('promoCodeLabel') }}:</strong> {{ code }}</div>
        </div>

        <div v-if="predictions.length > 0" class="predictions-section">
          <h3>{{ t('yourPredictions') }}:</h3>
          <div class="predictions-list">
            <div v-for="(prediction, index) in predictions" :key="index" class="prediction-item">
              <span class="prediction-label">{{ t('predict') }} {{ index + 1 }}:</span>
              <span class="prediction-value">{{ prediction }}</span>
            </div>
          </div>
        </div>

        <div class="message-box">
          <p>{{ t('waitingContact') }}</p>
        </div>

        <button @click="goHome" class="home-btn">{{ t('backHome') }}</button>
      </div>

      <div v-else class="error-container">
        <div class="error-icon">✗</div>
        <h2>{{ t('predictionError') }}</h2>
        <p class="error-message">{{ errorMsg }}</p>
        <button @click="goHome" class="home-btn">{{ t('backHome') }}</button>
      </div>
    </div>
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
const predictions = ref<number[]>([])
const success = ref(true)
const errorMsg = ref('')

onMounted(() => {
  // Get predictions from query parameter
  const predictionsQuery = route.query.predictions as string
  if (predictionsQuery) {
    try {
      predictions.value = predictionsQuery.split(',').map(p => parseFloat(p))
    } catch (e) {
      // If parsing fails, predictions will remain empty
    }
  }
})

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f7f8fb, #fff);
  padding: 20px;
  position: relative;
}

.lang-wrap {
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  gap: 12px;
}

.lang-wrap button {
  padding: 10px 22px;
  border-radius: 28px;
  border: none;
  background: #fff;
  color: #333;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
  font-weight: 700;
}

.lang-wrap button.active {
  background: #4caf50;
  color: #fff;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  max-width: 640px;
  width: 100%;
}

.success-container {
  text-align: center;
}

.error-container {
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 20px;
  font-weight: bold;
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
  color: #555;
  font-size: 18px;
  margin-bottom: 12px;
  text-align: left;
}

.info-section {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
}

.info-row {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

.predictions-section {
  background: #f0f9f7;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
}

.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prediction-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: white;
  border-radius: 6px;
  font-size: 14px;
}

.prediction-label {
  font-weight: 600;
  color: #333;
}

.prediction-value {
  color: #2e7d32;
  font-weight: 700;
}

.message-box {
  background: #e8f5e9;
  border-left: 4px solid #4caf50;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: left;
}

.message-box p {
  margin: 0;
  color: #2e7d32;
  font-size: 14px;
}

.error-message {
  color: #c62828;
  font-size: 16px;
  margin-bottom: 20px;
}

.home-btn {
  padding: 12px 32px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.home-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

@media (max-width: 600px) {
  .card {
    padding: 20px;
  }

  h2 {
    font-size: 22px;
  }

  .success-icon,
  .error-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .info-section,
  .predictions-section {
    padding: 12px;
  }

  .lang-wrap {
    top: 16px;
  }

  .lang-wrap button {
    padding: 8px 16px;
    font-size: 12px;
  }
}
</style>
