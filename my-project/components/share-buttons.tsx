"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Share2,
  Link2,
  MessageCircle,
  Twitter,
  Facebook,
  Check,
} from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { toast } from "@/hooks/use-toast"
import { useState as useStateBase } from "react"

interface ShareButtonsProps {
  title: string
  url?: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const { isLoggedIn } = useUser()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const shareUrl = typeof window !== "undefined"
    ? url || window.location.href
    : url || ""

  const handleShare = () => {
    setOpen(true)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({ title: "✅ تم نسخ الرابط", description: "يمكنك الآن لصقه حيث تريد" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      toast({ title: "✅ تم نسخ الرابط", description: "يمكنك الآن لصقه حيث تريد" })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${shareUrl}`)
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const shareTwitter = () => {
    const text = encodeURIComponent(title)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    )
  }

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="text-muted-foreground hover:text-accent gap-1.5"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">مشاركة</span>
      </Button>

      {/* Share Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-dark border-border sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center gold-gradient">مشاركة المحتوى</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground text-center truncate">{title}</p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={shareWhatsApp}
                className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:bg-primary/10 transition-colors"
              >
                <MessageCircle className="h-6 w-6 text-emerald-400" />
                <span className="text-xs">واتساب</span>
              </button>
              <button
                onClick={shareTwitter}
                className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:bg-primary/10 transition-colors"
              >
                <Twitter className="h-6 w-6 text-sky-400" />
                <span className="text-xs">تويتر</span>
              </button>
              <button
                onClick={shareFacebook}
                className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:bg-primary/10 transition-colors"
              >
                <Facebook className="h-6 w-6 text-blue-400" />
                <span className="text-xs">فيسبوك</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 glass rounded-lg px-3 py-2 text-sm text-muted-foreground truncate">
                {shareUrl}
              </div>
              <Button
                size="icon"
                variant="outline"
                className="rounded-lg shrink-0"
                onClick={copyLink}
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
