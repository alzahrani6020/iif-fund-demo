"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Quote, Search, Heart, Share2, Filter, MessageSquareQuote } from "lucide-react"
import { getProverbs } from "@/lib/data-store"
import { ShareButtons } from "@/components/share-buttons"
import { BookmarkButton } from "@/components/bookmark-button"
import { FocusModeToggle } from "@/components/focus-mode-toggle"
import { TTSPlayer } from "@/components/tts-player"

const categories = ["الكل", "حكمة", "صبر", "كرم", "شجاعة", "تجارة", "أخلاق", "عمل"]

export default function ProverbsPage() {
  const [proverbs, setProverbs] = useState<any[]>([])
  useEffect(() => { getProverbs().then(setProverbs) }, [])
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProverbs = proverbs.filter((proverb) => {
    const matchesCategory = selectedCategory === "الكل" || proverb.category === selectedCategory
    const matchesSearch = proverb.text.includes(searchQuery) || proverb.meaning.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background heritage-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
            <Quote className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
            <span className="gold-gradient">الأمثال</span> والموروث
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            حكم وأمثال شعبية تتناقلها الأجيال، تحمل خلاصة تجارب الأجداد
          </p>
          <FocusModeToggle />
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث في الأمثال..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg pr-12 pl-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proverbs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProverbs.map((proverb) => (
              <Card
                key={proverb.id}
                className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <MessageSquareQuote className="h-8 w-8 text-primary/30" />
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {proverb.category}
                    </span>
                  </div>
                  
                  <blockquote className="text-2xl font-bold text-foreground font-serif mb-4 leading-loose group-hover:text-primary transition-colors duration-300">
                    {`"${proverb.text}"`}
                  </blockquote>
                  
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    <span className="text-accent font-medium">المعنى: </span>
                    {proverb.meaning}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors duration-300">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{proverb.likes}</span>
                      </button>
                      <BookmarkButton
                        itemId={proverb.id}
                        itemType="proverb"
                        title={proverb.text}
                        href={`/proverbs`}
                      />
                      <TTSPlayer text={`مثل شعبي: ${proverb.text}. المعنى: ${proverb.meaning}`} title={proverb.text} />
                    </div>
                    <ShareButtons title={proverb.text} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProverbs.length === 0 && (
            <div className="text-center py-16">
              <Quote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر تصنيف آخر</p>
            </div>
          )}

          {/* Load More */}
          {filteredProverbs.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-accent/50 text-accent hover:bg-accent/10">
                عرض المزيد من الأمثال
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
