import mongoose from 'mongoose'

export interface ISiteConfig {
  _id?: string
  poetName: string
  poetSubtitle: string
  logoImage?: string
  poetImage?: string
  createdAt?: Date
  updatedAt?: Date
}

const SiteConfigSchema = new mongoose.Schema<ISiteConfig>(
  {
    poetName: { type: String, default: 'محمد عيضة الزهراني' },
    poetSubtitle: { type: String, default: 'شاعر وباحث في التراث' },
    logoImage: { type: String },
    poetImage: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema)
