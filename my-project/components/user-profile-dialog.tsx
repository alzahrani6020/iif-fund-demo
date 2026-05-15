"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, Save, User, Camera, Upload } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { readImageFile } from "@/lib/data-store"
import { toast } from "@/hooks/use-toast"

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const avatarOptions = [
  "/placeholder-user.jpg",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahran",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Amal",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid",
]

const frames = [
  { id: "none", label: "بدون", className: "border-transparent" },
  { id: "gold", label: "ذهبي", className: "border-amber-400 shadow-amber-400/40" },
  { id: "purple", label: "بنفسجي", className: "border-purple-400 shadow-purple-400/40" },
  { id: "blue", label: "أزرق", className: "border-sky-400 shadow-sky-400/40" },
  { id: "green", label: "أخضر", className: "border-emerald-400 shadow-emerald-400/40" },
]

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const { user, update, logout } = useUser()
  const [name, setName] = useState(user?.name || "")
  const [avatar, setAvatar] = useState(user?.avatar || avatarOptions[0])
  const [frame, setFrame] = useState(user?.frame || "gold")
  const [customUrl, setCustomUrl] = useState("")
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const base64 = await readImageFile(file)
      setUploadedAvatar(base64)
      setCustomUrl("")
      toast({ title: "تم رفع الصورة", description: "تم تحديث صورتك الشخصية" })
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" })
    }
  }

  const handleSave = () => {
    setSaving(true)
    const finalAvatar = uploadedAvatar || customUrl.trim() || avatar
    update({ name: name.trim(), avatar: finalAvatar, frame: frame as any })
    setSaving(false)
    onOpenChange(false)
  }

  const handleLogout = () => {
    logout()
    onOpenChange(false)
  }

  if (!user) return null

  const activeFrame = frames.find((f) => f.id === frame) || frames[1]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-dark border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold gold-gradient">
            الملف الشخصي
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div
                className={`w-24 h-24 rounded-full overflow-hidden border-[3px] shadow-lg ${activeFrame.className}`}
              >
                <img
                  src={uploadedAvatar || avatar || "/placeholder-user.jpg"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <Camera className="h-4 w-4 text-primary-foreground" />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="profile-name">الاسم</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass border-border"
            />
          </div>

          {/* Avatars */}
          <div className="space-y-2">
            <Label>اختر صورة</Label>
            <div className="flex flex-wrap gap-2 justify-center">
              {avatarOptions.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => { setAvatar(src); setCustomUrl(""); setUploadedAvatar(null) }}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                    avatar === src && !customUrl && !uploadedAvatar
                      ? "border-accent scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="avatar" className="w-full h-full object-cover" />
                </button>
              ))}
              {/* Uploaded avatar preview */}
              {uploadedAvatar && (
                <button
                  type="button"
                  onClick={() => { setAvatar(uploadedAvatar); setCustomUrl("") }}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent scale-110 transition-all"
                >
                  <img src={uploadedAvatar} alt="uploaded" className="w-full h-full object-cover" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="أو أدخل رابط صورة..."
                value={customUrl}
                onChange={(e) => { setCustomUrl(e.target.value); setUploadedAvatar(null) }}
                className="glass border-border text-sm"
                dir="ltr"
              />
            </div>
          </div>

          {/* Frames */}
          <div className="space-y-2">
            <Label>اختر الفريم</Label>
            <div className="flex flex-wrap gap-2 justify-center">
              {frames.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrame(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    frame === f.id
                      ? "bg-primary/20 border-primary text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 ml-2" />
              خروج
            </Button>
            <Button
              className="flex-1 rounded-full"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="h-4 w-4 ml-2" />
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
