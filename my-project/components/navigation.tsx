"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search, BookOpen, Mic, Video, BookText, Quote, User, Image, FileText, Mail, LayoutDashboard, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "الرئيسية", icon: null },
  { href: "/diwan", label: "الديوان الشعري", icon: BookOpen },
  { href: "/audio", label: "القصائد الصوتية", icon: Mic },
  { href: "/videos", label: "مكتبة الفيديو", icon: Video },
  { href: "/dictionary", label: "معجم اللهجة", icon: BookText },
  { href: "/proverbs", label: "الأمثال والموروث", icon: Quote },
  { href: "/biography", label: "السيرة الذاتية", icon: User },
  { href: "/archive", label: "الصور والأرشيف", icon: Image },
  { href: "/articles", label: "المقالات", icon: FileText },
  { href: "/majlis", label: "المجلس", icon: MessageSquare },
  { href: "/contact", label: "تواصل معنا", icon: Mail },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 scroll-progress z-[60]"
        style={{ width: `${scrollProgress}%` }}
      />

      <motion.nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-dark shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-12 h-12 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center purple-glow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-accent font-serif text-xl">م</span>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold gold-gradient">محمد عيضة الزهراني</h1>
                <p className="text-xs text-muted-foreground">شاعر وباحث في التراث</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm transition-colors duration-300 relative group ${
                    pathname === item.href ? "text-accent" : "text-foreground/80 hover:text-accent"
                  }`}
                >
                  {item.label}
                  <motion.span
                    className="absolute bottom-0 right-0 h-0.5 bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: pathname === item.href ? "100%" : 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
              <div className="relative group">
                <button className="px-3 py-2 text-sm text-foreground/80 hover:text-accent transition-colors duration-300">
                  المزيد
                </button>
                <motion.div
                  className="absolute top-full right-0 mt-2 w-56 glass rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {navItems.slice(6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-300 ${
                        pathname === item.href
                          ? "text-accent bg-primary/10"
                          : "text-foreground/80 hover:text-accent hover:bg-secondary/50"
                      }`}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-primary/10 border-t border-border transition-colors duration-300"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    لوحة التحكم
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Search and Mobile Menu */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-foreground/80 hover:text-accent hover:bg-secondary/50"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-foreground/80 hover:text-accent hover:bg-secondary/50"
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
                className="py-4 border-t border-border"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="ابحث في القصائد والمقالات والمفردات..."
                    className="w-full glass border-0 rounded-xl pr-12 pl-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden glass-dark border-t border-border"
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 ${
                        pathname === item.href
                          ? "text-accent bg-primary/10"
                          : "text-foreground/80 hover:text-accent hover:bg-secondary/50"
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
                    className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-300"
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
    </>
  )
}
