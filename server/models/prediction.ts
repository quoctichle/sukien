import mongoose from 'mongoose'

const predictionSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true, index: true },
  name: { type: String, required: true },
  customerId: { type: String, required: true },
  predictions: { type: [Number], required: true },
  predictionsCount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.models.Prediction || mongoose.model('Prediction', predictionSchema)
