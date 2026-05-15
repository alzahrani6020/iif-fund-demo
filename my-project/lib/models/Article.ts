import mongoose from 'mongoose'

export interface IArticle {
  _id?: string
  title: string
  content: string
  excerpt?: string
  category?: string
  date: string
  views: number
  readTime?: string
  createdAt?: Date
  updatedAt?: Date
}

const ArticleSchema = new mongoose.Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    category: { type: String },
    date: { type: String, required: true },
    views: { type: Number, default: 0 },
    readTime: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema)
