import mongoose from 'mongoose'

export interface IAudio {
  _id?: string
  title: string
  url: string
  date: string
  views: number
  duration?: string
  durationSecs?: number
  category?: string
  description?: string
  year?: string
  createdAt?: Date
  updatedAt?: Date
}

const AudioSchema = new mongoose.Schema<IAudio>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: String, required: true },
    views: { type: Number, default: 0 },
    duration: { type: String },
    durationSecs: { type: Number },
    category: { type: String },
    description: { type: String },
    year: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Audio || mongoose.model<IAudio>('Audio', AudioSchema)
