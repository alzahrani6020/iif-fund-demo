"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Search, Calendar, Clock, User, ArrowLeft, Filter, Eye } from "lucide-react"

const categories = ["الكل", "الشعر النبطي", "التراث", "اللهجات", "ثقافة", "تاريخ"]

const articles = [
  {
    id: 1,
    title: "أصول الشعر النبطي في الجزيرة العربية",
    excerpt: "دراسة معمقة في تاريخ الشعر النبطي ونشأته وتطوره عبر العصور، وكيف أصبح جزءاً أصيلاً من الهوية الثقافية العربية...",
    category: "الشعر النبطي",
    date: "1445/04/15",
    readTime: "10 دقائق",
    views: 1250,
  },
  {
    id: 2,
    title: "لهجة زهران: دراسة لغوية",
    excerpt: "بحث لغوي في خصائص لهجة منطقة زهران، مفرداتها الفريدة، وصلتها باللغة العربية الفصحى والعناصر اللغوية القديمة...",
    category: "اللهجات",
    date: "1445/03/20",
    readTime: "15 دقيقة",
    views: 980,
  },
  {
    id: 3,
    title: "الأمثال الشعبية مرآة المجتمع",
    excerpt: "كيف تعكس الأمثال الشعبية قيم المجتمع وتجاربه، ودورها في نقل الحكمة من جيل إلى جيل عبر التاريخ...",
    category: "التراث",
    date: "1445/02/10",
    readTime: "8 دقائق",
    views: 1560,
  },
  {
    id: 4,
    title: "المجالس الشعرية في الجنوب السعودي",
    excerpt: "تاريخ المجالس الشعرية ودورها في الحفاظ على الموروث الثقافي، وكيف كانت منبراً للشعراء والأدباء...",
    category: "ثقافة",
    date: "1445/01/05",
    readTime: "12 دقيقة",
    views: 870,
  },
  {
    id: 5,
    title: "تاريخ منطقة زهران",
    excerpt: "رحلة عبر التاريخ في منطقة زهران، من العصور القديمة إلى الحاضر، وأهم المحطات التاريخية والشخصيات المؤثرة...",
    category: "تاريخ",
    date: "1444/12/20",
    readTime: "20 دقيقة",
    views: 2100,
  },
  {
    id: 6,
    title: "فن الإلقاء الشعري",
    excerpt: "أساسيات فن الإلقاء الشعري وكيفية إيصال المعنى والمشاعر من خلال الصوت والأداء، مع نصائح للشعراء الناشئين...",
    category: "الشعر النبطي",
    date: "1444/11/15",
    readTime: "7 دقائق",
    views: 1340,
  },
]

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "الكل" || article.category === selectedCategory
    const matchesSearch = article.title.includes(searchQuery) || article.excerpt.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background heritage-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
            <FileText className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
            <span className="gold-gradient">المقالات</span> الثقافية
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            مقالات ودراسات في الشعر والتراث واللهجات المحلية
          </p>
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
                placeholder="ابحث في المقالات..."
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

      {/* Articles List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {article.category}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {article.views}
                          </span>
                        </div>
                        <Link
                          href={`/articles/${article.id}`}
                          className="inline-flex items-center text-accent hover:text-accent/80 font-medium transition-colors duration-300"
                        >
                          قراءة المقال
                          <ArrowLeft className="mr-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر تصنيف آخر</p>
            </div>
          )}

          {/* Load More */}
          {filteredArticles.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-accent/50 text-accent hover:bg-accent/10">
                عرض المزيد من المقالات
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
