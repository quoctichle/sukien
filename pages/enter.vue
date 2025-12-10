<template>
  <Fireworks />
  <div class="enter-page">

    <div class="card">
      <h2>{{ t('goldPricePrediction') }}</h2>
      <div class="info-section">
        <div class="info-row"><strong>{{ t('fbNameLabel') }}:</strong> {{ name }}</div>
        <div class="info-row"><strong>{{ t('customerIdLabel') }}:</strong> {{ customerId }}</div>
        <div class="info-row"><strong>{{ t('promoCodeLabel') }}:</strong> {{ code }}</div>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="prediction-count">{{ t('predictionCount') }}: <strong>{{ maxPredictions }}</strong></div>
        
        <form @submit.prevent="submitPredictions">
          <div v-for="(prediction, index) in predictions" :key="index" class="prediction-row">
            <label>{{ t('predict') }} {{ index + 1 }}:</label>
            <input 
              v-model.number="predictions[index]" 
              type="number" 
              :placeholder="t('goldPricePrediction')"
              step="0.01"
              required
            />
          </div>

          <div class="button-group">
            <button type="submit" class="submit-btn">{{ t('confirmPrediction') }}</button>
            <button type="button" @click="goHome" class="back-btn">{{ t('back') }}</button>
          </div>
        </form>
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
const error = ref('')

const maxPredictions = ref(1)
const predictions = ref<(number | null)[]>([])

// Determine number of predictions based on code prefix
const getPredictionCount = (codeStr: string): number => {
  const prefix = codeStr.charAt(0).toUpperCase()
  switch (prefix) {
    case 'V':
      return 5
    case 'B':
      return 4
    case 'D':
      return 3
    default:
      return 2
  }
}

// Initialize predictions array on mount
onMounted(async () => {
  try {
    const result = await $fetch('/api/code/validate', { method: 'POST', body: { code } })
    const count = getPredictionCount(code as string)
    maxPredictions.value = count
    predictions.value = new Array(count).fill(null)
  } catch (e: any) {
    const errorMsg = e?.statusMessage || e?.data?.message || t('predictionError')
    error.value = errorMsg
  }
})

const submitPredictions = async () => {
  // Validate all predictions are filled
  if (predictions.value.some(p => p === null || p === '')) {
    error.value = locale.value === 'vi' 
      ? 'Vui lòng điền đầy đủ tất cả các dự đoán'
      : 'Please fill in all predictions'
    return
  }

  try {
    await $fetch('/api/prediction/submit', {
      method: 'POST',
      body: {
        name,
        customerId,
        code,
        predictions: predictions.value
      }
    })

    // Navigate to success page with predictions data
    await router.push({
      path: '/result',
      query: {
        name,
        customerId,
        code,
        predictions: predictions.value.join(',')
      }
    })
  } catch (e: any) {
    error.value = e?.statusMessage || e?.data?.message || t('predictionError')
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.enter-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* full-page background image to match other pages */
  background-image: url('/background.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 40px 20px;
  position: relative;
}

/* language buttons removed for this page; global switcher is controlled in app.vue */

.card {
  background: white;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  max-width: 640px;
  width: 100%;
  position: relative;
  z-index: 2;
}

h2 {
  margin-top: 0;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.info-section {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-row {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

.prediction-count {
  text-align: center;
  padding: 12px;
  background: #e8f5e9;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #2e7d32;
  font-weight: 500;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prediction-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.prediction-row label {
  min-width: 100px;
  font-weight: 600;
  color: #333;
}

.prediction-row input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.prediction-row input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
}

.submit-btn,
.back-btn {
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.submit-btn {
  background: #4caf50;
  color: white;
}

.submit-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.back-btn {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.back-btn:hover {
  background: #eeeeee;
}

.error {
  padding: 12px;
  background: #ffebee;
  color: #c62828;
  border-radius: 6px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

@media (max-width: 600px) {
  .enter-page {
    padding: 80px 20px 20px;
  }

  .card {
    padding: 20px;
  }

  h2 {
    font-size: 20px;
  }

  .prediction-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .prediction-row label {
    min-width: auto;
  }

  .prediction-row input {
    width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .submit-btn,
  .back-btn {
    width: 100%;
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
