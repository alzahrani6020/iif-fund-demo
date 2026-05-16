import mongoose from 'mongoose'

export interface IUser {
  _id?: string
  name: string
  email: string
  password: string
  avatar?: string
  frame?: string
  role: 'user' | 'moderator' | 'admin'
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    frame: { type: String },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
