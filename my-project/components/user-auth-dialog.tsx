"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, UserPlus, Eye, EyeOff, Upload, Camera } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { toast } from "@/hooks/use-toast"
import { uploadImageToR2 } from "@/lib/data-store"

interface UserAuthDialogProps {
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

export function UserAuthDialog({ open, onOpenChange }: UserAuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0])
  const [customAvatar, setCustomAvatar] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, register } = useUser()

  const reset = () => {
    setName("")
    setEmail("")
    setPassword("")
    setError("")
    setSelectedAvatar(avatarOptions[0])
    setCustomAvatar(null)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      toast({ title: "جاري الرفع", description: "يتم رفع الصورة على السحابة..." })
      const url = await uploadImageToR2(file)
      setCustomAvatar(url)
      toast({ title: "تم رفع الصورة", description: "تم رفع الصورة على السحابة" })
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "login") {
        const result = login(email, password)
        if (result.success) {
          reset()
          onOpenChange(false)
          toast({ title: "🎉 تم تسجيل الدخول", description: "أهلاً بك مجدداً" })
        } else {
          setError(result.message)
        }
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError("جميع الحقول مطلوبة")
          setLoading(false)
          return
        }
        const finalAvatar = customAvatar || selectedAvatar
        const result = register(name, email, password, finalAvatar)
        if (result.success) {
          reset()
          onOpenChange(false)
          toast({ title: "🎉 تم إنشاء الحساب", description: "تم تسجيل الدخول تلقائياً" })
        } else {
          setError(result.message)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-dark border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold gold-gradient">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4 mt-4"
          >
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد الزهراني"
                  className="glass border-border"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="glass border-border"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass border-border pl-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-3">
                <Label>اختر صورة شخصية</Label>
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {avatarOptions.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => { setSelectedAvatar(src); setCustomAvatar(null) }}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === src && !customAvatar
                          ? "border-accent scale-110 ring-2 ring-accent/30"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={src} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {/* Upload from device */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all flex items-center justify-center bg-secondary/50 ${
                      customAvatar ? "border-accent scale-110 ring-2 ring-accent/30" : "border-dashed border-muted-foreground/30 hover:border-muted-foreground"
                    }`}>
                      {customAvatar ? (
                        <img src={customAvatar} alt="uploaded" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </label>
                </div>
                {customAvatar && (
                  <p className="text-xs text-center text-accent">✓ تم اختيار صورة من الجهاز</p>
                )}
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">جاري التحميل...</span>
              ) : mode === "login" ? (
                <>
                  <LogIn className="h-4 w-4 ml-2" />
                  دخول
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 ml-2" />
                  إنشاء الحساب
                </>
              )}
            </Button>
          </motion.form>
        </AnimatePresence>

        <div className="text-center mt-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login")
              setError("")
            }}
            className="text-sm text-accent hover:underline"
          >
            {mode === "login" ? "ليس لديك حساب؟ سجّل الآن" : "لديك حساب؟ سجّل دخول"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
