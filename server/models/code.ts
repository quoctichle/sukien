import mongoose from 'mongoose'

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['V', 'B', 'D', 'X'], required: true }, // X = other
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.models.ParticipantCode || mongoose.model('ParticipantCode', codeSchema)
