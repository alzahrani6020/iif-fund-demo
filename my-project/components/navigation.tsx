"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Search,
  Clock,
  BookOpen,
  Mic,
  Video,
  BookText,
  Quote,
  User,
  Image,
  FileText,
  Mail,
  LayoutDashboard,
  MessageSquare,
  Landmark,
  ArrowLeft,
  Bookmark,
  Feather,
  LogIn,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getPoems,
  getArticles,
  getProverbs,
  getDictionary,
  getVideos,
  getAudio,
  getHistory,
} from "@/lib/data-store"
import { useUser } from "@/hooks/use-user"
import { getSiteConfig } from "@/lib/data-store"
import { UserAuthDialog } from "@/components/user-auth-dialog"
import { UserProfileDialog } from "@/components/user-profile-dialog"

const navItems = [
  { href: "/", label: "الرئيسية", icon: null },
  { href: "/diwan", label: "الديوان الشعري", icon: BookOpen },
  { href: "/aghraz", label: "أغراض الشعر", icon: Feather },
  { href: "/articles", label: "المقالات", icon: FileText },
  { href: "/history", label: "تاريخ زهران", icon: Landmark },
  { href: "/proverbs", label: "الأمثال والموروث", icon: Quote },
  { href: "/dictionary", label: "معجم اللهجة", icon: BookText },
  { href: "/audio", label: "القصائد الصوتية", icon: Mic },
  { href: "/videos", label: "مكتبة الفيديو", icon: Video },
  { href: "/timeline", label: "الخط الزمني", icon: Clock },
  { href: "/biography", label: "السيرة الذاتية", icon: User },
  { href: "/archive", label: "الصور والأرشيف", icon: Image },
  { href: "/majlis", label: "المجلس", icon: MessageSquare },
  { href: "/contact", label: "تواصل معنا", icon: Mail },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    { title: string; label: string; href: string; excerpt: string }[]
  >([])
  const [showResults, setShowResults] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isLoggedIn } = useUser()
  const [siteConfig, setSiteConfig] = useState<any>({
    poetName: 'محمد عيضة الزهراني',
    poetSubtitle: 'شاعر وباحث في التراث',
    poetImage: undefined,
    logoImage: undefined,
  })
  const [poemsData, setPoemsData] = useState<any[]>([])
  const [articlesData, setArticlesData] = useState<any[]>([])
  const [proverbsData, setProverbsData] = useState<any[]>([])
  const [dictionaryData, setDictionaryData] = useState<any[]>([])
  const [videosData, setVideosData] = useState<any[]>([])
  const [audioData, setAudioData] = useState<any[]>([])
  const [historyData, setHistoryData] = useState<any[]>([])

  useEffect(() => {
    getSiteConfig().then(setSiteConfig)
    Promise.all([
      getPoems(), getArticles(), getProverbs(), getDictionary(),
      getVideos(), getAudio(), getHistory()
    ]).then(([p, a, pr, d, v, au, h]) => {
      setPoemsData(p)
      setArticlesData(a)
      setProverbsData(pr)
      setDictionaryData(d)
      setVideosData(v)
      setAudioData(au)
      setHistoryData(h)
    })
  }, [])

  // ⏰ الساعة والتاريخ
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getHijriDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }, [])

  const getGregorianDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("ar-SA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(date)
  }, [])

  const getTime = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date)
  }, [])

  useEffect(() => {
    const handleStorage = () => getSiteConfig().then(setSiteConfig)
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
      setIsScrolled(window.scrollY > 30)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handler = () => setAuthOpen(true)
    window.addEventListener("open-user-auth", handler)
    return () => window.removeEventListener("open-user-auth", handler)
  }, [])

  const performSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }
    const q = query.trim().toLowerCase()
    const results: {
      title: string
      label: string
      href: string
      excerpt: string
    }[] = []

    const push = (
      title: string,
      label: string,
      href: string,
      excerpt: string
    ) => {
      results.push({
        title,
        label,
        href,
        excerpt: excerpt.slice(0, 60) + (excerpt.length > 60 ? "…" : ""),
      })
    }

    poemsData.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      ) {
        push(
          item.title,
          "قصيدة",
          `/diwan/${item.id || item._id}`,
          item.excerpt || item.content || ""
        )
      }
    })
    articlesData.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q)
      ) {
        push(
          item.title,
          "مقال",
          "/articles",
          item.excerpt || item.content || ""
        )
      }
    })
    proverbsData.forEach((item) => {
      if (
        item.text.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q)
      ) {
        push(item.text, "مثل", "/proverbs", item.meaning)
      }
    })
    dictionaryData.forEach((item) => {
      if (
        item.word.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
      ) {
        push(item.word, "مفردة", "/dictionary", item.meaning)
      }
    })
    videosData.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      ) {
        push(item.title, "فيديو", "/videos", item.description || "")
      }
    })
    audioData.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      ) {
        push(item.title, "صوتي", "/audio", item.description || "")
      }
    })
    historyData.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      ) {
        push(item.title, "تاريخي", "/history", item.description)
      }
    })

    setSearchResults(results.slice(0, 6))
    setShowResults(true)
  }

  return (
    <>
      {/* ─── Top Bar: Clock & Date ─── */}
      <div className="fixed top-0 right-0 left-0 z-[55] hidden lg:flex items-center justify-center h-8 bg-black/20 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4">
          {/* Clock icon + time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-300/70" />
            <time className="font-sans font-bold text-amber-100 text-[13px] tracking-[0.12em] tabular-nums">
              {getTime(now)}
            </time>
          </div>
          {/* Divider */}
          <span className="w-px h-3 bg-white/10" />
          {/* Hijri date */}
          <span className="font-serif text-amber-200/60 text-[11px] font-light tracking-wide">
            {getHijriDate(now)}
          </span>
          {/* Divider */}
          <span className="w-px h-3 bg-white/10" />
          {/* Gregorian date */}
          <span className="font-sans text-white/40 text-[11px] font-light tracking-wide">
            {getGregorianDate(now)}
          </span>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-8 left-0 right-0 h-1 z-[60]"
        style={{ width: `${scrollProgress}%` }}
      >
        <div className="h-full bg-gradient-to-l from-primary via-accent to-primary animate-pulse" />
      </motion.div>

      <motion.nav
        className={`fixed top-8 right-0 left-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-background/90 backdrop-blur-2xl border-border/40 shadow-2xl shadow-black/30"
            : "bg-background/40 backdrop-blur-3xl border-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Bottom gradient border */}
        <div className="absolute bottom-0 right-0 left-0 h-[1px] bg-gradient-to-l from-transparent via-accent/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo — Luxurious */}
            <Link href="/" className="flex items-center gap-4 group">
              <motion.div
                className="relative w-16 h-16 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-accent to-primary animate-spin" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-[2px] rounded-full bg-background flex items-center justify-center overflow-hidden">
                  <img 
                    src="/poet.jpg?v=2" 
                    alt="الشاعر" 
                    className="w-full h-full object-cover object-top"
                    onError={(e) => { 
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl -z-10" />
              </motion.div>
              <div className="hidden sm:block">
                <motion.h1
                  className="text-2xl font-bold leading-tight tracking-wide"
                  style={{ fontFamily: "'Amiri', serif" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="animated-gradient">محمد عيضة الزهراني</span>
                </motion.h1>
                <p className="text-xs text-muted-foreground/80 tracking-widest uppercase mt-0.5 flex items-center gap-1.5">
                  <span className="w-4 h-[1px] bg-accent/50" />
                  شاعر وباحث في التراث الشعبي
                  <span className="w-4 h-[1px] bg-accent/50" />
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 text-[15px] font-medium transition-colors duration-300 relative group rounded-lg ${
                    pathname === item.href
                      ? "text-accent"
                      : "text-foreground/60 hover:text-accent"
                  }`}
                >
                  {item.label}
                  {/* Active underline pill */}
                  {pathname === item.href && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 right-2 left-2 h-[2px] bg-gradient-to-l from-primary via-accent to-primary rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {/* Hover glow */}
                  <span className="absolute inset-0 rounded-lg bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300" />
                </Link>
              ))}
              <div className="relative group">
                <button className="px-4 py-2.5 text-[15px] font-medium text-foreground/60 hover:text-accent transition-colors duration-300 rounded-lg flex items-center gap-1 relative group">
                  <span className="absolute inset-0 rounded-lg bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300" />
                  <span className="relative">المزيد</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 relative"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <motion.div
                  className="absolute top-full right-0 mt-2 w-60 glass-dark rounded-xl shadow-2xl border border-border/50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {navItems.slice(6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                        pathname === item.href
                          ? "text-accent bg-primary/10"
                          : "text-foreground/70 hover:text-accent hover:bg-secondary/50"
                      }`}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-primary/10 border-t border-border transition-colors duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    لوحة التحكم
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-foreground/70 hover:text-accent hover:bg-accent/10 rounded-full w-10 h-10"
              >
                <Search className="h-5 w-5" />
              </Button>

              {isLoggedIn && (
                <Link href="/bookmarks">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground/70 hover:text-accent hover:bg-accent/10 rounded-full w-10 h-10 hidden sm:flex"
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* User Avatar */}
              <button
                onClick={() =>
                  isLoggedIn ? setProfileOpen(true) : setAuthOpen(true)
                }
                className="relative group flex items-center gap-2"
                title={isLoggedIn ? user?.name : "تسجيل الدخول"}
              >
                {isLoggedIn && (
                  <span className="hidden sm:inline text-sm font-medium text-foreground/80 group-hover:text-accent transition-colors">
                    {user?.name}
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden border-[2.5px] transition-all ${
                    user?.frame === "purple"
                      ? "border-purple-400 shadow-lg shadow-purple-400/30"
                      : user?.frame === "blue"
                      ? "border-sky-400 shadow-lg shadow-sky-400/30"
                      : user?.frame === "green"
                      ? "border-emerald-400 shadow-lg shadow-emerald-400/30"
                      : user?.frame === "none"
                      ? "border-transparent"
                      : "border-amber-400 shadow-lg shadow-amber-400/30"
                  }`}
                >
                  <img
                    src={user?.avatar || "/placeholder-user.jpg"}
                    alt={user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!isLoggedIn && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <User className="w-2 h-2 text-muted-foreground" />
                  </span>
                )}
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-foreground/70 hover:text-accent hover:bg-accent/10 rounded-full w-10 h-10"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                className="py-5 border-t border-border/50"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative max-w-2xl mx-auto">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (searchQuery.trim()) {
                        router.push(
                          `/search?q=${encodeURIComponent(searchQuery.trim())}`
                        )
                        setShowResults(false)
                        setSearchOpen(false)
                        setSearchQuery("")
                      }
                    }}
                    className="relative"
                  >
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                    <input
                      type="text"
                      placeholder="ابحث في القصائد والمقالات والمفردات والتاريخ..."
                      value={searchQuery}
                      onChange={(e) => performSearch(e.target.value)}
                      className="w-full glass border-0 rounded-2xl pr-14 pl-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300"
                      autoFocus
                    />
                  </form>
                  {/* Results Dropdown */}
                  <AnimatePresence>
                    {showResults && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 left-0 mt-3 glass-dark rounded-xl shadow-2xl border border-border/50 overflow-hidden z-50"
                      >
                        <div className="max-h-80 overflow-y-auto py-2">
                          {searchResults.map((result, index) => (
                            <Link
                              key={index}
                              href={result.href}
                              onClick={() => {
                                setShowResults(false)
                                setSearchOpen(false)
                                setSearchQuery("")
                              }}
                              className="flex items-center justify-between px-5 py-3.5 hover:bg-primary/10 transition-colors"
                            >
                              <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                <span className="text-sm font-semibold text-foreground truncate">
                                  {result.title}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {result.excerpt}
                                </span>
                              </div>
                              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary mr-3 shrink-0 font-medium">
                                {result.label}
                              </span>
                            </Link>
                          ))}
                          <button
                            onClick={() => {
                              if (searchQuery.trim()) {
                                router.push(
                                  `/search?q=${encodeURIComponent(
                                    searchQuery.trim()
                                  )}`
                                )
                                setShowResults(false)
                                setSearchOpen(false)
                                setSearchQuery("")
                              }
                            }}
                            className="flex items-center justify-center gap-2 w-full px-5 py-3.5 text-sm text-accent hover:bg-primary/10 transition-colors border-t border-border mt-1 font-medium"
                          >
                            <span>عرض كل النتائج</span>
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                    {showResults &&
                      searchQuery.trim() &&
                      searchResults.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full right-0 left-0 mt-3 glass-dark rounded-xl shadow-2xl border border-border/50 overflow-hidden z-50 p-5 text-center text-sm text-muted-foreground"
                        >
                          لا توجد نتائج لـ «{searchQuery}»
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden glass-dark border-t border-border/50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-1 max-h-[70vh] overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors duration-200 text-base ${
                        pathname === item.href
                          ? "text-accent bg-primary/10 font-semibold"
                          : "text-foreground/70 hover:text-accent hover:bg-secondary/50"
                      }`}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="pt-4 border-t border-border mt-4"
                >
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 text-primary hover:bg-primary/10 rounded-xl transition-colors duration-200 text-base"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    لوحة التحكم
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <UserAuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <UserProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  )
}
