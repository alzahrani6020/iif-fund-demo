"use client"

import { useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import {
  BookOpen,
  FileText,
  Landmark,
  Calendar,
  ArrowRight,
  Clock,
} from "lucide-react"
import {
  getPoems,
  getArticles,
  getHistory,
} from "@/lib/data-store"
import { FocusModeToggle } from "@/components/focus-mode-toggle"

interface TimelineItem {
  id: string
  title: string
  description: string
  date: string
  year: number
  month: number
  day: number
  type: "poem" | "article" | "history"
  typeLabel: string
  href: string
  icon: React.ElementType
  color: string
  bgColor: string
}

function parseHijriDate(dateStr: string): { year: number; month: number; day: number } {
  if (!dateStr) return { year: 0, month: 0, day: 0 }
  // Remove "هـ" and trim
  const clean = dateStr.replace(/هـ/g, "").trim()
  const parts = clean.split("/").map((p) => parseInt(p, 10))
  if (parts.length === 3) {
    return { year: parts[0], month: parts[1], day: parts[2] }
  }
  if (parts.length === 1 && !isNaN(parts[0])) {
    return { year: parts[0], month: 0, day: 0 }
  }
  return { year: 0, month: 0, day: 0 }
}

function buildTimeline(): TimelineItem[] {
  const items: TimelineItem[] = []

  getHistory().forEach((item) => {
    const d = parseHijriDate(item.date)
    items.push({
      id: `h-${item.id}`,
      title: item.title,
      description: item.description,
      date: item.date,
      year: d.year,
      month: d.month,
      day: d.day,
      type: "history",
      typeLabel: item.category,
      href: "/history",
      icon: Landmark,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10 border-amber-400/20",
    })
  })

  getPoems().forEach((item) => {
    const d = parseHijriDate(item.date)
    items.push({
      id: `p-${item.id}`,
      title: item.title,
      description: item.excerpt || item.content?.slice(0, 100) + "..." || "",
      date: item.date,
      year: d.year,
      month: d.month,
      day: d.day,
      type: "poem",
      typeLabel: "قصيدة",
      href: "/diwan",
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10 border-primary/20",
    })
  })

  getArticles().forEach((item) => {
    const d = parseHijriDate(item.date)
    items.push({
      id: `a-${item.id}`,
      title: item.title,
      description: item.excerpt || item.content?.slice(0, 100) + "..." || "",
      date: item.date,
      year: d.year,
      month: d.month,
      day: d.day,
      type: "article",
      typeLabel: item.category || "مقال",
      href: "/articles",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10 border-accent/20",
    })
  })

  // Sort by year ascending (oldest first)
  return items.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    if (a.month !== b.month) return a.month - b.month
    return a.day - b.day
  })
}

function groupByEra(items: TimelineItem[]) {
  const groups: Record<string, TimelineItem[]> = {}
  items.forEach((item) => {
    const era =
      item.year >= 1440
        ? "العصر الحديث"
        : item.year >= 1400
        ? "القرن الخامس عشر"
        : item.year >= 1350
        ? "القرن الرابع عشر"
        : item.year >= 1300
        ? "القرن الثالث عشر"
        : "ما قبل القرن الثالث عشر"
    if (!groups[era]) groups[era] = []
    groups[era].push(item)
  })
  return groups
}

export default function TimelinePage() {
  const items = useMemo(() => buildTimeline(), [])
  const groups = useMemo(() => groupByEra(items), [items])

  const eraOrder = [
    "ما قبل القرن الثالث عشر",
    "القرن الثالث عشر",
    "القرن الرابع عشر",
    "القرن الخامس عشر",
    "العصر الحديث",
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="max-w-4xl mx-auto relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
              <Clock className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold gold-gradient mb-3">
              الخط الزمني
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              رحلة عبر الزمن تجمع بين الأحداث التاريخية والمحتوى الثقافي في منظور واحد
            </p>
            <FocusModeToggle />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-8 mt-8 text-muted-foreground"
          >
            <div className="text-center">
              <span className="text-2xl font-bold gold-gradient">{items.length}</span>
              <p className="text-sm">حدث</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <span className="text-2xl font-bold gold-gradient">
                {items.filter((i) => i.type === "history").length}
              </span>
              <p className="text-sm">تاريخي</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <span className="text-2xl font-bold gold-gradient">
                {items.filter((i) => i.type === "poem").length}
              </span>
              <p className="text-sm">قصيدة</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <span className="text-2xl font-bold gold-gradient">
                {items.filter((i) => i.type === "article").length}
              </span>
              <p className="text-sm">مقال</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Center line */}
            <div className="absolute right-8 md:right-1/2 md:translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent" />

            {eraOrder.map((era, eraIndex) => {
              const eraItems = groups[era]
              if (!eraItems || eraItems.length === 0) return null

              return (
                <div key={era}>
                  {/* Era Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative flex items-center justify-center my-12"
                  >
                    <div className="absolute right-8 md:right-1/2 md:translate-x-px w-4 h-4 rounded-full bg-accent border-4 border-background z-10" />
                    <div className="glass px-6 py-2 rounded-full border border-border z-10">
                      <span className="text-sm font-bold text-accent">{era}</span>
                    </div>
                  </motion.div>

                  {/* Items */}
                  {eraItems.map((item, index) => {
                    const Icon = item.icon
                    const isEven = index % 2 === 0

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="relative mb-8"
                      >
                        {/* Dot */}
                        <div className="absolute right-6 md:right-1/2 md:-translate-x-[5px] top-6 z-10">
                          <div
                            className={`w-3 h-3 rounded-full border-2 border-background ${
                              item.type === "history"
                                ? "bg-amber-400"
                                : item.type === "poem"
                                ? "bg-primary"
                                : "bg-accent"
                            }`}
                          />
                        </div>

                        {/* Card */}
                        <div
                          className={`mr-16 md:mr-0 md:w-[calc(50%-2rem)] ${
                            isEven ? "md:ml-auto md:mr-[calc(50%+2rem)]" : "md:mr-auto md:ml-[calc(50%+2rem)]"
                          }`}
                        >
                          <Link href={item.href}>
                            <div className="glass rounded-xl p-5 card-lift group border border-border hover:border-primary/40 transition-all">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.bgColor}`}
                                >
                                  <Icon className={`h-5 w-5 ${item.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full border ${item.bgColor} ${item.color}`}
                                    >
                                      {item.typeLabel}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {item.date}
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-foreground group-hover:text-accent transition-colors mb-1">
                                    {item.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {item.description}
                                  </p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-1 rotate-180" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )
            })}

            {items.length === 0 && (
              <div className="text-center py-20">
                <Clock className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-xl font-semibold">لا توجد بيانات</h2>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
