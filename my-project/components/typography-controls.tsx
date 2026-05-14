"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Type, Plus, Minus, RotateCcw, X, Palette } from "lucide-react"
import { useTypography } from "@/hooks/use-typography"

export function TypographyControls() {
  const [open, setOpen] = useState(false)
  const { settings, increaseSize, decreaseSize, setSettings, reset } = useTypography()

  const sizePercent = Math.round(settings.fontSize * 100)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed left-4 bottom-4 z-40 w-12 h-12 rounded-full glass-dark border border-border shadow-lg text-accent hover:text-accent hover:bg-primary/10"
        title="إعدادات الخط"
      >
        <Type className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 glass-dark border-r border-border shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold gold-gradient">إعدادات القراءة</h2>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Font Size */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Palette className="h-4 w-4" />
                  <span>حجم الخط</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseSize}
                    disabled={sizePercent <= 80}
                    className="rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-accent">{sizePercent}%</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseSize}
                    disabled={sizePercent >= 130}
                    className="rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    animate={{ width: `${((sizePercent - 80) / 50) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Type className="h-4 w-4" />
                  <span>نوع الخط</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings({ fontFamily: "Tajawal" })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      settings.fontFamily === "Tajawal"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="block text-lg font-bold" style={{ fontFamily: "Tajawal, sans-serif" }}>
                      تجوال
                    </span>
                    <span className="text-xs text-muted-foreground">sans-serif</span>
                  </button>
                  <button
                    onClick={() => setSettings({ fontFamily: "Amiri" })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      settings.fontFamily === "Amiri"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="block text-lg font-bold" style={{ fontFamily: "Amiri, serif" }}>
                      أميري
                    </span>
                    <span className="text-xs text-muted-foreground">serif</span>
                  </button>
                </div>
              </div>

              {/* Line Height */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Type className="h-4 w-4" />
                  <span>تباعد الأسطر</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1.6, 1.8, 2.0].map((lh) => (
                    <button
                      key={lh}
                      onClick={() => setSettings({ lineHeight: lh })}
                      className={`py-3 rounded-xl border text-sm transition-all ${
                        settings.lineHeight === lh
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {lh === 1.6 ? "ضيق" : lh === 1.8 ? "متوسط" : "واسع"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl border border-border bg-secondary/20 mb-6">
                <p
                  className="text-foreground"
                  style={{
                    fontSize: `${settings.fontSize}rem`,
                    fontFamily: settings.fontFamily,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  هذا نص تجريبي يعرض إعدادات الخط التي اخترتها. يمكنك تغيير الحجم والنوع والتباعد حسب راحتك.
                </p>
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={reset}
              >
                <RotateCcw className="h-4 w-4 ml-2" />
                إعادة الافتراضيات
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
