"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Settings,
  X,
  SkipBack,
  Gauge,
} from "lucide-react"
import { useTTS } from "@/hooks/use-tts"
import { toast } from "@/hooks/use-toast"

interface TTSPlayerProps {
  text: string
  title?: string
}

export function TTSPlayer({ text, title }: TTSPlayerProps) {
  const { speaking, paused, supported, rate, voices, currentVoice, togglePlay, stop, setRate, setVoice } = useTTS()
  const [showSettings, setShowSettings] = useState(false)

  if (!supported) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/50">
        <VolumeX className="h-3.5 w-3.5" />
        القارئ غير مدعوم في هذا المتصفح
      </div>
    )
  }

  const arVoices = voices.filter((v) => v.lang.startsWith("ar"))

  return (
    <div className="inline-flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={speaking ? "default" : "outline"}
          size="sm"
          onClick={() => {
            togglePlay(text)
            if (!speaking && !paused) {
              toast({ title: "🔊 جاري القراءة", description: title || "استمع إلى النص" })
            }
          }}
          className={`rounded-full gap-2 ${
            speaking
              ? "purple-glow animate-pulse"
              : "border-primary/30 text-primary hover:bg-primary/10"
          }`}
        >
          {speaking && !paused ? (
            <Pause className="h-4 w-4" />
          ) : paused ? (
            <Play className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {speaking && !paused ? "إيقاف مؤقت" : paused ? "استئناف" : "استمع"}
          </span>
        </Button>

        {speaking && (
          <Button
            variant="ghost"
            size="sm"
            onClick={stop}
            className="rounded-full text-muted-foreground hover:text-destructive"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-4 border border-border space-y-3 min-w-[240px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5" />
                السرعة
              </span>
              <span className="text-xs text-accent">{rate}x</span>
            </div>
            <div className="flex gap-1">
              {[0.7, 0.8, 0.9, 1, 1.1, 1.2].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${
                    rate === r
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>

            {arVoices.length > 1 && (
              <>
                <div className="text-xs font-medium pt-1">الصوت</div>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {arVoices.map((voice) => (
                    <button
                      key={voice.name}
                      onClick={() => setVoice(voice)}
                      className={`text-right px-3 py-2 rounded-lg text-xs transition-all ${
                        currentVoice?.name === voice.name
                          ? "bg-accent/10 text-accent border border-accent/30"
                          : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 border border-transparent"
                      }`}
                    >
                      {voice.name} ({voice.lang})
                    </button>
                  ))}
                </div>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="w-full rounded-lg text-muted-foreground"
              onClick={() => setShowSettings(false)}
            >
              <X className="h-3.5 w-3.5 ml-1" />
              إغلاق
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {speaking && title && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-accent"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          جاري القراءة: {title}
        </motion.div>
      )}
    </div>
  )
}
