import mongoose from 'mongoose'

export interface IDictionaryEntry {
  _id?: string
  word: string
  meaning: string
  example?: string
  usage?: string
  culturalNote?: string
  letter?: string
  category?: string
  pronunciation?: string
  date: string
  createdAt?: Date
  updatedAt?: Date
}

const DictionaryEntrySchema = new mongoose.Schema<IDictionaryEntry>(
  {
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    example: { type: String },
    usage: { type: String },
    culturalNote: { type: String },
    letter: { type: String },
    category: { type: String },
    pronunciation: { type: String },
    date: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.DictionaryEntry || mongoose.model<IDictionaryEntry>('DictionaryEntry', DictionaryEntrySchema)
