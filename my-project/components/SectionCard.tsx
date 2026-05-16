"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpLeft } from "lucide-react"

export interface SectionItem {
  title: string
  description: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export default function SectionCard({ title, description, href, icon: Icon }: SectionItem) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        href={href}
        className="group block h-full p-6 md:p-8 glass rounded-2xl border border-border hover:border-primary/40 transition-all duration-500 relative overflow-hidden"
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            {Icon && (
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            )}
            <ArrowUpLeft className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-l from-primary via-accent to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
      </Link>
    </motion.div>
  )
}
