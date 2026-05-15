"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Landmark, MapPin, Swords, Calendar, Filter, Scroll, User, FileText } from "lucide-react"
import { getHistory } from "@/lib/data-store"
import { ShareButtons } from "@/components/share-buttons"
import { BookmarkButton } from "@/components/bookmark-button"
import { FocusModeToggle } from "@/components/focus-mode-toggle"
import { TTSPlayer } from "@/components/tts-player"

const categories = ["الكل", "معركة", "حدث", "معاهدة", "شخصية"]

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "معركة": Swords,
  "حدث": Calendar,
  "معاهدة": Scroll,
  "شخصية": User,
}

const categoryColors: Record<string, string> = {
  "معركة": "text-red-400 bg-red-400/10 border-red-400/20",
  "حدث": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "معاهدة": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "شخصية": "text-purple-400 bg-purple-400/10 border-purple-400/20",
}

export default function HistoryPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [events, setEvents] = useState<any[]>([])
  useEffect(() => { getHistory().then(setEvents) }, [])

  const filteredEvents = events.filter((event) => {
    return selectedCategory === "الكل" || event.category === selectedCategory
  })

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background islamic-pattern relative overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
              <Landmark className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
              <span className="gold-gradient">تاريخ</span> زهران
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              محطات تاريخية ومعارك مجيدة وأحداث شكلت هوية المنطقة والقبيلة
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">{events.length}</span>
                <p className="text-sm">حدث مسجل</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">{events.filter(e => e.category === "معركة").length}</span>
                <p className="text-sm">معركة</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <FocusModeToggle />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 glass-dark z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground purple-glow"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent" />

            <div className="space-y-8">
              {filteredEvents.map((event, index) => {
                const Icon = categoryIcons[event.category] || FileText
                const colorClass = categoryColors[event.category] || "text-primary bg-primary/10 border-primary/20"

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="relative pr-16"
                  >
                    {/* Dot */}
                    <div className={`absolute right-0 top-4 w-12 h-12 rounded-full border-2 flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <Card className="glass border-border hover:border-primary/40 transition-all duration-300 card-lift">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`inline-block px-3 py-1 text-xs rounded-full border ${colorClass}`}>
                                {event.category}
                              </span>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {event.date}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground font-serif mb-2">{event.title}</h3>
                            <p className="text-muted-foreground leading-loose text-base mb-4">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </span>
                              )}
                              {event.sides && event.sides !== "—" && (
                                <span className="flex items-center gap-1">
                                  <Swords className="h-4 w-4" />
                                  {event.sides}
                                </span>
                              )}
                              {event.result && event.result !== "—" && (
                                <span className="flex items-center gap-1">
                                  <Scroll className="h-4 w-4" />
                                  النتيجة: {event.result}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                              <TTSPlayer text={`${event.title}. ${event.description}`} title={event.title} />
                              <BookmarkButton
                                itemId={event.id}
                                itemType="history"
                                title={event.title}
                                href={`/history`}
                              />
                              <ShareButtons title={event.title} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {filteredEvents.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Landmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
                <p className="text-muted-foreground">اختر تصنيف آخر</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
