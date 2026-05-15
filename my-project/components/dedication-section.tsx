"use client"

import { motion } from "framer-motion"
import { Heart, Phone, Mail, Globe } from "lucide-react"

const dedicationQuotes = [
  {
    text: "إلى من زرع في القلوب حب التراث، وأشعل في الضلوع لهيب الفخر",
    style: "italic"
  },
  {
    text: "هذا الموقع إهداء من الدكتور طلال بن حسن الزهراني",
    style: "bold"
  },
  {
    text: "للشاعر المتفرد محمد عيضة الزهراني",
    style: "bold"
  },
  {
    text: "فأنت يا محمد عيضة... صوت زهران الأصيل، وروحها العصية على الزوال",
    style: "italic"
  },
  {
    text: "وما العطاء إلا استمرارٌ لمسيرة الأجداد، ووفاءٌ للوطن والتاريخ",
    style: "italic"
  }
]

export default function DedicationSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/80 via-indigo-950/90 to-purple-950/80" />
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      
      {/* Decorative glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <Heart className="w-5 h-5 text-amber-400" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          <h2 
            className="text-3xl md:text-4xl font-bold gold-gradient"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            إهداء
          </h2>
        </motion.div>

        {/* Dedication Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-dark rounded-2xl p-8 md:p-12 border border-amber-500/10 relative overflow-hidden">
            {/* Decorative corner ornaments */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-500/20 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-amber-500/20 rounded-bl-2xl" />
            
            {/* Images Row */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              {/* Dr. Talal Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-28 h-28 md:w-32 md:h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 to-purple-500/30 animate-pulse" />
                  <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-amber-500/40">
                    <img
                      src="/dr-talal.jpg"
                      alt="الدكتور طلال بن حسن الزهراني"
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder-user.jpg" 
                      }}
                    />
                  </div>
                </div>
                <span className="mt-3 text-sm text-amber-300 font-medium whitespace-nowrap bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  د. طلال بن حسن الزهراني
                </span>
              </motion.div>

              {/* Arrow / Connector */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="hidden md:flex flex-col items-center"
              >
                <Heart className="w-6 h-6 text-amber-500/40" />
                <div className="h-8 w-px bg-gradient-to-b from-amber-500/40 to-transparent" />
              </motion.div>

              {/* Poet Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-28 h-28 md:w-32 md:h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/30 to-amber-500/30 animate-pulse" style={{ animationDelay: "1s" }} />
                  <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-purple-500/40">
                    <img
                      src="/poet.jpg?v=2"
                      alt="الشاعر محمد عيضة الزهراني"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => { 
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder-user.jpg" 
                      }}
                    />
                  </div>
                </div>
                <span className="mt-3 text-sm text-purple-300 font-medium whitespace-nowrap bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  الشاعر محمد عيضة الزهراني
                </span>
              </motion.div>
            </div>

            {/* Quotes */}
            <div className="space-y-6 text-center mb-8">
              {dedicationQuotes.map((quote, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                  className={`text-lg md:text-xl leading-relaxed ${
                    quote.style === "bold" 
                      ? "text-amber-100 font-bold" 
                      : "text-purple-200/80 italic font-serif"
                  }`}
                  style={{ fontFamily: quote.style === "italic" ? "'Amiri', serif" : "'Tajawal', sans-serif" }}
                >
                  {quote.text}
                </motion.p>
              ))}
            </div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
              className="mt-8 pt-6 border-t border-amber-500/10"
            >
              <h3 className="text-center text-lg font-bold text-amber-200 mb-4" style={{ fontFamily: "'Amiri', serif" }}>
                معلومات الموقع
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-500/10">
                  <Phone className="w-4 h-4 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-purple-200/70">للتواصل</p>
                  <p className="text-sm text-amber-200/80 font-medium">mzahrani.com</p>
                </div>
                <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-500/10">
                  <Mail className="w-4 h-4 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-purple-200/70">البريد</p>
                  <p className="text-sm text-amber-200/80 font-medium">info@mzahrani.com</p>
                </div>
                <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-500/10">
                  <Globe className="w-4 h-4 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-purple-200/70">الموقع</p>
                  <p className="text-sm text-amber-200/80 font-medium">www.mzahrani.com</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.8 }}
              className="text-center mt-6"
            >
              <p className="text-sm text-purple-300/40">
                بكل وفاءٍ وإخلاص... لك يا صوت زهران
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
