"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  BookOpen,
  FileText,
  Quote,
  BookText,
  Video,
  Mic,
  Landmark,
  ArrowRight,
  Filter,
  X,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Input } from "@/components/ui/input"
import {
  getPoems,
  getArticles,
  getProverbs,
  getDictionary,
  getVideos,
  getAudio,
  getHistory,
} from "@/lib/data-store"

interface SearchResult {
  id: string
  title: string
  excerpt: string
  type: string
  typeLabel: string
  href: string
  date?: string
  matchField: string
  icon: React.ElementType
}

const typeConfig: Record<
  string,
  { label: string; href: string; icon: React.ElementType }
> = {
  poem: { label: "قصيدة", href: "/diwan", icon: BookOpen },
  article: { label: "مقال", href: "/articles", icon: FileText },
  proverb: { label: "مثل شعبي", href: "/proverbs", icon: Quote },
  dictionary: { label: "مفردة", href: "/dictionary", icon: BookText },
  video: { label: "فيديو", href: "/videos", icon: Video },
  audio: { label: "صوتي", href: "/audio", icon: Mic },
  history: { label: "تاريخي", href: "/history", icon: Landmark },
}

function makeExcerpt(text: string, query: string, maxLength = 120): string {
  if (!text) return ""
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  let start = 0
  let end = text.length

  if (index !== -1) {
    start = Math.max(0, index - 40)
    end = Math.min(text.length, index + query.length + 40)
  } else {
    end = Math.min(text.length, maxLength)
  }

  let snippet = text.slice(start, end)
  if (start > 0) snippet = "…" + snippet
  if (end < text.length) snippet = snippet + "…"

  return snippet
}

function highlightQuery(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-accent/30 text-accent rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function performSearch(
  query: string,
  poemsData: any[],
  articlesData: any[],
  proverbsData: any[],
  dictionaryData: any[],
  videosData: any[],
  audioData: any[],
  historyData: any[]
): SearchResult[] {
  if (!query.trim()) return []
  const q = query.trim().toLowerCase()
  const results: SearchResult[] = []

  const addResult = (
    id: string,
    title: string,
    excerpt: string,
    type: string,
    date?: string
  ) => {
    const config = typeConfig[type]
    if (!config) return
    results.push({
      id,
      title,
      excerpt: makeExcerpt(excerpt, q),
      type,
      typeLabel: config.label,
      href: config.href,
      date,
      matchField: title.toLowerCase().includes(q) ? "العنوان" : "المحتوى",
      icon: config.icon,
    })
  }

  poemsData.forEach((item) => {
    const fields = [item.title, item.content, item.category, item.excerpt]
    if (fields.some((f) => f?.toLowerCase().includes(q))) {
      addResult(item.id || item._id, item.title, item.content || item.excerpt || "", "poem", item.date)
    }
  })

  articlesData.forEach((item) => {
    const fields = [item.title, item.content, item.category, item.excerpt]
    if (fields.some((f) => f?.toLowerCase().includes(q))) {
      addResult(item.id || item._id, item.title, item.content || item.excerpt || "", "article", item.date)
    }
  })

  proverbsData.forEach((item) => {
    const fields = [item.text, item.meaning, item.category]
    if (fields.some((f) => f?.toLowerCase().includes(q))) {
      addResult(item.id || item._id, item.text, item.meaning, "proverb", item.date)
    }
  })

  dictionaryData.forEach((item) => {
    const fields = [item.word, item.meaning, item.example, item.usage, item.culturalNote, item.category]
    if (fields.some((f) => f?.toLowerCase().includes(q))) {
      addResult(item.id || item._id, item.word, item.meaning + " " + item.example, "dictionary", item.date)
    }
  })

  videosData.forEach((item) => {
    const fields = [item.title, item.description, item.category]
    if (fields.some((f) => f?.toLowerCase().includes(q))) {
      addResult(item.id || item._id, item.title, item.description || "", "video", item.date)
    }
  })

  audioData.forEach((item) => {
    const fields = [item.title, item.description, item.category]
    if (fields.some((f) => f?.toLowerCase().includes(q))) {
      addResult(item.id || item._id, item.title, item.description || "", "audio", item.date)
    }
  })

  historyData.forEach((item) => {
    const fields = [item.title, item.description, item.location, item.sides, item.result, item.category]
    if (fields.some((f) => f?.toLowerCase().includes(q))) {
      addResult(item.id || item._id, item.title, item.description, "history", item.date)
    }
  })

  return results
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [activeQuery, setActiveQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const [poemsData, setPoemsData] = useState<any[]>([])
  const [articlesData, setArticlesData] = useState<any[]>([])
  const [proverbsData, setProverbsData] = useState<any[]>([])
  const [dictionaryData, setDictionaryData] = useState<any[]>([])
  const [videosData, setVideosData] = useState<any[]>([])
  const [audioData, setAudioData] = useState<any[]>([])
  const [historyData, setHistoryData] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      getPoems(), getArticles(), getProverbs(), getDictionary(),
      getVideos(), getAudio(), getHistory()
    ]).then(([p, a, pr, d, v, au, h]) => {
      setPoemsData(p)
      setArticlesData(a)
      setProverbsData(pr)
      setDictionaryData(d)
      setVideosData(v)
      setAudioData(au)
      setHistoryData(h)
    })
  }, [])

  useEffect(() => {
    const q = searchParams.get("q") || ""
    setQuery(q)
    setActiveQuery(q)
  }, [searchParams])

  useEffect(() => {
    if (!activeQuery) return
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [activeQuery])

  const allResults = useMemo(() =>
    performSearch(activeQuery, poemsData, articlesData, proverbsData, dictionaryData, videosData, audioData, historyData),
    [activeQuery, poemsData, articlesData, proverbsData, dictionaryData, videosData, audioData, historyData]
  )

  const filters = useMemo(() => {
    const counts: Record<string, number> = { all: allResults.length }
    allResults.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1
    })
    return counts
  }, [allResults])

  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return allResults
    return allResults.filter((r) => r.type === activeFilter)
  }, [allResults, activeFilter])

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    filteredResults.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = []
      groups[r.type].push(r)
    })
    return groups
  }, [filteredResults])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setActiveQuery(query.trim())
  }

  const groupOrder = ["poem", "article", "proverb", "dictionary", "video", "audio", "history"]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Search */}
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold gold-gradient mb-3">
              {activeQuery ? `نتائج البحث عن «${activeQuery}»` : "البحث الشامل"}
            </h1>
            <p className="text-muted-foreground">
              ابحث في القصائد والمقالات والمفردات والتاريخ والوسائط
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="اكتب كلمة البحث..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full glass border-0 rounded-xl pr-14 pl-14 py-6 text-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setActiveQuery(""); router.push("/search") }}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </motion.form>

          {/* Filters */}
          {activeQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className="rounded-full"
              >
                <Filter className="h-3.5 w-3.5 ml-1.5" />
                الكل {filters.all > 0 && `(${filters.all})`}
              </Button>
              {groupOrder.map((type) => {
                const count = filters[type]
                if (!count) return null
                const config = typeConfig[type]
                const Icon = config.icon
                return (
                  <Button
                    key={type}
                    variant={activeFilter === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(type)}
                    className="rounded-full"
                  >
                    <Icon className="h-3.5 w-3.5 ml-1.5" />
                    {config.label} ({count})
                  </Button>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && activeQuery && filteredResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">لا توجد نتائج</h2>
              <p className="text-muted-foreground">
                لم نجد أي نتيجة لـ «{activeQuery}». جرّب كلمة أخرى أو تحقق من الإملاء.
              </p>
            </motion.div>
          )}

          {!loading &&
            activeQuery &&
            groupOrder.map((type) => {
              const group = groupedResults[type]
              if (!group || group.length === 0) return null
              const config = typeConfig[type]
              const Icon = config.icon

              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">{config.label}</h2>
                    <span className="text-sm text-muted-foreground">({group.length})</span>
                  </div>

                  <div className="grid gap-3">
                    <AnimatePresence>
                      {group.map((result, idx) => (
                        <motion.div
                          key={result.id + idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link href={result.href}>
                            <div className="glass rounded-xl p-5 card-lift group">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                      {result.typeLabel}
                                    </span>
                                    {result.matchField && (
                                      <span className="text-xs text-muted-foreground">
                                        تطابق في {result.matchField}
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                                    {highlightQuery(result.title, activeQuery)}
                                  </h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {highlightQuery(result.excerpt, activeQuery)}
                                  </p>
                                  {result.date && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {result.date}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-1 rotate-180" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}

          {!activeQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">ابحث في كل المحتوى</h2>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                اكتب كلمة في مربع البحث أعلاه لتجد القصائد والمقالات والمفردات والأحداث التاريخية
                والمقاطع الصوتية والمرئية.
              </p>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {[
                  { label: "وطنية", type: "poem" },
                  { label: "الشعر النبطي", type: "article" },
                  { label: "حكمة", type: "proverb" },
                  { label: "الطبيعة", type: "dictionary" },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setQuery(s.label)
                      setActiveQuery(s.label)
                      router.push(`/search?q=${encodeURIComponent(s.label)}`)
                    }}
                    className="glass rounded-lg px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
