"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, FileText, Video, Mic, Clock, ScrollText, History, Library, BookMarked, Volume2, ImageIcon } from "lucide-react"
import { getPoems, getArticles, getVideos, getAudio } from "@/lib/data-store"

const sections = [
  { type: "ديوان", title: "قصائد نبطية أصيلة", href: "/diwan", icon: BookOpen, color: "text-primary" },
  { type: "مقال", title: "دراسات في التراث الشعبي", href: "/articles", icon: FileText, color: "text-accent" },
  { type: "فيديو", title: "محتوى مرئي متنوع", href: "/videos", icon: Video, color: "text-primary" },
  { type: "صوتي", title: "قصائد بصوت الشاعر", href: "/audio", icon: Volume2, color: "text-accent" },
  { type: "أمثال", title: "حكم تراثية من زهران", href: "/proverbs", icon: ScrollText, color: "text-primary" },
  { type: "تاريخ", title: "محطات تاريخية مجيدة", href: "/history", icon: History, color: "text-accent" },
]

export default function LatestAdditions() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPoems(), getArticles(), getVideos(), getAudio()])
      .then(([poems, articles, videos, audio]) => {
        const latest = [
          ...poems.slice(0, 2).map((p: any) => ({ type: "قصيدة", title: p.title, href: "/diwan", icon: BookOpen, date: p.date, color: "text-primary" })),
          ...articles.slice(0, 2).map((a: any) => ({ type: "مقال", title: a.title, href: "/articles", icon: FileText, date: a.date, color: "text-accent" })),
          ...videos.slice(0, 1).map((v: any) => ({ type: "فيديو", title: v.title, href: "/videos", icon: Video, date: v.date, color: "text-primary" })),
          ...audio.slice(0, 1).map((a: any) => ({ type: "صوتي", title: a.title, href: "/audio", icon: Mic, date: a.date, color: "text-accent" })),
        ]
        setItems(latest)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const displayItems = items.length > 0 ? items : sections
  const isFallback = items.length === 0

  return (
    <section className="relative py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gold-gradient">{isFallback ? "تصفح المحتوى" : "آخر الإضافات"}</span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-l from-primary to-accent mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            {isFallback ? "أقسام الموقع الرئيسية — اختر ما يهمك" : "أحدث المحتويات المضافة إلى الموقع"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={`${item.type}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={item.href}>
                  <Card className="glass border-border hover:border-primary/40 transition-all duration-300 group h-full card-lift">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground">{item.type}</span>
                          <h3 className="text-sm font-bold text-foreground mt-1 group-hover:text-accent transition-colors truncate">
                            {item.title}
                          </h3>
                          {item.date && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {item.date}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
