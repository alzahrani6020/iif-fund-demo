"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Bookmark,
  ArrowRight,
  BookOpen,
  FileText,
  Quote,
  BookText,
  Video,
  Mic,
  Landmark,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { useUser } from "@/hooks/use-user"
import { getUserBookmarks, removeBookmark } from "@/lib/data-store"

const typeConfig: Record<string, { label: string; href: string; icon: React.ElementType }> = {
  poem: { label: "قصيدة", href: "/diwan", icon: BookOpen },
  article: { label: "مقال", href: "/articles", icon: FileText },
  proverb: { label: "مثل شعبي", href: "/proverbs", icon: Quote },
  dictionary: { label: "مفردة", href: "/dictionary", icon: BookText },
  video: { label: "فيديو", href: "/videos", icon: Video },
  audio: { label: "صوتي", href: "/audio", icon: Mic },
  history: { label: "تاريخي", href: "/history", icon: Landmark },
}

export default function BookmarksPage() {
  const { user, isLoggedIn } = useUser()

  const bookmarks = useMemo(() => {
    if (!user) return []
    return getUserBookmarks(user.id)
  }, [user])

  const handleRemove = (itemId: string, itemType: string) => {
    if (!user) return
    removeBookmark(user.id, itemId, itemType)
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="relative pt-32 pb-12 px-4">
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold gold-gradient mb-3">
              محفوظاتي
            </h1>
            <p className="text-muted-foreground">
              المحتوى الذي حفظته للعودة إليه لاحقاً
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Bookmark className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">سجّل دخول أولاً</h2>
              <p className="text-muted-foreground mb-6">
                يجب تسجيل الدخول لعرض محفوظاتك وحفظ محتوى جديد.
              </p>
              <Button
                className="rounded-full"
                onClick={() => window.dispatchEvent(new CustomEvent("open-user-auth"))}
              >
                تسجيل الدخول
              </Button>
            </motion.div>
          )}

          {isLoggedIn && bookmarks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Bookmark className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">لا توجد محفوظات</h2>
              <p className="text-muted-foreground">
                ابدأ بتصفح المحتوى واضغط على زر «حفظ» لإضافته هنا.
              </p>
            </motion.div>
          )}

          {isLoggedIn && bookmarks.length > 0 && (
            <div className="grid gap-3">
              {bookmarks.map((bookmark, idx) => {
                const config = typeConfig[bookmark.itemType] || {
                  label: bookmark.itemType,
                  href: "/",
                  icon: Bookmark,
                }
                const Icon = config.icon

                return (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="glass rounded-xl p-4 card-lift group flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link href={bookmark.href}>
                          <h3 className="font-semibold group-hover:text-accent transition-colors truncate">
                            {bookmark.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {config.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{bookmark.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={bookmark.href}>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowRight className="h-4 w-4 rotate-180" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemove(bookmark.itemId, bookmark.itemType)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
