"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Play, BookOpen, Mic, Video, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const poetryLines = [
  "يا راكب اللي من فوقهن رقاب",
  "وقفت على ربع المعاني ديار",
  "من زهران أرض العز والطيبين",
  "يا ساري الليل البهيم الطويل",
  "نحن أهل الجود والكرم والوفاء",
]

const stats = [
  { number: "500+", label: "قصيدة", icon: BookOpen },
  { number: "200+", label: "مثل شعبي", icon: Sparkles },
  { number: "1000+", label: "مفردة زهرانية", icon: BookOpen },
  { number: "50+", label: "فيديو وإلقاء", icon: Video },
]

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 10,
}))

export function HeroSection() {
  const [currentLine, setCurrentLine] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % poetryLines.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      
      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      
      {/* Floating particles */}
      {floatingParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-accent/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glow orbs */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Decorative lines */}
      <motion.div
        className="absolute top-1/4 right-0 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full border-primary/30">
            <motion.span
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-primary font-medium">شاعر وباحث في التراث الشعبي الزهراني</span>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 font-serif"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="animated-gradient">محمد عيضة</span>
          <br />
          <motion.span
            className="text-foreground inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            الزهراني
          </motion.span>
        </motion.h1>

        {/* Animated poetry line */}
        <div className="h-24 flex items-center justify-center mb-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentLine}
              className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-serif"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {`"${poetryLines[currentLine]}"`}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="p-6 glass rounded-2xl card-lift group cursor-default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className="h-6 w-6 text-primary mx-auto mb-3 group-hover:text-accent transition-colors duration-300" />
              <p className="text-3xl sm:text-4xl font-bold gold-gradient">{stat.number}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full purple-glow group"
          >
            <Link href="/diwan">
              <BookOpen className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              اقرأ القصائد
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-full gold-glow group"
          >
            <Link href="/videos">
              <Video className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              شاهد الفيديوهات
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-full"
          >
            <Link href="/dictionary">
              <Sparkles className="ml-2 h-5 w-5" />
              استكشف الموروث
            </Link>
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#featured"
          className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm">اكتشف المزيد</span>
          <ChevronDown className="h-5 w-5" />
        </motion.a>
      </div>
    </section>
  )
}
