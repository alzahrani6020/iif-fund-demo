import mongoose from 'mongoose'

export interface IVideo {
  _id?: string
  title: string
  url?: string
  description?: string
  thumbnail?: string
  youtubeId?: string
  fileUrl?: string
  fileSize?: number
  fileType?: string
  category?: string
  date: string
  views: number
  duration?: string
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

const VideoSchema = new mongoose.Schema<IVideo>(
  {
    title: { type: String, required: true },
    url: { type: String },
    description: { type: String },
    thumbnail: { type: String },
    youtubeId: { type: String },
    fileUrl: { type: String },
    fileSize: { type: Number },
    fileType: { type: String },
    category: { type: String },
    date: { type: String, required: true },
    views: { type: Number, default: 0 },
    duration: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema)
