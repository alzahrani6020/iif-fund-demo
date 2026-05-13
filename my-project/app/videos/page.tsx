"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Play, Calendar, Eye, X, Search, Filter, Clock, Heart, Share2 } from "lucide-react"
import { getVideos } from "@/lib/data-store"

const categories = ["الكل", "أمسيات شعرية", "مقابلات", "وثائقيات", "محاضرات"]

const videos = getVideos()

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null)

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === "الكل" || video.category === selectedCategory
    const matchesSearch = video.title.includes(searchQuery) || (video.description || "").includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  const featuredVideo = videos.find(v => v.featured)

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background islamic-pattern relative overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
              <Video className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
              <span className="gold-gradient">مكتبة</span> الفيديو
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              أرشيف مرئي يضم الأمسيات الشعرية والمقابلات الثقافية
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">{videos.length}</span>
                <p className="text-sm">فيديو</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">+{videos.reduce((a, b) => a + b.views, 0).toLocaleString()}</span>
                <p className="text-sm">مشاهدة</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Video */}
      {featuredVideo && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedVideo(featuredVideo)}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent/20 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-primary flex items-center justify-center purple-glow"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="h-9 w-9 text-primary-foreground mr-[-3px]" />
                  </motion.div>
                </motion.div>
                <div className="absolute bottom-0 right-0 left-0 p-8 z-20">
                  <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs rounded-full mb-4">
                    مميز
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{featuredVideo.title}</h3>
                  <p className="text-muted-foreground max-w-2xl mb-4">{featuredVideo.description}</p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {featuredVideo.duration}
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {featuredVideo.views.toLocaleString()} مشاهدة
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {featuredVideo.date}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 glass-dark z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Search */}
            <motion.div
              className="relative w-full md:w-96"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث في الفيديوهات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass border-0 rounded-xl pr-12 pl-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </motion.div>

            {/* Categories */}
            <motion.div
              className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground purple-glow"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="glass border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden cursor-pointer card-lift"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center z-20"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center purple-glow">
                        <Play className="h-6 w-6 text-primary-foreground mr-[-3px]" />
                      </div>
                    </motion.div>
                    <span className="absolute bottom-3 left-3 z-20 px-2 py-1 bg-background/80 text-foreground text-xs rounded flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {video.duration}
                    </span>
                    {video.featured && (
                      <span className="absolute top-3 right-3 z-20 px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                        مميز
                      </span>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-3">
                      {video.category}
                    </span>
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {video.description || ""}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {video.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {video.views.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredVideos.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر تصنيف آخر</p>
            </motion.div>
          )}

          {/* Load More */}
          {filteredVideos.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="outline" size="lg" className="border-accent/50 text-accent hover:bg-accent/10">
                عرض المزيد من الفيديوهات
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-lg"
              onClick={() => setSelectedVideo(null)}
            />
            <motion.div
              className="relative w-full max-w-5xl z-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 left-0 text-foreground hover:text-accent"
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="aspect-video bg-card rounded-xl overflow-hidden border border-border shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="mt-6 glass rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-2">
                      {selectedVideo.category}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{selectedVideo.title}</h3>
                    <p className="text-muted-foreground">{selectedVideo.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {selectedVideo.views.toLocaleString()} مشاهدة
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedVideo.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedVideo.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
