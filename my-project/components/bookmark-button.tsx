"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { toast } from "@/hooks/use-toast"
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "@/lib/data-store"

interface BookmarkButtonProps {
  itemId: string
  itemType: string
  title: string
  href: string
}

export function BookmarkButton({ itemId, itemType, title, href }: BookmarkButtonProps) {
  const { user, isLoggedIn } = useUser()
  const [bookmarked, setBookmarked] = useState(() =>
    user ? isBookmarked(user.id, itemId, itemType) : false
  )
  const [showAuth, setShowAuth] = useState(false)

  const toggle = () => {
    if (!isLoggedIn || !user) {
      setShowAuth(true)
      return
    }

    if (bookmarked) {
      removeBookmark(user.id, itemId, itemType)
      setBookmarked(false)
      toast({ title: "🗑️ تم الإزالة", description: "أُزيل من محفوظاتك" })
    } else {
      addBookmark(user.id, itemId, itemType, title, href)
      setBookmarked(true)
      toast({ title: "🔖 تم الحفظ", description: "أُضيف إلى محفوظاتك" })
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggle}
        className={`gap-1.5 transition-colors ${
          bookmarked ? "text-accent" : "text-muted-foreground hover:text-accent"
        }`}
      >
        <AnimatePresence mode="wait">
          {bookmarked ? (
            <motion.div
              key="saved"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <BookmarkCheck className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="unsaved"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Bookmark className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="hidden sm:inline">{bookmarked ? "محفوظ" : "حفظ"}</span>
      </Button>

      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-dark rounded-2xl p-6 max-w-sm mx-4 text-center border border-border"
            >
              <Bookmark className="h-10 w-10 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">سجّل دخول للحفظ</h3>
              <p className="text-sm text-muted-foreground mb-4">
                يجب تسجيل الدخول لحفظ العناصر في قائمة محفوظاتك.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowAuth(false)}
                >
                  لاحقاً
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    setShowAuth(false)
                    window.dispatchEvent(new CustomEvent("open-user-auth"))
                  }}
                >
                  تسجيل الدخول
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
