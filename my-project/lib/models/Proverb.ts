import mongoose from 'mongoose'

export interface IProverb {
  _id?: string
  text: string
  meaning: string
  category?: string
  date: string
  likes?: number
  createdAt?: Date
  updatedAt?: Date
}

const ProverbSchema = new mongoose.Schema<IProverb>(
  {
    text: { type: String, required: true },
    meaning: { type: String, required: true },
    category: { type: String },
    date: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Proverb || mongoose.model<IProverb>('Proverb', ProverbSchema)
