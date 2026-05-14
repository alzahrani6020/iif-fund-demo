"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, Heart, BookOpen, Calendar, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { getPoems } from "@/lib/data-store"
import { BookmarkButton } from "@/components/bookmark-button"
import { FocusModeToggle } from "@/components/focus-mode-toggle"
import { TTSPlayer } from "@/components/tts-player"

export default function DiwanPage() {
  const [poems, setPoems] = useState(() => getPoems())
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const poemsPerPage = 6

  const categories = useMemo(() => {
    const counts = poems.reduce((acc, poem) => {
      acc[poem.category] = (acc[poem.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return [
      { id: "الكل", label: "الكل", count: poems.length },
      ...Object.entries(counts).map(([label, count]) => ({ id: label, label, count })),
    ]
  }, [poems])

  const filteredPoems = useMemo(() => {
    return poems.filter((poem) => {
      const matchesCategory = selectedCategory === "الكل" || poem.category === selectedCategory
      const matchesSearch =
        poem.title.includes(searchQuery) || (poem.excerpt || "").includes(searchQuery)
      return matchesCategory && matchesSearch
    })
  }, [poems, selectedCategory, searchQuery])

  const totalPages = Math.ceil(filteredPoems.length / poemsPerPage)
  const paginatedPoems = filteredPoems.slice(
    (currentPage - 1) * poemsPerPage,
    currentPage * poemsPerPage
  )

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background islamic-pattern relative overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
              <BookOpen className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
              <span className="gold-gradient">وردٍ تنامى</span> في فصول الرتابة
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              ديوان وأعمال الشاعر محمد عيضة الزهراني
            </p>
            <p className="text-lg text-muted-foreground/70 max-w-2xl mx-auto mb-8">
              مجموعة من القصائد النبطية الأصيلة التي تعكس جمال التراث وعمق المشاعر
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">{poems.length}</span>
                <p className="text-sm">قصيدة</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">{categories.length - 1}</span>
                <p className="text-sm">تصنيفات</p>
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
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Search */}
            <motion.div
              className="relative w-full lg:w-96"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث في القصائد..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full glass border-0 rounded-xl pr-12 pl-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </motion.div>

            {/* Categories */}
            <motion.div
              className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground purple-glow"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {category.label}
                  <span className="mr-1 opacity-60">({category.count})</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Poems Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {paginatedPoems.map((poem, index) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-border hover:border-primary/50 transition-all duration-300 group card-lift h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-2">
                          {poem.category}
                        </span>
                        <Link href={`/diwan/${poem.id}`}>
                          <h3 className="text-xl font-bold text-foreground font-serif group-hover:text-primary transition-colors duration-300">
                            {poem.title}
                          </h3>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        {poem.hasAudio && (
                          <span className="p-2 rounded-full bg-accent/10 text-accent">
                            <Play className="h-4 w-4" />
                          </span>
                        )}
                        <BookmarkButton
                          itemId={poem.id}
                          itemType="poem"
                          title={poem.title}
                          href={`/diwan/${poem.id}`}
                        />
                      </div>
                    </div>

                    <p className="text-muted-foreground font-serif text-xl leading-loose whitespace-pre-line mb-6 line-clamp-4 font-medium">
                      {poem.excerpt || poem.content?.slice(0, 150) + "..." || ""}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {poem.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {poem.likes || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TTSPlayer text={`${poem.title}.\n${poem.content || poem.excerpt || ""}`} title={poem.title} />
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-accent hover:text-accent/80"
                        >
                          <Link href={`/diwan/${poem.id}`}>قراءة المزيد</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredPoems.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر تصنيف آخر</p>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-center gap-4 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="border-border"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    className={page === currentPage ? "bg-primary" : "border-border"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-border"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
