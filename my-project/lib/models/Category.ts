import mongoose from 'mongoose'

export interface ICategory {
  _id?: string
  name: string
  type: 'poem' | 'article' | 'proverb' | 'dictionary' | 'video' | 'audio' | 'history'
  color?: string
  icon?: string
  createdAt?: Date
  updatedAt?: Date
}

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['poem', 'article', 'proverb', 'dictionary', 'video', 'audio', 'history'] },
    color: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
