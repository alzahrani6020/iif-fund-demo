import mongoose from 'mongoose'

export interface IHistoryEvent {
  _id?: string
  title: string
  date: string
  location?: string
  sides?: string
  result?: string
  description: string
  category: string
  createdAt?: Date
  updatedAt?: Date
}

const HistoryEventSchema = new mongoose.Schema<IHistoryEvent>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String },
    sides: { type: String },
    result: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.HistoryEvent || mongoose.model<IHistoryEvent>('HistoryEvent', HistoryEventSchema)
