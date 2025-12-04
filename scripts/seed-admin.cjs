const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nuxt-app'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  language: { type: String, enum: ['vi', 'en'], default: 'vi' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') return next()
    return
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    if (typeof next === 'function') next()
  } catch (error) {
    if (typeof next === 'function') next(error)
  }
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const existingAdmin = await User.findOne({ email: 'admin@sunshine.com' })
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists')
      await mongoose.disconnect()
      return
    }

    const adminUser = new User({
      name: 'Admin',
      email: 'admin@sunshine.com',
      password: 'sunshinetelecom',
      role: 'admin',
      language: 'vi',
      isActive: true
    })

    await adminUser.save()
    console.log('✅ Admin account created successfully!')
    console.log('Email: admin@sunshine.com')
    console.log('Password: sunshinetelecom')

    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

seedAdmin()
