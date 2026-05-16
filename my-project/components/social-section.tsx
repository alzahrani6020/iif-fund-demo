"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Youtube, ExternalLink, Play, Music2 } from "lucide-react"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.2 0 .39.02.57.06v-3.5a6.37 6.37 0 0 0-.57-.03A6.34 6.34 0 0 0 3 15.34 6.34 6.34 0 0 0 9.34 21.68a6.34 6.34 0 0 0 6.34-6.34V9.01a8.04 8.04 0 0 0 4.91 1.68V7.24a4.83 4.83 0 0 1-1-.55z"/>
    </svg>
  )
}

export default function SocialSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 islamic-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-accent/30 flex items-center justify-center mx-auto mb-4 purple-glow">
            <ExternalLink className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-3">
            <span className="gold-gradient">تابع</span> الشاعر
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            تابع أحدث القصائد والفعاليات على منصات التواصل الاجتماعي
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* YouTube Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-border overflow-hidden card-lift group h-full">
              {/* YouTube Header */}
              <div className="bg-gradient-to-r from-red-600/20 to-red-500/10 border-b border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <Youtube className="h-7 w-7 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">قناة اليوتيوب</h3>
                      <p className="text-sm text-muted-foreground">@mohd3z</p>
                    </div>
                  </div>
                  <a
                    href="https://www.youtube.com/@mohd3z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    زيارة
                  </a>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm mb-4">
                  قصائد نبطية أصيلة ألقيت في مهرجانات ومناسبات ثقافية
                </p>
                {/* Embedded YouTube Video */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary/50 border border-border">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/@mohd3z?autoplay=0&mute=1"
                    title="قناة الشاعر محمد عيضة الزهراني"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Play className="h-4 w-4 text-red-400" />
                    <span>شاهد أحدث الفيديوهات</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* TikTok Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-border overflow-hidden card-lift group h-full">
              {/* TikTok Header */}
              <div className="bg-gradient-to-r from-pink-600/20 to-cyan-500/10 border-b border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-cyan-500/20 flex items-center justify-center">
                      <Music2 className="h-7 w-7 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">تيك توك</h3>
                      <p className="text-sm text-muted-foreground">@Mohd3z</p>
                    </div>
                  </div>
                  <a
                    href="https://www.tiktok.com/@Mohd3z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 text-pink-300 hover:from-pink-500/30 hover:to-cyan-500/30 transition-colors text-sm font-medium"
                  >
                    زيارة
                  </a>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm mb-4">
                  مقاطع قصيرة من القصائد والحوارات الشعرية
                </p>
                {/* TikTok Preview */}
                <div className="relative aspect-[9/16] max-h-64 mx-auto rounded-xl overflow-hidden bg-gradient-to-b from-pink-500/10 to-cyan-500/10 border border-border flex items-center justify-center">
                  <div className="text-center p-4">
                    <TikTokIcon className="h-16 w-16 text-pink-400/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">تابع الشاعر على تيك توك</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">@Mohd3z</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Music2 className="h-4 w-4 text-pink-400" />
                    <span>مقاطع قصيرة من القصائد</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "قناة اليوتيوب", value: "@mohd3z", icon: Youtube, color: "text-red-400" },
            { label: "تيك توك", value: "@Mohd3z", icon: Music2, color: "text-pink-400" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
