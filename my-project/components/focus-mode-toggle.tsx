"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, X } from "lucide-react"
import { useFocusMode } from "@/hooks/use-focus-mode"
import { toast } from "@/hooks/use-toast"

export function FocusModeToggle() {
  const { active, toggle, disable } = useFocusMode()

  return (
    <>
      <AnimatePresence>
        {!active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={toggle}
              className="rounded-full gap-2 border-accent/30 text-accent hover:bg-accent/10 hover:text-accent"
              title="وضع القراءة المريحة"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">قراءة مريحة</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Button - shown only in focus mode */}
      <div className="focus-mode-exit">
        <Button
          variant="default"
          size="sm"
          onClick={disable}
          className="rounded-full gap-2 shadow-lg purple-glow"
        >
          <X className="h-4 w-4" />
          خروج من وضع القراءة
        </Button>
      </div>
    </>
  )
}
