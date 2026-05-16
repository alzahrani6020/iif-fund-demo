import mongoose from 'mongoose'

export interface IComment {
  _id?: string
  itemId: string
  itemType: string
  name: string
  email?: string
  content: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt?: Date
  updatedAt?: Date
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    itemId: { type: String, required: true },
    itemType: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    content: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
)

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
