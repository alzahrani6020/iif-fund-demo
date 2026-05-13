"use client"

import { motion } from "framer-motion"
import SectionCard, { SectionItem } from "@/components/SectionCard"
import { BookOpen, Mic, Video, BookText, Quote, FileText, User, ImageIcon, MessageSquare, Mail } from "lucide-react"

interface MainContentProps {
  sections: SectionItem[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  biography: User,
  diwan: BookOpen,
  majlis: MessageSquare,
  videos: Video,
  audio: Mic,
  dictionary: BookText,
  proverbs: Quote,
  articles: FileText,
  archive: ImageIcon,
  contact: Mail,
}

export default function MainContent({ sections }: MainContentProps) {
  return (
    <section className="relative py-20 md:py-28">
      {/* Background pattern */}
      <div className="absolute inset-0 heritage-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gold-gradient">أقسام الموقع</span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-l from-primary to-accent mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            استكشف المحتوى الثقافي والتراثي المتنوع من شعر وأمثال ومعجم اللهجة الزهرانية
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const key = section.href.replace("/", "") || "home"
            const Icon = iconMap[key]
            return (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <SectionCard {...section} icon={Icon} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
