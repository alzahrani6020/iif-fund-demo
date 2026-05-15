import mongoose from 'mongoose'

export interface IPoem {
  _id?: string
  title: string
  category: string
  content: string
  excerpt?: string
  date: string
  views: number
  likes?: number
  hasAudio?: boolean
  createdAt?: Date
  updatedAt?: Date
}

const PoemSchema = new mongoose.Schema<IPoem>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    date: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    hasAudio: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.Poem || mongoose.model<IPoem>('Poem', PoemSchema)
