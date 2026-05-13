"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Play, BookOpen, Calendar, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { getPoems, updatePoem } from "@/lib/data-store"
import CommentsSection from "@/components/comments-section"
import { useState } from "react"

export default function PoemDetailPage() {
  const params = useParams()
  const poemId = params.id as string
  const poems = getPoems()
  const poem = poems.find((p) => p.id === poemId)
  const [liked, setLiked] = useState(false)

  if (!poem) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold">القصيدة غير موجودة</h1>
          <Link href="/diwan" className="text-accent mt-4 inline-block">
            العودة للديوان
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const handleLike = () => {
    updatePoem(poem.id, { likes: (poem.likes || 0) + 1 })
    setLiked(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: poem.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background islamic-pattern">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/diwan"
              className="inline-flex items-center text-muted-foreground hover:text-accent mb-6 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 ml-1" />
              العودة للديوان
            </Link>

            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mb-6 purple-glow">
              <BookOpen className="h-8 w-8 text-accent" />
            </div>

            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-4">
              {poem.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold font-serif mb-4">
              <span className="gold-gradient">{poem.title}</span>
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {poem.date}
              </span>
              <span>{poem.views || 0} مشاهدة</span>
            </div>

            <div className="glass border-border rounded-2xl p-8 md:p-12 mb-8">
              <p className="text-foreground font-serif text-xl md:text-2xl leading-loose whitespace-pre-line text-center">
                {poem.content || ""}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className={`border-accent/50 hover:bg-accent/10 ${liked ? "bg-accent/10 text-accent" : "text-accent"}`}
                onClick={handleLike}
                disabled={liked}
              >
                <Heart className={`ml-2 h-5 w-5 ${liked ? "fill-current" : ""}`} />
                إعجاب ({poem.likes || 0})
              </Button>
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
                onClick={handleShare}
              >
                <Share2 className="ml-2 h-5 w-5" />
                مشاركة
              </Button>
              {poem.hasAudio && (
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Play className="ml-2 h-5 w-5" />
                  استماع
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <CommentsSection itemId={poem.id} itemType="poem" />
      </div>

      <Footer />
    </main>
  )
}
