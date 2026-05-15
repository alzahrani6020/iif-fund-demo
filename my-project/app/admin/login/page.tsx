"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LogIn, Shield, Eye, EyeOff } from "lucide-react"
import { login } from "@/lib/data-store"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      if (login(password)) {
        router.push("/admin")
      } else {
        setError("كلمة المرور غير صحيحة")
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass border-border shadow-2xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-4 purple-glow"
              >
                <Shield className="h-8 w-8 text-accent" />
              </motion.div>
              <h1 className="text-2xl font-bold gold-gradient mb-2">لوحة التحكم</h1>
              <p className="text-sm text-muted-foreground">
                تسجيل الدخول للوصول إلى إدارة المحتوى
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">كلمة المرور</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور..."
                    className="glass border-border pr-10 pl-12 py-5 text-foreground placeholder:text-muted-foreground"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <LogIn className="ml-2 h-5 w-5" />
                    تسجيل الدخول
                  </>
                )}
              </Button>
            </form>

            {/* Back link */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                العودة إلى الموقع
              </a>
            </div>

            {/* Security note */}
            <p className="mt-4 text-xs text-muted-foreground/50 text-center">
              يمكنك تغيير كلمة المرور من إعدادات لوحة التحكم
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
