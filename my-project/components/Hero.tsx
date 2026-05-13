"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950" />
      <div className="absolute inset-0 islamic-pattern opacity-50" />
      
      {/* Animated glow orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-8 w-40 h-40 md:w-48 md:h-48"
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-accent/40 purple-glow relative">
            <img
              src="/poet.jpg"
              alt="صورة الشاعر"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-2 ring-inset ring-accent/20 rounded-full" />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-wide"
        >
          <span className="gold-gradient">محمد عيضة الزهراني</span>
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-purple-200/90 max-w-2xl mx-auto leading-relaxed mb-8 font-light"
        >
          شاعر نظم… وصوت يحمل موروث زهران بين السطور
        </motion.p>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="relative inline-block"
        >
          <div className="absolute -top-4 -right-6 text-accent/30 text-4xl font-serif">"</div>
          <p className="text-base md:text-lg text-amber-100/70 max-w-xl mx-auto italic leading-loose font-serif">
            وردٌ تنامى في فصول الرتابة… حتى غدا في كفّ روحي حدائق
          </p>
          <div className="absolute -bottom-4 -left-6 text-accent/30 text-4xl font-serif rotate-180">"</div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-accent/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-accent/60 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
