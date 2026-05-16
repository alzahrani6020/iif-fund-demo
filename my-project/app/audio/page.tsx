"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock, Heart, Download, Shuffle, Repeat, List } from "lucide-react"
import { getAudio } from "@/lib/data-store"
import { ShareButtons } from "@/components/share-buttons"
import { BookmarkButton } from "@/components/bookmark-button"

export default function AudioPage() {
  const [audioTracks, setAudioTracks] = useState<any[]>([])
  useEffect(() => { getAudio().then(setAudioTracks) }, [])
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [showPlaylist, setShowPlaylist] = useState(false)

  const currentTrackData = audioTracks.find((t) => t.id === currentTrack)

  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 0.5
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTrack])

  const handlePlayTrack = (trackId: string) => {
    if (currentTrack === trackId) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(trackId)
      setIsPlaying(true)
      setProgress(0)
    }
  }

  const formatTime = (percent: number, totalSecs: number) => {
    const currentSecs = Math.floor((percent / 100) * totalSecs)
    const mins = Math.floor(currentSecs / 60)
    const secs = currentSecs % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

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
              <Mic className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
              <span className="gold-gradient">القصائد</span> الصوتية
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              استمع إلى القصائد بصوت الشاعر، إلقاء مميز يحمل روح الكلمة
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">{audioTracks.length}</span>
                <p className="text-sm">تسجيل صوتي</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">+{audioTracks.reduce((a, b) => a + (b.views || 0), 0).toLocaleString()}</span>
                <p className="text-sm">استماع</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Audio Player */}
      <AnimatePresence>
        {currentTrack && (
          <motion.section
            className="sticky top-20 z-40 glass-dark border-b border-border"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col gap-4">
                {/* Track Info and Controls */}
                <div className="flex items-center gap-6">
                  {/* Album Art / Waveform */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <Mic className="h-8 w-8 text-primary z-10" />
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-end justify-center gap-1 p-2">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-accent rounded-full"
                            animate={{
                              height: ["20%", "80%", "40%", "100%", "20%"],
                            }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{currentTrackData?.title}</h4>
                    <p className="text-sm text-muted-foreground">{currentTrackData?.category}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <motion.button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center purple-glow"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 mr-[-2px]" />}
                    </motion.button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="hidden md:flex items-center gap-3 w-32">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: isMuted ? 0 : `${volume}%` }}
                      />
                    </div>
                  </div>

                  {/* Playlist Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className={`text-muted-foreground hover:text-foreground ${showPlaylist ? "text-primary" : ""}`}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-12 text-left">
                    {currentTrackData && currentTrackData.durationSecs ? formatTime(progress, currentTrackData.durationSecs) : "0:00"}
                  </span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden cursor-pointer group">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12">{currentTrackData?.duration}</span>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Tracks List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {audioTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`glass border-border hover:border-primary/50 transition-all duration-300 card-lift ${
                    currentTrack === track.id ? "border-primary/50 bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Number & Play */}
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-muted-foreground/30 w-8 hidden sm:block">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <motion.button
                          onClick={() => handlePlayTrack(track.id)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            currentTrack === track.id && isPlaying
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/50 hover:bg-primary/20 text-foreground"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {currentTrack === track.id && isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5 mr-[-2px]" />
                          )}
                        </motion.button>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground font-serif mb-1 text-lg">{track.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">{track.description}</p>
                      </div>

                      {/* Meta */}
                      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {track.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {track.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          {(track.views || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <BookmarkButton
                          itemId={track.id}
                          itemType="audio"
                          title={track.title}
                          href={`/audio`}
                        />
                        <ShareButtons title={track.title} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary hidden sm:flex"
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button variant="outline" size="lg" className="border-accent/50 text-accent hover:bg-accent/10">
              عرض المزيد من التسجيلات
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
