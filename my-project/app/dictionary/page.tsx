"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookText, Search, Volume2, BookOpen, Star, Share2, Copy, Check } from "lucide-react"
import { getDictionary } from "@/lib/data-store"
import { ShareButtons } from "@/components/share-buttons"
import { BookmarkButton } from "@/components/bookmark-button"
import { FocusModeToggle } from "@/components/focus-mode-toggle"
import { TTSPlayer } from "@/components/tts-player"

const letters = [
  "الكل", "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"
]

const categories = ["الكل", "الطبيعة", "الأدوات", "الطعام", "المنزل", "العادات", "الزراعة"]

const dictionaryEntries = getDictionary()

export default function DictionaryPage() {
  const [selectedLetter, setSelectedLetter] = useState("الكل")
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredEntries = dictionaryEntries.filter((entry) => {
    const matchesLetter = selectedLetter === "الكل" || entry.letter === selectedLetter
    const matchesCategory = selectedCategory === "الكل" || entry.category === selectedCategory
    const matchesSearch = entry.word.includes(searchQuery) || entry.meaning.includes(searchQuery)
    return matchesLetter && matchesCategory && matchesSearch
  })

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background islamic-pattern relative overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 gold-glow">
              <BookText className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
              <span className="gold-gradient">معجم</span> اللهجة الزهرانية
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              معجم شامل للمفردات والعبارات الخاصة بلهجة منطقة زهران، مع الشرح والأمثلة والملاحظات الثقافية
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">1,024</span>
                <p className="text-sm">مفردة</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">29</span>
                <p className="text-sm">حرف</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">7</span>
                <p className="text-sm">تصنيفات</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <FocusModeToggle />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b border-border sticky top-20 glass-dark z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Search */}
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن مفردة أو معنى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass border-0 rounded-xl pr-12 pl-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 text-lg"
            />
          </motion.div>

          {/* Category Filters */}
          <motion.div
            className="flex items-center justify-center gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground gold-glow"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Letters Navigation */}
      <section className="py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {letters.map((letter, index) => (
              <motion.button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300 ${
                  selectedLetter === letter
                    ? "bg-primary text-primary-foreground purple-glow"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {letter}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dictionary Entries */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedLetter}-${selectedCategory}-${searchQuery}`}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass border-border hover:border-accent/50 transition-all duration-300 card-lift overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-3xl font-bold text-foreground font-serif">{entry.word}</h3>
                              <motion.button
                                className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Volume2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                حرف {entry.letter}
                              </span>
                              <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                {entry.category}
                              </span>
                              <span className="text-xs text-muted-foreground" dir="ltr">
                                [{entry.pronunciation}]
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TTSPlayer text={`${entry.word}. المعنى: ${entry.meaning}. مثال: ${entry.example || entry.usage || ""}`} title={entry.word} />
                            <BookmarkButton
                              itemId={entry.id}
                              itemType="dictionary"
                              title={entry.word}
                              href={`/dictionary`}
                            />
                            <ShareButtons title={entry.word} />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary"
                              onClick={() => handleCopy(entry.id, `${entry.word}: ${entry.meaning}`)}
                            >
                              {copiedId === entry.id ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <Copy className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <span className="text-sm text-accent font-medium flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            المعنى
                          </span>
                          <p className="text-foreground mt-2 leading-relaxed text-lg">{entry.meaning}</p>
                        </div>
                        
                        <div className="pt-4 border-t border-border">
                          <span className="text-sm text-primary font-medium">مثال على الاستخدام:</span>
                          <p className="text-muted-foreground mt-2 font-serif text-lg bg-secondary/30 rounded-lg p-4">
                            {`"${entry.usage}"`}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <span className="text-sm text-accent font-medium">ملاحظة ثقافية:</span>
                          <p className="text-muted-foreground mt-2 text-base italic leading-relaxed">{entry.culturalNote}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BookText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر حرف آخر</p>
            </motion.div>
          )}

          {/* Load More */}
          {filteredEntries.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="outline" size="lg" className="border-accent/50 text-accent hover:bg-accent/10">
                عرض المزيد من المفردات
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
